import type { GilHeung } from "@/lib/seongmyung";

export const COUPLE_UPSELL_LINES = [
  "나의 명통을 본 뒤, 상대의 사주·이름·태생지를 더하면 두 사람의 조화가 드러납니다.",
  "연애·결혼·재물·자녀·건강 — 항목별 궁합 점수와 앞으로의 흐름을 짚어 드립니다.",
] as const;

export const COUPLE_GRADE: Record<string, string> = {
  대길: "대길(大吉) — 천생연분에 가까운 궁합",
  길: "길(吉) — 서로를 키우는 좋은 인연",
  보통: "보통(普通) — 맞춤과 이해로 깊어지는 인연",
  주의: "주의(注意) — 조율·소통이 특히 중요",
};

export function coupleScoreLabel(score: number): string {
  return `신수 쌍통 부합도 (身數 雙通 附合度): ${score}%`;
}

export const PREMIUM_FEATURES = [
  "연애·결혼·재물·자녀·건강 항목별 상세 풀이",
  "이름↔상대 사주 교차 오행 분석",
  "형격(21~40세) 결혼·주운 시기 해석",
  "태생 좌표 지기 조화",
  "앞으로 4년 흐름·주의 시기",
] as const;

export function gilBadgeClass(gil: GilHeung): string {
  if (gil === "길") return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
  if (gil === "흉") return "text-[var(--mk-cinnabar-soft)] border-[var(--mk-cinnabar)]/30 bg-[var(--mk-cinnabar)]/10";
  return "text-[var(--mk-ivory-dim)] border-[var(--mk-border)] bg-[var(--mk-charcoal-light)]";
}
