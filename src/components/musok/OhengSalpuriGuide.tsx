"use client";

import { motion } from "framer-motion";
import BrushText from "@/components/musok/BrushText";
import { musokHarmonyNarrative, OHENG_OBANG } from "@/lib/musok-copy";
import type { SajuOhengProfile, SourceOhengHarmony } from "@/lib/saju";
import type { Oheng } from "@/lib/seongmyung";

const ORDER: Oheng[] = ["목", "화", "토", "금", "수"];

/** 오행 살풀이 및 상생 가이드 */
export default function OhengSalpuriGuide({
  saju,
  nameOheng,
  harmony,
}: {
  saju: SajuOhengProfile;
  nameOheng: Oheng[];
  harmony: SourceOhengHarmony;
}) {
  const narrative = musokHarmonyNarrative(harmony, saju.lacking);
  const max = Math.max(...ORDER.map((o) => saju.distribution[o]), 1);

  return (
    <div className="mk-card p-4 sm:p-6 md:p-8">
      <p className="mk-kicker">오행 살풀이 · 상생 가이드</p>
      <p className="mt-2 text-sm text-[var(--mk-ivory-dim)]">비보(裨補)의 원리 — 이름이 사주의 공허를 메웁니다</p>

      <div className="mt-6 -mx-1 overflow-x-auto px-1 sm:mx-0 sm:overflow-visible sm:px-0">
        <div className="flex min-w-[220px] justify-center gap-1.5 sm:gap-3">
        {ORDER.map((o) => {
          const ob = OHENG_OBANG[o];
          const count = saju.distribution[o];
          const filled = harmony.fillsLacking.includes(o);
          const inName = nameOheng.includes(o);
          return (
            <div key={o} className="flex shrink-0 flex-col items-center gap-1.5 sm:gap-2">
              <div className="flex h-20 w-7 items-end justify-center border border-[var(--mk-border)] bg-[var(--mk-charcoal-light)] sm:h-24 sm:w-10">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(count / max) * 100}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="w-full min-h-[4px]"
                  style={{ backgroundColor: ob.color, opacity: count > 0 ? 0.85 : 0.2 }}
                />
              </div>
              <span className="text-[10px] sm:text-xs" style={{ color: ob.color }}>
                {o}
              </span>
              <span className="text-[10px] text-[var(--mk-ivory-muted)]">{ob.label}</span>
              {filled && <span className="text-[10px] text-[var(--mk-cinnabar-soft)]">비보</span>}
              {inName && !filled && <span className="text-[10px] text-[var(--mk-ivory-dim)]">名</span>}
            </div>
          );
        })}
        </div>
      </div>

      <div className="mt-6 border-t border-[var(--mk-border)] pt-5">
        <BrushText text={narrative} className="text-sm leading-relaxed text-[var(--mk-ivory-dim)]" />
      </div>

      {(harmony.fillsLacking.length > 0 || harmony.matchesUseful.length > 0) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {harmony.fillsLacking.map((o) => (
            <span key={o} className="mk-tag mk-tag-gil">
              {o}행 살풀이
            </span>
          ))}
          {harmony.matchesUseful.map((o) => (
            <span key={o} className="mk-tag">
              희신 {o}행
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
