"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import BrushText from "@/components/musok/BrushText";
import { calcAge, isPastStage, stageForAge } from "@/lib/future-fortune";
import type { LifeStageKey } from "@/lib/future-fortune";
import { GIL_MUSOK, musok81Verse, SAGYEOK_MUSOK } from "@/lib/musok-copy";
import type { SagyeokGrid } from "@/lib/seongmyung";

function HanjiCard({
  grid,
  index,
  isCurrent,
  isPast,
}: {
  grid: SagyeokGrid;
  index: number;
  isCurrent: boolean;
  isPast: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const meta = SAGYEOK_MUSOK[grid.key as keyof typeof SAGYEOK_MUSOK];
  const isHyung = grid.key === "hyung";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: isPast ? 0.55 : 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`mk-card mk-hanji p-5 sm:p-6 ${isHyung ? "mk-card-hyung" : ""} ${isCurrent ? "mk-card-current" : ""}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        {isCurrent && <span className="mk-tag">현재</span>}
        {isHyung && <span className="mk-tag mk-tag-gil">주운</span>}
        <span className="font-musok text-lg text-[var(--mk-ivory)]">{meta.title}</span>
        <span className="text-xs text-[var(--mk-cinnabar-soft)]">{meta.folk}</span>
      </div>
      <p className="mt-1 text-xs text-[var(--mk-ivory-muted)]">{meta.epoch}</p>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-musok text-3xl text-[var(--mk-ivory)]">{grid.suri}</span>
        <span className="text-sm text-[var(--mk-ivory-dim)]">수 · {grid.gridName}</span>
        <span className="mk-tag text-[10px]">{GIL_MUSOK[grid.gilHeung]}</span>
      </div>

      <BrushText text={meta.verse} className="mt-4 text-sm leading-relaxed text-[var(--mk-ivory-dim)]" />
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-3 text-sm leading-relaxed text-[var(--mk-ivory-muted)]"
      >
        {musok81Verse(grid.gilHeung, grid.gridName)}
      </motion.p>
      <p className="mt-2 text-[10px] text-[var(--mk-ivory-muted)]">{grid.formula}</p>
    </motion.div>
  );
}

/** 사격 타임라인 — 한지 카드 슬라이드인 */
export default function HanjiTimeline({
  grids,
  birthYear,
  birthMonth,
  birthDay,
}: {
  grids: SagyeokGrid[];
  birthYear?: number;
  birthMonth?: number;
  birthDay?: number;
}) {
  const age =
    birthYear && birthMonth && birthDay
      ? calcAge({ year: birthYear, month: birthMonth, day: birthDay })
      : undefined;
  const currentStageKey = age !== undefined ? stageForAge(age) : undefined;

  return (
    <div className="space-y-4">
      <div>
        <p className="mk-kicker">사격(四格) · 명줄의 네 시기</p>
        <p className="mt-2 text-sm text-[var(--mk-ivory-dim)]">
          형격(形格) · 명줄의 중심을 중심으로 읽으십시오
        </p>
      </div>
      <div className="space-y-4">
        {grids.map((g, i) => (
          <HanjiCard
            key={g.key}
            grid={g}
            index={i}
            isCurrent={g.key === currentStageKey}
            isPast={currentStageKey ? isPastStage(g.key as LifeStageKey, currentStageKey) : false}
          />
        ))}
      </div>
    </div>
  );
}
