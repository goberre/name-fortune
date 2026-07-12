"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GRADE_OCCULT, resonanceLabel } from "@/lib/occult-copy";

export default function ResonanceMatrix({
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
    const dur = 2200;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setDisplay(Math.round(score * (1 - Math.pow(1 - p, 4))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  return (
    <div className="oc-card oc-card-glow relative overflow-hidden p-8 text-center sm:p-12">
      <p className="oc-kicker">Resonance Matrix</p>
      <p className="font-occult mt-4 text-4xl tracking-[0.2em] text-white sm:text-5xl">{name}</p>
      <p className="font-occult mt-2 text-2xl text-red-300/80">{hanja}</p>

      <div className="relative mx-auto mt-10 flex h-56 w-56 items-center justify-center">
        <motion.svg
          viewBox="0 0 200 200"
          className="absolute h-full w-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
        >
          <polygon
            points="100,12 188,68 152,168 48,168 12,68"
            fill="none"
            stroke="rgba(127,29,29,0.35)"
            strokeWidth="0.8"
          />
          <polygon
            points="100,28 168,72 140,152 60,152 32,72"
            fill="none"
            stroke="rgba(99,102,241,0.25)"
            strokeWidth="0.5"
            strokeDasharray="3 5"
          />
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i * 60 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1="100"
                y1="100"
                x2={100 + 88 * Math.cos(a - Math.PI / 2)}
                y2={100 + 88 * Math.sin(a - Math.PI / 2)}
                stroke="rgba(220,38,38,0.12)"
                strokeWidth="0.5"
              />
            );
          })}
        </motion.svg>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative z-10"
        >
          <p className="font-occult text-6xl font-light text-white">{display}</p>
          <p className="mt-1 text-[10px] tracking-[0.25em] text-indigo-300/60">RESONANCE</p>
        </motion.div>
      </div>

      <p className="mt-6 text-sm tracking-wide text-red-200/80">{resonanceLabel(display)}</p>
      <p className="mt-2 font-occult text-lg text-indigo-200/90">{grade}</p>
      <p className="mt-1 text-xs text-white/40">{GRADE_OCCULT[grade] ?? grade}</p>
    </div>
  );
}
