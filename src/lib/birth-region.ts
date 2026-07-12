import type { Oheng } from "@/lib/seongmyung";
import type { SajuOhengProfile } from "@/lib/saju";
import {
  deriveMicroDirection,
  formatCoordinates,
  formatCoordinatesKorean,
  getDistrict,
  getFullDistrictLabel,
  type BirthDistrict,
} from "@/lib/birth-districts";

const DIRECTION_LABEL = { 동: "동쪽", 서: "서쪽", 남: "남쪽", 북: "북쪽", 중: "중앙" } as const;

const WHY_REGION = [
  "태어날 때 그 땅의 방위·지형 기운(지기)이 평생 성향과 운의 방향을 잡습니다.",
  "생년월일(사주)만으로는 부족한 오행을 태생지 기운이 보완하거나 약화시킬 수 있습니다.",
  "이름 한자와 태생 좌표의 기운이 맞으면 뿌리·이름·운명이 한 줄로 연결됩니다.",
] as const;

const OHENG_GENERATES: Record<Oheng, Oheng> = {
  목: "화",
  화: "토",
  토: "금",
  금: "수",
  수: "목",
};

export type BirthPlaceAnalysis = {
  district: BirthDistrict;
  fullLabel: string;
  lat: number;
  lng: number;
  coordinateDisplay: string;
  coordinateDisplayKo: string;
  microDirection: string;
  gilHeung: "길" | "흉" | "평";
  matchScore: number;
  fillsLacking: Oheng[];
  matchesUseful: Oheng[];
  summary: string;
  terrainGuide: string;
  directionGuide: string;
  coordinateGuide: string;
  whyImportant: string[];
  futureGuide: string;
};

export function getBirthPlace(districtId: string): BirthDistrict | undefined {
  return getDistrict(districtId);
}

export type BirthRegion = {
  id: string;
  label: string;
  direction: BirthDistrict["direction"];
  oheng: Oheng;
  terrain: string;
  trait: string;
};

export function getBirthRegion(id: string): BirthRegion | undefined {
  const d = getDistrict(id);
  if (!d) return undefined;
  return {
    id: d.id,
    label: getFullDistrictLabel(d.id),
    direction: d.direction,
    oheng: d.oheng,
    terrain: d.terrain,
    trait: `${d.terrain} 지형의 지기`,
  };
}

export function analyzeBirthPlaceHarmony(
  districtId: string,
  saju: SajuOhengProfile,
  nameOheng: Oheng[],
): BirthPlaceAnalysis | undefined {
  const district = getDistrict(districtId);
  if (!district) return undefined;

  const fullLabel = getFullDistrictLabel(districtId);
  const coordinateDisplay = formatCoordinates(district.lat, district.lng);
  const coordinateDisplayKo = formatCoordinatesKorean(district.lat, district.lng);
  const microDirection = deriveMicroDirection(district.lat, district.lng);

  const fillsLacking = saju.lacking.filter((o) => o === district.oheng);
  const matchesUseful = saju.usefulOheng.filter((o) => o === district.oheng);
  const nameHasOheng = nameOheng.includes(district.oheng);

  let matchScore = 55;
  matchScore += fillsLacking.length * 18;
  matchScore += matchesUseful.length * 10;
  if (nameHasOheng) matchScore += 12;
  if (saju.lacking.length > 0 && fillsLacking.length === 0 && !nameHasOheng) matchScore -= 10;
  matchScore = Math.max(0, Math.min(100, matchScore));

  let gilHeung: "길" | "흉" | "평" = "평";
  if (fillsLacking.length > 0 || matchesUseful.length > 0 || nameHasOheng) gilHeung = "길";
  else if (saju.lacking.length > 0) gilHeung = "흉";

  const dir = DIRECTION_LABEL[district.direction];
  const terrainGuide = `${fullLabel}은(는) ${district.terrain} 지형으로, ${dir} 방위 ${district.oheng}행 지기가 흐릅니다.`;

  let directionGuide = `${dir} 방위에서 ${district.oheng}행 기운을 받았습니다. `;
  if (district.terrain === "바다") directionGuide += "바다와 맞닿은 좌표는 유연하고 개방적인 기질을 돕습니다.";
  else if (district.terrain === "산") directionGuide += "산세가 깊은 좌표는 굳건한 끈기를 돕습니다.";
  else if (district.terrain === "평야") directionGuide += "들판의 좌표는 포용력과 안정감을 돕습니다.";
  else directionGuide += "도시·중심 좌표는 활동성과 사회성을 돕습니다.";

  const coordinateGuide = `좌표 ${coordinateDisplayKo}(${coordinateDisplay})는 한반도 ${microDirection}에 해당합니다. 위도·경도로 본 정밀 지기(地氣)를 사주·이름 풀이에 반영했습니다.`;

  let summary = `${fullLabel}(${coordinateDisplayKo})에서 태어나셨습니다. `;
  if (fillsLacking.length > 0) {
    summary += `이 좌표의 ${district.oheng}행 지기가 사주에 부족한 오행을 보완해, 이름과 함께 균형에 도움이 됩니다.`;
  } else if (nameHasOheng) {
    summary += `이름 한자에도 ${district.oheng}행이 있어, 태생 좌표와 이름이 같은 방향으로 맞물립니다.`;
  } else if (matchesUseful.length > 0) {
    summary += `태생지 ${district.oheng}행이 희신과 맞아, 뿌리와 명줄의 방향이 잘 어울립니다.`;
  } else if (saju.lacking.length > 0) {
    summary += `사주에 부족한 ${saju.lacking.map((o) => `${o}행`).join(", ")} 기운을 이 좌표만으로는 채우기 어렵습니다. 이름 한자 선택이 더 중요합니다.`;
  } else {
    summary += `태생 좌표의 ${district.oheng}행과 사주 오행이 무난하게 어우러집니다.`;
  }

  const dayOheng = saju.dayOheng;
  if (OHENG_GENERATES[district.oheng] === dayOheng) {
    summary += ` 태생지 ${district.oheng}행이 일간 ${dayOheng}행을 돕는 상생 관계입니다.`;
  } else if (OHENG_GENERATES[dayOheng] === district.oheng) {
    summary += ` 일간 ${dayOheng}행이 태생지 ${district.oheng}행을 키워, 고향과의 인연이 깊습니다.`;
  }

  let futureGuide = `앞으로 ${microDirection} 방향·${dir}쪽 활동이 태생 좌표와 맞물릴 때 명줄이 순합니다. `;
  if (fillsLacking.length > 0 || nameHasOheng) {
    futureGuide += `좌표 ${coordinateDisplay}의 ${district.oheng}행과 이름이 함께 액운을 누릅니다.`;
  } else {
    futureGuide += `이름 한자의 기운과 함께 이 방향을 참고해 보세요.`;
  }

  return {
    district,
    fullLabel,
    lat: district.lat,
    lng: district.lng,
    coordinateDisplay,
    coordinateDisplayKo,
    microDirection,
    gilHeung,
    matchScore,
    fillsLacking,
    matchesUseful,
    summary,
    terrainGuide,
    directionGuide,
    coordinateGuide,
    whyImportant: [...WHY_REGION],
    futureGuide,
  };
}

/** @deprecated */
export type BirthRegionAnalysis = BirthPlaceAnalysis;
export const analyzeBirthRegionHarmony = analyzeBirthPlaceHarmony;
