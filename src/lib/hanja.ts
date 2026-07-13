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
  高: "높은 높다 크다 고귀 고상",
  峻: "높은 높다 가파른 준수",
  崇: "높은 높다 숭고 숭배",
  峰: "봉우리 높은 산꼭대기",
  岳: "높은 산 큰산",
  卓: "높은 탁월 뛰어난",
  俊: "뛰어난 준수 잘생긴 재주",
  秀: "뛰어난 빼어난 수려",
  傑: "뛰어난 걸출 영웅",
  英: "뛰어난 영웅 꽃",
  賢: "현명한 지혜 슬기",
  智: "지혜 똑똑한 현명한",
  慧: "지혜 슬기 총명한",
  明: "밝은 빛나는 총명",
  輝: "빛나는 빛날 환하다",
  煥: "빛나는 빛날 환하다",
  燦: "빛나는 빛날 찬란",
  熙: "빛나는 밝을 기쁜",
  光: "빛 광채 빛나는",
  晶: "빛나는 맑은 수정",
  澈: "맑은 투명한 깨끗한",
  淸: "맑은 깨끗한 청결",
  純: "순수 순결 깨끗한",
  仁: "어진 사랑 인자한",
  善: "착한 선량 좋은",
  德: "덕스러운 인덕 품덕",
  義: "의로운 정의 옳은",
  誠: "성실 진실 정성스러운",
  忠: "충성 충직 진실한",
  勇: "용감한 씩씩한 용기",
  强: "강한 힘센 굳센",
  健: "건강한 튼튼한 강건",
  福: "복 행복 운",
  吉: "길한 좋은 행운",
  壽: "장수 오래살 수명",
  富: "부유한 풍요 재물",
  榮: "영광 번창 영화",
  昌: "번창 번성 성함",
  盛: "성한 번성 번창",
  興: "흥할 번성 일어날",
  泰: "태평 편안 크다",
  安: "편안한 안녕 평화",
  和: "화목한 조화 평화",
  平: "평화 공평 평탄",
  大: "큰 위대한 많은",
  小: "작은 아담한 귀여운",
  美: "아름다운 예쁜 이쁜",
  麗: "아름다운 예쁜 고운",
  嬌: "예쁜 귀여운 아름다운",
  雅: "우아한 아름다운 고상한",
  珍: "귀한 보물 진귀한",
  寶: "보물 귀한 소중한",
  金: "금 황금 쇠",
  玉: "옥 구슬 귀한",
  龍: "용 강한 신성한",
  鳳: "봉황 아름다운 상서로운",
  鶴: "학 고상한 장수",
  松: "소나무 절개 장수",
  竹: "대나무 절개 강인",
  蘭: "난초 우아한 고상한",
  梅: "매화 고결 향기",
  花: "꽃 아름다운 예쁜",
  春: "봄 따뜻한 새로운",
  夏: "여름 크다 화려한",
  秋: "가을 결실 풍요",
  冬: "겨울 강인 깨끗한",
  日: "해 태양 밝은",
  月: "달 부드러운 아름다운",
  星: "별 빛나는 반짝이는",
  天: "하늘 위대한 신성한",
  地: "땅 대지 굳건한",
  山: "산 높은 굳건한",
  江: "강 물 넓은",
  海: "바다 넓은 깊은",
  雨: "비 은혜 내리는",
  雲: "구름 높은 신비한",
  風: "바람 시원한 자유로운",
  水: "물 맑은 생명",
  火: "불 열정 빛나는",
  木: "나무 생명 성장",
  土: "흙 대지 안정",
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
