import type { Oheng } from "@/lib/seongmyung";
import { getWonhyeokStrokes } from "@/lib/wonhyeok";

export type HanjaCandidate = {
  hanja: string;
  meaning: string;
  oheng: Oheng;
  wonStrokes: number;
};

type RawEntry = { hanja: string; meaning: string; oheng: Oheng };

/** 한글 음절 → 인명용 한자 후보 */
const HANJA_CATALOG: Record<string, RawEntry[]> = {
  김: [
    { hanja: "金", meaning: "쇠 금", oheng: "금" },
    { hanja: "琴", meaning: "거문고 금", oheng: "금" },
  ],
  이: [
    { hanja: "李", meaning: "오얏 리", oheng: "목" },
    { hanja: "理", meaning: "다스릴 리", oheng: "화" },
    { hanja: "利", meaning: "이로울 리", oheng: "화" },
  ],
  박: [
    { hanja: "朴", meaning: "순박할 박", oheng: "목" },
    { hanja: "博", meaning: "넓을 박", oheng: "수" },
  ],
  최: [{ hanja: "崔", meaning: "높을 최", oheng: "목" }],
  정: [
    { hanja: "正", meaning: "바를 정", oheng: "금" },
    { hanja: "政", meaning: "정치 정", oheng: "화" },
    { hanja: "定", meaning: "정할 정", oheng: "화" },
    { hanja: "靜", meaning: "고요할 정", oheng: "금" },
  ],
  강: [
    { hanja: "姜", meaning: "성 강", oheng: "목" },
    { hanja: "江", meaning: "강 강", oheng: "수" },
    { hanja: "强", meaning: "강할 강", oheng: "목" },
  ],
  조: [
    { hanja: "趙", meaning: "성 조", oheng: "화" },
    { hanja: "曺", meaning: "성 조", oheng: "화" },
  ],
  윤: [
    { hanja: "尹", meaning: "다스릴 윤", oheng: "토" },
    { hanja: "潤", meaning: "윤택할 윤", oheng: "수" },
    { hanja: "允", meaning: "허락할 윤", oheng: "토" },
  ],
  장: [
    { hanja: "張", meaning: "베풀 장", oheng: "화" },
    { hanja: "長", meaning: "길 장", oheng: "화" },
    { hanja: "章", meaning: "글 장", oheng: "화" },
  ],
  임: [
    { hanja: "林", meaning: "수풀 림", oheng: "목" },
    { hanja: "琳", meaning: "구슬 림", oheng: "목" },
  ],
  한: [
    { hanja: "韓", meaning: "성 한", oheng: "수" },
    { hanja: "漢", meaning: "한수 한", oheng: "수" },
    { hanja: "寒", meaning: "찰 한", oheng: "수" },
  ],
  오: [
    { hanja: "吳", meaning: "성 오", oheng: "목" },
    { hanja: "五", meaning: "다섯 오", oheng: "목" },
    { hanja: "午", meaning: "낮 오", oheng: "화" },
  ],
  서: [
    { hanja: "舒", meaning: "펼 서", oheng: "금" },
    { hanja: "瑞", meaning: "상서로울 서", oheng: "금" },
    { hanja: "書", meaning: "글 서", oheng: "금" },
    { hanja: "西", meaning: "서쪽 서", oheng: "금" },
    { hanja: "序", meaning: "차례 서", oheng: "금" },
  ],
  신: [
    { hanja: "申", meaning: "성 신", oheng: "금" },
    { hanja: "信", meaning: "믿을 신", oheng: "금" },
    { hanja: "新", meaning: "새 신", oheng: "금" },
    { hanja: "神", meaning: "신 신", oheng: "금" },
  ],
  권: [{ hanja: "權", meaning: "권세 권", oheng: "목" }],
  황: [{ hanja: "黃", meaning: "누를 황", oheng: "토" }],
  안: [
    { hanja: "安", meaning: "편안할 안", oheng: "토" },
    { hanja: "顔", meaning: "얼굴 안", oheng: "목" },
  ],
  송: [{ hanja: "宋", meaning: "성 송", oheng: "금" }],
  유: [
    { hanja: "柳", meaning: "버들 유", oheng: "목" },
    { hanja: "劉", meaning: "성 유", oheng: "화" },
    { hanja: "有", meaning: "있을 유", oheng: "토" },
    { hanja: "裕", meaning: "넉넉할 유", oheng: "금" },
  ],
  홍: [
    { hanja: "洪", meaning: "넓을 홍", oheng: "수" },
    { hanja: "弘", meaning: "클 홍", oheng: "수" },
    { hanja: "紅", meaning: "붉을 홍", oheng: "수" },
  ],
  민: [
    { hanja: "民", meaning: "백성 민", oheng: "수" },
    { hanja: "敏", meaning: "민첩할 민", oheng: "수" },
    { hanja: "玟", meaning: "아름다운 옥 민", oheng: "수" },
  ],
  준: [
    { hanja: "俊", meaning: "준걸 준", oheng: "화" },
    { hanja: "準", meaning: "준할 준", oheng: "수" },
    { hanja: "峻", meaning: "높을 준", oheng: "금" },
  ],
  현: [
    { hanja: "賢", meaning: "어질 현", oheng: "목" },
    { hanja: "炫", meaning: "빛날 현", oheng: "화" },
    { hanja: "玄", meaning: "검을 현", oheng: "수" },
    { hanja: "現", meaning: "나타날 현", oheng: "금" },
  ],
  지: [
    { hanja: "智", meaning: "지혜 지", oheng: "화" },
    { hanja: "志", meaning: "뜻 지", oheng: "화" },
    { hanja: "知", meaning: "알 지", oheng: "화" },
    { hanja: "芝", meaning: "영지 지", oheng: "목" },
  ],
  수: [
    { hanja: "秀", meaning: "뛰어날 수", oheng: "금" },
    { hanja: "守", meaning: "지킬 수", oheng: "금" },
    { hanja: "壽", meaning: "장수 수", oheng: "금" },
    { hanja: "修", meaning: "닦을 수", oheng: "금" },
  ],
  영: [
    { hanja: "英", meaning: "꽃부리 영", oheng: "토" },
    { hanja: "永", meaning: "길 영", oheng: "토" },
    { hanja: "榮", meaning: "영화 영", oheng: "목" },
    { hanja: "映", meaning: "비칠 영", oheng: "토" },
  ],
  호: [
    { hanja: "浩", meaning: "넓을 호", oheng: "수" },
    { hanja: "昊", meaning: "하늘 호", oheng: "화" },
    { hanja: "虎", meaning: "범 호", oheng: "수" },
    { hanja: "鎬", meaning: "쇠 호", oheng: "금" },
  ],
  성: [
    { hanja: "成", meaning: "이룰 성", oheng: "금" },
    { hanja: "聖", meaning: "성인 성", oheng: "금" },
    { hanja: "盛", meaning: "성할 성", oheng: "금" },
    { hanja: "星", meaning: "별 성", oheng: "금" },
  ],
  재: [
    { hanja: "才", meaning: "재주 재", oheng: "금" },
    { hanja: "在", meaning: "있을 재", oheng: "금" },
    { hanja: "宰", meaning: "재상 재", oheng: "금" },
  ],
  원: [
    { hanja: "元", meaning: "으뜸 원", oheng: "목" },
    { hanja: "源", meaning: "근원 원", oheng: "수" },
    { hanja: "園", meaning: "동산 원", oheng: "토" },
    { hanja: "遠", meaning: "멀 원", oheng: "토" },
  ],
  연: [
    { hanja: "延", meaning: "연장할 연", oheng: "토" },
    { hanja: "蓮", meaning: "연꽃 연", oheng: "목" },
    { hanja: "妍", meaning: "아름다울 연", oheng: "수" },
    { hanja: "然", meaning: "그럴 연", oheng: "금" },
  ],
  빈: [
    { hanja: "彬", meaning: "문채 빛날 빈", oheng: "목" },
    { hanja: "斌", meaning: "문무 겸비 빈", oheng: "수" },
  ],
  혜: [
    { hanja: "慧", meaning: "슬기로울 혜", oheng: "수" },
    { hanja: "惠", meaning: "은혜 혜", oheng: "수" },
    { hanja: "海", meaning: "바다 해", oheng: "수" },
  ],
  경: [
    { hanja: "京", meaning: "서울 경", oheng: "목" },
    { hanja: "景", meaning: "경치 경", oheng: "목" },
    { hanja: "敬", meaning: "공경 경", oheng: "목" },
    { hanja: "慶", meaning: "경사 경", oheng: "목" },
  ],
  태: [
    { hanja: "泰", meaning: "편안할 태", oheng: "화" },
    { hanja: "太", meaning: "클 태", oheng: "화" },
    { hanja: "台", meaning: "대 태", oheng: "화" },
  ],
  승: [
    { hanja: "勝", meaning: "이길 승", oheng: "금" },
    { hanja: "承", meaning: "이을 승", oheng: "금" },
    { hanja: "昇", meaning: "오를 승", oheng: "토" },
  ],
  우: [
    { hanja: "宇", meaning: "집 우", oheng: "토" },
    { hanja: "雨", meaning: "비 우", oheng: "수" },
    { hanja: "優", meaning: "뛰어날 우", oheng: "토" },
    { hanja: "祐", meaning: "도울 우", oheng: "토" },
  ],
  진: [
    { hanja: "眞", meaning: "참 진", oheng: "금" },
    { hanja: "振", meaning: "일으킬 진", oheng: "화" },
    { hanja: "晉", meaning: "나아갈 진", oheng: "화" },
    { hanja: "珍", meaning: "보배 진", oheng: "화" },
  ],
  은: [
    { hanja: "恩", meaning: "은혜 은", oheng: "토" },
    { hanja: "銀", meaning: "은 은", oheng: "금" },
    { hanja: "隱", meaning: "숨을 은", oheng: "토" },
  ],
  혁: [{ hanja: "赫", meaning: "빛날 혁", oheng: "목" }],
  동: [
    { hanja: "東", meaning: "동녘 동", oheng: "목" },
    { hanja: "棟", meaning: "대들보 동", oheng: "목" },
    { hanja: "同", meaning: "한가지 동", oheng: "화" },
  ],
  상: [
    { hanja: "相", meaning: "서로 상", oheng: "금" },
    { hanja: "常", meaning: "항상 상", oheng: "금" },
    { hanja: "翔", meaning: "날 상", oheng: "금" },
  ],
  철: [{ hanja: "哲", meaning: "밝을 철", oheng: "화" }],
  미: [
    { hanja: "美", meaning: "아름다울 미", oheng: "수" },
    { hanja: "微", meaning: "작을 미", oheng: "수" },
  ],
  나: [
    { hanja: "娜", meaning: "고운 모습 나", oheng: "화" },
    { hanja: "羅", meaning: "벌릴 나", oheng: "화" },
  ],
  하: [
    { hanja: "河", meaning: "강 하", oheng: "수" },
    { hanja: "夏", meaning: "여름 하", oheng: "화" },
    { hanja: "荷", meaning: "연꽃 하", oheng: "목" },
  ],
  건: [
    { hanja: "建", meaning: "세울 건", oheng: "목" },
    { hanja: "健", meaning: "건강 건", oheng: "목" },
    { hanja: "乾", meaning: "하늘 건", oheng: "목" },
  ],
  길: [
    { hanja: "吉", meaning: "길 길", oheng: "토" },
    { hanja: "桔", meaning: "귤 길", oheng: "목" },
  ],
  도: [
    { hanja: "道", meaning: "길 도", oheng: "화" },
    { hanja: "度", meaning: "법 도", oheng: "금" },
    { hanja: "都", meaning: "도읍 도", oheng: "화" },
  ],
  선: [
    { hanja: "善", meaning: "착할 선", oheng: "금" },
    { hanja: "宣", meaning: "펼 선", oheng: "금" },
    { hanja: "仙", meaning: "신선 선", oheng: "금" },
    { hanja: "先", meaning: "먼저 선", oheng: "금" },
  ],
  훈: [
    { hanja: "勳", meaning: "공 훈", oheng: "토" },
    { hanja: "訓", meaning: "가르칠 훈", oheng: "수" },
  ],
  심: [
    { hanja: "心", meaning: "마음 심", oheng: "금" },
    { hanja: "深", meaning: "깊을 심", oheng: "금" },
    { hanja: "沈", meaning: "잠길 심", oheng: "수" },
  ],
  희: [
    { hanja: "熙", meaning: "빛날 희", oheng: "수" },
    { hanja: "喜", meaning: "기쁠 희", oheng: "수" },
    { hanja: "姬", meaning: "아름다울 희", oheng: "목" },
  ],
  아: [
    { hanja: "雅", meaning: "우아할 아", oheng: "토" },
    { hanja: "娥", meaning: "아름다울 아", oheng: "토" },
  ],
  담: [
    { hanja: "淡", meaning: "담담할 담", oheng: "화" },
    { hanja: "譚", meaning: "이름 담", oheng: "화" },
  ],
  온: [
    { hanja: "溫", meaning: "따뜻할 온", oheng: "토" },
    { hanja: "穩", meaning: "편안할 온", oheng: "토" },
  ],
  채: [
    { hanja: "采", meaning: "빛날 채", oheng: "화" },
    { hanja: "彩", meaning: "채색 채", oheng: "금" },
  ],
  란: [{ hanja: "蘭", meaning: "난초 란", oheng: "목" }],
  석: [
    { hanja: "石", meaning: "돌 석", oheng: "금" },
    { hanja: "碩", meaning: "클 석", oheng: "금" },
  ],
  양: [
    { hanja: "陽", meaning: "볕 양", oheng: "토" },
    { hanja: "良", meaning: "어질 량", oheng: "화" },
    { hanja: "洋", meaning: "큰바다 양", oheng: "수" },
  ],
  군: [
    { hanja: "君", meaning: "임금 군", oheng: "목" },
    { hanja: "均", meaning: "고를 균", oheng: "토" },
  ],
  돌: [{ hanja: "突", meaning: "갑자기 돌", oheng: "화" }],
};

export function getHanjaCandidates(hangul: string): HanjaCandidate[] {
  const raw = HANJA_CATALOG[hangul];
  if (!raw) return [];
  return raw.map((item) => ({
    ...item,
    wonStrokes: getWonhyeokStrokes(item.hanja),
  }));
}

export function hasHanjaData(hangul: string): boolean {
  return hangul in HANJA_CATALOG;
}

export type HanjaSelection = {
  hangul: string;
  hanja: string;
  meaning: string;
  oheng: Oheng;
  wonStrokes: number;
};

export function buildSelection(hangul: string, hanja: string): HanjaSelection | null {
  const hit = getHanjaCandidates(hangul).find((c) => c.hanja === hanja);
  if (!hit) return null;
  return { hangul, ...hit };
}
