import type { GilHeung, Oheng } from "@/lib/seongmyung";
import type { SourceOhengHarmony } from "@/lib/saju";

export const INTRO_MUSOK = [
  "이름 석 자는 육신에 새기는 영험한 부적(符籍)이자,",
  "평생의 신수(身數)를 좌우하는 기틀입니다.",
] as const;

export const MUSOK_MOTTO =
  "사주(先天地)는 바꿀 수 없으나, 이름(後天地)으로 명줄을 잇고 궂은 액운을 쳐냅니다.";

export const SAGYEOK_MUSOK = {
  won: {
    title: "원격 (元格)",
    folk: "탯줄의 기운",
    epoch: "초년 · 1~20세",
    verse:
      "유년기부터 청소년기까지 신수의 기초가 놓이는 시기입니다. 조상덕이 탯줄을 통해 스며들기 시작합니다.",
  },
  hyung: {
    title: "형격 (形格)",
    folk: "명줄의 중심",
    epoch: "청년 · 21~40세 · 주운",
    verse:
      "평생을 이끄는 주운(主運)이자 궂은 풍파를 막아주는 방패입니다. 성명학에서 가장 비중 있게 보는 명줄입니다.",
  },
  i: {
    title: "이격 (意格)",
    folk: "가업과 신수",
    epoch: "장년 · 41~60세",
    verse:
      "가정을 지키고 사회적 풍파를 다스리는 장년기의 힘입니다. 가업과 인덕이 무르익는 시기입니다.",
  },
  jeong: {
    title: "정격 (正格)",
    folk: "종택(宗宅)의 결실",
    epoch: "말년 · 61세~",
    verse:
      "삶의 마무리에 거두는 복록과 자손에게 물려줄 덕망입니다. 이름이 이끈 종택의 결실을 보여줍니다.",
  },
} as const;

export const GIL_MUSOK: Record<GilHeung, string> = {
  길: "길(吉) — 천기 순조",
  흉: "흉(凶) — 살(煞) 주의",
  평: "평(平) — 무난한 흐름",
};

export const GRADE_MUSOK: Record<string, string> = {
  대길: "대길(大吉) — 신수가 크게 맞음",
  길: "길(吉) — 명줄이 순함",
  보통: "보통(普通) — 스스로 다스려야 함",
  주의: "주의(注意) — 살풀이 필요",
};

export function sinsuLabel(score: number): string {
  return `성명 신수 부합도 (姓名 身數 附合度): ${score}%`;
}

const OHENG_FOLK: Record<Oheng, string> = {
  목: "木 — 생장의 기",
  화: "火 — 열정의 기",
  토: "土 — 대지의 기",
  금: "金 — 결단의 기",
  수: "水 — 윤택의 기",
};

export function musok81Verse(gilHeung: GilHeung, gridName: string): string {
  if (gilHeung === "길") {
    return `상생(相生)의 기운이 서로를 밀어주어 ${gridName}에서 인덕이 마르지 않고, 조상의 보살핌이 따르는 형국입니다.`;
  }
  if (gilHeung === "흉") {
    return `상극(相剋)이 심할 경우 이름의 획수가 부딪쳐 살(煞)이 끼거나 명줄이 꼬일 수 있습니다. 한자의 자원오행으로 액운을 누르고 대지의 기운으로 보완해야 합니다.`;
  }
  return `${gridName} — 오행의 흐름이 중립입니다. 이름(後天地)의 선택으로 명줄을 다스릴 여지가 남아 있습니다.`;
}

export function musokHarmonyNarrative(harmony: SourceOhengHarmony, lacking: Oheng[]): string {
  if (harmony.fillsLacking.length > 0) {
    const filled = harmony.fillsLacking.map((o) => OHENG_FOLK[o]).join(", ");
    return `사주에 부족했던 ${lacking.map((o) => OHENG_FOLK[o]).join(", ")} 기운을, 이번 이름 한자가 ${filled}로 비보(裨補)하여 촉촉하게 채워 액운을 걷어냅니다. 상생의 기운이 명줄을 잇습니다.`;
  }
  if (harmony.matchesUseful.length > 0) {
    return `희신(喜神)에 맞는 기운이 이름에 실려, 선천 사주와 후천 이름이 한 줄로 이어집니다. 조상덕과 인덕이 함께하는 형국입니다.`;
  }
  if (lacking.length > 0) {
    return `사주에 ${lacking.map((o) => `${o}행`).join(", ")} 기운이 부족합니다. 이름 한자의 자원오행이 직접 보완하지 못하니, 명줄 보완(補完)을 다시 살펴 보시기 바랍니다.`;
  }
  return "선천 사주와 후천 이름의 오행이 고르게 흐릅니다. 명줄이 크게 틀어지지 않은 형국입니다.";
}

export const OHENG_OBANG: Record<Oheng, { color: string; label: string }> = {
  목: { color: "#2d6a4f", label: "東" },
  화: { color: "#c1121f", label: "南" },
  토: { color: "#ca8a04", label: "中" },
  금: { color: "#78716c", label: "西" },
  수: { color: "#1e3a5f", label: "北" },
};
