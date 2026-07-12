import type { Oheng } from "@/lib/seongmyung";
import { sortCandidates, isPopularHanja } from "@/lib/popular-hanja";
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
  return {
    ...entry,
    oheng: inferOheng(entry.hanja, entry.meaning),
    wonStrokes: getWonhyeokStrokes(entry.hanja),
  };
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

export async function getHanjaCandidates(hangul: string): Promise<HanjaCandidate[]> {
  const data = await loadHanjaIndex();
  const raw = data.index[hangul] ?? [];
  return sortCandidates(hangul, raw.map(enrich));
}

export { isPopularHanja };

export async function hasHanjaData(hangul: string): Promise<boolean> {
  const data = await loadHanjaIndex();
  return (data.index[hangul]?.length ?? 0) > 0;
}

export function buildSelection(hangul: string, candidate: HanjaCandidate): HanjaSelection {
  return { hangul, ...candidate };
}

export function getIndexStats() {
  return cache
    ? { syllableCount: cache.syllableCount, entryCount: cache.entryCount, source: cache.source }
    : null;
}
