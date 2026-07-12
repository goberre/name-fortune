import type { GilHeung, SeongmyungResult } from "@/lib/seongmyung";
import { analyzeSeongmyung, scoreToGrade, type AnalyzeInput } from "@/lib/seongmyung";
import { analyzeSourceOhengHarmony } from "@/lib/saju";
import {
  ohengRelation,
  relationLabel,
  relationScore,
  type OhengRelation,
} from "@/lib/oheng-relation";
import { getFullDistrictLabel } from "@/lib/birth-districts";

export type CompatibilityDimensionKey = "love" | "marriage" | "money" | "children" | "health";

export type CompatibilityDimension = {
  key: CompatibilityDimensionKey;
  label: string;
  hanja: string;
  score: number;
  gilHeung: GilHeung;
  teaser: string;
  detail: string;
  advice: string;
};

export type YearOutlook = {
  year: number;
  theme: string;
  flow: GilHeung;
  advice: string;
};

export type CoupleCompatibilityResult = {
  personA: SeongmyungResult;
  personB: SeongmyungResult;
  pairScore: number;
  pairGrade: string;
  headline: string;
  teaser: string;
  dayRelation: OhengRelation;
  dayRelationSummary: string;
  crossHarmonySummary: string;
  nameBridgeSummary: string;
  placeSummary: string;
  marriageWindowSummary: string;
  dimensions: CompatibilityDimension[];
  premiumOverview: string;
  yearOutlook: YearOutlook[];
  strengths: string[];
  cautions: string[];
};

