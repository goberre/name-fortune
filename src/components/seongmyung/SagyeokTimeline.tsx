"use client";

import { motion } from "framer-motion";
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
  won: "성장과 학업의 시기",
  hyung: "인생의 중심축 · 주운",
  i: "가정과 사회적 중추",
  jeong: "인생 총괄 · 말년운",
};

export default function SagyeokTimeline({ grids }: { grids: SagyeokGrid[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="ap-card p-6 sm:p-8"
    >
      <h3 className="text-base font-semibold text-neutral-900">사격 운세 타임라인</h3>
      <p className="mt-1 text-sm text-neutral-500">원획법 획수 기반 81수리 분석</p>

      <div className="relative mt-8 space-y-0 pl-6 before:absolute before:bottom-4 before:left-[11px] before:top-4 before:w-px before:bg-neutral-200">
        {grids.map((grid, i) => (
          <motion.div
            key={grid.key}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            whileHover={{ scale: 1.01 }}
            className="group relative pb-8 last:pb-0"
          >
            <span className="absolute -left-6 top-5 z-10 h-[10px] w-[10px] rounded-full bg-white ring-2 ring-neutral-300 transition group-hover:ring-neutral-900" />
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/80 p-5 transition group-hover:border-neutral-200 group-hover:bg-white group-hover:shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg font-semibold text-neutral-900">{grid.label}</span>
                <StatusBadge gilHeung={grid.gilHeung} />
              </div>
              <p className="mt-1 text-xs text-neutral-400">{grid.period}</p>
              <p className="mt-0.5 text-xs font-medium text-neutral-500">{PERIOD_HINT[grid.key]}</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-tight text-neutral-900">{grid.suri}</span>
                <span className="text-sm text-neutral-500">수 · {grid.gridName}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{grid.description}</p>
              <p className="mt-2 text-xs text-neutral-400">
                획수 합 {grid.rawSum} → 81수리 {grid.suri}수
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
