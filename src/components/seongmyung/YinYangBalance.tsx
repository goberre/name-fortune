"use client";

import { motion } from "framer-motion";
import type { YinYang } from "@/lib/seongmyung";

export default function YinYangBalance({ pattern }: { pattern: YinYang[] }) {
  const yang = pattern.filter((p) => p === "양").length;
  const yin = pattern.filter((p) => p === "음").length;
  const yangPct = pattern.length ? (yang / pattern.length) * 100 : 50;

  return (
    <div className="mt-4">
      <div className="mb-2 flex justify-between text-xs font-medium text-neutral-500">
        <span>양 {yang}</span>
        <span>음 {yin}</span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-neutral-100">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-neutral-800"
          initial={{ width: 0 }}
          animate={{ width: `${yangPct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-y-0 right-0 rounded-full bg-neutral-300"
          initial={{ width: 0 }}
          animate={{ width: `${100 - yangPct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {pattern.map((p, i) => (
          <span
            key={i}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
              p === "양" ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-600"
            }`}
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
