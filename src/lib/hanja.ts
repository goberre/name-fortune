import type { Oheng } from "@/lib/seongmyung";
import { sortCandidates, isPopularHanja } from "@/lib/popular-hanja";
import { getSurnameEntry, getSurnameHanjaOptions, getSurnameCharDefaultHanja } from "@/lib/surname-hanja";
import { getWonhyeokStrokes } from "@/lib/wonhyeok";

export type HanjaCandidate = {
  hanja: string;
  meaning: string;
  oheng: Oheng;
  wonStrokes: number;
};

export type HanjaSelection = {
  hangul: string;
  hanja: string;
  meaning: string;
  oheng: Oheng;
  wonStrokes: number;
};

type RawEntry = { hanja: string; meaning: string };

type HanjaIndexMeta = {
  version: number;
  source: string;
  syllableCount: number;
  entryCount: number;
  generatedAt: string;
  index: Record<string, RawEntry[]>;
};

let cache: HanjaIndexMeta | null = null;
let loadPromise: Promise<HanjaIndexMeta> | null = null;
const candidateCache = new Map<string, HanjaCandidate[]>();

/** CJK 호환 한자 → 표준형 (네이버 CSV의 金 등) */
const CJK_COMPAT_TO_STANDARD: Record<string, string> = {
  "\uF90A": "金",
};

/**
 * 두음법칙으로 한글 발음은 달라도 같은 한자를 공유하는 음절 쌍.
 * 예) 이/리(李), 유/류(柳), 김/금(金) — 인덱스 key가 나뉘어 있어 runtime에서 병합.
 */
const READING_SYLLABLE_ALIASES: Record<string, string[]> = {
  김: ["금"],
  이: ["리"],
  유: ["류"],
};

export function normalizeHanjaChar(hanja: string): string {
  return [...hanja].map((ch) => CJK_COMPAT_TO_STANDARD[ch] ?? ch).join("");
}

/**
 * 한자별 한국어 검색 키워드 — 뜻 풀이에 없는 동의어·유의어·일상어를 포함.
 * HanjaPicker 검색 시 meaning 외에 이 키워드도 함께 검색됨.
 */
