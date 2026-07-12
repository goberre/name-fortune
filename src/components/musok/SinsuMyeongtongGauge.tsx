"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GRADE_MUSOK, sinsuLabel } from "@/lib/musok-copy";

/** 신수 명통도 — 천지인 선형 인포그래픽 */
export default function SinsuMyeongtongGauge({
  score,
  grade,
  name,
  hanja,
}: {
  score: number;
  grade: string;
  name: string;
  hanja: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const dur = 2000;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setDisplay(Math.round(score * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  return (
    <div className="mk-card mk-card-elevated p-8 text-center sm:p-10">
      <p className="mk-kicker">신수 명통도</p>
      <p className="font-musok mt-4 text-3xl tracking-widest text-[var(--mk-ivory)] sm:text-4xl">{name}</p>
      <p className="font-musok mt-2 text-xl text-[var(--mk-cinnabar-soft)]">{hanja}</p>

      <div className="relative mx-auto mt-10 max-w-xs">
        {/* 천 · 지 · 인 */}
        <svg viewBox="0 0 280 120" className="w-full" aria-hidden>
          <text x="140" y="18" textAnchor="middle" fill="var(--mk-ivory-dim)" fontSize="11">
            天
          </text>
          <line x1="40" y1="28" x2="240" y2="28" stroke="var(--mk-border)" strokeWidth="1" />
          <motion.line
            x1="40"
            y1="28"
            x2="240"
            y2="28"
            stroke="var(--mk-cinnabar)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: display / 100 }}
            transition={{ duration: 2 }}
          />
          <text x="60" y="58" fill="var(--mk-ivory-dim)" fontSize="11">
            地
          </text>
          <text x="140" y="58" textAnchor="middle" fill="var(--mk-ivory-dim)" fontSize="11">
            人
          </text>
          <text x="220" y="58" textAnchor="end" fill="var(--mk-ivory-dim)" fontSize="11">
            名
          </text>
          <line x1="40" y1="68" x2="240" y2="68" stroke="var(--mk-border)" strokeWidth="0.5" strokeDasharray="4 4" />
          {/* 오행 상생 원 */}
          <circle cx="140" cy="95" r="18" fill="none" stroke="var(--mk-obang)" strokeWidth="1" opacity="0.6" />
        </svg>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="font-musok text-5xl text-[var(--mk-ivory)]"
        >
          {display}
        </motion.p>
      </div>

      <p className="mt-4 text-sm text-[var(--mk-ivory-dim)]">{sinsuLabel(display)}</p>
      <p className="font-musok mt-2 text-lg text-[var(--mk-cinnabar-soft)]">{grade}</p>
      <p className="mt-1 text-xs text-[var(--mk-ivory-muted)]">{GRADE_MUSOK[grade] ?? grade}</p>
    </div>
  );
}
