import type { Oheng } from "@/lib/seongmyung";
import { OHENG_LABEL } from "@/lib/seongmyung";

const STEM_OHENG: Oheng[] = ["목", "목", "화", "화", "토", "토", "금", "금", "수", "수"];

const BRANCH_OHENG: Oheng[] = ["수", "토", "목", "목", "토", "화", "화", "토", "금", "금", "토", "수"];

const OHENG_GENERATES: Record<Oheng, Oheng> = {
  목: "화",
  화: "토",
  토: "금",
  금: "수",
  수: "목",
};

export type BirthDate = {
  year: number;
  month: number;
  day: number;
};

export type SajuOhengProfile = {
  yearOheng: Oheng;
  monthOheng: Oheng;
  dayOheng: Oheng;
  distribution: Record<Oheng, number>;
  lacking: Oheng[];
  summary: string;
};

/** 1900-01-01 = 甲戌일 (60갑자 index 10) 기준 일간 계산 */
function daySexagenaryIndex(year: number, month: number, day: number): number {
  const base = Date.UTC(1900, 0, 1);
  const target = Date.UTC(year, month - 1, day);
  const days = Math.floor((target - base) / 86400000);
  return ((days + 10) % 60 + 60) % 60;
}

function monthBranchIndex(month: number): number {
  // 양력 월 → 지지 근사 (절기 미적용 간이)
  const map = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return map[Math.max(0, Math.min(11, month - 1))];
}

export function analyzeSajuOheng(birth: BirthDate): SajuOhengProfile {
  const yearStem = ((birth.year - 4) % 10 + 10) % 10;
  const dayStem = daySexagenaryIndex(birth.year, birth.month, birth.day) % 10;
  const monthBranch = monthBranchIndex(birth.month);

  const yearOheng = STEM_OHENG[yearStem];
  const dayOheng = STEM_OHENG[dayStem];
  const monthOheng = BRANCH_OHENG[monthBranch];

  const distribution: Record<Oheng, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  for (const o of [yearOheng, monthOheng, dayOheng]) distribution[o]++;

  const lacking = (["목", "화", "토", "금", "수"] as Oheng[]).filter((o) => distribution[o] === 0);

  const summary =
    lacking.length > 0
      ? `사주에 ${lacking.map((o) => `${o}(${OHENG_LABEL[o]})`).join(", ")} 기운이 부족합니다. 이름 한자의 자원오행으로 보완 여부를 확인하세요.`
      : "사주에 오행이 고르게 분포되어 있습니다. 이름 한자와의 조화를 확인하세요.";

  return { yearOheng, monthOheng, dayOheng, distribution, lacking, summary };
}

export type SourceOhengHarmony = {
  gilHeung: "길" | "흉" | "평";
  fillsLacking: Oheng[];
  nameOheng: Oheng[];
  summary: string;
};

export function analyzeSourceOhengHarmony(
  saju: SajuOhengProfile,
  nameOheng: Oheng[],
): SourceOhengHarmony {
  const fillsLacking = saju.lacking.filter((o) => nameOheng.includes(o));

  let gilHeung: "길" | "흉" | "평" = "평";
  let summary = "이름 한자의 자원오행이 사주와 무난하게 어우러집니다.";

  if (fillsLacking.length > 0) {
    gilHeung = "길";
    summary = `이름 한자가 사주에 부족한 ${fillsLacking.map((o) => `${o}(${OHENG_LABEL[o]})`).join(", ")} 기운을 보완합니다. '이름대로 살아간다'는 성명학의 긍정적 해석입니다.`;
  } else if (saju.lacking.length > 0) {
    gilHeung = "흉";
    summary = `사주에 부족한 ${saju.lacking.map((o) => o).join(", ")} 기운을 이름 한자가 직접 보완하지 못합니다. 한자 선택을 재검토해 보세요.`;
  }

  // 상생 보조: 이름 오행이 사주 주기운을 생하는지
  const main = saju.yearOheng;
  const generatesMain = nameOheng.some((o) => OHENG_GENERATES[o] === main);
  if (generatesMain && gilHeung !== "흉") {
    summary += ` 또한 이름 오행이 ${main}(${OHENG_LABEL[main]}) 기운을 돕는 상생 관계입니다.`;
  }

  return { gilHeung, fillsLacking, nameOheng, summary };
}