export const HANJA_SEARCH_KEYWORDS: Record<string, string> = {
  /* ── 높이·위대함 ── */
  高: "높은 높다 크다 고귀 고상",
  峻: "높은 높다 가파른 준수",
  崇: "높은 높다 숭고 숭배",
  峰: "봉우리 높은 산꼭대기",
  岳: "높은 산 큰산",
  卓: "높은 탁월 뛰어난",
  嶠: "높은 산봉우리",
  嶽: "높은 산 큰산",
  巍: "높고 위대한",
  /* ── 뛰어남·재능 ── */
  俊: "뛰어난 준수 잘생긴 재주 영특",
  秀: "뛰어난 빼어난 수려 출중",
  傑: "뛰어난 걸출 영웅 호걸",
  英: "뛰어난 영웅 꽃 빛나는",
  豪: "호방한 뛰어난 호걸",
  彦: "뛰어난 선비 학자",
  穎: "영리한 뛰어난 이삭",
  逸: "뛰어난 빼어난 훌륭한",
  哲: "지혜로운 현명한 밝은",
  /* ── 지혜·총명 ── */
  賢: "현명한 지혜 슬기 영리",
  智: "지혜 똑똑한 현명한 슬기",
  慧: "지혜 슬기 총명한 영리",
  聰: "총명한 귀밝을 영리",
  敏: "영리한 민첩한 빠른",
  睿: "슬기 총명 깊은 지혜",
  悟: "깨달은 총명한 슬기",
  識: "지식 알다 분별 총명",
  /* ── 밝음·빛남 ── */
  明: "밝은 빛나는 총명 환한",
  輝: "빛나는 빛날 환한 광채",
  煥: "빛나는 빛날 환한 찬란",
  燦: "빛나는 빛날 찬란 화려",
  熙: "빛나는 밝을 기쁜 환한",
  光: "빛 광채 빛나는 환한",
  晶: "빛나는 맑은 수정 반짝",
  炫: "빛나는 화려한 눈부신",
  炳: "빛나는 밝은 빛날",
  昱: "빛나는 해빛 밝은",
  曉: "밝을 새벽 이해하다",
  朗: "밝을 명랑한 맑은",
  暉: "햇빛 빛 광채",
  燁: "빛날 불꽃 밝은",
  璨: "옥빛 빛나는 찬란",
  灿: "빛나는 찬란",
  /* ── 맑음·깨끗함 ── */
  淸: "맑은 깨끗한 청결 투명",
  澈: "맑은 투명한 깨끗한",
  澄: "맑은 맑을 투명한",
  潔: "깨끗한 결백 순결",
  純: "순수 순결 깨끗한 진실",
  粹: "순수 순수할 깨끗한",
  鮮: "선명한 새로운 싱싱한",
  /* ── 착함·덕 ── */
  仁: "어진 사랑 인자한 자비",
  善: "착한 선량 좋은 선하다",
  德: "덕스러운 인덕 품덕 도덕",
  惠: "은혜 사랑 베풀다",
  慈: "사랑 자비 어머니",
  恩: "은혜 사랑 고마운",
  慶: "경사 기쁜 축하",
  祥: "상서로운 길한 복",
  瑞: "상서로운 길한 복",
  /* ── 바름·의리 ── */
  義: "의로운 정의 옳은 바른",
  正: "바를 정직 옳은 정확",
  直: "곧을 정직 바른",
  忠: "충성 충직 진실한 성실",
  誠: "성실 진실 정성스러운",
  信: "믿음 신뢰 진실 성실",
  貞: "바를 곧은 정절 절개",
  廉: "청렴 깨끗한 검소",
  謙: "겸손 겸허",
  /* ── 용기·강함 ── */
  勇: "용감한 씩씩한 용기 담대",
  强: "강한 힘센 굳센",
  健: "건강한 튼튼한 강건",
  剛: "강한 굳센 단단한",
  毅: "굳센 강의한 결단",
  壯: "씩씩한 장대한 강건",
  武: "용맹한 무용 강한",
  勁: "강한 굳센 힘있는",
  /* ── 복·행복 ── */
  福: "복 행복 운 행운",
  吉: "길한 좋은 행운 상서",
  祿: "복 녹봉 행복",
  禧: "복 기쁨 축복",
  禎: "상서로운 복 길한",
  祺: "복 길한 행복",
  祐: "도울 하늘의 복",
  佑: "도울 복 행운",
  /* ── 장수·건강 ── */
  壽: "장수 오래살 수명 건강",
  康: "건강한 편안한 튼튼",
  /* ── 부유·풍요 ── */
  富: "부유한 풍요 재물 넉넉한",
  財: "재물 돈 넉넉한",
  裕: "넉넉한 여유 풍요",
  豊: "풍요 넉넉한 풍성",
  豐: "풍요 풍성 넉넉한",
  /* ── 번성·영광 ── */
  榮: "영광 번창 영화 빛나는",
  昌: "번창 번성 성함 활발",
  盛: "성한 번성 번창 풍요",
  興: "흥할 번성 일어날 번창",
  繁: "많은 번성 무성한",
  旺: "왕성 번성 활발한",
  /* ── 편안·평화 ── */
  泰: "태평 편안 크다 안정",
  安: "편안한 안녕 평화 안정",
  和: "화목한 조화 평화 부드러운",
  平: "평화 공평 평탄 편안",
  寧: "편안 안녕 조용한",
  靜: "조용한 고요한 편안",
  閒: "한가한 여유 편안",
  /* ── 아름다움 ── */
  美: "아름다운 예쁜 이쁜 고운",
  麗: "아름다운 예쁜 고운 화려",
  嬌: "예쁜 귀여운 아름다운",
  雅: "우아한 아름다운 고상한",
  娟: "예쁜 우아한 아름다운",
  嫣: "아름다운 예쁜 미소",
  姸: "예쁜 아름다운 고운",
  婕: "아름다운 예쁜",
  妍: "예쁜 아름다운 고운",
  /* ── 귀함·보물 ── */
  珍: "귀한 보물 진귀한 소중한",
  寶: "보물 귀한 소중한 진귀",
  貴: "귀한 값진 고귀한",
  玉: "옥 구슬 귀한 아름다운",
  金: "금 황금 쇠 귀한",
  璃: "수정 유리 맑은 빛나는",
  珠: "구슬 진주 귀한",
  瑾: "옥 귀한 아름다운",
  瑜: "옥 구슬 아름다운",
  琳: "옥 보물 아름다운",
  /* ── 넓음·큰 마음 ── */
  廣: "넓은 넓다 크다",
  博: "넓은 많이알다 박식",
  弘: "넓은 크다 뜻이 넓은",
  宏: "넓은 크다 넓고 큰",
  洪: "넓은 크다 물",
  大: "큰 위대한 많은",
  /* ── 사랑·따뜻함 ── */
  愛: "사랑 사랑하다 좋아하다",
  情: "사랑 감정 정다운",
  溫: "따뜻한 온화한 부드러운",
  暖: "따뜻한 따스한",
  柔: "부드러운 온화한 유순한",
  /* ── 기쁨·즐거움 ── */
  喜: "기쁜 즐거운 행복한",
  歡: "기쁜 즐거운 반가운",
  悅: "기쁜 즐거운 기뻐하다",
  樂: "즐거운 기쁜 음악",
  娛: "즐거운 기쁜",
  /* ── 새로움·창조 ── */
  新: "새로운 새로울 신선한",
  創: "창조 새로운 처음",
  革: "새로운 변화 혁신",
  /* ── 믿음·진실 ── */
  眞: "진실 참 진짜",
  實: "진실 열매 실질",
  /* ── 자연 ── */
  龍: "용 강한 신성한",
  鳳: "봉황 아름다운 상서로운",
  鶴: "학 고상한 장수 우아",
  松: "소나무 절개 장수 늘푸른",
  竹: "대나무 절개 강인 곧은",
  蘭: "난초 우아한 고상한 향기",
  梅: "매화 고결 향기 절개",
  菊: "국화 절개 향기 가을",
  花: "꽃 아름다운 예쁜 향기",
  草: "풀 자연 새싹",
  葉: "잎 새싹 자연",
  林: "숲 나무 자연",
  春: "봄 따뜻한 새로운 시작",
  夏: "여름 크다 화려한",
  秋: "가을 결실 풍요 성숙",
  冬: "겨울 강인 깨끗한",
  日: "해 태양 밝은 따뜻한",
  月: "달 부드러운 아름다운",
  星: "별 빛나는 반짝이는",
  天: "하늘 위대한 신성한",
  地: "땅 대지 굳건한",
  山: "산 높은 굳건한",
  江: "강 물 넓은",
  河: "강 물 흐르는",
  海: "바다 넓은 깊은",
  湖: "호수 맑은 잔잔한",
  泉: "샘 맑은 물",
  雨: "비 은혜 내리는",
  雲: "구름 높은 신비한",
  風: "바람 시원한 자유로운",
  雪: "눈 깨끗한 하얀",
  霜: "서리 깨끗한 결백",
  水: "물 맑은 생명",
  火: "불 열정 빛나는",
  木: "나무 생명 성장",
  土: "흙 대지 안정",
  石: "돌 강한 굳건한",
  /* ── 방위·우주 ── */
  東: "동쪽 동방 새벽",
  南: "남쪽 따뜻한",
  西: "서쪽 방위",
  北: "북쪽 방위",
  /* ── 기타 자주 쓰는 이름 한자 ── */
  圓: "둥근 완전한 원만한",
  源: "근원 원천 깊은",
  元: "으뜸 시작 근원",
  遠: "멀다 원대한 깊은",
  苑: "동산 정원 아름다운",
  媛: "아름다운 여인 고운",
  準: "기준 법도 정확한",
  竣: "마칠 완성 높은",
  俐: "영리한 똑똑한 빠른",
  利: "이로운 날카로운 예리한",
  理: "이치 도리 이해",
  梨: "배나무 열매 아름다운",
  璟: "옥빛 빛나는 아름다운",
  暻: "밝은 빛나는",
  景: "경치 빛 아름다운",
  敬: "공경 존경 삼가는",
  炅: "빛나는 밝은",
  瓊: "아름다운 옥 빛나는",
  尙: "높이다 귀하게 여기다",
  相: "서로 돕다 보좌",
  祉: "복 행복 길한",
  芝: "영지 상서로운 귀한",
  志: "뜻 의지 목표",
  知: "알다 지혜 이해",
  持: "지닐 간직 유지",
  在: "있을 존재 머물다",
  宰: "다스릴 재능 재주",
  才: "재능 재주 능력",
  載: "실을 기록 가득한",
  宗: "으뜸 근본 중심",
  鍾: "사랑모을 종 귀여운",
  鎭: "진압 안정 굳건한",
  晉: "나아갈 발전 오를",
  振: "떨칠 진동 활발한",
  鉉: "현 끈 이을",
  玹: "옥 줄 아름다운",
  泫: "맑은 빛나는 물방울",
  昡: "빛나는 밝은",
  顯: "드러날 빛나는 뛰어난",
  宣: "펼칠 알릴 화창한",
  仙: "신선 선녀 고상한",
  先: "먼저 선도 앞서",
  成: "이룰 성공 완성",
  城: "성 도시 굳건한",
  聖: "성스러운 신성 거룩한",
  承: "이을 계승 받들",
  昇: "오를 상승 발전",
  勝: "이길 승리 뛰어난",
  洙: "강이름 물 맑은",
  修: "닦을 연마 수련",
  守: "지킬 지킴 보호",
  宇: "하늘 우주 넓은",
  禹: "우임금 크다",
  愚: "어리석어보이는 겸손",
  遇: "만날 기회 인연",
  鎬: "밝을 환한 서울",
  浩: "넓을 크다 풍부",
  昊: "하늘 크다 넓은",
  虎: "호랑이 용맹 강한",
  皓: "흰 밝을 순수",
  桓: "굳셀 씩씩한 강건",
  羲: "복희씨 빛 상서로운",
  希: "바랄 희망 드문",
  熹: "빛날 기쁠 밝은",
  姬: "아름다운 여인 고귀",
  /* ── 검색 동의어 ── */
  赫: "빛날 붉을 빛나는",
  奕: "성할 크다 아름다운",
  弈: "장기 지혜 계략",
  赢: "이길 승리",
  勵: "힘쓸 노력 부지런",
  力: "힘 능력 강한",
  麟: "기린 상서로운 뛰어난",
  鱗: "비늘 상서로운",
  麒: "기린 상서로운",
  龜: "거북 장수 신성한",
  燮: "불꽃 조화 빛나는",
  曄: "빛날 환한",
  涉: "건널 경험 넓은",
  雄: "영웅 씩씩한 웅장한",
  熊: "곰 강한",
  苗: "싹 새로운 자랄",
  妙: "묘한 아름다운 신기한",
  廟: "사당 신성한",
  /* ── 널리 쓰이는 표현 ── */
  재능: "才 俊 秀 英 傑 彦",
  지혜: "智 慧 賢 哲",
  아름다움: "美 麗 嬌 雅 妍",
};

