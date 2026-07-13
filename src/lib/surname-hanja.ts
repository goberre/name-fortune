/** 한국 주요 성씨(姓) — 대표 한자와 성씨 풀이 */
export type SurnameHanjaOption = {
  hanja: string;
  meaning: string;
  gloss: string;
};

export type SurnameEntry = {
  /** 대표 한자 */
  primary: string;
  options: SurnameHanjaOption[];
  /** 성씨 유래·뜻 요약 */
  summary: string;
};

/** 음절(김·이·박…) 또는 복성(남궁·황보…) */
export const SURNAME_HANJA: Record<string, SurnameEntry> = {
  김: {
    primary: "金",
    summary: "금(金) · 재물·단단함의 기운. 김해·경주 김씨 등 전국 최대 성씨.",
    options: [
      { hanja: "金", meaning: "쇠 금", gloss: "성씨 金(김) — 금·쇠에서 유래한 대표 김씨 한자" },
      { hanja: "琴", meaning: "거문고 금", gloss: "성씨 琴(김) — 거문고(琴)에서 유래한 김씨 파" },
      { hanja: "錦", meaning: "비단 금", gloss: "성씨 錦(김) — 錦綉·錦城 등 김씨 파" },
    ],
  },
  이: {
    primary: "李",
    summary: "오얀(李) · 나무(木) 위 아이(子). 전통 성씨 李(이)의 정통 한자.",
    options: [
      { hanja: "李", meaning: "오얀 리", gloss: "성씨 李(이) — 木+子, 전국 2위 성씨" },
      { hanja: "異", meaning: "다를 이", gloss: "성씨 異(이) — 이(異)씨 계열" },
      { hanja: "伊", meaning: "저 이", gloss: "성씨 伊(이) — 伊氏 계열" },
    ],
  },
  박: {
    primary: "朴",
    summary: "박(朴)나무 · 순박·겸손의 뜻. 박(朴)씨 정통 한자.",
    options: [
      { hanja: "朴", meaning: "박(나무) 박", gloss: "성씨 朴(박) — 朴木, 순박함·겸손" },
      { hanja: "博", meaning: "넓을 박", gloss: "성씨 博(박) — 박(博)씨 파" },
    ],
  },
  최: {
    primary: "崔",
    summary: "높은 산(崔) · 경주 최씨 등. 崔(최)씨 정통 한자.",
    options: [{ hanja: "崔", meaning: "높을 최", gloss: "성씨 崔(최) — 산(山)이 높다, 崔氏" }],
  },
  정: {
    primary: "鄭",
    summary: "나라 이름(鄭) · 경주·동래 정씨. 鄭(정)씨 대표 한자.",
    options: [
      { hanja: "鄭", meaning: "나라 이름 정", gloss: "성씨 鄭(정) — 鄭國, 경주 정씨" },
      { hanja: "丁", meaning: "고무망치 정", gloss: "성씨 丁(정) — 丁氏 계열" },
      { hanja: "全", meaning: "온전할 정", gloss: "성씨 全(정) — 全氏 계열" },
    ],
  },
  강: {
    primary: "姜",
    summary: "생강(姜) · 진(晉) 강씨 등. 姜(강)씨 정통.",
    options: [
      { hanja: "姜", meaning: "생강 강", gloss: "성씨 姜(강) — 姜氏, 진(晉) 강씨" },
      { hanja: "康", meaning: "편안할 강", gloss: "성씨 康(강) — 康氏 계열" },
      { hanja: "江", meaning: "강 강", gloss: "성씨 江(강) — 江氏 계열" },
      { hanja: "强", meaning: "강할 강", gloss: "성씨 强(강) — 强氏 계열" },
    ],
  },
  조: {
    primary: "趙",
    summary: "조(趙)나라 · 개성·평양 조씨. 趙(조)씨 대표.",
    options: [
      { hanja: "趙", meaning: "나라 이름 조", gloss: "성씨 趙(조) — 趙國, 개성 조씨" },
      { hanja: "曺", meaning: "조(曺)", gloss: "성씨 曺(조) — 曺氏 변형 표기" },
      { hanja: "曹", meaning: "무리 조", gloss: "성씨 曹(조) — 曹氏 계열" },
    ],
  },
  윤: {
    primary: "尹",
    summary: "다스릴(尹) · 파주·해남 윤씨. 尹(윤)씨 정통.",
    options: [
      { hanja: "尹", meaning: "다스릴 윤", gloss: "성씨 尹(윤) — 尹氏, 파주·해남" },
      { hanja: "允", meaning: "허락할 윤", gloss: "성씨 允(윤) — 允氏 계열" },
      { hanja: "潤", meaning: "윤택할 윤", gloss: "성씨 潤(윤) — 潤氏 계열" },
    ],
  },
  장: {
    primary: "張",
    summary: "활(張) · 전국 장씨. 張(장)씨 대표.",
    options: [
      { hanja: "張", meaning: "활 장", gloss: "성씨 張(장) — 張氏, 활(弓)을 펴다" },
      { hanja: "章", meaning: "글 장", gloss: "성씨 章(장) — 章氏 계열" },
      { hanja: "蔣", meaning: "蔣 장", gloss: "성씨 蔣(장) — 蔣氏 계열" },
    ],
  },
  임: {
    primary: "林",
    summary: "숲(林) · 나무(木) 둘. 林(임)씨·任(임)씨.",
    options: [
      { hanja: "林", meaning: "수풀 림", gloss: "성씨 林(임) — 林氏, 숲·나무" },
      { hanja: "任", meaning: "맡길 임", gloss: "성씨 任(임) — 任氏 계열" },
    ],
  },
  한: {
    primary: "韓",
    summary: "한(韓)나라 · 한(韓)씨·漢(한)씨.",
    options: [
      { hanja: "韓", meaning: "나라 이름 한", gloss: "성씨 韓(한) — 韓國, 한(韓)씨" },
      { hanja: "漢", meaning: "한(朝) 한", gloss: "성씨 漢(한) — 漢氏 계열" },
    ],
  },
  오: {
    primary: "吳",
    summary: "오(吳)나라 · 오(吳)씨 정통.",
    options: [
      { hanja: "吳", meaning: "나라 이름 오", gloss: "성씨 吳(오) — 吳國, 오(吳)씨" },
      { hanja: "伍", meaning: "다섯 오", gloss: "성씨 伍(오) — 伍氏 계열" },
    ],
  },
  서: {
    primary: "徐",
    summary: "천천히(徐) · 경주·이천 서씨.",
    options: [
      { hanja: "徐", meaning: "천천히 서", gloss: "성씨 徐(서) — 徐氏, 경주·이천" },
      { hanja: "西", meaning: "서쪽 서", gloss: "성씨 西(서) — 西氏 계열" },
      { hanja: "序", meaning: "차례 서", gloss: "성씨 序(서) — 序氏 계열" },
    ],
  },
  신: {
    primary: "申",
    summary: "펼(申) · 신(申)씨·辛(신)씨.",
    options: [
      { hanja: "申", meaning: "펼 신", gloss: "성씨 申(신) — 申氏" },
      { hanja: "辛", meaning: "매울 신", gloss: "성씨 辛(신) — 辛氏" },
      { hanja: "新", meaning: "새 신", gloss: "성씨 新(신) — 新氏 계열" },
    ],
  },
  권: {
    primary: "權",
    summary: "권(權) · 권력·균형. 權(권)씨 정통.",
    options: [{ hanja: "權", meaning: "권세 권", gloss: "성씨 權(권) — 權氏, 권력·균형" }],
  },
  황: {
    primary: "黃",
    summary: "누렇(黃) · 황(黃)씨·皇(황)씨.",
    options: [
      { hanja: "黃", meaning: "누를 황", gloss: "성씨 黃(황) — 黃氏" },
      { hanja: "皇", meaning: "임금 황", gloss: "성씨 皇(황) — 皇氏 계열" },
    ],
  },
  안: {
    primary: "安",
    summary: "편안(安) · 안(安)씨·顔(안)씨.",
    options: [
      { hanja: "安", meaning: "편안할 안", gloss: "성씨 安(안) — 安氏, 평안" },
      { hanja: "顔", meaning: "얼굴 안", gloss: "성씨 顔(안) — 顔氏 계열" },
    ],
  },
  송: {
    primary: "宋",
    summary: "송(宋)나라 · 송(宋)씨 정통.",
    options: [{ hanja: "宋", meaning: "나라 이름 송", gloss: "성씨 宋(송) — 宋國, 宋氏" }],
  },
  유: {
    primary: "柳",
    summary: "버들(柳) · 유(柳)씨·劉(유)씨.",
    options: [
      { hanja: "柳", meaning: "버들 류", gloss: "성씨 柳(유) — 柳氏, 버들" },
      { hanja: "劉", meaning: "죽일 류", gloss: "성씨 劉(유) — 劉氏 계열" },
      { hanja: "兪", meaning: "대답할 유", gloss: "성씨 兪(유) — 兪氏 계열" },
    ],
  },
  홍: {
    primary: "洪",
    summary: "넓(洪) · 홍(洪)씨·洪(홍)씨.",
    options: [
      { hanja: "洪", meaning: "넓을 홍", gloss: "성씨 洪(홍) — 洪氏" },
      { hanja: "弘", meaning: "클 홍", gloss: "성씨 弘(홍) — 弘氏 계열" },
    ],
  },
  문: {
    primary: "文",
    summary: "글(文) · 문(文)씨·門(문)씨.",
    options: [
      { hanja: "文", meaning: "글월 문", gloss: "성씨 文(문) — 文氏, 학문" },
      { hanja: "門", meaning: "문 문", gloss: "성씨 門(문) — 門氏 계열" },
    ],
  },
  양: {
    primary: "梁",
    summary: "들보(梁) · 양(梁)씨·楊(양)씨.",
    options: [
      { hanja: "梁", meaning: "들보 량", gloss: "성씨 梁(양) — 梁氏" },
      { hanja: "楊", meaning: "버들 양", gloss: "성씨 楊(양) — 楊氏, 버들" },
      { hanja: "陽", meaning: "볕 양", gloss: "성씨 陽(양) — 陽氏 계열" },
    ],
  },
  손: {
    primary: "孫",
    summary: "손자(孫) · 손(孫)씨 정통.",
    options: [{ hanja: "孫", meaning: "손자 손", gloss: "성씨 孫(손) — 孫氏, 손자" }],
  },
  배: {
    primary: "裵",
    summary: "裵(배) · 배(裵)씨 정통 한자.",
    options: [{ hanja: "裵", meaning: "배 성", gloss: "성씨 裵(배) — 裵氏" }],
  },
  백: {
    primary: "白",
    summary: "흰(白) · 백(白)씨·百(백)씨.",
    options: [
      { hanja: "白", meaning: "흰 백", gloss: "성씨 白(백) — 白氏" },
      { hanja: "百", meaning: "일백 백", gloss: "성씨 百(백) — 百氏 계열" },
    ],
  },
  허: {
    primary: "許",
    summary: "허락(許) · 허(許)씨 정통.",
    options: [{ hanja: "許", meaning: "허락할 허", gloss: "성씨 許(허) — 許氏" }],
  },
  남: {
    primary: "南",
    summary: "남쪽(南) · 남(南)씨·남궁(南宮) 복성.",
    options: [{ hanja: "南", meaning: "남녘 남", gloss: "성씨 南(남) — 南氏·南宮(남궁) 복성" }],
  },
  심: {
    primary: "沈",
    summary: "잠길(沈) · 심(沈)씨·心(심)씨.",
    options: [
      { hanja: "沈", meaning: "잠길 심", gloss: "성씨 沈(심) — 沈氏" },
      { hanja: "心", meaning: "마음 심", gloss: "성씨 心(심) — 心氏 계열" },
    ],
  },
  노: {
    primary: "盧",
    summary: "그릇(盧) · 노(盧)씨·魯(노)씨.",
    options: [
      { hanja: "盧", meaning: "그릇 노", gloss: "성씨 盧(노) — 盧氏" },
      { hanja: "魯", meaning: "나라 이름 노", gloss: "성씨 魯(노) — 魯氏 계열" },
    ],
  },
  하: {
    primary: "河",
    summary: "강(河) · 하(河)씨·夏(하)씨.",
    options: [
      { hanja: "河", meaning: "강 하", gloss: "성씨 河(하) — 河氏, 강" },
      { hanja: "夏", meaning: "여름 하", gloss: "성씨 夏(하) — 夏氏 계열" },
    ],
  },
  곽: {
    primary: "郭",
    summary: "성곽(郭) · 곽(郭)씨 정통.",
    options: [{ hanja: "郭", meaning: "성곽 곽", gloss: "성씨 郭(곽) — 郭氏, 성곽" }],
  },
  성: {
    primary: "成",
    summary: "이룸(成) · 성(成)씨·星(성)씨.",
    options: [
      { hanja: "成", meaning: "이룰 성", gloss: "성씨 成(성) — 成氏" },
      { hanja: "星", meaning: "별 성", gloss: "성씨 星(성) — 星氏 계열" },
    ],
  },
  차: {
    primary: "車",
    summary: "수레(車) · 차(車)씨 정통.",
    options: [{ hanja: "車", meaning: "수레 차", gloss: "성씨 車(차) — 車氏, 수레" }],
  },
  주: {
    primary: "周",
    summary: "두루(周) · 주(周)씨·朱(주)씨.",
    options: [
      { hanja: "周", meaning: "두루 주", gloss: "성씨 周(주) — 周氏" },
      { hanja: "朱", meaning: "붉을 주", gloss: "성씨 朱(주) — 朱氏 계열" },
    ],
  },
  우: {
    primary: "禹",
    summary: "우(禹) · 우(禹)씨·于(우)씨.",
    options: [
      { hanja: "禹", meaning: "성명 우", gloss: "성씨 禹(우) — 禹氏" },
      { hanja: "于", meaning: "어조사 우", gloss: "성씨 于(우) — 于氏 계열" },
    ],
  },
  구: {
    primary: "具",
    summary: "갖출(具) · 구(具)씨·丘(구)씨.",
    options: [
      { hanja: "具", meaning: "갖출 구", gloss: "성씨 具(구) — 具氏" },
      { hanja: "丘", meaning: "언덕 구", gloss: "성씨 丘(구) — 丘氏 계열" },
    ],
  },
  전: {
    primary: "全",
    summary: "온전(全) · 전(全)씨·田(전)씨.",
    options: [
      { hanja: "全", meaning: "온전할 전", gloss: "성씨 全(전) — 全氏" },
      { hanja: "田", meaning: "밭 전", gloss: "성씨 田(전) — 田氏 계열" },
    ],
  },
  민: {
    primary: "閔",
    summary: "근심(閔) · 민(閔)씨·民(민)씨.",
    options: [
      { hanja: "閔", meaning: "근심할 민", gloss: "성씨 閔(민) — 閔氏" },
      { hanja: "民", meaning: "백성 민", gloss: "성씨 民(민) — 民氏 계열" },
    ],
  },
  진: {
    primary: "陳",
    summary: "펼(陳) · 진(陳)씨·秦(진)씨.",
    options: [
      { hanja: "陳", meaning: "펼 진", gloss: "성씨 陳(진) — 陳氏" },
      { hanja: "秦", meaning: "나라 이름 진", gloss: "성씨 秦(진) — 秦氏 계열" },
    ],
  },
  지: {
    primary: "池",
    summary: "못(池) · 지(池)씨·智(지)씨.",
    options: [
      { hanja: "池", meaning: "못 지", gloss: "성씨 池(지) — 池氏" },
      { hanja: "智", meaning: "지혜 지", gloss: "성씨 智(지) — 智氏 계열" },
    ],
  },
  나: {
    primary: "羅",
    summary: "그물(羅) · 나(羅)씨 정통.",
    options: [{ hanja: "羅", meaning: "벌일 나", gloss: "성씨 羅(나) — 羅氏, 그물" }],
  },
  원: {
    primary: "元",
    summary: "으뜸(元) · 원(元)씨·袁(원)씨.",
    options: [
      { hanja: "元", meaning: "으뜸 원", gloss: "성씨 元(원) — 元氏" },
      { hanja: "袁", meaning: "옷깃 원", gloss: "성씨 袁(원) — 袁氏 계열" },
    ],
  },
  천: {
    primary: "千",
    summary: "일천(千) · 천(千)씨·全(천)씨.",
    options: [
      { hanja: "千", meaning: "일천 천", gloss: "성씨 千(천) — 千氏" },
      { hanja: "全", meaning: "온전할 천", gloss: "성씨 全(천) — 全氏 계열" },
    ],
  },
  방: {
    primary: "方",
    summary: "모(方) · 방(方)씨 정통.",
    options: [{ hanja: "方", meaning: "모 방", gloss: "성씨 方(방) — 方氏, 네모·모" }],
  },
  공: {
    primary: "孔",
    summary: "구멍(孔) · 공(孔)씨·公(공)씨.",
    options: [
      { hanja: "孔", meaning: "구멍 공", gloss: "성씨 孔(공) — 孔氏" },
      { hanja: "公", meaning: "공 공", gloss: "성씨 公(공) — 公氏 계열" },
    ],
  },
  현: {
    primary: "玄",
    summary: "검을(玄) · 현(玄)씨 정통.",
    options: [{ hanja: "玄", meaning: "검을 현", gloss: "성씨 玄(현) — 玄氏, 깊음·신비" }],
  },
  함: {
    primary: "咸",
    summary: "함께(咸) · 함(咸)씨 정통.",
    options: [{ hanja: "咸", meaning: "함께 함", gloss: "성씨 咸(함) — 咸氏" }],
  },
  변: {
    primary: "卞",
    summary: "급(卞) · 변(卞)씨·邊(변)씨.",
    options: [
      { hanja: "卞", meaning: "급할 변", gloss: "성씨 卞(변) — 卞氏" },
      { hanja: "邊", meaning: "가 변", gloss: "성씨 邊(변) — 邊氏 계열" },
    ],
  },
  여: {
    primary: "余",
    summary: "나(余) · 여(余)씨·呂(여)씨.",
    options: [
      { hanja: "余", meaning: "나 여", gloss: "성씨 余(여) — 余氏" },
      { hanja: "呂", meaning: "등 여", gloss: "성씨 呂(여) — 呂氏 계열" },
    ],
  },
  추: {
    primary: "秋",
    summary: "가을(秋) · 추(秋)씨 정통.",
    options: [{ hanja: "秋", meaning: "가을 추", gloss: "성씨 秋(추) — 秋氏" }],
  },
  도: {
    primary: "都",
    summary: "도읍(都) · 도(都)씨·陶(도)씨.",
    options: [
      { hanja: "都", meaning: "도읍 도", gloss: "성씨 都(도) — 都氏" },
      { hanja: "陶", meaning: "질그릇 도", gloss: "성씨 陶(도) — 陶氏 계열" },
    ],
  },
  소: {
    primary: "蘇",
    summary: "깨어남(蘇) · 소(蘇)씨 정통.",
    options: [{ hanja: "蘇", meaning: "깨어날 소", gloss: "성씨 蘇(소) — 蘇氏" }],
  },
  석: {
    primary: "石",
    summary: "돌(石) · 석(石)씨·昔(석)씨.",
    options: [
      { hanja: "石", meaning: "돌 석", gloss: "성씨 石(석) — 石氏" },
      { hanja: "昔", meaning: "옛 석", gloss: "성씨 昔(석) — 昔氏 계열" },
    ],
  },
  선: {
    primary: "宣",
    summary: "펼(宣) · 선(宣)씨·善(선)씨.",
    options: [
      { hanja: "宣", meaning: "펼 선", gloss: "성씨 宣(선) — 宣氏" },
      { hanja: "善", meaning: "착할 선", gloss: "성씨 善(선) — 善氏 계열" },
    ],
  },
  설: {
    primary: "薛",
    summary: "설(薛) · 설(薛)씨 정통.",
    options: [{ hanja: "薛", meaning: "설 성", gloss: "성씨 薛(설) — 薛氏" }],
  },
  마: {
    primary: "馬",
    summary: "말(馬) · 마(馬)씨 정통.",
    options: [{ hanja: "馬", meaning: "말 마", gloss: "성씨 馬(마) — 馬氏, 말" }],
  },
  길: {
    primary: "吉",
    summary: "길(吉) · 길(吉)씨 정통.",
    options: [{ hanja: "吉", meaning: "길 길", gloss: "성씨 吉(길) — 吉氏, 길함" }],
  },
  위: {
    primary: "魏",
    summary: "나라 이름(魏) · 위(魏)씨.",
    options: [{ hanja: "魏", meaning: "나라 이름 위", gloss: "성씨 魏(위) — 魏國, 魏氏" }],
  },
  표: {
    primary: "表",
    summary: "겉(表) · 표(表)씨·彪(표)씨.",
    options: [
      { hanja: "表", meaning: "겉 표", gloss: "성씨 表(표) — 表氏" },
      { hanja: "彪", meaning: "표범 표", gloss: "성씨 彪(표) — 彪氏 계열" },
    ],
  },
  연: {
    primary: "延",
    summary: "이어짐(延) · 연(延)씨 정통.",
    options: [{ hanja: "延", meaning: "늘일 연", gloss: "성씨 延(연) — 延氏" }],
  },
  염: {
    primary: "廉",
    summary: "청렴(廉) · 염(廉)씨·鹽(염)씨.",
    options: [
      { hanja: "廉", meaning: "청렴할 염", gloss: "성씨 廉(염) — 廉氏" },
      { hanja: "鹽", meaning: "소금 염", gloss: "성씨 鹽(염) — 鹽氏 계열" },
    ],
  },
  왕: {
    primary: "王",
    summary: "임금(王) · 왕(王)씨 정통.",
    options: [{ hanja: "王", meaning: "임금 왕", gloss: "성씨 王(왕) — 王氏, 임금" }],
  },
  금: {
    primary: "金",
    summary: "금(金) · 성씨 金(금)과 동일.",
    options: [{ hanja: "金", meaning: "쇠 금", gloss: "성씨 金(금) — 金氏" }],
  },
  옥: {
    primary: "玉",
    summary: "구슬(玉) · 옥(玉)씨 정통.",
    options: [{ hanja: "玉", meaning: "구슬 옥", gloss: "성씨 玉(옥) — 玉氏" }],
  },
  육: {
    primary: "陸",
    summary: "육지(陸) · 육(陸)씨 정통.",
    options: [{ hanja: "陸", meaning: "육지 육", gloss: "성씨 陸(육) — 陸氏" }],
  },
  인: {
    primary: "印",
    summary: "도장(印) · 인(印)씨·林(인)씨.",
    options: [
      { hanja: "印", meaning: "도장 인", gloss: "성씨 印(인) — 印氏" },
      { hanja: "林", meaning: "수풀 인", gloss: "성씨 林(인) — 林氏 계열" },
    ],
  },
  맹: {
    primary: "孟",
    summary: "맏(孟) · 맹(孟)씨 정통.",
    options: [{ hanja: "孟", meaning: "맏 맹", gloss: "성씨 孟(맹) — 孟氏, 맏" }],
  },
  제: {
    primary: "諸",
    summary: "모(諸) · 제(諸)씨·齊(제)씨.",
    options: [
      { hanja: "諸", meaning: "모 제", gloss: "성씨 諸(제) — 諸氏" },
      { hanja: "齊", meaning: "가지런할 제", gloss: "성씨 齊(제) — 齊氏 계열" },
    ],
  },
  탁: {
    primary: "卓",
    summary: "높(卓) · 탁(卓)씨 정통.",
    options: [{ hanja: "卓", meaning: "높을 탁", gloss: "성씨 卓(탁) — 卓氏" }],
  },
  국: {
    primary: "國",
    summary: "나라(國) · 국(國)씨 정통.",
    options: [{ hanja: "國", meaning: "나라 국", gloss: "성씨 國(國) — 國氏" }],
  },
  어: {
    primary: "魚",
    summary: "물고기(魚) · 어(魚)씨 정통.",
    options: [{ hanja: "魚", meaning: "고기 어", gloss: "성씨 魚(어) — 魚氏" }],
  },
  은: {
    primary: "殷",
    summary: "성(殷) · 은(殷)씨·銀(은)씨.",
    options: [
      { hanja: "殷", meaning: "성할 은", gloss: "성씨 殷(은) — 殷氏" },
      { hanja: "銀", meaning: "은 은", gloss: "성씨 銀(은) — 銀氏 계열" },
    ],
  },
  편: {
    primary: "片",
    summary: "조각(片) · 편(片)씨·邊(편)씨.",
    options: [
      { hanja: "片", meaning: "조각 편", gloss: "성씨 片(편) — 片氏" },
      { hanja: "邊", meaning: "가 편", gloss: "성씨 邊(편) — 邊氏 계열" },
    ],
  },
  // 복성 구성 음절
  보: {
    primary: "甫",
    summary: "보(甫) · 황보(皇甫) 등 복성의 甫.",
    options: [{ hanja: "甫", meaning: "처음 보", gloss: "성씨 甫(보) — 皇甫(황보) 복성" }],
  },
  갈: {
    primary: "葛",
    summary: "갈(葛) · 제갈(諸葛) 등 복성의 葛.",
    options: [{ hanja: "葛", meaning: "칡 갈", gloss: "성씨 葛(갈) — 諸葛(제갈) 복성" }],
  },
  사: {
    primary: "司",
    summary: "사(司) · 사공(司空) 등 복성의 司.",
    options: [{ hanja: "司", meaning: "주관할 사", gloss: "성씨 司(사) — 司空(사공) 복성" }],
  },
  독: {
    primary: "獨",
    summary: "독(獨) · 독고(獨孤) 등 복성의 獨.",
    options: [{ hanja: "獨", meaning: "홀로 독", gloss: "성씨 獨(독) — 獨孤(독고) 복성" }],
  },
  동: {
    primary: "東",
    summary: "동쪽(東) · 동방(東方) 등 복성의 東.",
    options: [{ hanja: "東", meaning: "동녘 동", gloss: "성씨 東(동) — 東方(동방) 복성" }],
  },
  고: {
    primary: "孤",
    summary: "고(孤) · 독고(獨孤) 등 복성의 孤.",
    options: [{ hanja: "孤", meaning: "홀로 고", gloss: "성씨 孤(고) — 獨孤(독고) 복성" }],
  },
  궁: {
    primary: "宮",
    summary: "궁(宮) · 남궁(南宮) 등 복성의 宮.",
    options: [{ hanja: "宮", meaning: "궁궐 궁", gloss: "성씨 宮(궁) — 南宮(남궁) 등 복성" }],
  },
  // 복성 (4글자 이름 앞 2자)
  남궁: {
    primary: "南宮",
    summary: "남쪽 궁(南宮) · 남궁(南宮)씨 복성.",
    options: [{ hanja: "南宮", meaning: "남쪽 궁", gloss: "복성 南宮(남궁) — 南宮氏" }],
  },
  황보: {
    primary: "皇甫",
    summary: "황(皇) + 부(甫) · 황보(皇甫)씨 복성.",
    options: [{ hanja: "皇甫", meaning: "황甫", gloss: "복성 皇甫(황보) — 皇甫氏" }],
  },
  제갈: {
    primary: "諸葛",
    summary: "제(諸) + 갈(葛) · 제갈(諸葛)씨 복성.",
    options: [{ hanja: "諸葛", meaning: "제갈", gloss: "복성 諸葛(제갈) — 諸葛氏" }],
  },
  사공: {
    primary: "司空",
    summary: "사(司) + 공(空) · 사공(司空)씨 복성.",
    options: [{ hanja: "司空", meaning: "사공", gloss: "복성 司空(사공) — 司空氏" }],
  },
  선우: {
    primary: "鮮于",
    summary: "선(鮮) + 우(于) · 선우(鮮于)씨 복성.",
    options: [{ hanja: "鮮于", meaning: "선우", gloss: "복성 鮮于(선우) — 鮮于氏" }],
  },
  독고: {
    primary: "獨孤",
    summary: "독(獨) + 고(孤) · 독고(獨孤)씨 복성.",
    options: [{ hanja: "獨孤", meaning: "독고", gloss: "복성 獨孤(독고) — 獨孤氏" }],
  },
  동방: {
    primary: "東方",
    summary: "동쪽(東) + 방(方) · 동방(東方)씨 복성.",
    options: [{ hanja: "東方", meaning: "동쪽 방", gloss: "복성 東方(동방) — 東方氏" }],
  },
  서문: {
    primary: "西門",
    summary: "서쪽(西) + 문(門) · 서문(西門)씨 복성.",
    options: [{ hanja: "西門", meaning: "서쪽 문", gloss: "복성 西門(서문) — 西門氏" }],
  },
  망절: {
    primary: "網絶",
    summary: "망(網) + 절(絶) · 망절(網絶)씨 복성.",
    options: [{ hanja: "網絶", meaning: "망절", gloss: "복성 網絶(망절) — 網絶氏" }],
  },
  사마: {
    primary: "司馬",
    summary: "사(司) + 마(馬) · 사마(司馬)씨 복성.",
    options: [{ hanja: "司馬", meaning: "사마", gloss: "복성 司馬(사마) — 司馬氏" }],
  },
};

