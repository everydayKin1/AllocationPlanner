window.GENGEKI_MASTER_DATA = {
  version: "2026-07-v5-months",
  title: "幻想シアター公演配分プランナー",
  rules: {
    maxVitality: 2,
    cheerGain: 25,        // 観客からの応援1回につき幻戯の花+25
    slotsPerStage: 4,
    inviteCost: 80,
    buffCost: 60,
    defaultReward: 90,
    buffMaxLevel: 4,
    rosterMin: 22,
    rosterMax: 26
  },
  // 画像パスは images フォルダに。空文字なら絵文字/テキストで代替表示します。
  icons: {
    favicon: "./images/icon/幻想シアター.webp",
    header: "./images/icon/幻想シアター.webp",
    flower: "./images/icon/幻戯の花_icon.webp",
    arcanaNum1: "./images/icon/LunarArcanaNum1_icon.webp",
    arcanaNum2: "./images/icon/LunarArcanaNum2_icon.webp",
    elements: { "炎": "./images/元素/炎元素.png", "水": "./images/元素/水元素.png", "雷": "./images/元素/雷元素.png", "氷": "./images/元素/氷元素.png", "風": "./images/元素/風元素.png", "岩": "./images/元素/岩元素.png", "草": "./images/元素/草元素.png" },
    positions: { "オンフィールド": "./images/icon/Role_On-Field.webp", "オフフィールド": "./images/icon/Role_Off-Field.webp" },
    // 主人公のアイコン。設定で「空」「蛍」を選ぶと、元素を問わず主人公全員の顔がこれに変わる
    traveler: { "空": "./images/character/Aether_icon.webp", "蛍": "./images/character/Lumine_Icon.webp" },
    roles: { "アタッカー": "./images/icon/Role_アタッカー.webp", "サポーター": "./images/icon/Role_サポーター.webp", "ライフキーパー": "./images/icon/Role_ライフキーパー.webp" },
    pneuma: "./images/icon/プネウマ_icon.png",
    ousia: "./images/icon/ウーシア_icon.webp",
    lunar: "./images/icon/月兆_icon.webp",
    magic: "./images/icon/魔導_icon.webp",
    nightsoul: "./images/icon/夜魂の加護_icon.webp",
    reactions: {
      "過負荷": "./images/シャイニングブレス/過負荷_icon.png",
      "溶解": "./images/シャイニングブレス/溶解_icon.png",
      "超伝導": "./images/シャイニングブレス/超伝導_icon.png",
      "凍結": "./images/シャイニングブレス/凍結_icon.png",
      "感電": "./images/シャイニングブレス/感電_icon.png",
      "水晶": "./images/シャイニングブレス/水晶_icon.png",
      "水風": "./images/シャイニングブレス/水風_icon.png",
      "氷晶": "./images/シャイニングブレス/氷晶_icon.png",
      "氷草": "./images/シャイニングブレス/氷草_icon.png",
      "氷風": "./images/シャイニングブレス/氷風_icon.png",
      "激化": "./images/シャイニングブレス/激化_icon.png",
      "火晶": "./images/シャイニングブレス/火晶_icon.png",
      "火風": "./images/シャイニングブレス/火風_icon.png",
      "燃焼": "./images/シャイニングブレス/燃焼_icon.png",
      "蒸発": "./images/シャイニングブレス/蒸発_icon.png",
      "開花": "./images/シャイニングブレス/開花_icon.png",
      "雷晶": "./images/シャイニングブレス/雷晶_icon.png",
      "雷風": "./images/シャイニングブレス/雷風_icon.png"
    }
  },
  elements: ["炎", "水", "雷", "氷", "風", "岩", "草"],
  tagOptions: {
    positions: ["オンフィールド", "オフフィールド"],
    roles: ["アタッカー", "サポーター", "ライフキーパー", "ヒーラー", "シールダー", "タンク"],
    weapons: ["片手剣", "両手剣", "法器", "弓", "長柄武器"],
    pneumaOusia: ["プネウマ", "ウーシア"]
  },
  // 聖遺物セット一覧。iconは用意した画像ファイル名を想定（例: ./images/artifacts/kyuukizoku_icon.png）
  artifactSets: [
    { id: "kyuukizoku", name: "旧貴族4セット", icon: "" },
    { id: "senngan", name: "千岩4セット", icon: "" },
    { id: "kyoukan", name: "教官4セット", icon: "" },
    { id: "suiryoku", name: "翠緑4セット", icon: "" },
    { id: "shinrin", name: "深林4セット", icon: "" },
    { id: "yuukyuu", name: "悠久4セット", icon: "" },
    { id: "arishihi", name: "在りし日の歌4セット", icon: "" },
    { id: "kaijin", name: "灰燼/絵巻4セット", icon: "" },
    { id: "tsukitsumugi", name: "月紡ぎ4セット", icon: "" },
    { id: "okurimono", name: "贈り物4セット", icon: "" }
  ],
  // 用語ツールチップの雛形。文言はあとで自由に書き換えてOK
  glossary: {
    buff: "シャイニングブレス。幻戯の花を消費して強化していくバフ。最大Lv.4まで。",
    lunar: "「月兆」タグ。ナド・クライの一部キャラクターは「月光」の祝福を受けています。チームに編成すると月兆レベルを上げることができ、月兆レベル1(初照)または月兆レベル2以上(満照状態)の時、月兆キャラクターの一部スキルと天賦効果が強化されます。",
    magic: "「魔導」タグ。一部キャラクターがLv.70以上で受注できるクエストを完了させると授かる強化効果です。チームに2名以上の魔導キャラクターを編成することで魔導秘技効果が発動されます。",
    pneumaOusia: "「プネウマ／ウーシア」。フォンテーヌの神の目を持つキャラクターがどちらかに分類され、一部の攻撃方法によって命中すると発動されます。",
    nightsoul: "「夜魂の加護」タグ。ナタのキャラクターは「夜魂の加護」状態に入ることで、運動能力と戦闘力がアップします。「夜魂の加護」状態は一部敵の行動に影響を与えます。一般的な方法として元素スキルの発動で夜魂の加護状態に入ることができます。",
    artifactSet: "そのキャラが今つけている聖遺物4セット効果です。同じチームに同じ聖遺物セットのキャラが重なっていても効果は重複しません。",
    inviteGuide: "「招待の目安」は、その幕までに使う“開幕キャスト以外”のキャラ人数から、必要なキャラ招待の累計回数を概算したものです。幕をクリアするたびに仲間が1人増える前提で計算しています。実際に誰が増えるかはランダムなので、あくまで目安として使ってください。"
  },
  // バフのidは月をまたいで固定（A/B/Cの枠）。名前だけ月ごとに差し替えます。
  defaultBuffs: [
    { id: "buffA", name: "バフA" },
    { id: "buffB", name: "バフB" },
    { id: "buffC", name: "バフC" }
  ],
  months: [
    {
      id: "2026-07",
      label: "2026年07月",
      elements: ["炎", "氷", "雷"],
      travelerElements: ["炎", "雷"],
      openingCast: ["arlecchino", "bennett", "ganyu", "diona", "cyno", "beidou"],
      specialCast: ["kinich", "jahoda", "yumemizukimizuki", "columbina"],
      buffs: [
        { id: "buffA", name: "過負荷" },
        { id: "buffB", name: "溶解" },
        { id: "buffC", name: "超伝導" }
      ],
      icons: [
        { label: "炎", icon: "炎" },
        { label: "氷", icon: "氷" },
        { label: "雷", icon: "雷" }
      ],
      stages: [
        { id: "act-1", name: "第1幕", reward: 90, enemyOptions: [
          { name: "大霊の化身×1", icon: "雷大霊", image: "./images/enemy/大霊（雷）.webp", note: "[おすすめ]元素エネルギーを没収される" },
          { name: "ヴィシャップ・岩×1、ヴィシャップ・水×1", icon: "岩", image: "./images/enemy/ヴィシャップ・岩.webp", note: "過負荷などで怯ませられる", element: ["炎", "雷"] },
          { name: "精鋭襲来-遺跡機兵", icon: "精鋭", image: "./images/enemy/遺跡機兵-ヘビ.webp", note: "最初なので挑戦してみてもOK" }
        ] },
        { id: "act-2", name: "第2幕", reward: 90, enemyOptions: [
          { name: "コホラ竜、土蝕者", icon: "コホラ竜", image: "./images/enemy/コホラ竜.webp", note: "土蝕者は炎手数で割合ダメージを入れることができる" },
          { name: "陸巡艇、ファデュイ特務隊", icon: "陸巡艇", image: "./images/enemy/陸巡艇・偵察攻撃型 .webp", note: "多いのでできればコホラ竜がいい" },
          { name: "精鋭襲来-竜戦士", icon: "竜戦士", image: "./images/enemy/竜戦士・豊穣.webp", note: "火力に余裕があれば" }
        ] },
        { id: "act-3", name: "第3幕（ボス）", reward: 125, enemy: { name: "マッシュラプトル", image: "./images/enemy/マッシュラプトル.webp", note: "耐性が若干高い。雷元素攻撃で激化反応ゲージを上げるとダウンが取れて有利", element: ["雷"] } },
        { id: "act-4", name: "第4幕", reward: 90, enemyOptions: [
          { name: "クク竜", icon: "クク竜", image: "./images/enemy/クク竜.webp", note: "2体を維持、ノックバックで怯む", element: ["炎", "雷"] },
          { name: "野伏", icon: "野伏", image: "./images/enemy/野伏・機巧番.webp", note: "3体を維持、ノックバックで怯む", element: ["炎", "雷"] },
          { name: "重圧ディフェンス", icon: "遺跡守衛", image: "./images/enemy/遺跡守衛くん.webp", note: "遺跡機兵・遺跡守衛&重機　非常にコントロールしにくくノックバックもしないので避けるのがおすすめ" }
        ] },
        { id: "act-5", name: "第5幕", reward: 90, enemyOptions: [
          { name: "濁水幻霊", icon: "濁水幻霊", image: "./images/enemy/濁水幻霊.webp", note: "1体ずつ出現　単体・炎アタッカーはここ", element: ["炎"], tags: ["アタッカー"], matchGroups: [["炎"], ["アタッカー"]] },
          { name: "プライマル構造体", icon: "プライマル構造体", image: "./images/enemy/プライマル構造体.webp", note: "3体ずつ出現　複数OKなら" },
          { name: "精鋭襲来-海乱鬼", icon: "海乱鬼", image: "./images/enemy/海乱鬼.webp", note: "きついので避ける" }
        ] },
        { id: "act-6", name: "第6幕（ボス）", reward: 125, enemy: { name: "エンシェントヴィシャップ", icon: "エンシェントヴィシャップ", image: "./images/enemy/エンシェントヴィシャップ岩.webp", note: "原岩噴射はシールド　今回は雷シールドがあるとダウンを取れる", tags: ["シールド付与"], recommendedCharacterIds: ["ineffa", "beidou"] } },
        { id: "act-7", name: "第7幕", reward: 90, enemyOptions: [
          { name: "大霊の化身×1、大霊の化身×1", icon: "氷大霊", image: "./images/enemy/大霊（氷）.webp", note: "元素エネルギーを没収される", tags: ["夜魂の加護"] },
          { name: "継霊者・炎", icon: "炎継霊者", image: "./images/enemy/継霊者・炎.webp", note: "ギミック解除に炎必須↔️炎ダメ無効（炎以外の火力・アタッカーがいると良い）", tags: ["アタッカー"] },
          { name: "黒蛇騎士", icon: "黒蛇騎士", image: "./images/enemy/黒蛇騎士・岩.webp", note: "きついので避ける" }
        ] },
        { id: "act-8", name: "第8幕（ボス）", reward: 125, enemy: { name: "バトルシップ", icon: "バトルシップ", image: "./images/enemy/バトルシップ.webp", note: "高耐性・炎手数&炎付着量　炎ゲージ貯め→氷シールド削り→ダウン", element: ["炎"] } },
        { id: "act-9", name: "第9幕", reward: 90, enemyOptions: [
          { name: "土蝕者1、土蝕者1", icon: "土蝕者", image: "./images/enemy/土蝕者.webp", note: "炎手数で割合ダメージを自分に入れる", element: ["炎"] },
          { name: "ナタ竜4体", icon: "テペトル竜", image: "./images/enemy/テペトル竜.webp", note: "数が多く走らされるので不便" },
          { name: "精鋭襲来-遺跡重機", icon: "遺跡重機", image: "./images/enemy/遺跡重機.webp", note: "3体、火力に余裕があれば" }
        ] },
        { id: "arcana-1", name: "アルカナ挑戦1", reward: 90, special: true, allowedFromAfter: "第3幕", enemy: { name: "多ウェーブ戦（エルマイト旅団）", icon: "エルマイト旅団", image: "./images/enemy/エルマイト旅団・サンドロアマスター .webp", note: "実質1分30秒（星章獲得目標なら）討伐、ダメージが入るステージなので耐久役も連れてくのが無難", tags: ["ライフキーパー"] } },
        { id: "arcana-2", name: "アルカナ挑戦2", reward: 90, special: true, allowedFromAfter: "第6幕", enemy: { name: "実験用フィールド生成装置", icon: "実験装置", image: "./images/enemy/実験用フィールド生成装置.webp", note: "ジャンプ力が上がるのでジャンプで回避or手厚い耐久サポがいれば。　一応プネウマ×3でダウンが取れるが手間の割にリターンは少ないので火力優先" } },
        { id: "act-10", name: "第10幕（ボス）", reward: 0, final: true, enemy: { name: "兆載永劫ドレイク", icon: "兆載永劫ドレイク", image: "./images/enemy/兆載永劫ドレイク .webp", note: "開幕飛び上がるので両翼のコアまたは光っていれば胸元を弓などで狙い撃ち。しばらくダウン→残り1分ぐらいで目が光るので弓ペチなどでまたダウン", tags: ["弓"], recommendedCharacterIds: ["sandrone", "yaemiko"] } }
      ]
    },
    {
      id: "2026-08",
      label: "2026年08月",
      elements: ["水", "雷", "氷"],
      travelerElements: ["水", "雷", "氷"],
      openingCast: ["yelan", "aino", "flins", "ororon", "skirk", "layla"],
      specialCast: ["arlecchino", "chevreuse", "kaedeharakazuha", "tighnari"],
      buffs: [
        { id: "buffA", name: "凍結" },
        { id: "buffB", name: "感電" },
        { id: "buffC", name: "超伝導" }
      ],
      icons: [
        { label: "水", icon: "水" },
        { label: "雷", icon: "雷" },
        { label: "氷", icon: "氷" }
      ],
      stages: [
        { id: "act-1", name: "第1幕", reward: 90, enemy: { name: "8月サンプル1", icon: "氷", note: "月データ差し替え例。" } },
        { id: "act-2", name: "第2幕", reward: 90, enemy: { name: "8月サンプル2", icon: "風" } },
        { id: "act-3", name: "第3幕", reward: 125, enemy: { name: "8月サンプル3", icon: "岩", note: "第3幕報酬は+125。" } },
        { id: "act-4", name: "第4幕", reward: 90, enemy: { name: "8月サンプル4", icon: "剣" } },
        { id: "act-5", name: "第5幕", reward: 90, enemy: { name: "8月サンプル5", icon: "盾" } },
        { id: "act-6", name: "第6幕", reward: 125, enemy: { name: "8月サンプル6", icon: "双", note: "第6幕報酬は+125。" } },
        { id: "act-7", name: "第7幕", reward: 90, enemy: { name: "8月サンプル7", icon: "旗" } },
        { id: "act-8", name: "第8幕", reward: 125, enemy: { name: "8月サンプル8", icon: "鎧", note: "第8幕報酬は+125。" } },
        { id: "act-9", name: "第9幕", reward: 90, enemy: { name: "8月サンプル9", icon: "星" } },
        { id: "arcana-1", name: "アルカナ挑戦1", reward: 90, special: true, allowedFromAfter: "第3幕", enemy: { name: "8月アルカナ1", icon: "Ⅰ", note: "高難易度。" } },
        { id: "arcana-2", name: "アルカナ挑戦2", reward: 90, special: true, allowedFromAfter: "第6幕", enemy: { name: "8月アルカナ2", icon: "Ⅱ", note: "高難易度。" } },
        { id: "act-10", name: "第10幕", reward: 0, final: true, enemy: { name: "8月最終戦", icon: "冠", note: "12フェーズ目固定。" } }
      ]
    },
    {
      id: "2026-09",
      label: "2026年09月",
      elements: ["水", "雷", "草"],
      travelerElements: ["水", "雷", "草"],
      openingCast: ["cyno", "kukishinobu", "columbina", "xingqiu", "lauma", "kaveh"],
      specialCast: ["sandrone", "nicole", "sucrose", "odette"],
      buffs: [
        { id: "buffA", name: "開花" },
        { id: "buffB", name: "激化" },
        { id: "buffC", name: "感電" }
      ],
      icons: [
        { label: "水", icon: "水" },
        { label: "雷", icon: "雷" },
        { label: "草", icon: "草" }
      ],
      stages: [
        { id: "act-1", name: "第1幕", reward: 90, enemyOptions: [
          { name: "ファデュイ特務隊×6", icon: "特務隊", image: "./images/enemy/ファデュイ特務隊.webp", note: "（とくになし）" },
          { name: "アビスの魔術師・水×6、氷ヒルチャール×1", icon: "アビス", image: "./images/enemy/アビスの魔術師・水.webp", note: "草元素有利", element: ["草"] }
        ] },
        { id: "act-2", name: "第2幕", reward: 90, enemyOptions: [
          { name: "マシナリー×5、×1", icon: "マシナリー", image: "./images/enemy/建造特化型マシナリー.webp" },
          { name: "ライノ竜×3、豊穣竜戦士×2", icon: "ライノ竜", image: "./images/enemy/ライノ竜.webp" },
          { name: "精鋭・クク竜×3、大霊の化身・炎×1", icon: "クク竜", image: "./images/enemy/クク竜.webp", note: "ライフキーパー", tags: ["ライフキーパー"] }
        ] },
        { id: "act-3", name: "第3幕（ボス）", reward: 125, enemy: { name: "マッシュラプトル", image: "./images/enemy/マッシュラプトル.webp", note: "雷アタッカー推奨", element: ["雷"], tags: ["アタッカー"], matchGroups: [["雷"], ["アタッカー"]] } },
        { id: "act-4", name: "第4幕", reward: 90, enemyOptions: [
          { name: "遺跡守衛、水スライム", icon: "遺跡守衛", image: "./images/enemy/遺跡守衛くん.webp", note: "雷、草有利", element: ["雷", "草"] },
          { name: "溶岩の像・流燃体、炎スライム", icon: "溶岩の像", image: "./images/enemy/溶岩の像・流燃体.webp" },
          { name: "重圧ディフェンス", icon: "重圧" }
        ] },
        { id: "act-5", name: "第5幕", reward: 90, enemyOptions: [
          { name: "遺跡機兵×9", icon: "遺跡機兵", image: "./images/enemy/遺跡機兵-ヘビ.webp", note: "設置系不利" },
          { name: "獣域ハウンド×14", icon: "獣域", image: "./images/enemy/獣域.webp", note: "ヒーラー", tags: ["ライフキーパー"] }
        ] },
        { id: "act-6", name: "第6幕（ボス）", reward: 125, enemy: { name: "鉄甲熔炎帝王", image: "./images/enemy/鉄甲熔炎帝王.webp", note: "水付着推奨", element: ["水"] } },
        { id: "act-7", name: "第7幕", reward: 90, enemyOptions: [
          { name: "マッドウォーリアー", icon: "マッド", image: "./images/enemy/ワイルドハント・マッドウォーリアー .webp", note: "月兆（満照）", tags: ["月兆"] },
          { name: "ファデュイ・烈風の従者×1、ファデュイ・氷霜の従者×1", icon: "従者", image: "./images/enemy/ファデュイのお姉さん.webp" }
        ] },
        { id: "act-8", name: "第8幕（ボス）", reward: 125, enemy: { name: "ピピルパンアイドル", image: "./images/enemy/ピピルパンアイドル.webp", note: "感電ギミック持ち", element: ["水", "雷"] } },
        { id: "act-9", name: "第9幕", reward: 90, enemyOptions: [
          { name: "アビスの魔術師・水×6", icon: "アビス水", image: "./images/enemy/アビスの魔術師・水.webp", note: "草元素有利", element: ["草"] },
          { name: "アビスの魔術師・炎×6", icon: "アビス炎", image: "./images/enemy/アビスの魔術師・炎.webp", note: "水元素有利", element: ["水"] }
        ] },
        { id: "arcana-1", name: "アルカナ挑戦1", reward: 90, special: true, allowedFromAfter: "第3幕", enemy: { name: "シャドウハスク", image: "./images/enemy/シャドウハスク.webp", note: "集団戦・要ヒーラー", tags: ["ライフキーパー"] } },
        { id: "arcana-2", name: "アルカナ挑戦2", reward: 90, special: true, allowedFromAfter: "第6幕", enemy: { name: "シネアス", image: "./images/enemy/シネアス.webp", note: "要草元素", element: ["草"] } },
        { id: "act-10", name: "第10幕（ボス）", reward: 0, final: true, enemy: { name: "集光の幻月蝶", image: "./images/enemy/集光の幻月蝶.webp", note: "ヒーラー必須", tags: ["ライフキーパー"] } }
      ]
    }
  ],
  characters: [
    { id: "tr-fire", name: "主人公/炎", element: "炎", level: 90, image: "./images/character/Traveler_icon.webp", isTraveler: true, exclusiveGroup: "traveler", tags: { positions: ["オフフィールド"], roles: ["アタッカー"], weapon: "片手剣", nightsoul: true, pneumaOusia: "", lunar: false, magic: false } },
    { id: "tr-water", name: "主人公/水", element: "水", level: 90, image: "./images/character/Traveler_icon.webp", isTraveler: true, exclusiveGroup: "traveler", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "プネウマ", lunar: false, magic: false } },
    { id: "tr-electro", name: "主人公/雷", element: "雷", level: 90, image: "./images/character/Traveler_icon.webp", isTraveler: true, exclusiveGroup: "traveler", tags: { positions: ["オフフィールド"], roles: ["サポーター"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "tr-anemo", name: "主人公/風", element: "風", level: 90, image: "./images/character/Traveler_icon.webp", isTraveler: true, exclusiveGroup: "traveler", tags: { positions: ["オフフィールド"], roles: ["アタッカー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "tr-geo", name: "主人公/岩", element: "岩", level: 90, image: "./images/character/Traveler_icon.webp", isTraveler: true, exclusiveGroup: "traveler", tags: { positions: ["オフフィールド"], roles: ["アタッカー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "tr-dendro", name: "主人公/草", element: "草", level: 90, image: "./images/character/Traveler_icon.webp", isTraveler: true, exclusiveGroup: "traveler", tags: { positions: ["オフフィールド"], roles: ["アタッカー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "tr-cryo", name: "主人公/氷", element: "氷", level: 90, image: "./images/character/Traveler_icon.webp", isTraveler: true, exclusiveGroup: "traveler", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "durin", name: "ドゥリン", element: "炎", level: 90, image: "./images/character/Durin_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー", "サポーター"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: true } },
    { id: "mavuika", name: "マーヴィカ", element: "炎", level: 90, image: "./images/character/Mavuika_icon.webp", tags: { positions: ["オンフィールド", "オフフィールド"], roles: ["アタッカー", "サポーター"], weapon: "両手剣", nightsoul: true, pneumaOusia: "", lunar: false, magic: false } },
    { id: "arlecchino", name: "アルレッキーノ", element: "炎", level: 90, image: "./images/character/Arlecchino_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "長柄武器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "lyney", name: "リネ", element: "炎", level: 90, image: "./images/character/Lyney_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "弓", nightsoul: false, pneumaOusia: "プネウマ", lunar: false, magic: false } },
    { id: "dehya", name: "ディシア", element: "炎", level: 90, image: "./images/character/Dehya_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー", "ライフキーパー"], weapon: "両手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "yoimiya", name: "宵宮", element: "炎", level: 90, image: "./images/character/Yoimiya_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "弓", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "hutao", name: "胡桃", element: "炎", level: 90, image: "./images/character/HuTao_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "長柄武器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "klee", name: "クレー", element: "炎", level: 90, image: "./images/character/Klee_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "法器", nightsoul: false, pneumaOusia: "", lunar: false, magic: true } },
    { id: "diluc", name: "ディルック", element: "炎", level: 90, image: "./images/character/Diluc_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "両手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "gamin", name: "嘉明", element: "炎", level: 90, image: "./images/character/Gamin_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "両手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "chevreuse", name: "シュヴルーズ", element: "炎", level: 90, image: "./images/character/Chevreuse_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター", "ライフキーパー"], weapon: "長柄武器", nightsoul: false, pneumaOusia: "ウーシア", lunar: false, magic: false } },
    { id: "thoma", name: "トーマ", element: "炎", level: 90, image: "./images/character/Thoma_icon.webp", tags: { positions: ["オフフィールド"], roles: ["ライフキーパー"], weapon: "長柄武器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "yanfei", name: "煙緋", element: "炎", level: 90, image: "./images/character/Yanfei_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "法器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "xinyan", name: "辛炎", element: "炎", level: 90, image: "./images/character/Xinyan_icon.webp", tags: { positions: ["オフフィールド"], roles: ["ライフキーパー"], weapon: "両手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "bennett", name: "ベネット", element: "炎", level: 90, image: "./images/character/Bennett_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター", "ライフキーパー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "xiangling", name: "香菱", element: "炎", level: 90, image: "./images/character/Xiangling_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー"], weapon: "長柄武器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "amber", name: "アンバー", element: "炎", level: 90, image: "./images/character/Amber_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター"], weapon: "弓", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "nicole", name: "ニコ", element: "炎", level: 90, image: "./images/character/Nicole_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター", "ライフキーパー"], weapon: "法器", nightsoul: false, pneumaOusia: "", lunar: false, magic: true } },
    { id: "columbina", name: "コロンビーナ", element: "水", level: 90, image: "./images/character/Columbina_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー", "サポーター"], weapon: "法器", nightsoul: false, pneumaOusia: "", lunar: true, magic: false } },
    { id: "mualani", name: "ムアラニ", element: "水", level: 90, image: "./images/character/Mualani_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "法器", nightsoul: true, pneumaOusia: "", lunar: false, magic: false } },
    { id: "sigewinne", name: "シグウィン", element: "水", level: 90, image: "./images/character/Sigewinne_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター", "ライフキーパー"], weapon: "弓", nightsoul: false, pneumaOusia: "ウーシア", lunar: false, magic: false } },
    { id: "furina", name: "フリーナ", element: "水", level: 90, image: "./images/character/Furina_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー", "サポーター", "ライフキーパー"], weapon: "片手剣", nightsoul: false, pneumaOusia: ["プネウマ", "ウーシア"], lunar: false, magic: false } },
    { id: "neuvillette", name: "ヌヴィレット", element: "水", level: 90, image: "./images/character/Neuvillette_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "法器", nightsoul: false, pneumaOusia: "プネウマ", lunar: false, magic: false } },
    { id: "nilou", name: "ニィロウ", element: "水", level: 90, image: "./images/character/Nilou_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー", "サポーター"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "yelan", name: "夜蘭", element: "水", level: 90, image: "./images/character/Yelan_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー"], weapon: "弓", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "kamisatoayato", name: "神里綾人", element: "水", level: 90, image: "./images/character/KamisatoAyato_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "sangonomiyakokomi", name: "珊瑚宮心海", element: "水", level: 90, image: "./images/character/SangonomiyaKokomi_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター", "ライフキーパー"], weapon: "法器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "tartaglia", name: "タルタリヤ", element: "水", level: 90, image: "./images/character/Tartaglia_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "弓", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "mona", name: "モナ", element: "水", level: 90, image: "./images/character/Mona_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター"], weapon: "法器", nightsoul: false, pneumaOusia: "", lunar: false, magic: true } },
    { id: "aino", name: "アイノ", element: "水", level: 90, image: "./images/character/Aino_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー", "ライフキーパー"], weapon: "両手剣", nightsoul: false, pneumaOusia: "", lunar: true, magic: false } },
    { id: "dahlia", name: "ダリア", element: "水", level: 90, image: "./images/character/Dahlia_icon.webp", tags: { positions: ["オフフィールド"], roles: ["ライフキーパー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "candace", name: "キャンディス", element: "水", level: 90, image: "./images/character/Candace_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター"], weapon: "長柄武器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "xingqiu", name: "行秋", element: "水", level: 90, image: "./images/character/Xingqiu_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー", "ライフキーパー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "barbara", name: "バーバラ", element: "水", level: 90, image: "./images/character/Barbara_icon.webp", tags: { positions: ["オフフィールド"], roles: ["ライフキーパー"], weapon: "法器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "chongyun", name: "重雲", element: "氷", level: 90, image: "./images/character/Chongyun_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー", "サポーター"], weapon: "両手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "kamisatoayaka", name: "神里綾華", element: "氷", level: 90, image: "./images/character/Kamisato Ayaka_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "shenhe", name: "申鶴", element: "氷", level: 90, image: "./images/character/Shenhe_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター"], weapon: "長柄武器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "ganyu", name: "甘雨", element: "氷", level: 90, image: "./images/character/Ganyu_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "弓", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "qiqi", name: "七七", element: "氷", level: 90, image: "./images/character/Qiqi_icon.webp", tags: { positions: ["オフフィールド"], roles: ["ライフキーパー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "rosaria", name: "ロサリア", element: "氷", level: 90, image: "./images/character/Rosaria_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー"], weapon: "長柄武器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "layla", name: "レイラ", element: "氷", level: 90, image: "./images/character/Layla_icon.webp", tags: { positions: ["オフフィールド"], roles: ["ライフキーパー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "wriothesley", name: "リオセスリ", element: "氷", level: 90, image: "./images/character/Wriothesley_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "法器", nightsoul: false, pneumaOusia: "ウーシア", lunar: false, magic: false } },
    { id: "mika", name: "ミカ", element: "氷", level: 90, image: "./images/character/Mika_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター", "ライフキーパー"], weapon: "長柄武器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "freminet", name: "フレミネ", element: "氷", level: 90, image: "./images/character/Freminet_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "両手剣", nightsoul: false, pneumaOusia: "プネウマ", lunar: false, magic: false } },
    { id: "diona", name: "ディオナ", element: "氷", level: 90, image: "./images/character/Diona_icon.webp", tags: { positions: ["オフフィールド"], roles: ["ライフキーパー"], weapon: "弓", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "skirk", name: "スカーク", element: "氷", level: 90, image: "./images/character/Skirk_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "charlotte", name: "シャルロット", element: "氷", level: 90, image: "./images/character/Charlotte_icon.webp", tags: { positions: ["オフフィールド"], roles: ["ライフキーパー"], weapon: "法器", nightsoul: false, pneumaOusia: "プネウマ", lunar: false, magic: false } },
    { id: "citlali", name: "シトラリ", element: "氷", level: 90, image: "./images/character/Citlali_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター", "ライフキーパー"], weapon: "法器", nightsoul: true, pneumaOusia: "", lunar: false, magic: false } },
    { id: "kaeya", name: "ガイア", element: "氷", level: 90, image: "./images/character/Kaeya_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "escofier", name: "エスコフィエ", element: "氷", level: 90, image: "./images/character/Escofier_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー", "サポーター", "ライフキーパー"], weapon: "長柄武器", nightsoul: false, pneumaOusia: "ウーシア", lunar: false, magic: false } },
    { id: "eula", name: "エウルア", element: "氷", level: 90, image: "./images/character/Eula_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "両手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "aloy", name: "アーロイ", element: "氷", level: 90, image: "./images/character/Aloy_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "弓", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "lohen", name: "ローエン", element: "氷", level: 90, image: "./images/character/Lohen_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "長柄武器", nightsoul: false, pneumaOusia: "", lunar: false, magic: true } },
    { id: "sandrone", name: "サンドローネ", element: "氷", level: 90, image: "./images/character/Sandrone_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "両手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "flins", name: "フリンズ", element: "雷", level: 90, image: "./images/character/Flins_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "長柄武器", nightsoul: false, pneumaOusia: "", lunar: true, magic: false } },
    { id: "ineffa", name: "イネファ", element: "雷", level: 90, image: "./images/character/Ineffa_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー", "ライフキーパー"], weapon: "長柄武器", nightsoul: false, pneumaOusia: "", lunar: true, magic: false } },
    { id: "varesa", name: "ヴァレサ", element: "雷", level: 90, image: "./images/character/Varesa_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "法器", nightsoul: true, pneumaOusia: "", lunar: false, magic: false } },
    { id: "clorinde", name: "クロリンデ", element: "雷", level: 90, image: "./images/character/Clorinde_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "ウーシア", lunar: false, magic: false } },
    { id: "cyno", name: "セノ", element: "雷", level: 90, image: "./images/character/Cyno_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "長柄武器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "yaemiko", name: "八重神子", element: "雷", level: 90, image: "./images/character/YaeMiko_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー"], weapon: "法器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "raidenshogun", name: "雷電将軍", element: "雷", level: 90, image: "./images/character/RaidenShogun_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー", "サポーター"], weapon: "長柄武器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "keqing", name: "刻晴", element: "雷", level: 90, image: "./images/character/Keqing_cos.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "iansan", name: "イアンサ", element: "雷", level: 90, image: "./images/character/Iansan_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター", "ライフキーパー"], weapon: "長柄武器", nightsoul: true, pneumaOusia: "", lunar: false, magic: false } },
    { id: "ororon", name: "オロルン", element: "雷", level: 90, image: "./images/character/Ororon_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー"], weapon: "弓", nightsoul: true, pneumaOusia: "", lunar: false, magic: false } },
    { id: "sethos", name: "セトス", element: "雷", level: 90, image: "./images/character/Sethos_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "弓", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "dori", name: "ドリー", element: "雷", level: 90, image: "./images/character/Dori_icon.webp", tags: { positions: ["オフフィールド"], roles: ["ライフキーパー"], weapon: "両手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "kukishinobu", name: "久岐忍", element: "雷", level: 90, image: "./images/character/KukiShinobu_icon.webp", tags: { positions: ["オフフィールド"], roles: ["ライフキーパー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "kujousara", name: "九条裟羅", element: "雷", level: 90, image: "./images/character/KujouSara_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター"], weapon: "弓", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "fischl", name: "フィッシュル", element: "雷", level: 90, image: "./images/character/Fischl_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー"], weapon: "弓", nightsoul: false, pneumaOusia: "", lunar: false, magic: true } },
    { id: "beidou", name: "北斗", element: "雷", level: 90, image: "./images/character/Beidou_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー", "ライフキーパー"], weapon: "両手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "razor", name: "レザー", element: "雷", level: 90, image: "./images/character/Razor_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "両手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: true } },
    { id: "lisa", name: "リサ", element: "雷", level: 90, image: "./images/character/Lisa_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター"], weapon: "法器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "varka", name: "ファルカ", element: "風", level: 90, image: "./images/character/Varka_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: true } },
    { id: "yumemizukimizuki", name: "夢見月瑞希", element: "風", level: 90, image: "./images/character/YumemizukiMizuki_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー", "ライフキーパー"], weapon: "法器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "chasca", name: "チャスカ", element: "風", level: 90, image: "./images/character/Chasca_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "弓", nightsoul: true, pneumaOusia: "", lunar: false, magic: false } },
    { id: "xianyun", name: "閑雲", element: "風", level: 90, image: "./images/character/Xianyun_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター", "ライフキーパー"], weapon: "法器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "wanderer", name: "放浪者", element: "風", level: 90, image: "./images/character/Wanderer_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "法器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "kaedeharakazuha", name: "楓原万葉", element: "風", level: 90, image: "./images/character/KaedeharaKazuha_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "xiao", name: "魈", element: "風", level: 90, image: "./images/character/Xiao_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "長柄武器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "venti", name: "ウェンティ", element: "風", level: 90, image: "./images/character/Venti_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー", "サポーター"], weapon: "弓", nightsoul: false, pneumaOusia: "", lunar: false, magic: true } },
    { id: "jean", name: "ジン", element: "風", level: 90, image: "./images/character/Jean_icon.webp", tags: { positions: ["オフフィールド"], roles: ["ライフキーパー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "jahoda", name: "ヤフォダ", element: "風", level: 90, image: "./images/character/Jahoda_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター", "ライフキーパー"], weapon: "弓", nightsoul: false, pneumaOusia: "", lunar: true, magic: false } },
    { id: "ifa", name: "イファ", element: "風", level: 90, image: "./images/character/Ifa_icon.webp", tags: { positions: ["オンフィールド"], roles: ["サポーター", "ライフキーパー"], weapon: "法器", nightsoul: true, pneumaOusia: "", lunar: false, magic: false } },
    { id: "lanyan", name: "藍硯", element: "風", level: 90, image: "./images/character/LanYan_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー", "ライフキーパー"], weapon: "法器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "lynette", name: "リネット", element: "風", level: 90, image: "./images/character/Lynette_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "ウーシア", lunar: false, magic: false } },
    { id: "faruzan", name: "ファルザン", element: "風", level: 90, image: "./images/character/Faruzan_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター"], weapon: "弓", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "shikanoinheizou", name: "鹿野院平蔵", element: "風", level: 90, image: "./images/character/ShikanoinHeizou_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "法器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "sayu", name: "早柚", element: "風", level: 90, image: "./images/character/Sayu_icon.webp", tags: { positions: ["オフフィールド"], roles: ["ライフキーパー"], weapon: "両手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "sucrose", name: "スクロース", element: "風", level: 90, image: "./images/character/Sucrose_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター"], weapon: "法器", nightsoul: false, pneumaOusia: "", lunar: false, magic: true } },
    { id: "prune", name: "プルーネ", element: "風", level: 90, image: "./images/character/Prune_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター"], weapon: "法器", nightsoul: false, pneumaOusia: "", lunar: false, magic: true } },
    { id: "linnea", name: "リンネア", element: "岩", level: 90, image: "./images/character/Linnea_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー", "サポーター", "ライフキーパー"], weapon: "弓", nightsoul: false, pneumaOusia: "", lunar: true, magic: false } },
    { id: "zibai", name: "兹白", element: "岩", level: 90, image: "./images/character/Zibai_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: true, magic: false } },
    { id: "xilonen", name: "シロネン", element: "岩", level: 90, image: "./images/character/Xilonen_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター", "ライフキーパー"], weapon: "片手剣", nightsoul: true, pneumaOusia: "", lunar: false, magic: false } },
    { id: "chiori", name: "千織", element: "岩", level: 90, image: "./images/character/Chiori_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "navia", name: "ナヴィア", element: "岩", level: 90, image: "./images/character/Navia_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "両手剣", nightsoul: false, pneumaOusia: "ウーシア", lunar: false, magic: false } },
    { id: "aratakiitto", name: "荒瀧一斗", element: "岩", level: 90, image: "./images/character/AratakiItto_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "両手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "albedo", name: "アルベド", element: "岩", level: 90, image: "./images/character/Albedo_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: true } },
    { id: "zhongli", name: "鍾離", element: "岩", level: 90, image: "./images/character/Zhongli_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター", "ライフキーパー"], weapon: "長柄武器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "illuga", name: "イルーガ", element: "岩", level: 90, image: "./images/character/Illuga_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター"], weapon: "長柄武器", nightsoul: false, pneumaOusia: "", lunar: true, magic: false } },
    { id: "kachina", name: "カチーナ", element: "岩", level: 90, image: "./images/character/Kachina_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー"], weapon: "長柄武器", nightsoul: true, pneumaOusia: "", lunar: false, magic: false } },
    { id: "yunjin", name: "雲菫", element: "岩", level: 90, image: "./images/character/YunJin_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター"], weapon: "長柄武器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "gorou", name: "ゴロー", element: "岩", level: 90, image: "./images/character/Gorou_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター"], weapon: "弓", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "noelle", name: "ノエル", element: "岩", level: 90, image: "./images/character/Noelle_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー", "ライフキーパー"], weapon: "両手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "ningguang", name: "凝光", element: "岩", level: 90, image: "./images/character/Ningguang_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "法器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "nefer", name: "ネフェル", element: "草", level: 90, image: "./images/character/Nefer_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "法器", nightsoul: false, pneumaOusia: "", lunar: true, magic: false } },
    { id: "lauma", name: "ラウマ", element: "草", level: 90, image: "./images/character/Lauma_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター"], weapon: "法器", nightsoul: false, pneumaOusia: "", lunar: true, magic: false } },
    { id: "kinich", name: "キィニチ", element: "草", level: 90, image: "./images/character/Kinich_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "両手剣", nightsoul: true, pneumaOusia: "", lunar: false, magic: false } },
    { id: "emilie", name: "エミリエ", element: "草", level: 90, image: "./images/character/Emilie_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー"], weapon: "長柄武器", nightsoul: false, pneumaOusia: "プネウマ", lunar: false, magic: false } },
    { id: "baizhu", name: "白朮", element: "草", level: 90, image: "./images/character/Baizhu_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター", "ライフキーパー"], weapon: "法器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "alhaitham", name: "アルハイゼン", element: "草", level: 90, image: "./images/character/Alhaitham_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "nahida", name: "ナヒーダ", element: "草", level: 90, image: "./images/character/Nahida_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー", "サポーター"], weapon: "法器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "tighnari", name: "ティナリ", element: "草", level: 90, image: "./images/character/Tighnari_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "弓", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "kirara", name: "綺良々", element: "草", level: 90, image: "./images/character/Kirara_icon.webp", tags: { positions: ["オフフィールド"], roles: ["ライフキーパー"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "odette", name: "オデット", element: "氷", level: 90, image: "./images/character/Odette_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー", "サポーター"], weapon: "片手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "alyosha", name: "アリョーシャ", element: "雷", level: 90, image: "./images/character/Alyosha_icon.webp", tags: { positions: ["オフフィールド"], roles: ["サポーター", "ライフキーパー"], weapon: "長柄武器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "kaveh", name: "カーヴェ", element: "草", level: 90, image: "./images/character/Kaveh_icon.webp", tags: { positions: ["オンフィールド"], roles: ["アタッカー"], weapon: "両手剣", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "yaoyao", name: "ヨォーヨ", element: "草", level: 90, image: "./images/character/Yaoyao_icon.webp", tags: { positions: ["オフフィールド"], roles: ["ライフキーパー"], weapon: "長柄武器", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } },
    { id: "collei", name: "コレイ", element: "草", level: 90, image: "./images/character/Collei_icon.webp", tags: { positions: ["オフフィールド"], roles: ["アタッカー"], weapon: "弓", nightsoul: false, pneumaOusia: "", lunar: false, magic: false } }
  ]
};
