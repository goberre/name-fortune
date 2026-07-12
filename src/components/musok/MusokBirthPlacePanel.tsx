"use client";

import { motion } from "framer-motion";
import type { BirthPlaceAnalysis } from "@/lib/birth-region";
import { formatCoordinatesKorean } from "@/lib/birth-districts";

const DIRECTION_LABEL = { 동: "동쪽", 서: "서쪽", 남: "남쪽", 북: "북쪽", 중: "중앙" } as const;

export default function MusokBirthPlacePanel({ analysis }: { analysis: BirthPlaceAnalysis }) {
  const { district, gilHeung, matchScore } = analysis;
  const statusClass =
    gilHeung === "길"
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      : gilHeung === "흉"
        ? "text-[var(--mk-cinnabar-soft)] border-[var(--mk-cinnabar)]/30 bg-[var(--mk-cinnabar)]/10"
        : "text-[var(--mk-ivory-dim)] border-[var(--mk-border)] bg-[var(--mk-charcoal-light)]";

  return (
    <div className="mk-card p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="mk-kicker">태생 좌표 (生所)</p>
          <h3 className="font-musok mt-1 text-lg text-[var(--mk-ivory)]">{analysis.fullLabel}</h3>
          <p className="mt-1 font-mono text-xs text-[var(--mk-cinnabar-soft)]">{analysis.coordinateDisplay}</p>
          <p className="mt-0.5 text-[10px] text-[var(--mk-ivory-muted)]">{analysis.coordinateDisplayKo}</p>
        </div>
        <span className={`shrink-0 border px-2.5 py-1 text-xs font-medium ${statusClass}`}>{gilHeung}</span>
      </div>

      <CoordinateMiniMap lat={analysis.lat} lng={analysis.lng} />

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[var(--mk-ivory-dim)]">
        <span className="border border-[var(--mk-border)] px-2 py-0.5">{DIRECTION_LABEL[district.direction]}</span>
        <span className="border border-[var(--mk-border)] px-2 py-0.5">{district.terrain}</span>
        <span className="border border-[var(--mk-border)] px-2 py-0.5">{district.oheng}행 지기</span>
        <span className="border border-[var(--mk-border)] px-2 py-0.5">{analysis.microDirection}</span>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-[10px] text-[var(--mk-ivory-muted)]">
          <span>태생지 ↔ 명줄 조화</span>
          <span className="text-[var(--mk-ivory-dim)]">{matchScore}점</span>
        </div>
        <div className="h-1 overflow-hidden bg-[var(--mk-charcoal-light)]">
          <motion.div
            className="h-full bg-[var(--mk-cinnabar)]"
            initial={{ width: 0 }}
            animate={{ width: `${matchScore}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[var(--mk-ivory-dim)]">{analysis.summary}</p>
      <p className="mt-2 text-xs leading-relaxed text-[var(--mk-ivory-muted)]">{analysis.coordinateGuide}</p>
      <p className="mt-2 text-xs leading-relaxed text-[var(--mk-ivory-muted)]">{analysis.terrainGuide}</p>

      {(analysis.fillsLacking.length > 0 || analysis.matchesUseful.length > 0) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {analysis.fillsLacking.map((o) => (
            <span
              key={`fill-${o}`}
              className="border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400"
            >
              {o}행 지기 보완
            </span>
          ))}
          {analysis.matchesUseful.map((o) => (
            <span
              key={`use-${o}`}
              className="border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] text-sky-400"
            >
              {o}행 희신 일치
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 border-t border-[var(--mk-border)] pt-4">
        <p className="text-[10px] tracking-wider text-[var(--mk-ivory-muted)]">앞으로의 방향</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--mk-ivory-dim)]">{analysis.futureGuide}</p>
      </div>

      <ul className="mt-4 space-y-1.5">
        {analysis.whyImportant.map((line) => (
          <li key={line} className="text-[10px] leading-relaxed text-[var(--mk-ivory-muted)]">
            · {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CoordinateMiniMap({ lat, lng }: { lat: number; lng: number }) {
  const x = ((lng - 125) / 5) * 100;
  const y = ((38.5 - lat) / 5.5) * 100;
  const cx = Math.max(4, Math.min(96, x));
  const cy = Math.max(4, Math.min(96, y));

  return (
    <svg viewBox="0 0 100 100" className="mt-4 h-28 w-full opacity-80" aria-hidden>
      <rect x="0" y="0" width="100" height="100" fill="rgba(245,240,232,0.03)" stroke="var(--mk-border)" strokeWidth="0.5" />
      <ellipse cx="50" cy="48" rx="22" ry="38" fill="none" stroke="var(--mk-border)" strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r="3" fill="var(--mk-cinnabar)" />
      <circle cx={cx} cy={cy} r="6" fill="none" stroke="var(--mk-cinnabar)" strokeWidth="0.5" opacity="0.5" />
      <text x="50" y="98" textAnchor="middle" fontSize="5" fill="var(--mk-ivory-muted)">
        {formatCoordinatesKorean(lat, lng).replace("위도 ", "").replace("경도 ", " · ")}
      </text>
    </svg>
  );
}
