"use client";

const REASONS = [
  {
    icon: "🌱",
    title: "첫 기운이 평생 방향을 잡는다",
    desc: "태어날 때 그 땅의 방위·지형 기운(지기)이 몸에 밴다고 봅니다. 이것이 성격과 운의 '뿌리'가 됩니다.",
  },
  {
    icon: "🧩",
    title: "사주만으로는 부족한 퍼즐",
    desc: "생년월일(사주)만으로는 알 수 없는 기운이 지역에 있습니다. 부족한 오행을 고향이 보완하거나 약화시킬 수 있습니다.",
  },
  {
    icon: "🔗",
    title: "이름·사주·고향 3박자",
    desc: "이름 한자 + 생년월일 + 태생지가 맞물리면 '뿌리·이름·운명'이 한 줄로 연결됩니다.",
  },
  {
    icon: "🧭",
    title: "앞으로 어느 방향이 열리는지",
    desc: "고향의 방위는 미래에 유리한 활동 방향·거주지·이직·창업 방향의 힌트가 됩니다.",
  },
] as const;

/** 태어난 지역이 왜 중요한지 — 4가지 이유 인포그래픽 */
export default function WhyRegionMatters() {
  return (
    <div className="info-chart">
      <p className="mb-3 text-center text-xs font-semibold text-neutral-700">왜 태어난 지역이 중요할까요?</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {REASONS.map((r) => (
          <div
            key={r.title}
            className="flex gap-3 rounded-xl border border-neutral-100 bg-white p-3"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-50 text-xl">
              {r.icon}
            </span>
            <div>
              <p className="text-xs font-semibold text-neutral-900">{r.title}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-neutral-500">{r.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
