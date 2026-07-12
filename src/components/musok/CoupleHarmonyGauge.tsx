"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { COUPLE_GRADE, coupleScoreLabel } from "@/lib/compatibility-copy";

export default function CoupleHarmonyGauge({
  score,
  grade,
  nameA,
  hanjaA,
  nameB,
  hanjaB,
}: {
  score: number;
  grade: string;
  nameA: string;
  hanjaA: string;
  nameB: string;
  hanjaB: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const dur = 1600;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setDisplay(Math.round(score * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  return (
    <div className="mk-card mk-card-elevated p-5 text-center sm:p-8 md:p-10">
      <p className="mk-kicker">신수 쌍통도 (身數 雙通圖)</p>

      <div className="mt-6 flex flex-col items-stretch gap-5 sm:flex-row sm:items-center sm:justify-center sm:gap-8">
        <div className="min-w-0 text-center">
          <p className="font-musok break-keep text-lg text-[var(--mk-ivory)] sm:text-2xl">{nameA}</p>
          <p className="font-musok text-sm text-[var(--mk-cinnabar-soft)]">{hanjaA}</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-musok text-2xl text-[var(--mk-obang)]">合</span>
          <span className="mt-1 text-[10px] text-[var(--mk-ivory-muted)]">궁합</span>
        </div>
        <div className="min-w-0 text-center">
          <p className="font-musok break-keep text-lg text-[var(--mk-ivory)] sm:text-2xl">{nameB}</p>
          <p className="font-musok text-sm text-[var(--mk-cinnabar-soft)]">{hanjaB}</p>
        </div>
      </div>

      <div className="relative mx-auto mt-10 max-w-xs">
        <svg viewBox="0 0 280 100" className="w-full" aria-hidden>
          <line x1="30" y1="50" x2="250" y2="50" stroke="var(--mk-border)" strokeWidth="1" />
          <motion.line
            x1="30"
            y1="50"
            x2="250"
            y2="50"
            stroke="var(--mk-cinnabar)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: display / 100 }}
            transition={{ duration: 1.6 }}
          />
          <circle cx="30" cy="50" r="6" fill="var(--mk-cinnabar)" opacity="0.8" />
          <circle cx="250" cy="50" r="6" fill="var(--mk-cinnabar)" opacity="0.8" />
          <text x="140" y="28" textAnchor="middle" fill="var(--mk-ivory-dim)" fontSize="11">
            陰 · 陽 · 合
          </text>
        </svg>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-musok text-4xl text-[var(--mk-ivory)] sm:text-5xl"
        >
          {display}
        </motion.p>
      </div>

      <p className="mt-4 text-sm text-[var(--mk-ivory-dim)]">{coupleScoreLabel(display)}</p>
      <p className="font-musok mt-2 text-lg text-[var(--mk-cinnabar-soft)]">{grade}</p>
      <p className="mt-1 text-xs text-[var(--mk-ivory-muted)]">{COUPLE_GRADE[grade] ?? grade}</p>
    </div>
  );
}