function gilFromScore(score: number): GilHeung {
  if (score >= 75) return "길";
  if (score >= 50) return "평";
  return "흉";
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function crossNameHarmonyScore(a: SeongmyungResult, b: SeongmyungResult): number {
  if (!a.sajuProfile || !b.sajuProfile || !a.sourceOheng || !b.sourceOheng) return 55;
  const aToB = analyzeSourceOhengHarmony(b.sajuProfile, a.sourceOheng);
  const bToA = analyzeSourceOhengHarmony(a.sajuProfile, b.sourceOheng);
  return Math.round((aToB.matchScore + bToA.matchScore) / 2);
}

function pronunciationBridgeScore(a: SeongmyungResult, b: SeongmyungResult): number {
  const flowA = a.pronunciationFlow;
  const flowB = b.pronunciationFlow;
  if (flowA.length === 0 || flowB.length === 0) return 60;
  const rel = ohengRelation(flowA[flowA.length - 1], flowB[0]);
  return relationScore(rel);
}

function yinYangComplementScore(a: SeongmyungResult, b: SeongmyungResult): number {
  const yangA = a.yinYangPattern.filter((p) => p === "양").length;
  const yangB = b.yinYangPattern.filter((p) => p === "양").length;
  const lenA = a.yinYangPattern.length;
  const lenB = b.yinYangPattern.length;
  const biasA = yangA / lenA;
  const biasB = yangB / lenB;
  const diff = Math.abs(biasA - biasB);
  if (diff >= 0.25 && diff <= 0.75) return 88;
  if (diff < 0.15) return 58;
  return 72;
}

function marriageHyungScore(a: SeongmyungResult, b: SeongmyungResult): number {
  const hyungA = a.sagyeok.find((s) => s.key === "hyung");
  const hyungB = b.sagyeok.find((s) => s.key === "hyung");
  if (!hyungA || !hyungB) return 60;
  let score = 55;
  if (hyungA.gilHeung === "길" && hyungB.gilHeung === "길") score += 25;
  else if (hyungA.gilHeung !== "흉" && hyungB.gilHeung !== "흉") score += 12;
  else if (hyungA.gilHeung === "흉" || hyungB.gilHeung === "흉") score -= 15;
  const ohengA = a.sourceOheng ?? [];
  const ohengB = b.sourceOheng ?? [];
  if (ohengA.some((o) => ohengB.includes(o))) score += 8;
  return Math.max(0, Math.min(100, score));
}

function placeHarmonyScore(a: SeongmyungResult, b: SeongmyungResult): number {
  const latA = a.sajuProfile?.regionLat;
  const lngA = a.sajuProfile?.regionLng;
  const latB = b.sajuProfile?.regionLat;
  const lngB = b.sajuProfile?.regionLng;
  const oA = a.sajuProfile?.regionOheng;
  const oB = b.sajuProfile?.regionOheng;
  if (!latA || !lngA || !latB || !lngB || !oA || !oB) return 60;
  let score = 58;
  const rel = ohengRelation(oA, oB);
  score += relationScore(rel) * 0.25;
  const dist = Math.sqrt((latA - latB) ** 2 + (lngA - lngB) ** 2);
  if (dist < 0.5) score += 10;
  else if (dist < 2) score += 5;
  return Math.round(Math.min(100, score));
}

function buildDimensions(
  a: SeongmyungResult,
  b: SeongmyungResult,
  dayRel: OhengRelation,
  crossScore: number,
  marriageScore: number,
): CompatibilityDimension[] {
  const hyungA = a.sagyeok.find((s) => s.key === "hyung");
  const hyungB = b.sagyeok.find((s) => s.key === "hyung");
  const iA = a.sagyeok.find((s) => s.key === "i");
  const iB = b.sagyeok.find((s) => s.key === "i");
  const jeongA = a.sagyeok.find((s) => s.key === "jeong");
  const jeongB = b.sagyeok.find((s) => s.key === "jeong");
  const wonA = a.sagyeok.find((s) => s.key === "won");
  const wonB = b.sagyeok.find((s) => s.key === "won");

  const loveScore = Math.round(
    relationScore(dayRel) * 0.45 + pronunciationBridgeScore(a, b) * 0.35 + crossScore * 0.2,
  );
  const marriageDimScore = Math.round(marriageScore);
  const moneyScore = Math.round(
    avg([iA?.gilHeung === "길" ? 85 : iA?.gilHeung === "평" ? 65 : 40, iB?.gilHeung === "길" ? 85 : iB?.gilHeung === "평" ? 65 : 40]),
  );
  const childrenScore = Math.round(
    avg([
      jeongA?.gilHeung === "길" ? 82 : jeongA?.gilHeung === "평" ? 62 : 42,
      jeongB?.gilHeung === "길" ? 82 : jeongB?.gilHeung === "평" ? 62 : 42,
    ]),
  );
  const healthScore = Math.round(
    avg([
      wonA?.gilHeung === "길" ? 80 : wonA?.gilHeung === "평" ? 60 : 45,
      wonB?.gilHeung === "길" ? 80 : wonB?.gilHeung === "평" ? 60 : 45,
    ]) *
      0.6 +
      (a.sajuProfile && b.sajuProfile
        ? a.sajuProfile.lacking.some((o) => b.sajuProfile!.distribution[o] > 0) ||
          b.sajuProfile.lacking.some((o) => a.sajuProfile!.distribution[o] > 0)
          ? 88
          : 62
        : 60) *
        0.4,
  );

  return [
    {
      key: "love",
      label: "연애·애정",
      hanja: "情",
      score: loveScore,
      gilHeung: gilFromScore(loveScore),
      teaser: `일간 ${relationLabel(dayRel).split("—")[0].trim()} 관계로 감정의 온도가 ${loveScore >= 75 ? "따뜻하게" : loveScore >= 50 ? "오르락내리락하며" : "조율이 필요하게"} 흐릅니다.`,
      detail: `${a.name}(${a.sajuProfile?.dayOheng ?? "?"}행)과 ${b.name}(${b.sajuProfile?.dayOheng ?? "?"}행)의 일간 관계는 ${relationLabel(dayRel)}입니다. 발음오행 ${a.pronunciationFlow.join("→")} · ${b.pronunciationFlow.join("→")} 흐름이 만나 ${loveScore >= 75 ? "서로를 끌어당기는 상생의 결을 이룹니다." : loveScore >= 50 ? "비슷한 리듬으로 맞춰가면 깊어집니다." : "감정 표현 방식이 달라 오해가 생기기 쉽습니다."} 이름 한자가 상대 사주를 보완하는 정도는 ${crossScore}점입니다.`,
      advice:
        loveScore >= 75
          ? "서로의 장점을 말로 확인하는 습관이 인연을 더 굳건히 합니다."
          : "감정이 격해질 때 하루 쉬었다 대화하면 상극 기운이 약해집니다.",
    },
    {
      key: "marriage",
      label: "결혼·부부",
      hanja: "婚",
      score: marriageDimScore,
      gilHeung: gilFromScore(marriageDimScore),
      teaser: `형격(21~40세) 조화 ${marriageDimScore}점 — ${hyungA?.gridName ?? ""} · ${hyungB?.gridName ?? ""} 흐름이 ${marriageDimScore >= 75 ? "함께 길합니다" : "노력으로 맞춰집니다"}.`,
      detail: `결혼·동거 시기에 해당하는 형격을 보면, ${a.name}은 ${hyungA?.gridName}(${hyungA?.gilHeung}), ${b.name}은 ${hyungB?.gridName}(${hyungB?.gilHeung})입니다. ${a.yinYangSummary} ${b.yinYangSummary} 두 사람의 음양 패턴이 ${yinYangComplementScore(a, b) >= 80 ? "서로 빈 곳을 채워 부부운에 유리" : "비슷한 기질로 공감은 쉬우나 조율이 필요"}합니다.`,
      advice:
        marriageDimScore >= 75
          ? "중요한 결정은 둘 다 형격 주운이 순한 시기(21~40세)에 함께 내리세요."
          : "역할 분담과 경제·가사 원칙을 미리 정하면 형격의 기복을 줄일 수 있습니다.",
    },
    {
      key: "money",
      label: "재물·생활",
      hanja: "財",
      score: moneyScore,
      gilHeung: gilFromScore(moneyScore),
      teaser: `이격(41~60세) 흐름으로 재물·생활 기반은 ${moneyScore >= 75 ? "함께 단단해질" : "계획이 있으면 안정될"} 형국입니다.`,
      detail: `${a.name} 이격 ${iA?.gridName} · ${b.name} 이격 ${iB?.gridName}. ${moneyScore >= 75 ? "두 사람 모두 중년기 재물운의 기틀이 좋아 공동 자산 형성에 유리합니다." : "한쪽 이격이 평·주의일 수 있어 지출·저축 규칙을 함께 정하는 것이 좋습니다."} 태생지 지기 ${a.sajuProfile?.regionOheng ?? ""} · ${b.sajuProfile?.regionOheng ?? ""}가 생활 반경·일터 방향에도 영향을 줍니다.`,
      advice: "공동 목표(저축·투자·주거)를 오행 중 토·금 기운이 순한 달에 시작하면 흐름이 맞습니다.",
    },
    {
      key: "children",
      label: "자녀·후손",
      hanja: "子",
      score: childrenScore,
      gilHeung: gilFromScore(childrenScore),
      teaser: `정격(말년·총운)과 오행 보완으로 자녀·후손 인연은 ${childrenScore >= 75 ? "길(吉)" : "평(平) 이상"}입니다.`,
      detail: `${a.name} 정격 ${jeongA?.gridName} · ${b.name} 정격 ${jeongB?.gridName}. ${childrenScore >= 75 ? "종택(宗宅)의 결실이 두 이름에서 함께 길하게 보입니다." : "자녀운은 부모 각자의 정격과 교육 방식 조율에 달려 있습니다."} 사주 부족 오행이 서로 채워 주면 자녀에게 물려줄 기운이 고릅니다.`,
      advice: "자녀 계획·양육 방침은 두 사람 이름의 수(水)·목(木) 기운이 고를 때 논의하면 잘 맞습니다.",
    },
    {
      key: "health",
      label: "건강·액운",
      hanja: "健",
      score: healthScore,
      gilHeung: gilFromScore(healthScore),
      teaser: `원격·사주 상호 보완으로 건강·액운 관리는 ${healthScore >= 75 ? "서로 돕는" : "주의 깊은"} 관계입니다.`,
      detail: `${a.name} 원격 ${wonA?.gridName} · ${b.name} 원격 ${wonB?.gridName}. ${healthScore >= 75 ? "한쪽이 부족한 오행을 다른 쪽 사주·이름이 보완해 액운을 함께 누릅니다." : "스트레스·수면·식습관을 함께 관리하지 않으면 기운이 빠지기 쉽습니다."}`,
      advice: "상극(相剋)이 강한 해에는 여행·이사·큰 결정을 한꺼번에 내리지 마세요.",
    },
  ];
}

function buildYearOutlook(a: SeongmyungResult, b: SeongmyungResult, pairScore: number): YearOutlook[] {
  const baseYear = new Date().getFullYear();
  const dayRel = ohengRelation(a.sajuProfile?.dayOheng ?? "토", b.sajuProfile?.dayOheng ?? "토");
  const themes = ["인연 심화", "가정·주거", "재물·협력", "조율·성장"];
  const flows: GilHeung[] = ["길", "평", "길", "평"];

  return themes.map((theme, i) => {
    const year = baseYear + i;
    let flow = flows[i];
    if (dayRel === "상극" && i === 1) flow = "평";
    if (pairScore >= 80 && i === 0) flow = "길";
    return {
      year,
      theme,
      flow,
      advice:
        i === 0
          ? `${a.name}·${b.name} — 서로의 이름 오행을 말로 자주 확인하세요.`
          : i === 1
            ? "동거·결혼·이사는 두 사람 형격(21~40세)이 순한 시기에 맞추면 좋습니다."
            : i === 2
              ? "공동 재정·사업은 이격(41~60세) 흐름을 보고 시작하세요."
              : "갈등은 상극 기운이 강한 달보다 상생 달에 풀면 수월합니다.",
    };
  });
}

export function analyzeCoupleCompatibility(input: {
  personA: AnalyzeInput;
  personB: AnalyzeInput;
}): CoupleCompatibilityResult {
  const personA = analyzeSeongmyung(input.personA);
  const personB = analyzeSeongmyung(input.personB);

  const dayA = personA.sajuProfile?.dayOheng ?? "토";
  const dayB = personB.sajuProfile?.dayOheng ?? "토";
  const dayRelation = ohengRelation(dayA, dayB);
  const dayScore = relationScore(dayRelation);
  const crossScore = crossNameHarmonyScore(personA, personB);
  const bridgeScore = pronunciationBridgeScore(personA, personB);
  const yinYangScore = yinYangComplementScore(personA, personB);
  const marriageScore = marriageHyungScore(personA, personB);
  const placeScore = placeHarmonyScore(personA, personB);

  const pairScore = Math.round(
    dayScore * 0.28 +
      crossScore * 0.22 +
      bridgeScore * 0.12 +
      yinYangScore * 0.1 +
      marriageScore * 0.18 +
      placeScore * 0.1,
  );

  const pairGrade = scoreToGrade(pairScore);
  const dimensions = buildDimensions(personA, personB, dayRelation, crossScore, marriageScore);

  const placeA = personA.birthDate?.birthDistrict
    ? getFullDistrictLabel(personA.birthDate.birthDistrict)
    : "";
  const placeB = personB.birthDate?.birthDistrict
    ? getFullDistrictLabel(personB.birthDate.birthDistrict)
    : "";

  const strengths: string[] = [];
  const cautions: string[] = [];

  if (dayRelation === "상생") strengths.push(`일간 ${dayA}·${dayB} 상생 — 근본 기질이 서로를 돕습니다.`);
  if (crossScore >= 75) strengths.push("이름 한자가 상대 사주 부족 오행을 보완합니다.");
  if (marriageScore >= 75) strengths.push("형격(결혼·주운) 흐름이 함께 길합니다.");
  if (placeScore >= 75 && placeA && placeB) strengths.push(`태생지 ${placeA} · ${placeB} 지기가 조화롭습니다.`);

  if (dayRelation === "상극") cautions.push("일간 상극 — 감정·의견 충돌 시 한 박자 쉬는 것이 좋습니다.");
  if (crossScore < 55) cautions.push("이름 오행이 상대 사주를 직접 보완하지 못합니다. 한자·호칭을 의식하세요.");
  if (personA.yinYangGilHeung === "흉" || personB.yinYangGilHeung === "흉") {
    cautions.push("한쪽 이름 음양이 치우쳐 있어 리듬·역할 균형이 필요합니다.");
  }

  const headline =
    pairScore >= 85
      ? `${personA.name} · ${personB.name} — 천생연분(天生緣分)에 가까운 조화`
      : pairScore >= 70
        ? `${personA.name} · ${personB.name} — 서로 맞추면 깊어지는 좋은 인연`
        : pairScore >= 55
          ? `${personA.name} · ${personB.name} — 노력과 이해로 균형을 찾는 인연`
          : `${personA.name} · ${personB.name} — 조율·소통이 특히 중요한 인연`;

  const teaser = `궁합 ${pairScore}점 · ${pairGrade} — 일간 ${dayRelation}, 이름↔사주 ${crossScore}점, 형격 ${marriageScore}점.`;

  const dayRelationSummary = `${personA.name} 일간 ${dayA}행 · ${personB.name} 일간 ${dayB}행 — ${relationLabel(dayRelation)}. ${dayRelation === "상생" ? "근본 성향이 서로를 키워 주는 관계입니다." : dayRelation === "상극" ? "에너지가 부딪칠 수 있어 존중과 거리 조절이 필요합니다." : "비슷한 기운으로 공감은 쉬우나 변화를 함께 만들기 어려울 수 있습니다."}`;

  const crossHarmonySummary =
    crossScore >= 75
      ? `「${personA.name}」한자가 ${personB.name} 사주를, 「${personB.name}」한자가 ${personA.name} 사주를 ${crossScore}점 수준으로 보완합니다.`
      : `이름↔상대 사주 교차 조화 ${crossScore}점 — 한쪽 또는 양쪽 이름이 상대 부족 오행을 직접 채우지 못할 수 있습니다.`;

  const nameBridgeSummary = `${personA.name} 발음 끝(${personA.pronunciationFlow.at(-1) ?? ""}행) → ${personB.name} 발음 시작(${personB.pronunciationFlow[0] ?? ""}행): ${relationLabel(ohengRelation(personA.pronunciationFlow.at(-1) ?? "토", personB.pronunciationFlow[0] ?? "토"))}.`;

  const placeSummary =
    placeA && placeB
      ? `태생 좌표 ${placeA} · ${placeB} — 지기 조화 ${placeScore}점. ${placeScore >= 75 ? "고향·활동 방향이 맞물리기 쉽습니다." : "거주·직장 방향은 두 사람 방위를 함께 고려하세요."}`
      : "태생지 정보가 없어 지기 조화는 참고 수준입니다.";

  const hyungA = personA.sagyeok.find((s) => s.key === "hyung");
  const hyungB = personB.sagyeok.find((s) => s.key === "hyung");
  const marriageWindowSummary = `형격(21~40세 주운) — ${personA.name} ${hyungA?.gridName}(${hyungA?.gilHeung}) · ${personB.name} ${hyungB?.gridName}(${hyungB?.gilHeung}). ${marriageScore >= 75 ? "결혼·동거 시기에 함께 길한 흐름입니다." : "한쪽 형격이 주의·평일 수 있어 시기·방식을 함께 맞추세요."}`;

  const premiumOverview = [
    dayRelationSummary,
    crossHarmonySummary,
    nameBridgeSummary,
    placeSummary,
    marriageWindowSummary,
    ...dimensions.map((d) => `[${d.label}] ${d.detail}`),
    strengths.length > 0 ? `강점: ${strengths.join(" ")}` : "",
    cautions.length > 0 ? `주의: ${cautions.join(" ")}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    personA,
    personB,
    pairScore,
    pairGrade,
    headline,
    teaser,
    dayRelation,
    dayRelationSummary,
    crossHarmonySummary,
    nameBridgeSummary,
    placeSummary,
    marriageWindowSummary,
    dimensions,
    premiumOverview,
    yearOutlook: buildYearOutlook(personA, personB, pairScore),
    strengths,
    cautions,
  };
}

export { scoreToGrade as pairScoreToGrade };