export function isKnownSurnameSyllable(hangul: string): boolean {
  return hangul in SURNAME_HANJA;
}

export function getSurnameEntry(hangul: string): SurnameEntry | undefined {
  return SURNAME_HANJA[hangul];
}

export function getSurnameSummary(hangul: string): string | undefined {
  return SURNAME_HANJA[hangul]?.summary;
}

export function getSurnameGloss(hangul: string, hanja: string): string | undefined {
  const entry = SURNAME_HANJA[hangul];
  if (!entry) return undefined;
  const opt = entry.options.find((o) => o.hanja === hanja);
  return opt?.gloss ?? entry.summary;
}

/** 성씨 음절용 후보 — 인명용 사전과 병합 */
export function getSurnameHanjaOptions(hangul: string): SurnameHanjaOption[] {
  return SURNAME_HANJA[hangul]?.options ?? [];
}

/** 이름 길이·복성 여부에 따른 글자 역할 */
export function getNameCharRoles(name: string): ("성" | "이름1" | "이름2")[] {
  const len = name.length;
  if (len === 2) return ["성", "이름1"];
  if (len === 3) return ["성", "이름1", "이름2"];
  if (len === 4) {
    if (getCompoundSurname(name)) return ["성", "성", "이름1", "이름2"];
    if (isKnownSurnameSyllable(name[0]!)) return ["성", "이름1", "이름2", "이름2"];
    return ["성", "성", "이름1", "이름2"];
  }
  return [];
}

