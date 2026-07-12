/** 발음오행 — 초성(자음) 기준 분류 */
export type Oheng = "목" | "화" | "토" | "금" | "수";
export type YinYang = "양" | "음";
export type GilHeung = "길" | "흉" | "평";

export type StrokeSlot = {
  char: string;
  strokes: number;
  yinYang: YinYang;
  role: "성" | "이름1" | "이름2";
};

export type SagyeokGrid = {
  key: "won" | "hyung" | "i" | "jeong";
  label: string;
  period: string;
  rawSum: number;
  suri: number;
  gilHeung: GilHeung;
  gridName: string;
  description: string;
};

export type PronunciationOheng = {
  char: string;
  cho: string;
  oheng: Oheng;
};

export type SeongmyungResult = {
  name: string;
  slots: StrokeSlot[];
  yinYangPattern: YinYang[];
  yinYangGilHeung: GilHeung;
  yinYangSummary: string;
  pronunciation: PronunciationOheng[];
  pronunciationFlow: Oheng[];
  pronunciationGilHeung: GilHeung;
  pronunciationSummary: string;
  sagyeok: SagyeokGrid[];
  birthOheng?: Oheng;
  birthSummary?: string;
  totalScore: number;
  gradeLabel: string;
};

/** 81수리 길격 데이터 (명세 핵심 리스트) */
const AUSPICIOUS_81: Record<number, { name: string; desc: string }> = {
  1: { name: "기본격", desc: "만물의 시작, 대지대업의 기운" },
  11: { name: "신성격", desc: "중인신망, 부귀영화" },
  13: { name: "지모격", desc: "총명지혜, 개척정신" },
  15: { name: "통솔격", desc: "덕망통솔, 부귀쌍전" },
  16: { name: "덕망격", desc: "유덕운영, 부귀안락" },
  17: { name: "건창격", desc: "의지견고, 돌파전진" },
  18: { name: "발전격", desc: "예술성공, 명리영달" },
  21: { name: "두령격", desc: "자립수공, 부귀공명" },
  23: { name: "공명격", desc: "욱일승천, 명진사해" },
  24: { name: "입신격", desc: "백수건가, 재록풍부" },
  25: { name: "안강격", desc: "재능지혜, 안전무난" },
  29: { name: "풍재격", desc: "신성지혜, 명리겸득" },
  31: { name: "융창격", desc: "자력대업, 학예성공" },
  32: { name: "혁신격", desc: "뜻밖의 성공, 의외득재" },
  33: { name: "승천격", desc: "명망부귀, 권세풍부" },
  35: { name: "평안격", desc: "안태평안, 문학발달" },
  37: { name: "인덕격", desc: "충실강건, 독립성공" },
  39: { name: "안태격", desc: "재백풍부, 안락장수" },
  41: { name: "고봉격", desc: "대업성취, 가운융창" },
  45: { name: "대성격", desc: "만물지육, 명리쌍전" },
};

/** 초성 인덱스 → 발음오행 (명세 기준) */
const CHO_PRONUNCIATION: Record<number, Oheng> = {
  0: "목",
  1: "목", // ㄲ
  2: "화", // ㄴ
  3: "화", // ㄷ
  4: "화", // ㄸ
  5: "화", // ㄹ
  6: "수", // ㅁ
  7: "수", // ㅂ
  8: "수", // ㅃ
  9: "금", // ㅅ
  10: "금", // ㅆ
  11: "토", // ㅇ
  12: "금", // ㅈ
  13: "금", // ㅉ
  14: "금", // ㅊ
  15: "목", // ㅋ
  16: "화", // ㅌ
  17: "수", // ㅍ
  18: "토", // ㅎ
};

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

const OHENG_LABEL: Record<Oheng, string> = {
  목: "木",
  화: "火",
  토: "土",
  금: "金",
  수: "水",
};

/** 한글 → 초성 인덱스 */
export function decomposeCho(char: string): number | null {
  const code = char.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return null;
  return Math.floor(code / 588);
}

/** 한글 기본 획수 추정 (한자 미입력 시) */
const DEFAULT_STROKES: Record<number, number> = {
  0: 6,
  1: 4,
  2: 3,
  3: 5,
  4: 5,
  5: 4,
  6: 4,
  7: 3,
  8: 4,
  9: 3,
  10: 4,
  11: 4,
  12: 2,
  13: 3,
  14: 4,
  15: 3,
  16: 4,
  17: 5,
  18: 5,
};

