import type { GilHeung } from "@/lib/seongmyung";
import type { SagyeokGrid } from "@/lib/seongmyung";
import type { BirthProfile } from "@/types/birth";

export type LifeStageKey = "won" | "hyung" | "i" | "jeong";

const STAGE_ORDER: LifeStageKey[] = ["won", "hyung", "i", "jeong"];

const STAGE_META: Record<
  LifeStageKey,
  { label: string; period: string; ageMin: number; ageMax: number; futureTopics: string[] }
> = {
  won: {
    label: "원격",
    period: "1~20세",
    ageMin: 1,
    ageMax: 20,
    futureTopics: ["학업", "성격 형성", "가족 관계"],
  },
  hyung: {
    label: "형격",
    period: "21~40세",
    ageMin: 21,
    ageMax: 40,
    futureTopics: ["직업", "연애·결혼", "사회 진출", "자립"],
  },
  i: {
    label: "이격",
    period: "41~60세",
    ageMin: 41,
    ageMax: 60,
    futureTopics: ["가정", "재물", "사회적 역할", "리더십"],
  },
  jeong: {
    label: "정격",
    period: "61세~",
    ageMin: 61,
    ageMax: 120,
    futureTopics: ["건강", "노후", "명예", "인생 총정리"],
  },
};

const GIL_SCORE: Record<GilHeung, number> = { 길: 85, 평: 60, 흉: 35 };

function gilHeadline(key: LifeStageKey, gilHeung: GilHeung, isCurrent: boolean): string {
  const topics = STAGE_META[key].futureTopics.slice(0, 2).join("·");
  const when = isCurrent ? "지금 이 시기" : "앞으로 다가올 시기";
  if (gilHeung === "길") return `${when} ${topics}에서 좋은 흐름이 기대됩니다.`;
  if (gilHeung === "흉") return `${when} ${topics}에 신중함이 필요합니다. 미리 준비하면 극복 가능합니다.`;
  return `${when} ${topics}는 무난한 흐름입니다.`;
}

export function calcAge(birth: Pick<BirthProfile, "year" | "month" | "day">): number {
  const today = new Date();
  let age = today.getFullYear() - birth.year;
  const md = today.getMonth() + 1 - birth.month;
  if (md < 0 || (md === 0 && today.getDate() < birth.day)) age--;
  return Math.max(0, age);
}

export function stageForAge(age: number): LifeStageKey {
  if (age <= 20) return "won";
  if (age <= 40) return "hyung";
  if (age <= 60) return "i";
  return "jeong";
}

export type UpcomingStage = {
  key: LifeStageKey;
  label: string;
  period: string;
  gilHeung: GilHeung;
  headline: string;
  isCurrent: boolean;
  isPast: boolean;
  yearsUntil?: number;
};

export type FutureFortuneSummary = {
  currentAge: number;
  currentStage: LifeStageKey;
  currentStageLabel: string;
  upcomingStages: UpcomingStage[];
  focusMessage: string;
  futureScore: number;
  yearsToNext?: number;
};

export function buildFutureFortune(
  birth: Pick<BirthProfile, "year" | "month" | "day">,
  sagyeok: SagyeokGrid[],
): FutureFortuneSummary {
  const currentAge = calcAge(birth);
  const currentStage = stageForAge(currentAge);
  const gridMap = Object.fromEntries(sagyeok.map((g) => [g.key, g])) as Record<LifeStageKey, SagyeokGrid>;

  const currentIdx = STAGE_ORDER.indexOf(currentStage);
  const upcomingStages: UpcomingStage[] = STAGE_ORDER.map((key, idx) => {
    const meta = STAGE_META[key];
    const grid = gridMap[key];
    const isPast = idx < currentIdx;
    const isCurrent = key === currentStage;
    let yearsUntil: number | undefined;
    if (idx > currentIdx) {
      yearsUntil = meta.ageMin - currentAge;
    } else if (isCurrent && currentAge < meta.ageMax) {
      yearsUntil = 0;
    }
    return {
      key,
      label: meta.label,
      period: meta.period,
      gilHeung: grid.gilHeung,
      headline: gilHeadline(key, grid.gilHeung, isCurrent),
      isCurrent,
      isPast,
      yearsUntil,
    };
  });

  const futureStages = upcomingStages.filter((s) => !s.isPast);
  const futureScore = Math.round(
    futureStages.reduce((sum, s) => sum + GIL_SCORE[s.gilHeung], 0) / futureStages.length,
  );

  const currentGrid = gridMap[currentStage];
  const nextStage = upcomingStages.find((s) => s.yearsUntil !== undefined && s.yearsUntil > 0);

  let focusMessage = `현재 ${currentAge}세, ${STAGE_META[currentStage].label}(${STAGE_META[currentStage].period}) 운이 펼쳐지는 시기입니다. `;
  focusMessage += gilHeadline(currentStage, currentGrid.gilHeung, true);
  if (nextStage && nextStage.yearsUntil) {
    focusMessage += ` ${nextStage.yearsUntil}년 후 ${nextStage.label}(${nextStage.period})로 넘어갑니다.`;
  }

  return {
    currentAge,
    currentStage,
    currentStageLabel: STAGE_META[currentStage].label,
    upcomingStages,
    focusMessage,
    futureScore,
    yearsToNext: nextStage?.yearsUntil,
  };
}

export function defaultSagyeokIndex(age: number): number {
  return STAGE_ORDER.indexOf(stageForAge(age));
}

export function isPastStage(key: LifeStageKey, current: LifeStageKey): boolean {
  return STAGE_ORDER.indexOf(key) < STAGE_ORDER.indexOf(current);
}
