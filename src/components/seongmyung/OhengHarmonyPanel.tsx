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
          <p className="mt-1 text-sm text-neutral-500">한자 기운이 사주를 보완하는지 분석</p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}>
          {harmony.gilHeung}
        </span>
      </div>

      <div className="mb-5">
        <div className="mb-2 flex justify-between text-xs text-neutral-500">
          <span>사주 매칭 점수</span>
          <span className="font-semibold text-neutral-900">{harmony.matchScore}점</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
          <motion.div
            className="h-full rounded-full bg-neutral-900"
            initial={{ width: 0 }}
            animate={{ width: `${harmony.matchScore}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-400">사주 오행</p>
          <div className="flex flex-wrap gap-2">
            <OhengBadge oheng={saju.yearOheng} />
            <OhengBadge oheng={saju.monthOheng} />
            <OhengBadge oheng={saju.dayOheng} />
            {saju.hourOheng && <OhengBadge oheng={saju.hourOheng} />}
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

      {(harmony.fillsLacking.length > 0 || harmony.matchesUseful.length > 0) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {harmony.fillsLacking.map((o) => (
            <span
              key={`fill-${o}`}
              className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200"
            >
              {o}행 보완
            </span>
          ))}
          {harmony.matchesUseful.map((o) => (
            <span
              key={`use-${o}`}
              className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-200"
            >
              희신 {o}행
            </span>
          ))}
        </div>
      )}

      {saju.calendarNote && (
        <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">{saju.calendarNote}</p>
      )}

      <p className="text-sm leading-relaxed text-neutral-600">{harmony.summary}</p>
    </motion.div>
  );
}