/** 4글자 이름의 사격 획수 구조 */
export function parseNameStrokes(name: string, strokes: number[]): { A: number; B: number; C: number } {
  const len = name.length;
  if (len === 2) return { A: strokes[0]!, B: strokes[1]!, C: 0 };
  if (len === 3) return { A: strokes[0]!, B: strokes[1]!, C: strokes[2]! };
  if (len === 4) {
    if (getCompoundSurname(name)) {
      return { A: strokes[0]! + strokes[1]!, B: strokes[2]!, C: strokes[3]! };
    }
    if (isKnownSurnameSyllable(name[0]!)) {
      return { A: strokes[0]!, B: strokes[1]!, C: strokes[2]! + strokes[3]! };
    }
    return { A: strokes[0]! + strokes[1]!, B: strokes[2]!, C: strokes[3]! };
  }
  throw new Error("2~4글자 한글 이름만 분석할 수 있습니다.");
}

/** 성씨 음절의 기본 한자 (복성·단성) */
export function getSurnameCharDefaultHanja(name: string, charIndex: number): string | undefined {
  if (charIndex > 1 || name.length < 2) return undefined;
  if (name.length === 4 && getCompoundSurname(name)) {
    const compound = name.slice(0, 2);
    const entry = SURNAME_HANJA[compound];
    if (entry?.primary.length === 2) return entry.primary[charIndex];
  }
  if (charIndex === 0) {
    const entry = SURNAME_HANJA[name[0]!];
    if (entry?.primary.length === 1) return entry.primary;
  }
  return undefined;
}

export function getSurnameGlossForChar(name: string, charIndex: number, hanja: string): string | undefined {
  if (name.length === 4 && getCompoundSurname(name) && charIndex <= 1) {
    const compound = name.slice(0, 2);
    const entry = SURNAME_HANJA[compound];
    if (entry) {
      const opt = entry.options.find((o) => o.hanja === entry.primary || o.hanja.includes(hanja));
      if (charIndex === 0) return opt?.gloss ?? entry.summary;
      const char = name[charIndex]!;
      const charEntry = SURNAME_HANJA[char];
      const charOpt = charEntry?.options.find((o) => o.hanja === hanja);
      return charOpt?.gloss ?? `${compound} 복성의 ${char}(${hanja})`;
    }
  }
  return getSurnameGloss(name[charIndex]!, hanja);
}

/** 4글자 복성 여부 확인 (남궁, 황보 등) */
export function getCompoundSurname(name: string): string | undefined {
  if (name.length !== 4) return undefined;
  const compound = name.slice(0, 2);
  return SURNAME_HANJA[compound] ? compound : undefined;
}
