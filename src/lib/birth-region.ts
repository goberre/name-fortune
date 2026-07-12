import type { Oheng } from "@/lib/seongmyung";
import type { SajuOhengProfile } from "@/lib/saju";

export type BirthRegion = {
  id: string;
  label: string;
  direction: "동" | "서" | "남" | "북" | "중";
  oheng: Oheng;
  terrain: string;
  trait: string;
};

/** 한국 주요 출생 지역 — 방위·지형·지기(地氣) 오행 */
export const BIRTH_REGIONS: BirthRegion[] = [
  { id: "seoul", label: "서울", direction: "중", oheng: "토", terrain: "도시", trait: "수도·중심의 기운" },
  { id: "gyeonggi", label: "경기", direction: "중", oheng: "토", terrain: "평야", trait: "넓은 평야와 교통의 기운" },
  { id: "incheon", label: "인천", direction: "서", oheng: "금", terrain: "바다", trait: "서해안·항구의 기운" },
  { id: "gangwon", label: "강원", direction: "동", oheng: "목", terrain: "산", trait: "태백산맥·청정 동쪽 기운" },
  { id: "chungbuk", label: "충북", direction: "중", oheng: "토", terrain: "산골", trait: "내륙 중심·안정의 기운" },
  { id: "chungnam", label: "충남", direction: "서", oheng: "금", terrain: "평야", trait: "서쪽 평야·넓은 들의 기운" },
  { id: "daejeon", label: "대전·세종", direction: "중", oheng: "토", terrain: "도시", trait: "한반도 중심·균형의 기운" },
  { id: "jeonbuk", label: "전북", direction: "서", oheng: "금", terrain: "평야", trait: "서남 들녘·온화한 기운" },
  { id: "jeonnam", label: "전남", direction: "남", oheng: "화", terrain: "바다", trait: "남해·따뜻한 남쪽 기운" },
  { id: "gwangju", label: "광주", direction: "서", oheng: "금", terrain: "도시", trait: "서남권 문화·예술의 기운" },
  { id: "gyeongbuk", label: "경북", direction: "동", oheng: "목", terrain: "산", trait: "영남 산간·성실한 동쪽 기운" },
  { id: "daegu", label: "대구", direction: "동", oheng: "목", terrain: "분지", trait: "대륙성 기후·뚜렷한 동쪽 기운" },
  { id: "gyeongnam", label: "경남", direction: "남", oheng: "화", terrain: "바다", trait: "남동 해안·활기찬 기운" },
  { id: "busan", label: "부산", direction: "동", oheng: "목", terrain: "바다", trait: "동남 해안·개방과 교류의 기운" },
  { id: "ulsan", label: "울산", direction: "동", oheng: "목", terrain: "바다", trait: "동해·산업과 바다의 기운" },
  { id: "jeju", label: "제주", direction: "남", oheng: "화", terrain: "바다", trait: "남쪽 섬·화산과 바다의 기운" },
  { id: "overseas", label: "해외·기타", direction: "중", oheng: "토", terrain: "기타", trait: "고향 땅의 기운을 넓게 해석" },
];

const DIRECTION_LABEL: Record<BirthRegion["direction"], string> = {
  동: "동쪽",
  서: "서쪽",
  남: "남쪽",
  북: "북쪽",
  중: "중앙",
};

const OHENG_GENERATES: Record<Oheng, Oheng> = {
  목: "화",
  화: "토",
  토: "금",
  금: "수",
  수: "목",
};

export function getBirthRegion(id: string): BirthRegion | undefined {
  return BIRTH_REGIONS.find((r) => r.id === id);
}

export type BirthRegionAnalysis = {
  region: BirthRegion;
  gilHeung: "길" | "흉" | "평";
  matchScore: number;
  fillsLacking: Oheng[];
  matchesUseful: Oheng[];
  summary: string;
  terrainGuide: string;
  directionGuide: string;
};

