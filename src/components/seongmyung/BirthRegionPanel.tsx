"use client";

import { motion } from "framer-motion";
import EasyTip from "@/components/infographics/EasyTip";
import KoreaRegionChart from "@/components/infographics/KoreaRegionChart";
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
          <h3 className="text-base font-semibold text-neutral-900">태생지 · 고향의 기운</h3>
          <p className="mt-1 text-sm text-neutral-500">태어난 곳의 방위와 지형이 운명의 뿌리에 미치는 영향</p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}>
          {gilHeung}
        </span>
      </div>

      <EasyTip>
        사람은 <strong>어디서 태어났는지</strong>도 중요합니다. 동쪽은 성장(목), 남쪽은 열정(화), 서쪽은
        결단(금), 중앙은 안정(토)의 기운을 받는다고 봅니다. 고향 = 인생의 &apos;뿌리&apos;입니다.
      </EasyTip>

      <div className="mt-5">
        <KoreaRegionChart region={region} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-full bg-neutral-900 px-3 py-1 text-sm font-medium text-white">{region.label}</span>
        <span className="text-sm text-neutral-500">{DIRECTION_LABEL[region.direction]} · {region.terrain}</span>
        <OhengBadge oheng={region.oheng} />
      </div>

      <div className="mb-5 mt-5">
        <div className="mb-2 flex justify-between text-xs text-neutral-500">
          <span>고향 ↔ 사주·이름 조화</span>
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

      {(analysis.fillsLacking.length > 0 || analysis.matchesUseful.length > 0) && (
        <div className="mb-4 flex flex-wrap gap-2">
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
              고향 {o}행 → 필요한 기운 일치
            </span>
          ))}
        </div>
      )}

      <p className="text-sm leading-relaxed text-neutral-700">{analysis.summary}</p>
    </motion.div>
  );
}
