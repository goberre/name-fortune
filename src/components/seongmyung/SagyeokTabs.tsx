"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { GilHeung, SagyeokGrid } from "@/lib/seongmyung";

function Badge({ gilHeung }: { gilHeung: GilHeung }) {
  if (gilHeung === "길") return <span className="nf-badge-gil">{gilHeung}</span>;
  if (gilHeung === "흉") return <span className="nf-badge-heung">{gilHeung}</span>;
  return <span className="nf-badge-pyeong">{gilHeung}</span>;
}

export default function SagyeokTabs({ grids }: { grids: SagyeokGrid[] }) {
  const [active, setActive] = useState(0);
  const g = grids[active];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="nf-card p-5"
    >
      <h3 className="mb-4 text-sm font-semibold text-violet-200">사격 운세 타임라인</h3>

      <div className="mb-5 flex gap-1 rounded-xl bg-black/40 p-1">
        {grids.map((grid, i) => (
          <button
            key={grid.key}
            type="button"
            onClick={() => setActive(i)}
            className={`flex-1 rounded-lg py-2 text-xs font-medium transition ${
              active === i
                ? "bg-violet-600/40 text-violet-100 shadow-sm"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            {grid.label}
          </button>
        ))}
      </div>

      <motion.div key={g.key} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="text-lg font-semibold text-white">
            {g.suri}수 · {g.gridName}
          </span>
          <Badge gilHeung={g.gilHeung} />
        </div>
        <p className="mb-1 text-xs text-violet-300/50">{g.period}</p>
        <p className="text-sm leading-relaxed text-white/55">{g.description}</p>
        <p className="mt-3 text-xs text-white/30">획수 합 {g.rawSum} → 81수리 {g.suri}수</p>
      </motion.div>

      <div className="relative mt-6 space-y-0 pl-4 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-violet-500/20">
        {grids.map((grid, i) => (
          <div key={grid.key} className="relative flex gap-3 pb-4 last:pb-0">
            <span
              className={`relative z-10 mt-1 h-3 w-3 shrink-0 rounded-full ${
                i === active ? "bg-violet-400 shadow-[0_0_8px_#a78bfa]" : "bg-white/20"
              }`}
            />
            <div>
              <p className={`text-xs font-medium ${i === active ? "text-violet-200" : "text-white/35"}`}>
                {grid.label} · {grid.suri}수
              </p>
              <p className="text-[10px] text-white/25">{grid.period}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