export function analyzeBirthRegionHarmony(
  regionId: string,
  saju: SajuOhengProfile,
  nameOheng: Oheng[],
): BirthRegionAnalysis | undefined {
  const region = getBirthRegion(regionId);
  if (!region) return undefined;

  const fillsLacking = saju.lacking.filter((o) => o === region.oheng);
  const matchesUseful = saju.usefulOheng.filter((o) => o === region.oheng);
  const nameHasRegionOheng = nameOheng.includes(region.oheng);

  let matchScore = 55;
  matchScore += fillsLacking.length * 18;
  matchScore += matchesUseful.length * 10;
  if (nameHasRegionOheng) matchScore += 12;
  if (saju.lacking.length > 0 && fillsLacking.length === 0 && !nameHasRegionOheng) matchScore -= 10;
  matchScore = Math.max(0, Math.min(100, matchScore));

  let gilHeung: "길" | "흉" | "평" = "평";
  if (fillsLacking.length > 0 || matchesUseful.length > 0 || nameHasRegionOheng) {
    gilHeung = "길";
  } else if (saju.lacking.length > 0) {
    gilHeung = "흉";
  }

  const dir = DIRECTION_LABEL[region.direction];
  const terrainGuide = `${region.label}은(는) ${region.terrain} 지형으로, ${region.trait}이(가) 강합니다. 태어난 땅의 기운은 성격 형성과 인생의 '뿌리'에 영향을 준다고 봅니다.`;

  let directionGuide = `${dir} 방향에서 태어나 ${region.oheng}행 기운을 받았습니다. `;
  if (region.terrain === "바다") {
    directionGuide += "바다와 맞닿은 지역은 유연하고 개방적인 기질을 돕습니다.";
  } else if (region.terrain === "산") {
    directionGuide += "산과 맞닿은 지역은 굳건하고 끈기 있는 기질을 돕습니다.";
  } else if (region.terrain === "평야") {
    directionGuide += "넓은 평야는 포용력과 안정감을 돕습니다.";
  } else {
    directionGuide += "도시·중심지는 활동성과 사회성을 돕습니다.";
  }

  let summary = `${region.label}(${dir}·${region.oheng}행)에서 태어나셨습니다. `;
  if (fillsLacking.length > 0) {
    summary += `고향의 ${region.oheng}행 기운이 사주에 부족한 오행을 보완해, 이름과 함께 균형에 도움이 됩니다.`;
  } else if (nameHasRegionOheng) {
    summary += `이름 한자에도 ${region.oheng}행이 있어, 태생지 기운과 이름이 같은 방향으로 맞물립니다.`;
  } else if (matchesUseful.length > 0) {
    summary += `고향의 ${region.oheng}행이 사주 희신과 맞아, 뿌리와 운명의 방향이 잘 어울립니다.`;
  } else if (saju.lacking.length > 0) {
    summary += `사주에 부족한 ${saju.lacking.map((o) => `${o}행`).join(", ")} 기운을 고향 ${region.oheng}행만으로는 채우기 어렵습니다. 이름 한자 선택이 더 중요합니다.`;
  } else {
    summary += `고향의 ${region.oheng}행과 사주 오행이 무난하게 어우러집니다.`;
  }

  const dayOheng = saju.dayOheng;
  const generatesDay = OHENG_GENERATES[region.oheng] === dayOheng;
  const dayGeneratesRegion = OHENG_GENERATES[dayOheng] === region.oheng;
  if (generatesDay) {
    summary += ` 태생지 ${region.oheng}행이 일간 ${dayOheng}행을 돕는 상생 관계입니다.`;
  } else if (dayGeneratesRegion) {
    summary += ` 일간 ${dayOheng}행이 태생지 ${region.oheng}행을 키워, 고향과의 인연이 깊습니다.`;
  }

  return {
    region,
    gilHeung,
    matchScore,
    fillsLacking,
    matchesUseful,
    summary,
    terrainGuide,
    directionGuide,
  };
}