/** 자원오행 추론 — 부수·키워드 기반 (성명학 참고용) */
const HANJA_OHENG: Record<string, Oheng> = {
  金: "금", 銀: "금", 鐵: "금", 銅: "금", 鋼: "금", 錢: "금", 玉: "금", 珠: "금", 珍: "금",
  木: "목", 林: "목", 森: "목", 竹: "목", 松: "목", 梅: "목", 蘭: "목", 花: "목", 草: "목",
  火: "화", 炎: "화", 日: "화", 光: "화", 明: "화", 照: "화", 煕: "화", 燦: "화",
  土: "토", 山: "토", 石: "토", 岩: "토", 峰: "토", 岳: "토", 地: "토", 城: "토", 基: "토",
  水: "수", 海: "수", 河: "수", 江: "수", 泉: "수", 雨: "수", 冰: "수", 波: "수", 潤: "수",
};

const MEANING_OHENG: [RegExp, Oheng][] = [
  [/불|화|날|빛|열|태|양|照|明/, "화"],
  [/물|강|바다|비|해|수|泉|潤|泳/, "수"],
  [/나무|풀|꽃|林|森|竹|木|草|蘭/, "목"],
  [/돌|山|土|石|岩|峰|地|城|基|堅/, "토"],
  [/쇠|금|銀|玉|珠|珍|寶|貝/, "금"],
];

