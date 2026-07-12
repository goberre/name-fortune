"use client";

import type { LifeStageKey } from "@/lib/future-fortune";
import { isPastStage } from "@/lib/future-fortune";
import type { SagyeokGrid } from "@/lib/seongmyung";

const STAGE = {
  won: { emoji: "🌱", age: "1~20세", short: "어릴 때" },
  hyung: { emoji: "⭐", age: "21~40세", short: "청년·주운" },
  i: { emoji: "🏠", age: "41~60세", short: "중년" },
  jeong: { emoji: "🌅", age: "61세~", short: "말년" },
} as const;

const GIL_COLOR = { 길: "#34c759", 흉: "#ff3b30", 평: "#8e8e93" } as const;

/** 인생 4단계 — 미래 중심 타임라인 */
export default function SagyeokLifeChart({
  grids,
  activeKey,
  currentStage,
  onSelect,
}: {
  grids: SagyeokGrid[];
  activeKey: string;
  currentStage?: LifeStageKey;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="info-chart">
      <div className="relative mt-2">
        <div className="absolute left-[8%] right-[8%] top-1/2 h-1 -translate-y-1/2 rounded-full bg-neutral-200" />
        {/* 미래 방향 화살표 */}
        <div className="absolute right-[4%] top-1/2 -translate-y-1/2 text-[10px] font-medium text-sky-600">
          미래 →
        </div>
        <div className="relative grid grid-cols-4 gap-1">
          {grids.map((g, i) => {
            const s = STAGE[g.key as keyof typeof STAGE];
            const isActive = g.key === activeKey;
            const isPast = currentStage ? isPastStage(g.key as LifeStageKey, currentStage) : false;
            const isCurrent = g.key === currentStage;
            const color = GIL_COLOR[g.gilHeung];
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => onSelect(i)}
                className={`group flex flex-col items-center gap-1.5 px-1 py-2 text-center transition ${
                  isPast ? "opacity-40" : ""
                }`}
              >
                <span
                  className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl text-lg transition ${
                    isActive ? "scale-110 shadow-md ring-2 ring-neutral-900 ring-offset-2" : "shadow-sm"
                  } ${isCurrent ? "ring-2 ring-sky-500 ring-offset-1" : ""}`}
                  style={{ backgroundColor: isActive ? color + "22" : "#f5f5f5" }}
                >
                  {s.emoji}
                  {g.key === "hyung" && (
                    <span className="absolute -right-1 -top-1 text-[10px]">★</span>
                  )}
                  {isCurrent && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-sky-600 px-1 text-[8px] font-bold text-white">
                      지금
                    </span>
                  )}
                </span>
                <span className={`text-xs font-semibold ${isActive ? "text-neutral-900" : "text-neutral-500"}`}>
                  {s.short}
                </span>
                <span className="text-[10px] text-neutral-400">{s.age}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{ color, backgroundColor: color + "18" }}
                >
                  {g.gilHeung}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-neutral-500">
        <span className="text-neutral-400">왼쪽(과거)</span> →{" "}
        <strong className="text-neutral-800">오른쪽(미래)</strong> 순입니다. 형격(★)과 지금·앞으로의 운을
        중점적으로 보세요.
      </p>
    </div>
  );
}
