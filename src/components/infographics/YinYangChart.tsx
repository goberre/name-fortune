"use client";

import { motion } from "framer-motion";
import type { YinYang } from "@/lib/seongmyung";

/** 음양 균형 인포그래픽 */
export default function YinYangChart({ pattern }: { pattern: YinYang[] }) {
  const yang = pattern.filter((p) => p === "양").length;
  const yin = pattern.filter((p) => p === "음").length;
  const yangPct = pattern.length ? (yang / pattern.length) * 100 : 50;

  return (
    <div className="info-chart">
      <div className="flex items-center justify-center gap-6">
        <div className="relative h-20 w-20">
          <svg viewBox="0 0 80 80" className="h-full w-full">
            <circle cx="40" cy="40" r="38" fill="#f5f5f5" stroke="#e5e5e5" />
            <path d="M40 2 A38 38 0 0 1 40 78 A19 19 0 0 1 40 40 A19 19 0 0 0 40 2" fill="#171717" />
            <circle cx="40" cy="21" r="5" fill="#fff" />
            <circle cx="40" cy="59" r="5" fill="#171717" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="mb-1 flex justify-between text-xs font-medium">
            <span className="text-neutral-900">양(陽) {yang}</span>
            <span className="text-neutral-500">음(陰) {yin}</span>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-neutral-200">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-neutral-900"
              initial={{ width: 0 }}
              animate={{ width: `${yangPct}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <p className="mt-2 text-[10px] text-neutral-500">
            {yang > yin
              ? "양 기운이 많음 → 적극적·외향적 성향"
              : yang < yin
                ? "음 기운이 많음 → 신중·내면적 성향"
                : "음양 균형 → 조화로운 성향"}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {pattern.map((p, i) => (
          <span
            key={i}
            className={`rounded-lg px-2 py-1 text-[10px] font-semibold ${
              p === "양" ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-600"
            }`}
          >
            {i + 1}번째 {p}
          </span>
        ))}
      </div>
    </div>
  );
}
