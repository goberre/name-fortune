"use client";

import { useEffect, useState } from "react";

const PHASES = [
  "촛불 하나… 켜진다",
  "이름이 어둠 속에서 떠오른다",
  "오행의 문이 열린다",
  "운명이 속삭인다",
] as const;

export default function OracleLoader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = PHASES.map((_, i) =>
      window.setTimeout(() => setPhase(i), i * 700),
    );
    const done = window.setTimeout(onComplete, PHASES.length * 700 + 400);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <div className="oracle-loader myst-result-enter flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
      <div className="oracle-eye" aria-hidden>
        <span className="oracle-pupil" />
      </div>
      <p className="oracle-phase mt-10 text-sm tracking-[0.25em] text-red-300/90">
        {PHASES[phase]}
      </p>
      <div className="oracle-dots mt-6 flex gap-2">
        {PHASES.map((_, i) => (
          <span key={i} className={`oracle-dot ${i <= phase ? "oracle-dot-on" : ""}`} />
        ))}
      </div>
      <p className="mt-8 text-xs text-white/25">눈을 떼지 마세요</p>
    </div>
  );
}
