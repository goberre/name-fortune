"use client";

import { useEffect, useState } from "react";
import GuaFrame from "@/components/musok/GuaFrame";

const PHASES = [
  "사주 선천운을 펼치는 중…",
  "신수 명통을 여는 중…",
] as const;

const PHASE_MS = 180;
const DONE_MS = PHASE_MS * PHASES.length + 120;

export default function MusokLoader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = PHASES.map((_, i) => window.setTimeout(() => setPhase(i), i * PHASE_MS));
    const done = window.setTimeout(onComplete, DONE_MS);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <div className="mk-loader flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
      <GuaFrame />
      <p className="mt-8 text-sm tracking-widest text-[var(--mk-ivory-dim)]">{PHASES[phase]}</p>
      <div className="mt-6 flex gap-2">
        {PHASES.map((_, i) => (
          <span
            key={i}
            className={`h-1 w-8 transition-colors duration-300 ${i <= phase ? "bg-[var(--mk-cinnabar)]" : "bg-[var(--mk-border)]"}`}
          />
        ))}
      </div>
    </div>
  );
}
