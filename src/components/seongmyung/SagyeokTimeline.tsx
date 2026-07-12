"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { GilHeung, SagyeokGrid } from "@/lib/seongmyung";

function StatusBadge({ gilHeung }: { gilHeung: GilHeung }) {
  const cls =
    gilHeung === "길"
      ? "bg-emerald-50 text-emerald-700"
      : gilHeung === "흉"
        ? "bg-rose-50 text-rose-700"
        : "bg-neutral-100 text-neutral-600";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{gilHeung}</span>;
}

const PERIOD_HINT: Record<string, string> = {
  won: "성장기 · 전반적인 기초운",
  hyung: "인생의 주운 · 가장 큰 영향력",
  i: "사회적 성취 · 가정을 이끄는 운",
  jeong: "인생 총운 · 최종 결실",
};

export default function SagyeokTimeline({ grids }: { grids: SagyeokGrid[] }) {
  const [active, setActive] = useState(0);
  const g = grids[active];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="ap-card p-6 sm:p-8"
    >
      <h3 className="text-base font-semibold text-neutral-900">사격 운세 타임라인</h3>
      <p className="mt-1 text-sm text-neutral-500">원획법 획수 기반 81수리 · 원·형·이·정격</p>

      <div className="mt-6 flex gap-1 rounded-xl bg-neutral-100 p-1">
        {grids.map((grid, i) => (
          <button
            key={grid.key}
            type="button"
            onClick={() => setActive(i)}
            className={`flex-1 rounded-lg py-2.5 text-xs font-medium transition sm:text-sm ${
              active === i ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {grid.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={g.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mt-6 rounded-2xl border border-neutral-100 bg-neutral-50/80 p-5"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xl font-semibold text-neutral-900">{g.label}</span>
            <StatusBadge gilHeung={g.gilHeung} />
          </div>
          <p className="mt-1 text-xs text-neutral-400">{g.period}</p>
          <p className="text-xs font-medium text-neutral-500">{PERIOD_HINT[g.key]}</p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-semibold tracking-tight text-neutral-900">{g.suri}</span>
            <span className="text-sm text-neutral-500">수 · {g.gridName}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">{g.description}</p>
          <p className="mt-2 text-xs text-neutral-400">
            획수 합 {g.rawSum} → 81수리 {g.suri}수
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="relative mt-8 space-y-0 pl-6 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-px before:bg-neutral-200">
        {grids.map((grid, i) => (
          <button
            key={grid.key}
            type="button"
            onClick={() => setActive(i)}
            className="group relative flex w-full gap-3 pb-6 text-left last:pb-0"
          >
            <span
              className={`absolute -left-6 top-1 z-10 h-[10px] w-[10px] shrink-0 rounded-full transition ${
                i === active ? "bg-neutral-900 ring-2 ring-neutral-900 ring-offset-2" : "bg-white ring-2 ring-neutral-300"
              }`}
            />
            <div>
              <p className={`text-sm font-medium ${i === active ? "text-neutral-900" : "text-neutral-400"}`}>
                {grid.label} · {grid.suri}수 {grid.gridName}
              </p>
              <p className="text-xs text-neutral-400">{grid.period}</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
