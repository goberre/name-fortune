import type { GilHeung, Oheng } from "@/lib/seongmyung";

export const INTRO_LINES = [
  "이름은 단순한 호칭이 아닌,",
  "당신의 영혼이 물질세계와 주파수를 맞추는",
  "고유의 문양(Sigil)입니다.",
] as const;

export const SAGYEOK_OCCULT = {
  won: {
    hanja: "元格",
    title: "원격",
    epoch: "초년 · 0~20세",
    archetype: "씨앗이 대지를 뚫고 나오는 힘",
    verse:
      "영혼의 전반기, 대지가 깨어나 새싹을 틔우는 천기의 흐름. 뿌리가 스스로를 향해 뻗어 나가는 시기.",
  },
  hyung: {
    hanja: "形格",
    title: "형격",
    epoch: "청년 · 21~40세 · 주운",
    archetype: "운명의 나침반이자 자아의 형상",
    verse:
      "우주가 당신에게 주운(主運)을 내린 시기. 직업·연애·자아가 하나의 문양으로 응축되는 가장 강렬한 궤적.",
  },
  i: {
    hanja: "意格",
    title: "이격",
    epoch: "장년 · 41~60세",
    archetype: "우주가 부여한 사회적 궤도와 결실",
    verse:
      "의지가 세상과 맞물리는 시기. 가정·재물·명예의 결실이 영혼의 두 번째 서사를 씁니다.",
  },
  jeong: {
    hanja: "正格",
    title: "정격",
    epoch: "말년 · 61세~ · 총운",
    archetype: "육신을 넘어 영혼이 거두어들일 최종 궤적",
    verse:
      "모든 획수가 하나의 결론으로 수렴합니다. 이름이 이끈 운명의 마지막 장면, 영혼의 귀환.",
  },
} as const;

export const GRADE_OCCULT: Record<string, string> = {
  대길: "천명 동조 — 우주가 이 이름과 공명한다",
  길: "길운 개방 — 운명의 문이 열려 있다",
  보통: "균형의 문 — 스스로 문양을 완성해야 한다",
  주의: "봉인 주의 — 기운의 충돌을 살펴야 한다",
};

export const GIL_OCCULT: Record<GilHeung, string> = {
  길: "천기 순응",
  흉: "기운 충돌",
  평: "중립의 흐름",
};

export const OHENG_RUNE: Record<Oheng, { rune: string; element: string; hue: string }> = {
  목: { rune: "🜁", element: "木", hue: "#4ade80" },
  화: { rune: "🜂", element: "火", hue: "#f87171" },
  토: { rune: "🜃", element: "土", hue: "#fbbf24" },
  금: { rune: "🜄", element: "金", hue: "#cbd5e1" },
  수: { rune: "🜅", element: "水", hue: "#60a5fa" },
};

export function resonanceLabel(score: number): string {
  return `성명 주파수 동조율 (Destiny Resonance): ${score}%`;
}

export function occult81Narrative(gilHeung: GilHeung, gridName: string): string {
  if (gilHeung === "길")
    return `${gridName} — 천기가 이름의 획수와 상생하며, 운명의 실이 붉은 빛으로 엮입니다.`;
  if (gilHeung === "흉")
    return `${gridName} — 상극의 기운이 문양을 흔듭니다. 연금술적 균형 조율이 요구됩니다.`;
  return `${gridName} — 오행의 흐름이 중립을 유지합니다. 의식적인 선택이 궤적을 바꿉니다.`;
}
