export type Oheng = "목" | "화" | "토" | "금" | "수";

export type FortuneGrade = "대길" | "길" | "보통" | "주의";

export type SyllableAnalysis = {
  char: string;
  cho: string;
  oheng: Oheng;
  strokes: number;
  energy: number;
};

export type NameAnalysis = {
  name: string;
  syllables: SyllableAnalysis[];
  nameNumber: number;
  grade: FortuneGrade;
  ohengCount: Record<Oheng, number>;
  dominant: Oheng;
  lacking: Oheng[];
  personality: string;
  career: string;
  love: string;
  wealth: string;
  health: string;
  advice: string;
  summary: string;
};

const CHO_TO_OHENG: Record<number, Oheng> = {
  0: "목",
  1: "목",
  2: "화",
  3: "토",
  4: "토",
  5: "금",
  6: "금",
  7: "금",
  8: "토",
  9: "수",
  10: "수",
  11: "수",
  12: "목",
  13: "화",
  14: "토",
  15: "금",
  16: "금",
  17: "수",
  18: "수",
};

const CHO_STROKES: Record<number, number> = {
  0: 2,
  1: 4,
  2: 2,
  3: 3,
  4: 5,
  5: 4,
  6: 2,
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

const JUNG_STROKES = [2, 4, 3, 2, 4, 3, 4, 3, 2, 4, 3, 2, 3, 4, 3, 2, 4, 3, 4, 3, 2];
const JONG_STROKES = [0, 2, 3, 3, 4, 4, 4, 5, 6, 7, 8, 9, 4, 5, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

const GRADES: { max: number; grade: FortuneGrade }[] = [
  { max: 15, grade: "대길" },
  { max: 35, grade: "길" },
  { max: 55, grade: "보통" },
  { max: 999, grade: "주의" },
];

const OHENG_ORDER: Oheng[] = ["목", "화", "토", "금", "수"];

const PERSONALITY: Record<Oheng, string> = {
  목: "성장과 시작의 기운이 강합니다. 새로운 것을 배우고 도전하는 에너지가 있으며, 주변 사람에게 긍정적인 영향을 줍니다.",
  화: "열정과 표현력이 돋보입니다. 감정을 솔직하게 드러내며, 추진력과 리더십이 자연스럽게 나타납니다.",
  토: "안정과 중재의 기운을 지닙니다. 신중하고 믿음직하며, 갈등 속에서 균형을 잡는 능력이 있습니다.",
  금: "결단력과 원칙이 분명합니다. 정리·분석·완성에 강하고, 목표를 향해 차분히 나아갑니다.",
  수: "지혜와 유연함이 특징입니다. 상황을 깊이 이해하고, 섬세한 공감 능력으로 관계를 잘 풀어갑니다.",
};

const CAREER: Record<Oheng, string> = {
  목: "교육, 기획, 창업, 콘텐츠, 환경·성장 관련 분야에서 빛을 발합니다.",
  화: "마케팅, 예술, 영업, 미디어, 대면 서비스 등 표현과 소통이 중요한 일에 적합합니다.",
  토: "행정, 상담, 부동산, 관리, 중간 조율 역할에서 안정적인 성과를 냅니다.",
  금: "금융, 법률, IT, 품질관리, 정밀 업무에서 신뢰를 얻기 쉽습니다.",
  수: "연구, 상담, 해외·유통, 디자인, 돌봄·치유 분야에서 강점을 보입니다.",
};

const LOVE: Record<Oheng, string> = {
  목: "함께 성장하는 관계를 원합니다. 상대의 가능성을 믿어주면 깊은 인연이 이어집니다.",
  화: "솔직한 감정 표현이 매력입니다. 다정함과 적극성이 연애운을 높입니다.",
  토: "느리지만 깊은 사랑을 합니다. 신뢰가 쌓이면 오래가는 인연으로 이어집니다.",
  금: "진지하고 책임감 있는 연애를 합니다. 약속을 지키는 모습이 상대에게 신뢰를 줍니다.",
  수: "공감과 배려가 연애의 핵심입니다. 마음을 읽어주는 능력이 인연을 좋게 만듭니다.",
};

const WEALTH: Record<Oheng, string> = {
  목: "꾸준한 투자와 성장형 수입이 유리합니다. 단기보다 중장기 계획이 재물운을 살립니다.",
  화: "적극적인 활동과 네트워크가 재물로 이어집니다. 과소비만 조심하면 흐름이 좋습니다.",
  토: "저축과 안정적 자산 형성에 강합니다. 무리한 투자보다 실속 있는 선택이 유리합니다.",
  금: "계획적 관리와 전문성이 수입을 키웁니다. 정리·절약·분석 능력이 재물운을 돕습니다.",
  수: "정보와 타이밍이 재물의 열쇠입니다. 흐름을 읽고 기회를 잡으면 수입이 늘어납니다.",
};

const HEALTH: Record<Oheng, string> = {
  목: "간·눈· 근육 긴장에 유의하세요. 스트레칭과 충분한 수면이 도움이 됩니다.",
  화: "심장·혈액순환·스트레스 관리가 중요합니다. 과로와 감정 과열을 피하세요.",
  토: "소화기·비위를 챙기세요. 규칙적인 식사와 적당한 운동이 컨디션을 유지합니다.",
  금: "호흡기·피부·건조함에 주의하세요. 수분 섭취와 호흡 운동이 좋습니다.",
  수: "신장·순환·면역에 신경 쓰세요. 따뜻하게 몸을 보하고 과한 한기를 피하세요.",
};

const LACK_ADVICE: Record<Oheng, string> = {
  목: "초록색, 식물, 아침 산책으로 목(木) 기운을 보완해 보세요.",
  화: "따뜻한 색, 햇살, 가벼운 운동으로 화(火) 기운을 채워 보세요.",
  토: "황토색·베이지, 규칙적인 생활로 토(土) 기운을 안정시키세요.",
  금: "흰색·메탈 소재, 정리·정돈으로 금(金) 기운을 보강하세요.",
  수: "파란색·물, 충분한 수분과 휴식으로 수(水) 기운을 채우세요.",
};

function decomposeHangul(char: string) {
  const code = char.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return null;
  const cho = Math.floor(code / 588);
  const jung = Math.floor((code % 588) / 28);
  const jong = code % 28;
  return { cho, jung, jong };
}

function gradeFromNumber(n: number): FortuneGrade {
  const mod = ((n - 1) % 81) + 1;
  if (mod <= 12 || mod === 24 || mod === 32 || mod === 42 || mod === 52 || mod === 62 || mod === 72) {
    return "대길";
  }
  if (mod <= 25 || mod === 35 || mod === 45 || mod === 55 || mod === 65 || mod === 75) {
    return "길";
  }
  if (mod <= 45) return "보통";
  return "주의";
}

export function isValidKoreanName(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 4) return false;
  return /^[가-힣]+$/.test(trimmed);
}

export function analyzeName(rawName: string): NameAnalysis {
  const name = rawName.trim();
  if (!isValidKoreanName(name)) {
    throw new Error("2~4글자 한글 이름을 입력해 주세요.");
  }

  const syllables: SyllableAnalysis[] = [];
  let totalStrokes = 0;

  for (const char of name) {
    const parts = decomposeHangul(char);
    if (!parts) throw new Error("한글 이름만 입력할 수 있습니다.");

    const strokes =
      CHO_STROKES[parts.cho] + JUNG_STROKES[parts.jung] + JONG_STROKES[parts.jong];
    const oheng = CHO_TO_OHENG[parts.cho];
    totalStrokes += strokes;

    syllables.push({
      char,
      cho: String.fromCharCode(0x1100 + parts.cho),
      oheng,
      strokes,
      energy: strokes * (parts.jong === 0 ? 1 : 1.1),
    });
  }

  const nameNumber = syllables.reduce((sum, s, i) => sum + s.strokes * (i + 1), 0);
  const grade = gradeFromNumber(nameNumber);

  const ohengCount: Record<Oheng, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  for (const s of syllables) ohengCount[s.oheng]++;

  const dominant = OHENG_ORDER.reduce((a, b) =>
    ohengCount[a] >= ohengCount[b] ? a : b,
  );
  const lacking = OHENG_ORDER.filter((o) => ohengCount[o] === 0);

  const personality = `${PERSONALITY[dominant]} ${lacking.length > 0 ? `부족한 ${lacking.join("·")} 기운은 ${LACK_ADVICE[lacking[0]]}` : "오행이 고르게 흘러 균형 잡힌 이름입니다."}`;

  const gradeText: Record<FortuneGrade, string> = {
    대길: "이름 전체 기운이 매우 좋습니다. 타고난 흐름이 순조로운 편입니다.",
    길: "이름 기운이 안정적입니다. 꾸준히 노력하면 운이 따라옵니다.",
    보통: "이름 기운이 평균 이상입니다. 본인의 선택과 습관이 운을 좌우합니다.",
    주의: "이름에 강한 기운과 약한 기운이 공존합니다. 부족한 오행을 의식적으로 보완하면 좋습니다.",
  };

  return {
    name,
    syllables,
    nameNumber: ((nameNumber - 1) % 81) + 1,
    grade,
    ohengCount,
    dominant,
    lacking,
    personality,
    career: CAREER[dominant],
    love: LOVE[dominant],
    wealth: WEALTH[dominant],
    health: HEALTH[dominant],
    advice: lacking.length > 0 ? LACK_ADVICE[lacking[0]] : "현재 오행 균형이 좋습니다. 지금의 리듬을 유지하세요.",
    summary: gradeText[grade],
  };
}

export const OHENG_COLORS: Record<Oheng, string> = {
  목: "#34d399",
  화: "#f87171",
  토: "#fbbf24",
  금: "#e2e8f0",
  수: "#60a5fa",
};

export const GRADE_COLORS: Record<FortuneGrade, string> = {
  대길: "#a78bfa",
  길: "#34d399",
  보통: "#fbbf24",
  주의: "#fb923c",
};