export function estimateHangulStrokes(char: string): number {
  const cho = decomposeCho(char);
  if (cho === null) return 8;
  const code = char.charCodeAt(0) - 0xac00;
  const jung = Math.floor((code % 588) / 28);
  const jong = code % 28;
  const jungS = [2, 4, 3, 2, 4, 3, 4, 3, 2, 4, 3, 2, 3, 4, 3, 2, 4, 3, 4, 3, 2][jung] ?? 3;
  const jongS = [0, 2, 3, 3, 4, 4, 4, 5, 6, 7, 8, 9, 4, 5, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18][jong] ?? 0;
  return (DEFAULT_STROKES[cho] ?? 4) + jungS + jongS;
}

export function strokeToYinYang(strokes: number): YinYang {
  return strokes % 2 === 0 ? "음" : "양";
}

export function normalize81(n: number): number {
  let v = Math.max(1, Math.round(n));
  while (v > 81) {
    if (v >= 100) {
      v = String(v)
        .split("")
        .reduce((s, d) => s + Number(d), 0);
    } else {
      v -= 80;
    }
  }
  return Math.max(1, Math.min(81, v));
}

export function lookup81(suri: number): { gilHeung: GilHeung; gridName: string; description: string } {
  const hit = AUSPICIOUS_81[suri];
  if (hit) return { gilHeung: "길", gridName: hit.name, description: hit.desc };
  if ([2, 6, 7, 8, 9, 10, 12, 14, 19, 20, 22, 26, 27, 28, 30, 34, 36, 38, 40, 42, 43, 44].includes(suri)) {
    return { gilHeung: "평", gridName: "평수격", description: "무난한 흐름, 꾸준한 노력이 빛을 발합니다." };
  }
  return {
    gilHeung: "흉",
    gridName: "주의격",
    description: "기운의 균형을 맞추면 충분히 좋은 방향으로 전환할 수 있습니다.",
  };
}

/** 이름 구조 → A(성), B(이름1), C(이름2) */
export function parseNameStructure(name: string, strokes: number[]) {
  const len = name.length;
  if (len === 2) return { A: strokes[0], B: strokes[1], C: 0 };
  if (len === 3) return { A: strokes[0], B: strokes[1], C: strokes[2] };
  if (len === 4) return { A: strokes[0] + strokes[1], B: strokes[2], C: strokes[3] };
  throw new Error("2~4글자 한글 이름만 분석할 수 있습니다.");
}

export function analyzeYinYang(slots: StrokeSlot[]): { gilHeung: GilHeung; pattern: YinYang[]; summary: string } {
  const pattern = slots.map((s) => s.yinYang);
  const allYang = pattern.every((p) => p === "양");
  const allYin = pattern.every((p) => p === "음");

  if (allYang || allYin) {
    return {
      gilHeung: "흉",
      pattern,
      summary: "음양이 한쪽으로 치우쳐 기복이 클 수 있습니다. 생활 리듬의 균형을 의식해 보세요.",
    };
  }

  return {
    gilHeung: "길",
    pattern,
    summary: "음양의 조화가 균형을 이루어 삶의 기복이 적고 평탄한 흐름을 보입니다.",
  };
}

function relation(a: Oheng, b: Oheng): "상생" | "상극" | "동류" {
  if (a === b) return "동류";
  if (OHENG_GENERATES[a] === b) return "상생";
  if (OHENG_OVERCOMES[a] === b) return "상극";
  return "동류";
}

export function analyzePronunciation(name: string): {
  items: PronunciationOheng[];
  flow: Oheng[];
  gilHeung: GilHeung;
  summary: string;
} {
  const items: PronunciationOheng[] = [];
  for (const char of name) {
    const choIdx = decomposeCho(char);
    if (choIdx === null) continue;
    const oheng = CHO_PRONUNCIATION[choIdx];
    items.push({ char, cho: String.fromCharCode(0x1100 + choIdx), oheng });
  }
  const flow = items.map((i) => i.oheng);

  let saeng = 0;
  let geuk = 0;
  for (let i = 0; i < flow.length - 1; i++) {
    const r = relation(flow[i], flow[i + 1]);
    if (r === "상생") saeng++;
    if (r === "상극") geuk++;
  }

  let gilHeung: GilHeung = "평";
  let summary = "발음오행이 평온하게 이어집니다.";
  if (saeng > geuk) {
    gilHeung = "길";
    summary = `발음오행이 상생(相生)으로 이어져 ${flow.map((o) => OHENG_LABEL[o]).join(" → ")} 흐름이 순조롭습니다.`;
  } else if (geuk > saeng) {
    gilHeung = "흉";
    summary = "발음오행에 상극(相剋)이 있어 주변과의 조율·인내가 중요합니다.";
  } else if (saeng > 0) {
    gilHeung = "길";
    summary = "발음오행에 상생 기운이 있어 협력과 성장에 유리합니다.";
  }

  return { items, flow, gilHeung, summary };
}

