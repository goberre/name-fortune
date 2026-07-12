"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { GIL_OCCULT, occult81Narrative, SAGYEOK_OCCULT } from "@/lib/occult-copy";
import { calcAge, isPastStage, stageForAge } from "@/lib/future-fortune";
import type { LifeStageKey } from "@/lib/future-fortune";
import type { SagyeokGrid } from "@/lib/seongmyung";

function TarotCard({ grid, index, isPast }: { grid: SagyeokGrid; index: number; isPast: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [flipped, setFlipped] = useState(false);
  const meta = SAGYEOK_OCCULT[grid.key as keyof typeof SAGYEOK_OCCULT];
  const isHyung = grid.key === "hyung";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: isPast ? 0.45 : 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.7 }}
      className="perspective-[1200px]"
      style={{ perspective: 1200 }}
    >
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className={`oc-tarot-card relative h-64 w-full ${isHyung ? "oc-tarot-hyung" : ""}`}
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : inView ? "rotateY(0deg)" : "rotateY(90deg)",
          transition: "transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* front */}
        <div
          className="oc-card absolute inset-0 flex flex-col items-center justify-center p-5 backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="text-[10px] tracking-[0.3em] text-red-400/60">{meta.hanja}</p>
          <p className="font-occult mt-2 text-2xl text-white">{meta.title}</p>
          <p className="mt-1 text-xs text-indigo-300/50">{meta.epoch}</p>
          {isHyung && <span className="mt-3 text-[10px] text-red-300">★ 주운</span>}
          <p className="mt-4 text-[10px] text-white/30">탭하여 해독</p>
        </div>
        {/* back */}
        <div
          className="oc-card absolute inset-0 flex flex-col justify-between p-5 text-left backface-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="oc-badge oc-badge-gil">{GIL_OCCULT[grid.gilHeung]}</span>
              <span className="text-xs text-white/40">{grid.suri}수 · {grid.gridName}</span>
            </div>
            <p className="font-occult mt-3 text-sm italic leading-relaxed text-red-200/80">{meta.archetype}</p>
          </div>
          <div>
            <p className="text-xs leading-relaxed text-white/55">{meta.verse}</p>
            <p className="mt-2 text-[11px] text-indigo-300/50">{occult81Narrative(grid.gilHeung, grid.gridName)}</p>
            <p className="mt-2 text-[10px] text-white/25">{grid.formula}</p>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

export default function TarotTimeline({
  grids,
  birthYear,
  birthMonth,
  birthDay,
}: {
  grids: SagyeokGrid[];
  birthYear?: number;
  birthMonth?: number;
  birthDay?: number;
}) {
  const age =
    birthYear && birthMonth && birthDay
      ? calcAge({ year: birthYear, month: birthMonth, day: birthDay })
      : undefined;
  const currentStageKey = age !== undefined ? stageForAge(age) : undefined;

  return (
    <div className="space-y-4">
      <div>
        <p className="oc-kicker">사격 · 운명의 네 장</p>
        <p className="mt-2 text-sm text-white/45">
          {age !== undefined
            ? `현재 ${age}세 — 카드를 뒤집어 앞으로의 궤적을 읽으십시오`
            : "타로처럼 카드를 뒤집어 사격을 해독하십시오"}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {grids.map((g, i) => (
          <div key={g.key} className="relative">
            {g.key === currentStageKey && (
              <span className="absolute -top-2 left-3 z-10 rounded bg-indigo-600/80 px-2 py-0.5 text-[9px] font-bold text-white">
                NOW
              </span>
            )}
            <TarotCard
              grid={g}
              index={i}
              isPast={currentStageKey ? isPastStage(g.key as LifeStageKey, currentStageKey) : false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
