"use client";

import { motion } from "framer-motion";
import { OhengBadge } from "@/components/seongmyung/HanjaPicker";
import type { SourceOhengHarmony } from "@/lib/saju";
import type { SajuOhengProfile } from "@/lib/saju";
import type { Oheng } from "@/lib/seongmyung";

export default function OhengHarmonyPanel({
  saju,
  nameOheng,
  harmony,
}: {
  saju: SajuOhengProfile;
  nameOheng: Oheng[];
  harmony: SourceOhengHarmony;
}) {
  const statusColor =
    harmony.gilHeung === "길"
      ? "text-emerald-600 bg-emerald-50"
      : harmony.gilHeung === "흉"
        ? "text-rose-600 bg-rose-50"
        : "text-neutral-600 bg-neutral-100";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="ap-card p-6"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">자원오행 · 사주 조화</h3>
          <p className="mt-1 text-sm text-neutral-500">한자의 기운이 사주와 어떻게 맞는지</p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}>
          {harmony.gilHeung}
        </span>
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-400">사주 오행</p>
          <div className="flex flex-wrap gap-2">
            <OhengBadge oheng={saju.yearOheng} />
            <OhengBadge oheng={saju.monthOheng} />
            <OhengBadge oheng={saju.dayOheng} />
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-400">이름 한자 오행</p>
          <div className="flex flex-wrap gap-2">
            {nameOheng.map((o, i) => (
              <OhengBadge key={i} oheng={o} />
            ))}
          </div>
        </div>
      </div>

      {harmony.fillsLacking.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {harmony.fillsLacking.map((o) => (
            <span
              key={o}
              className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200"
            >
              {o} 기운 보완 ✓
            </span>
          ))}
        </div>
      )}

      <p className="text-sm leading-relaxed text-neutral-600">{harmony.summary}</p>
    </motion.div>
  );
}
