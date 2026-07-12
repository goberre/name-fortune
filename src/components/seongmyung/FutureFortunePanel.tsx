"use client";

import { motion } from "framer-motion";
import type { FutureFortuneSummary } from "@/lib/future-fortune";

const GIL_STYLE = {
  길: "text-emerald-700 bg-emerald-50 ring-emerald-200",
  흉: "text-rose-700 bg-rose-50 ring-rose-200",
  평: "text-neutral-600 bg-neutral-100 ring-neutral-200",
} as const;

/** 미래 운세 하이라이트 패널 */
export default function FutureFortunePanel({ fortune }: { fortune: FutureFortuneSummary }) {
  const futureOnly = fortune.upcomingStages.filter((s) => !s.isPast);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="ap-card overflow-hidden"
    >
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 px-6 py-5 text-white sm:px-8">
        <p className="text-xs font-medium text-neutral-400">미래 운세 · 앞으로 펼쳐질 흐름</p>
        <p className="mt-2 text-lg font-semibold leading-snug sm:text-xl">{fortune.focusMessage}</p>
        <div className="mt-4 flex items-center gap-4">
          <div>
            <p className="text-3xl font-bold">{fortune.futureScore}</p>
            <p className="text-[10px] text-neutral-400">미래 운세 점수</p>
          </div>
          <div className="h-10 w-px bg-neutral-600" />
          <div>
            <p className="text-sm font-medium">현재 {fortune.currentAge}세</p>
            <p className="text-xs text-neutral-400">{fortune.currentStageLabel} 운 진행 중</p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <p className="mb-4 text-xs font-semibold text-neutral-500">지금부터 앞으로의 운세 타임라인</p>
        <div className="space-y-3">
          {futureOnly.map((s) => (
            <div
              key={s.key}
              className={`rounded-xl border p-4 ${
                s.isCurrent
                  ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900"
                  : "border-neutral-100 bg-white"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                {s.isCurrent && (
                  <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-bold text-white">
                    지금
                  </span>
                )}
                {!s.isCurrent && s.yearsUntil !== undefined && s.yearsUntil > 0 && (
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700">
                    {s.yearsUntil}년 후
                  </span>
                )}
                <span className="text-sm font-semibold text-neutral-900">
                  {s.label} · {s.period}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${GIL_STYLE[s.gilHeung]}`}>
                  {s.gilHeung}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{s.headline}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-neutral-400">
          과거(어린 시절) 운세는 참고용입니다. 아래 사격 타임라인에서 자세히 확인할 수 있습니다.
        </p>
      </div>
    </motion.div>
  );
}
