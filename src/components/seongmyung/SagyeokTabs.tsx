"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { SagyeokGrid } from "@/lib/seongmyung";

function Badge({ gilHeung }: { gilHeung: SagyeokGrid["gilHeung"] }) {
  const cls =
    gilHeung === "길"
      ? "bg-emerald-50 text-emerald-700"
      : gilHeung === "흉"
        ? "bg-rose-50 text-rose-700"
        : "bg-gray-100 text-gray-600";
  return <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${cls}`}>{gilHeung}</span>;
}

export default function SagyeokTabs({ grids }: { grids: SagyeokGrid[] }) {
  const [active, setActive] = useState(0);
  const g = grids[active];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-white p-5 ring-1 ring-gray-100"
    >
      <h3 className="mb-4 text-sm font-semibold text-gray-900">사격(四格) 운세 타임라인</h3>

      <div className="mb-5 flex gap-1 rounded-xl bg-gray-100 p-1">
        {grids.map((grid, i) => (
          <button
            key={grid.key}
            type="button"
            onClick={() => setActive(i)}
            className={`flex-1 rounded-lg py-2 text-xs font-medium transition ${
              active === i ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {grid.label}
          </button>
        ))}
      </div>

      <motion.div
        key={g.key}
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">
            {g.suri}수 · {g.gridName}
          </span>
          <Badge gilHeung={g.gilHeung} />
        </div>
        <p className="mb-1 text-xs text-gray-400">{g.period}</p>
        <p className="text-sm leading-relaxed text-gray-600">{g.description}</p>
        <p className="mt-3 text-xs text-gray-400">획수 합 {g.rawSum} → 81수리 {g.suri}수</p>
      </motion.div>

      <div className="relative mt-6 space-y-0 pl-4 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-gray-200">
        {grids.map((grid, i) => (
          <div key={grid.key} className="relative flex gap-3 pb-4 last:pb-0">
            <span
              className={`relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full ring-2 ring-white ${
                i === active ? "bg-gray-900" : "bg-gray-300"
              }`}
            />
            <div>
              <p className={`text-xs font-medium ${i === active ? "text-gray-900" : "text-gray-400"}`}>
                {grid.label} · {grid.suri}수 {grid.gridName}
              </p>
              <p className="text-[10px] text-gray-400">{grid.period}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
