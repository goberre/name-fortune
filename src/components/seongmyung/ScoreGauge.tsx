"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ScoreGauge({ score, grade }: { score: number; grade: string }) {
  const [display, setDisplay] = useState(0);
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (display / 100) * c;

  useEffect(() => {
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setDisplay(Math.round(score * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <div className="relative h-40 w-40">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#e5e5e5" strokeWidth="7" />
          <motion.circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="#171717"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-semibold tracking-tight text-neutral-900">{display}</span>
          <span className="text-xs text-neutral-400">/ 100</span>
        </div>
      </div>
      <p className="mt-4 text-base font-semibold text-neutral-900">{grade}</p>
      <p className="text-xs text-neutral-500">종합 성명학 점수</p>
    </motion.div>
  );
}