export function inferOheng(hanja: string, meaning: string): Oheng {
  if (HANJA_OHENG[hanja]) return HANJA_OHENG[hanja];
  if (/[氵水海江河泉雨波潤泳浩清]/u.test(hanja)) return "수";
  if (/[木林森竹艸艹花蘭梅松楊柳]/u.test(hanja)) return "목";
  if (/[火日光明照炎燦煥]/u.test(hanja)) return "화";
  if (/[土山石岩峰岳地城基堅]/u.test(hanja)) return "토";
  if (/[金銀玉珠珍寶貝]/u.test(hanja)) return "금";
  for (const [re, o] of MEANING_OHENG) {
    if (re.test(meaning)) return o;
  }
  const strokes = getWonhyeokStrokes(hanja);
  const mod = strokes % 5;
  return (["수", "목", "화", "토", "금"] as Oheng[])[mod];
}

function enrich(entry: RawEntry): HanjaCandidate {
  const hanja = normalizeHanjaChar(entry.hanja);
  return {
    hanja,
    meaning: entry.meaning,
    oheng: inferOheng(hanja, entry.meaning),
    wonStrokes: getWonhyeokStrokes(hanja),
  };
}

function collectRawEntries(data: HanjaIndexMeta, hangul: string): RawEntry[] {
  const keys = [hangul, ...(READING_SYLLABLE_ALIASES[hangul] ?? [])];
  const byHanja = new Map<string, RawEntry>();

  for (const key of keys) {
    for (const entry of data.index[key] ?? []) {
      const hanja = normalizeHanjaChar(entry.hanja);
      const normalized = { hanja, meaning: entry.meaning };
      const existing = byHanja.get(hanja);
      if (!existing || key === hangul) {
        byHanja.set(hanja, normalized);
      }
    }
  }

  return [...byHanja.values()];
}

