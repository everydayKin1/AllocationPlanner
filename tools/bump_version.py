#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
index.html の ?v=NN を +1 する。

master-data.js などを更新したとき、閲覧者のブラウザが古いキャッシュを
読み続けないようにするための処理。
"""

import os
import re

HTML_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "index.html")


def main():
    src = open(HTML_PATH, encoding="utf-8").read()
    versions = [int(v) for v in re.findall(r"\?v=(\d+)", src)]
    if not versions:
        print("?v= が見つからないので、何もしません。")
        return
    nxt = max(versions) + 1
    out = re.sub(r"\?v=\d+", "?v=%d" % nxt, src)
    if out == src:
        print("変更はありません。")
        return
    open(HTML_PATH, "w", encoding="utf-8").write(out)
    print("キャッシュ対策のバージョンを v=%d に更新しました。" % nxt)


if __name__ == "__main__":
    main()
