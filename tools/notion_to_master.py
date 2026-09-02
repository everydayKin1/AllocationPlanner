#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Notion のデータベースを読み取り、master-data.js の characters / months を書き換える。

・追加ライブラリ不要（標準ライブラリのみ）
・master-data.js の他の部分（title, rules, icons, glossary, artifactSets など）は触らない
・幕の報酬／特別挑戦／解放条件は毎月同じなので、Notion ではなくこのファイルで固定管理する

使い方:
    NOTION_API_KEY=secret_xxx python3 tools/notion_to_master.py
    python3 tools/notion_to_master.py --selftest   # ネット接続なしで変換ロジックを検証
"""

import json
import os
import re
import sys
import unicodedata
import urllib.error
import urllib.request

# ---------------------------------------------------------------- 設定

NOTION_VERSION = "2022-06-28"

DB_CHARACTERS = "acd855073bd543d0917e9b774d5f05f3"  # 幻想シアター・キャラクター一覧
DB_MONTHS = "332e6f6c6cd7440fa5f7ce158a7369dd"      # 幻想シアター・月次設定
DB_STAGES = "97a95927e91e4054904f283cafd9876e"      # 幻想シアター・幕と敵

MASTER_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "master-data.js")

CHARACTER_IMAGE_DIR = "./images/character/"
ENEMY_IMAGE_DIR = "./images/enemy/"

# 幕の骨格。毎月同じなのでここで固定管理する。
STAGE_ORDER = ["act-1", "act-2", "act-3", "act-4", "act-5", "act-6",
               "act-7", "act-8", "act-9", "arcana-1", "arcana-2", "act-10"]
STAGE_DEFAULT_NAME = {
    "act-1": "第1幕", "act-2": "第2幕", "act-3": "第3幕", "act-4": "第4幕",
    "act-5": "第5幕", "act-6": "第6幕", "act-7": "第7幕", "act-8": "第8幕",
    "act-9": "第9幕", "arcana-1": "アルカナ挑戦1", "arcana-2": "アルカナ挑戦2",
    "act-10": "第10幕",
}
STAGE_REWARD = {
    "act-1": 90, "act-2": 90, "act-3": 125, "act-4": 90, "act-5": 90, "act-6": 125,
    "act-7": 90, "act-8": 125, "act-9": 90, "arcana-1": 90, "arcana-2": 90, "act-10": 0,
}
STAGE_SPECIAL = {"arcana-1", "arcana-2"}
STAGE_FINAL = {"act-10"}
STAGE_ALLOWED_FROM_AFTER = {"arcana-1": "第3幕", "arcana-2": "第6幕"}


# ---------------------------------------------------------------- Notion API

def notion_query(database_id, token, sorts=None):
    """データベースの全ページを取得する（ページングに対応）。"""
    results = []
    cursor = None
    while True:
        payload = {"page_size": 100}
        if sorts:
            payload["sorts"] = sorts
        if cursor:
            payload["start_cursor"] = cursor
        req = urllib.request.Request(
            "https://api.notion.com/v1/databases/%s/query" % database_id,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": "Bearer %s" % token,
                "Notion-Version": NOTION_VERSION,
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as res:
                data = json.loads(res.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", "replace")
            raise SystemExit(
                "Notion API エラー (%s): %s\n"
                "・インテグレーションが対象ページに接続されているか\n"
                "・NOTION_API_KEY が正しいか\n"
                "を確認してください。" % (e.code, body)
            )
        results.extend(data.get("results", []))
        if not data.get("has_more"):
            break
        cursor = data.get("next_cursor")
    return results


# ---------------------------------------------------------------- プロパティ取り出し

def p_title(page, name):
    arr = page["properties"].get(name, {}).get("title") or []
    return "".join(x.get("plain_text", "") for x in arr).strip()


def p_text(page, name):
    arr = page["properties"].get(name, {}).get("rich_text") or []
    return "".join(x.get("plain_text", "") for x in arr).strip()


def p_select(page, name):
    sel = page["properties"].get(name, {}).get("select")
    return sel.get("name") if sel else ""


def p_multi(page, name):
    arr = page["properties"].get(name, {}).get("multi_select") or []
    return [x.get("name") for x in arr]


def p_check(page, name):
    return bool(page["properties"].get(name, {}).get("checkbox"))


def p_number(page, name, default=None):
    v = page["properties"].get(name, {}).get("number")
    return default if v is None else v


def p_relation_ids(page, name):
    arr = page["properties"].get(name, {}).get("relation") or []
    return [x.get("id", "").replace("-", "") for x in arr]


def page_id(page):
    return page.get("id", "").replace("-", "")


def check_properties(pages, label, expected):
    """想定した列が実際に存在するか確認し、無ければ分かりやすく落とす。"""
    if not pages:
        return
    actual = set(pages[0].get("properties", {}).keys())
    missing = [e for e in expected if e not in actual]
    if missing:
        raise SystemExit(
            "「%s」データベースに次の列が見つかりません: %s\n"
            "実際にある列: %s\n"
            "Notion 側で列名を変更した場合は tools/notion_to_master.py も合わせて直してください。"
            % (label, "、".join(missing), "、".join(sorted(actual)))
        )


# ---------------------------------------------------------------- 変換

def build_characters(pages):
    """キャラDBのページ群 → master-data.js の characters 配列"""
    chars = []
    for pg in pages:
        cid = p_text(pg, "ID")
        name = p_title(pg, "Name")
        if not cid or not name:
            continue  # 未入力の行はスキップ
        image = p_text(pg, "Image")
        pneuma = p_multi(pg, "PneumaOusia")
        entry = {
            "id": cid,
            "name": name,
            "element": p_select(pg, "Element"),
            "level": int(p_number(pg, "Level", 90) or 90),
            "image": (CHARACTER_IMAGE_DIR + image) if image else "",
        }
        if p_check(pg, "IsTraveler"):
            entry["isTraveler"] = True
            entry["exclusiveGroup"] = "traveler"
        entry["tags"] = {
            "positions": p_multi(pg, "Positions"),
            "roles": p_multi(pg, "Roles"),
            "weapon": p_select(pg, "Weapon"),
            "nightsoul": p_check(pg, "Nightsoul"),
            # 元の形式に合わせる: 0件なら ""、1件なら文字列、2件以上なら配列
            "pneumaOusia": ("" if not pneuma else (pneuma[0] if len(pneuma) == 1 else pneuma)),
            "lunar": p_check(pg, "Lunar"),
            "magic": p_check(pg, "Magic"),
        }
        chars.append(entry)
    return chars


def build_months(month_pages, stage_pages, char_id_by_page):
    """月次設定＋幕と敵のページ群 → master-data.js の months 配列"""
    # 敵の行を「月ページID → 幕id → 候補リスト」にまとめる
    by_month = {}
    for pg in stage_pages:
        month_ids = p_relation_ids(pg, "Month")
        stage_id = p_select(pg, "StageId")
        if not month_ids or stage_id not in STAGE_DEFAULT_NAME:
            continue
        enemy = {}
        name = p_title(pg, "EnemyName")
        if name:
            enemy["name"] = name
        icon = p_text(pg, "Icon")
        if icon:
            enemy["icon"] = icon
        image = p_text(pg, "Image")
        if image:
            enemy["image"] = ENEMY_IMAGE_DIR + image
        note = p_text(pg, "Note")
        if note:
            enemy["note"] = note
        good_el = p_multi(pg, "GoodElement")
        good_tags = p_multi(pg, "GoodTags")
        if good_el:
            enemy["element"] = good_el
        if good_tags:
            enemy["tags"] = good_tags
        # RequireAll: 元素とタグの両方を満たす必要がある
        if p_check(pg, "RequireAll") and good_el and good_tags:
            enemy["matchGroups"] = [good_el, good_tags]
        avoid_el = p_multi(pg, "AvoidElement")
        avoid_tags = p_multi(pg, "AvoidTags")
        if avoid_el:
            enemy["avoidElement"] = avoid_el
        if avoid_tags:
            enemy["avoidTags"] = avoid_tags
        rec = [char_id_by_page[i] for i in p_relation_ids(pg, "RecommendedCast") if i in char_id_by_page]
        if rec:
            enemy["recommendedCharacterIds"] = rec

        slot = by_month.setdefault(month_ids[0], {}).setdefault(stage_id, [])
        slot.append((p_number(pg, "Option", 1) or 1, p_text(pg, "StageName"), enemy))

    months = []
    for pg in month_pages:
        month_id = p_title(pg, "Month")
        if not month_id:
            continue
        elements = p_multi(pg, "Elements")
        traveler = p_multi(pg, "TravelerElements") or elements
        buffs = []
        for key, bid in (("BuffAName", "buffA"), ("BuffBName", "buffB"), ("BuffCName", "buffC")):
            buffs.append({"id": bid, "name": p_text(pg, key)})

        stage_map = by_month.get(page_id(pg), {})
        stages = []
        for sid in STAGE_ORDER:
            entries = sorted(stage_map.get(sid, []), key=lambda x: x[0])
            stage = {"id": sid}
            # 幕名: Notion の StageName があればそれを、無ければ既定名
            override = next((sn for _, sn, _ in entries if sn), "")
            stage["name"] = override or STAGE_DEFAULT_NAME[sid]
            stage["reward"] = STAGE_REWARD[sid]
            if sid in STAGE_SPECIAL:
                stage["special"] = True
                stage["allowedFromAfter"] = STAGE_ALLOWED_FROM_AFTER[sid]
            if sid in STAGE_FINAL:
                stage["final"] = True
            enemies = [e for _, _, e in entries]
            if len(enemies) >= 2:
                stage["enemyOptions"] = enemies
            else:
                stage["enemy"] = enemies[0] if enemies else {"name": "", "icon": "", "note": ""}
            stages.append(stage)

        months.append({
            "id": month_id,
            "label": month_id.replace("-", "年") + "月" if re.match(r"^\d{4}-\d{2}$", month_id) else month_id,
            "elements": elements,
            "travelerElements": traveler,
            "openingCast": [char_id_by_page[i] for i in p_relation_ids(pg, "OpeningCast") if i in char_id_by_page],
            "specialCast": [char_id_by_page[i] for i in p_relation_ids(pg, "SpecialCast") if i in char_id_by_page],
            "buffs": buffs,
            "icons": [{"label": e, "icon": e} for e in elements],
            "stages": stages,
        })

    months.sort(key=lambda m: m["id"])
    return months


# ---------------------------------------------------------------- JS 文字列化

def js(value):
    """Python の値を master-data.js の書式に合わせた JS リテラルにする。"""
    if value is True:
        return "true"
    if value is False:
        return "false"
    if value is None:
        return "null"
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, str):
        return json.dumps(value, ensure_ascii=False)
    if isinstance(value, list):
        return "[" + ", ".join(js(v) for v in value) + "]"
    if isinstance(value, dict):
        return "{ " + ", ".join("%s: %s" % (k, js(v)) for k, v in value.items()) + " }"
    raise TypeError(type(value))


def existing_character_order(source):
    """現在の master-data.js に並んでいるキャラ id を順番どおりに取り出す。"""
    try:
        i = source.index("\n  characters: [")
        j = source.index("\n  ]", i + 5)
    except ValueError:
        return []
    return re.findall(r'\{\s*id:\s*"([^"]+)"', source[i:j])


ELEMENT_ORDER = ["炎", "水", "氷", "雷", "風", "岩", "草"]


def sort_characters(chars, source):
    """並び順は既存ファイルを踏襲する。

    Notion の取得順は実行ごとに変わりうるため、そのまま出すと差分が毎回発生し、
    アプリ側の表示順（元素ごとのまとまり）も崩れてしまう。
    新しく増えたキャラは末尾ではなく「仲間の隣」に入れる。
    主人公なら主人公の並びの最後、それ以外なら同じ元素の最後に続ける。
    """
    order = existing_character_order(source)
    by_id = {c["id"]: c for c in chars}

    def group(c):
        return "traveler" if c.get("isTraveler") else c.get("element", "")

    # 既存キャラを元の順番どおりに並べる
    ordered = [by_id[cid] for cid in order if cid in by_id]

    # 新しいキャラは元素順→名前順で処理し、同じグループの最後尾に差し込む
    newcomers = [c for c in chars if c["id"] not in set(order)]
    newcomers.sort(key=lambda c: (ELEMENT_ORDER.index(c.get("element", ""))
                                  if c.get("element") in ELEMENT_ORDER else len(ELEMENT_ORDER),
                                  c.get("name", "")))
    for c in newcomers:
        g = group(c)
        last = max((n for n, x in enumerate(ordered) if group(x) == g), default=None)
        if last is None:
            ordered.append(c)
        else:
            ordered.insert(last + 1, c)
    return ordered


def render_characters(chars):
    lines = []
    for c in chars:
        lines.append("    " + js(c) + ",")
    if lines:
        lines[-1] = lines[-1][:-1]  # 末尾のカンマを外す
    return "\n".join(lines)


def render_months(months):
    out = []
    for m in months:
        b = []
        b.append("    {")
        b.append('      id: %s,' % js(m["id"]))
        b.append('      label: %s,' % js(m["label"]))
        b.append('      elements: %s,' % js(m["elements"]))
        b.append('      travelerElements: %s,' % js(m["travelerElements"]))
        b.append('      openingCast: %s,' % js(m["openingCast"]))
        b.append('      specialCast: %s,' % js(m["specialCast"]))
        b.append("      buffs: [")
        b.append(",\n".join("        " + js(x) for x in m["buffs"]))
        b.append("      ],")
        b.append("      icons: [")
        b.append(",\n".join("        " + js(x) for x in m["icons"]))
        b.append("      ],")
        b.append("      stages: [")
        b.append(",\n".join(render_stage(s) for s in m["stages"]))
        b.append("      ]")
        b.append("    }")
        out.append("\n".join(b))
    return ",\n".join(out)


def render_stage(stage):
    """幕1つを描画する。敵候補が複数ある場合は1行ずつ並べて読みやすくする。"""
    head = {k: v for k, v in stage.items() if k not in ("enemy", "enemyOptions")}
    head_txt = ", ".join("%s: %s" % (k, js(v)) for k, v in head.items())
    if "enemyOptions" in stage:
        opts = ",\n".join("          " + js(e) for e in stage["enemyOptions"])
        return "        { %s, enemyOptions: [\n%s\n        ] }" % (head_txt, opts)
    return "        { %s, enemy: %s }" % (head_txt, js(stage["enemy"]))


def splice_block(source, key, new_body):
    """master-data.js の `key: [ ... ]` の中身だけを差し替える。"""
    start_marker = "\n  %s: [\n" % key
    start = source.index(start_marker) + len(start_marker)
    # ブロック末尾は "\n  ]," か、最後のブロックなら "\n  ]" で終わる
    end = source.index("\n  ]", start)
    return source[:start] + new_body + source[end:]


def build_master_js(source, chars, months):
    chars = sort_characters(chars, source)
    out = splice_block(source, "characters", render_characters(chars))
    out = splice_block(out, "months", render_months(months))
    return out


# ---------------------------------------------------------------- セルフテスト

def _fake_pages_from_master(path):
    """既存の master-data.js から Notion API 形式のダミー応答を組み立てる（テスト用）。"""
    src = open(path, encoding="utf-8").read()

    def grab(key):
        i = src.index("\n  %s: [" % key)
        j = src.index("\n  ]", i + 5)
        t = "[" + src[i + len("\n  %s: [" % key):j] + "]"
        t = re.sub(r'([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:', r'\1"\2":', t)
        t = re.sub(r',(\s*[}\]])', r'\1', t)
        return json.loads(t)

    chars = grab("characters")
    months = grab("months")

    def rt(s):
        return {"rich_text": [{"plain_text": s}]} if s else {"rich_text": []}

    char_pages = []
    pid_by_char = {}
    for n, c in enumerate(chars):
        pid = "c%031d" % n
        pid_by_char[c["id"]] = pid
        t = c.get("tags", {})
        po = t.get("pneumaOusia", "")
        po_list = po if isinstance(po, list) else ([po] if po else [])
        char_pages.append({"id": pid, "properties": {
            "Name": {"title": [{"plain_text": c["name"]}]},
            "ID": rt(c["id"]),
            "Element": {"select": {"name": c["element"]}},
            "Level": {"number": c.get("level", 90)},
            "Image": rt(c["image"].split("/")[-1]),
            "IsTraveler": {"checkbox": bool(c.get("isTraveler"))},
            "Positions": {"multi_select": [{"name": x} for x in t.get("positions", [])]},
            "Roles": {"multi_select": [{"name": x} for x in t.get("roles", [])]},
            "Weapon": {"select": {"name": t.get("weapon", "")}},
            "Nightsoul": {"checkbox": bool(t.get("nightsoul"))},
            "PneumaOusia": {"multi_select": [{"name": x} for x in po_list]},
            "Lunar": {"checkbox": bool(t.get("lunar"))},
            "Magic": {"checkbox": bool(t.get("magic"))},
        }})

    month_pages, stage_pages = [], []
    for n, m in enumerate(months):
        mpid = "m%031d" % n
        month_pages.append({"id": mpid, "properties": {
            "Month": {"title": [{"plain_text": m["id"]}]},
            "Elements": {"multi_select": [{"name": x} for x in m["elements"]]},
            "TravelerElements": {"multi_select": [{"name": x} for x in m.get("travelerElements", [])]},
            "BuffAName": rt(m["buffs"][0]["name"]),
            "BuffBName": rt(m["buffs"][1]["name"]),
            "BuffCName": rt(m["buffs"][2]["name"]),
            "OpeningCast": {"relation": [{"id": pid_by_char[c]} for c in m["openingCast"]]},
            "SpecialCast": {"relation": [{"id": pid_by_char[c]} for c in m["specialCast"]]},
        }})
        for st in m["stages"]:
            opts = st.get("enemyOptions") or ([st["enemy"]] if st.get("enemy") else [])
            for k, e in enumerate(opts, 1):
                stage_name = st["name"] if st["name"] != STAGE_DEFAULT_NAME[st["id"]] else ""
                stage_pages.append({"id": "s%031d" % len(stage_pages), "properties": {
                    "EnemyName": {"title": [{"plain_text": e.get("name", "")}]},
                    "Month": {"relation": [{"id": mpid}]},
                    "StageId": {"select": {"name": st["id"]}},
                    "StageName": rt(stage_name),
                    "Option": {"number": k},
                    "Image": rt(e.get("image", "").split("/")[-1] if e.get("image") else ""),
                    "Icon": rt(e.get("icon", "")),
                    "Note": rt(e.get("note", "")),
                    "GoodElement": {"multi_select": [{"name": x} for x in e.get("element", [])]},
                    "GoodTags": {"multi_select": [{"name": x} for x in e.get("tags", [])]},
                    "RequireAll": {"checkbox": bool(e.get("matchGroups"))},
                    "AvoidElement": {"multi_select": [{"name": x} for x in e.get("avoidElement", [])]},
                    "AvoidTags": {"multi_select": [{"name": x} for x in e.get("avoidTags", [])]},
                    "RecommendedCast": {"relation": [{"id": pid_by_char[c]} for c in e.get("recommendedCharacterIds", [])]},
                }})
    return char_pages, month_pages, stage_pages


def selftest():
    src = open(MASTER_PATH, encoding="utf-8").read()
    char_pages, month_pages, stage_pages = _fake_pages_from_master(MASTER_PATH)
    char_id_by_page = {page_id(p): p_text(p, "ID") for p in char_pages}
    chars = build_characters(char_pages)
    months = build_months(month_pages, stage_pages, char_id_by_page)
    out = build_master_js(src, chars, months)

    def parse(text, key):
        i = text.index("\n  %s: [" % key)
        j = text.index("\n  ]", i + 5)
        t = "[" + text[i + len("\n  %s: [" % key):j] + "]"
        t = re.sub(r'([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:', r'\1"\2":', t)
        t = re.sub(r',(\s*[}\]])', r'\1', t)
        return json.loads(t)

    def norm(v):
        """空文字のキーは「無い」のと同じ扱いにして比較する。"""
        if isinstance(v, dict):
            return {k: norm(x) for k, x in sorted(v.items()) if x != "" and x != []}
        if isinstance(v, list):
            return [norm(x) for x in v]
        if isinstance(v, str):
            return unicodedata.normalize("NFC", v)
        return v

    ok = True
    for key in ("characters", "months"):
        before, after = norm(parse(src, key)), norm(parse(out, key))
        if before == after:
            print("セルフテスト OK: %s は既存データと完全に一致（%d件）" % (key, len(after)))
        else:
            ok = False
            print("セルフテスト NG: %s に差分があります" % key)
            for a, b in zip(before, after):
                if a != b:
                    print("  期待:", json.dumps(a, ensure_ascii=False)[:300])
                    print("  生成:", json.dumps(b, ensure_ascii=False)[:300])
                    break
    return 0 if ok else 1


# ---------------------------------------------------------------- main

def main():
    if "--selftest" in sys.argv:
        sys.exit(selftest())

    token = os.environ.get("NOTION_API_KEY")
    if not token:
        raise SystemExit("環境変数 NOTION_API_KEY が設定されていません。")

    created_asc = [{"timestamp": "created_time", "direction": "ascending"}]
    char_pages = notion_query(DB_CHARACTERS, token, created_asc)
    month_pages = notion_query(DB_MONTHS, token, created_asc)
    stage_pages = notion_query(DB_STAGES, token, created_asc)
    print("取得: キャラ %d件 / 月 %d件 / 敵 %d件" % (len(char_pages), len(month_pages), len(stage_pages)))

    # プロパティ名が想定どおりか先に確かめる（Notion側で列名を変えると壊れるため）
    check_properties(char_pages, "キャラクター一覧",
                     ["Name", "ID", "Element", "Level", "Image", "IsTraveler",
                      "Positions", "Roles", "Weapon", "Nightsoul", "PneumaOusia", "Lunar", "Magic"])
    check_properties(month_pages, "月次設定",
                     ["Month", "Elements", "TravelerElements", "BuffAName", "BuffBName",
                      "BuffCName", "OpeningCast", "SpecialCast"])
    check_properties(stage_pages, "幕と敵",
                     ["EnemyName", "Month", "StageId", "StageName", "Option", "Image", "Icon",
                      "Note", "GoodElement", "GoodTags", "RequireAll", "AvoidElement",
                      "AvoidTags", "RecommendedCast"])

    char_id_by_page = {page_id(p): p_text(p, "ID") for p in char_pages}
    chars = build_characters(char_pages)
    months = build_months(month_pages, stage_pages, char_id_by_page)

    # 取り違えや一時的な障害で既存データを消してしまわないための安全弁
    if not chars:
        raise SystemExit("キャラが0件でした。安全のため書き込みを中止します。")
    if not months:
        raise SystemExit("月次データが0件でした。安全のため書き込みを中止します。")
    if not stage_pages:
        raise SystemExit("幕と敵が0件でした。安全のため書き込みを中止します。")

    missing_id = [p_title(p, "Name") for p in char_pages if not p_text(p, "ID")]
    if missing_id:
        print("注意: ID が空のキャラは取り込みませんでした → %s" % "、".join(missing_id[:10]))

    src = open(MASTER_PATH, encoding="utf-8").read()
    out = build_master_js(src, chars, months)

    if out == src:
        print("変更はありません。")
        return

    open(MASTER_PATH, "w", encoding="utf-8").write(out)
    print("master-data.js を更新しました（キャラ %d名 / 月 %d件）" % (len(chars), len(months)))


if __name__ == "__main__":
    main()
