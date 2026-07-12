"use client";

import { motion } from "framer-motion";
import { OhengBadge } from "@/components/seongmyung/HanjaPicker";
import type { BirthRegionAnalysis } from "@/lib/birth-region";

const DIRECTION_LABEL = { 동: "동쪽", 서: "서쪽", 남: "남쪽", 북: "북쪽", 중: "중앙" } as const;

export default function BirthRegionPanel({ analysis }: { analysis: BirthRegionAnalysis }) {
  const { region, gilHeung, matchScore } = analysis;
  const statusColor =
    gilHeung === "길"
      ? "text-emerald-600 bg-emerald-50"
      : gilHeung === "흉"
        ? "text-rose-600 bg-rose-50"
        : "text-neutral-600 bg-neutral-100";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="ap-card p-6"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">태생지 · 지기(地氣) 분석</h3>
          <p className="mt-1 text-sm text-neutral-500">태어난 지역의 방위·지형 기운이 이름과 사주에 미치는 영향</p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}>
          {gilHeung}
        </span>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-neutral-900 px-3 py-1 text-sm font-medium text-white">{region.label}</span>
        <span className="text-sm text-neutral-500">{DIRECTION_LABEL[region.direction]} · {region.terrain}</span>
        <OhengBadge oheng={region.oheng} />
      </div>

      <div className="mb-5">
        <div className="mb-2 flex justify-between text-xs text-neutral-500">
          <span>태생지 조화 점수</span>
          <span className="font-semibold text-neutral-900">{matchScore}점</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
          <motion.div
            className="h-full rounded-full bg-neutral-900"
            initial={{ width: 0 }}
            animate={{ width: `${matchScore}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="space-y-3 rounded-xl bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-600">
        <p>{analysis.terrainGuide}</p>
        <p>{analysis.directionGuide}</p>
      </div>

      {(analysis.fillsLacking.length > 0 || analysis.matchesUseful.length > 0) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {analysis.fillsLacking.map((o) => (
            <span
              key={`region-fill-${o}`}
              className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200"
            >
              고향 {o}행 → 사주 보완
            </span>
          ))}
          {analysis.matchesUseful.map((o) => (
            <span
              key={`region-use-${o}`}
              className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-200"
            >
              고향 {o}행 → 희신 일치
            </span>
          ))}
        </div>
      )}

      <p className="mt-4 text-sm leading-relaxed text-neutral-700">{analysis.summary}</p>
    </motion.div>
  );
}
