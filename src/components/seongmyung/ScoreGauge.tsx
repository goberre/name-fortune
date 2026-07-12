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
    const dur = 1200;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setDisplay(Math.round(score * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center"
    >
      <div className="relative h-36 w-36">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="8" />
          <motion.circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold text-white">{display}</span>
          <span className="text-xs text-white/40">/ 100</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-violet-200">{grade}</p>
      <p className="text-xs text-white/35">종합 성명학 점수</p>
    </motion.div>
  );
}
