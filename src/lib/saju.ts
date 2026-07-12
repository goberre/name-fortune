import type { BirthProfile } from "@/types/birth";
import type { Oheng } from "@/lib/seongmyung";
import { getDistrict, getFullDistrictLabel } from "@/lib/birth-districts";

const STEM_OHENG: Oheng[] = ["목", "목", "화", "화", "토", "토", "금", "금", "수", "수"];
const BRANCH_OHENG: Oheng[] = ["수", "토", "목", "목", "토", "화", "화", "토", "금", "금", "토", "수"];

const OHENG_GENERATES: Record<Oheng, Oheng> = {
  목: "화",
  화: "토",
  토: "금",
  금: "수",
  수: "목",
};

const OHENG_OVERCOMES: Record<Oheng, Oheng> = {
  목: "토",
  토: "수",
  수: "화",
  화: "금",
  금: "목",
};

export type BirthDate = Pick<BirthProfile, "year" | "month" | "day">;

export type SajuOhengProfile = {
  yearOheng: Oheng;
  monthOheng: Oheng;
  dayOheng: Oheng;
  regionOheng?: Oheng;
  regionLabel?: string;
  regionLat?: number;
  regionLng?: number;
  distribution: Record<Oheng, number>;
  lacking: Oheng[];
  usefulOheng: Oheng[];
  summary: string;
  calendarNote?: string;
};

function daySexagenaryIndex(year: number, month: number, day: number): number {
  const base = Date.UTC(1900, 0, 1);
  const target = Date.UTC(year, month - 1, day);
  const days = Math.floor((target - base) / 86400000);
  return ((days + 10) % 60 + 60) % 60;
}

function monthBranchIndex(month: number): number {
  const map = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return map[Math.max(0, Math.min(11, month - 1))];
}

/** 부족한 오행의 상생 원천 = 희신(喜神) 후보 */
function deriveUsefulOheng(lacking: Oheng[]): Oheng[] {
  const useful = new Set<Oheng>();
  for (const o of lacking) {
    for (const [src, dst] of Object.entries(OHENG_GENERATES) as [Oheng, Oheng][]) {
      if (dst === o) useful.add(src);
    }
    useful.add(o);
  }
  return [...useful];
}

export function analyzeSajuOheng(birth: BirthProfile): SajuOhengProfile {
  const yearStem = ((birth.year - 4) % 10 + 10) % 10;
  const dayStem = daySexagenaryIndex(birth.year, birth.month, birth.day) % 10;
  const monthBranch = monthBranchIndex(birth.month);

  const yearOheng = STEM_OHENG[yearStem];
  const dayOheng = STEM_OHENG[dayStem];
  const monthOheng = BRANCH_OHENG[monthBranch];

  const place = getDistrict(birth.birthDistrict);
  const regionOheng = place?.oheng;
  const regionLabel = place ? getFullDistrictLabel(birth.birthDistrict) : undefined;
  const regionLat = place?.lat;
  const regionLng = place?.lng;

  const distribution: Record<Oheng, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  for (const o of [yearOheng, monthOheng, dayOheng, regionOheng].filter(Boolean) as Oheng[]) {
    distribution[o]++;
  }

  const lacking = (["목", "화", "토", "금", "수"] as Oheng[]).filter((o) => distribution[o] === 0);
  const usefulOheng = deriveUsefulOheng(lacking);

  let summary =
    lacking.length > 0
      ? `사주에 ${lacking.map((o) => `${o}행`).join(", ")} 기운이 부족합니다. 이름 한자의 자원오행으로 보완 여부를 확인해 주세요.`
      : "사주에 오행이 고르게 분포되어 있습니다. 이름 한자와의 조화를 확인해 주세요.";

  if (regionLabel && regionOheng) {
    summary += ` 태생지 ${regionLabel}(${regionLat?.toFixed(2)}°N, ${regionLng?.toFixed(2)}°E)의 ${regionOheng}행 지기(地氣)를 반영했습니다.`;
  }

  if (usefulOheng.length > 0 && lacking.length > 0) {
    summary += ` 희신 후보: ${usefulOheng.map((o) => `${o}행`).join(", ")}.`;
  }

  let calendarNote: string | undefined;
  if (birth.calendarType === "lunar") {
    calendarNote = birth.isLeapMonth
      ? "음력 윤달 입력입니다. 정밀 사주 분석은 양력 변환 후 확인하시는 것을 권장합니다."
      : "음력 입력입니다. 절기 기준 월주는 양력 변환 후 더 정확해집니다.";
  }

  return {
    yearOheng,
    monthOheng,
    dayOheng,
    regionOheng,
    regionLabel,
    regionLat,
    regionLng,
    distribution,
    lacking,
    usefulOheng,
    summary,
    calendarNote,
  };
}

export type SourceOhengHarmony = {
  gilHeung: "길" | "흉" | "평";
  fillsLacking: Oheng[];
  matchesUseful: Oheng[];
  nameOheng: Oheng[];
  matchScore: number;
  summary: string;
};

export function analyzeSourceOhengHarmony(
  saju: SajuOhengProfile,
  nameOheng: Oheng[],
): SourceOhengHarmony {
  const fillsLacking = saju.lacking.filter((o) => nameOheng.includes(o));
  const matchesUseful = saju.usefulOheng.filter((o) => nameOheng.includes(o));

  let matchScore = 50;
  matchScore += fillsLacking.length * 15;
  matchScore += matchesUseful.length * 8;
  if (saju.lacking.length > 0 && fillsLacking.length === 0) matchScore -= 20;
  matchScore = Math.max(0, Math.min(100, matchScore));

  let gilHeung: "길" | "흉" | "평" = "평";
  let summary = "이름 한자의 자원오행이 사주와 무난하게 어우러집니다.";

  if (fillsLacking.length > 0) {
    gilHeung = "길";
    summary = `이름 한자가 사주에 부족한 ${fillsLacking.map((o) => `${o}행`).join(", ")} 기운을 보완합니다. 이름대로 살아간다는 성명학의 긍정적 해석입니다.`;
  } else if (matchesUseful.length > 0) {
    gilHeung = "길";
    summary = `선택한 한자가 희신 ${matchesUseful.map((o) => `${o}행`).join(", ")} 기운과 맞닿아 사주 균형에 도움이 됩니다.`;
  } else if (saju.lacking.length > 0) {
    gilHeung = "흉";
    summary = `사주에 부족한 ${saju.lacking.map((o) => `${o}행`).join(", ")} 기운을 이름 한자가 직접 보완하지 못합니다. 한자 선택을 재검토해 보세요.`;
  }

  const main = saju.dayOheng;
  const generatesMain = nameOheng.some((o) => OHENG_GENERATES[o] === main);
  const overcomesMain = nameOheng.some((o) => OHENG_OVERCOMES[o] === main);
  if (generatesMain && gilHeung !== "흉") {
    summary += ` 일간 ${main}행을 돕는 상생 관계가 있습니다.`;
  } else if (overcomesMain) {
    summary += ` 일간 ${main}행과 상극 요소가 있어 균형 조율이 중요합니다.`;
  }

  return {
    gilHeung,
    fillsLacking,
    matchesUseful,
    nameOheng,
    matchScore,
    summary,
  };
}