export function computeSagyeok(A: number, B: number, C: number): SagyeokGrid[] {
  const grids = [
    { key: "won" as const, label: "원격", period: "초년운 (1~20세)", sum: B + C },
    { key: "hyung" as const, label: "형격", period: "청년운 (21~40세)", sum: A + B },
    { key: "i" as const, label: "이격", period: "장년운 (41~60세)", sum: A + C },
    { key: "jeong" as const, label: "정격", period: "말년운 (61세~)", sum: A + B + C },
  ];

  return grids.map((g) => {
    const suri = normalize81(g.sum);
    const { gilHeung, gridName, description } = lookup81(suri);
    return {
      key: g.key,
      label: g.label,
      period: g.period,
      rawSum: g.sum,
      suri,
      gilHeung,
      gridName,
      description,
    };
  });
}

/** 생년 천간 → 자원오행 */
export function birthYearOheng(year: number): Oheng {
  const stem = ((year - 4) % 10 + 10) % 10;
  if (stem <= 1) return "목";
  if (stem <= 3) return "화";
  if (stem <= 5) return "토";
  if (stem <= 7) return "금";
  return "수";
}

function scoreGilHeung(g: GilHeung): number {
  if (g === "길") return 1;
  if (g === "평") return 0.6;
  return 0.25;
}

export function computeTotalScore(
  yinYang: GilHeung,
  pronunciation: GilHeung,
  sagyeok: SagyeokGrid[],
): number {
  let score = 0;
  score += scoreGilHeung(yinYang) * 25;
  score += scoreGilHeung(pronunciation) * 25;
  for (const s of sagyeok) {
    score += scoreGilHeung(s.gilHeung) * 12.5;
  }
  return Math.round(Math.min(100, Math.max(0, score)));
}

export function scoreToGrade(score: number): string {
  if (score >= 85) return "대길";
  if (score >= 70) return "길";
  if (score >= 55) return "보통";
  return "주의";
}

export function isValidKoreanName(name: string): boolean {
  const t = name.trim();
  return t.length >= 2 && t.length <= 4 && /^[가-힣]+$/.test(t);
}

export type AnalyzeInput = {
  name: string;
  strokes: number[];
  birthYear?: number;
};

export function analyzeSeongmyung(input: AnalyzeInput): SeongmyungResult {
  const name = input.name.trim();
  if (!isValidKoreanName(name)) throw new Error("2~4글자 한글 이름을 입력해 주세요.");

  const chars = [...name];
  if (input.strokes.length !== chars.length) {
    throw new Error("각 글자별 획수를 입력해 주세요.");
  }

  const roles: StrokeSlot["role"][] =
    chars.length === 2
      ? ["성", "이름1"]
      : chars.length === 3
        ? ["성", "이름1", "이름2"]
        : ["성", "성", "이름1", "이름2"];

  const slots: StrokeSlot[] = chars.map((char, i) => ({
    char,
    strokes: input.strokes[i],
    yinYang: strokeToYinYang(input.strokes[i]),
    role: roles[i],
  }));

  const { A, B, C } = parseNameStructure(name, input.strokes);
  const yinYang = analyzeYinYang(slots);
  const pronunciation = analyzePronunciation(name);
  const sagyeok = computeSagyeok(A, B, C);
  const totalScore = computeTotalScore(yinYang.gilHeung, pronunciation.gilHeung, sagyeok);

  let birthOheng: Oheng | undefined;
  let birthSummary: string | undefined;
  if (input.birthYear && input.birthYear >= 1900 && input.birthYear <= 2100) {
    birthOheng = birthYearOheng(input.birthYear);
    const lacking = pronunciation.flow.filter((o) => o !== birthOheng);
    birthSummary = `출생년 ${input.birthYear}년의 자원오행은 ${birthOheng}(${OHENG_LABEL[birthOheng]})입니다. 이름 오행과 조화를 이루면 운의 시너지가 커집니다.${
      lacking.length ? "" : " 이름과 자원오행이 잘 맞는 편입니다."
    }`;
  }

  return {
    name,
    slots,
    yinYangPattern: yinYang.pattern,
    yinYangGilHeung: yinYang.gilHeung,
    yinYangSummary: yinYang.summary,
    pronunciation: pronunciation.items,
    pronunciationFlow: pronunciation.flow,
    pronunciationGilHeung: pronunciation.gilHeung,
    pronunciationSummary: pronunciation.summary,
    sagyeok,
    birthOheng,
    birthSummary,
    totalScore,
    gradeLabel: scoreToGrade(totalScore),
  };
}

export { OHENG_LABEL };