export async function loadHanjaIndex(): Promise<HanjaIndexMeta> {
  if (cache) return cache;
  if (loadPromise) return loadPromise;
  loadPromise = fetch("/data/hanja-index.json")
    .then((r) => {
      if (!r.ok) throw new Error("한자 데이터를 불러오지 못했습니다.");
      return r.json() as Promise<HanjaIndexMeta>;
    })
    .then((data) => {
      cache = data;
      return data;
    });
  return loadPromise;
}

function mergeSurnameCandidates(hangul: string, base: HanjaCandidate[]): HanjaCandidate[] {
  const surnameOpts = getSurnameHanjaOptions(hangul);
  if (surnameOpts.length === 0) return base;

  const byHanja = new Map<string, HanjaCandidate>();
  for (const opt of surnameOpts) {
    if (opt.hanja.length !== 1) continue;
    byHanja.set(opt.hanja, {
      hanja: opt.hanja,
      meaning: opt.meaning,
      oheng: inferOheng(opt.hanja, opt.meaning),
      wonStrokes: getWonhyeokStrokes(opt.hanja),
    });
  }
  for (const c of base) {
    if (!byHanja.has(c.hanja)) byHanja.set(c.hanja, c);
  }
  return sortCandidates(hangul, [...byHanja.values()]);
}

function surnameCacheKey(hangul: string, asSurname: boolean) {
  return `${hangul}:${asSurname ? "s" : "g"}`;
}

export async function getHanjaCandidates(
  hangul: string,
  options?: { asSurname?: boolean },
): Promise<HanjaCandidate[]> {
  const asSurname = options?.asSurname ?? false;
  const cacheKey = surnameCacheKey(hangul, asSurname);
  const cached = candidateCache.get(cacheKey);
  if (cached) return cached;

  const data = await loadHanjaIndex();
  const raw = collectRawEntries(data, hangul);
  let result = sortCandidates(hangul, raw.map(enrich));
  if (asSurname) {
    result = mergeSurnameCandidates(hangul, result);
    const entry = getSurnameEntry(hangul);
    if (entry?.primary.length === 1) {
      const primaryIdx = result.findIndex((c) => c.hanja === entry.primary);
      if (primaryIdx > 0) {
        const [primary] = result.splice(primaryIdx, 1);
        result.unshift(primary);
      }
    }
  }
  candidateCache.set(cacheKey, result);
  return result;
}

export async function getDefaultHanjaSelection(
  hangul: string,
  asSurname: boolean,
  context?: { fullName?: string; charIndex?: number },
): Promise<HanjaCandidate | null> {
  const list = await getHanjaCandidates(hangul, { asSurname });
  if (list.length === 0) return null;

  if (asSurname && context?.fullName !== undefined && context.charIndex !== undefined) {
    const preferred = getSurnameCharDefaultHanja(context.fullName, context.charIndex);
    if (preferred) {
      return list.find((c) => c.hanja === preferred) ?? list[0] ?? null;
    }
  }

  if (asSurname) {
    const entry = getSurnameEntry(hangul);
    if (entry?.primary.length === 1) {
      return list.find((c) => c.hanja === entry.primary) ?? list[0] ?? null;
    }
  }

  return list[0] ?? null;
}

export { isPopularHanja };

export async function hasHanjaData(hangul: string): Promise<boolean> {
  const data = await loadHanjaIndex();
  return collectRawEntries(data, hangul).length > 0;
}

export function buildSelection(hangul: string, candidate: HanjaCandidate): HanjaSelection {
  return { hangul, ...candidate };
}

export function getIndexStats() {
  return cache
    ? { syllableCount: cache.syllableCount, entryCount: cache.entryCount, source: cache.source }
    : null;
}
