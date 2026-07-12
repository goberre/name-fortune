"use client";

import { motion } from "framer-motion";
import AdSlot from "@/components/monetization/AdSlot";
import CoupangSlot from "@/components/monetization/CoupangSlot";
import BrushText from "@/components/musok/BrushText";
import CoupleHarmonyGauge from "@/components/musok/CoupleHarmonyGauge";
import PremiumPaywall from "@/components/musok/PremiumPaywall";
import SurnameHanjaPanel from "@/components/musok/SurnameHanjaPanel";
import { adsConfig } from "@/config/ads";
import { gilBadgeClass } from "@/lib/compatibility-copy";
import type { CoupleCompatibilityResult } from "@/lib/compatibility";
import { MUSOK_MOTTO } from "@/lib/musok-copy";
import { relationLabel } from "@/lib/oheng-relation";

export default function CoupleMusokDashboard({
  result,
  onReset,
}: {
  result: CoupleCompatibilityResult;
  onReset: () => void;
}) {
  const { personA, personB } = result;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-8"
    >
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <CoupleHarmonyGauge
          score={result.pairScore}
          grade={result.pairGrade}
          nameA={personA.name}
          hanjaA={personA.hanjaDisplay}
          nameB={personB.name}
          hanjaB={personB.hanjaDisplay}
        />
        <p className="mt-4 text-center font-musok text-sm leading-relaxed text-[var(--mk-ivory-dim)]">
          {result.headline}
        </p>
        <p className="mt-2 text-center text-[11px] text-[var(--mk-ivory-muted)]">{result.teaser}</p>
      </motion.div>

      {adsConfig.adsenseSlotTop && (
        <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
          <AdSlot slotId={adsConfig.adsenseSlotTop} className="mx-auto max-w-md" />
        </motion.div>
      )}

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="mk-card p-5">
        <BrushText text={MUSOK_MOTTO} className="text-center text-sm italic text-[var(--mk-ivory-dim)]" />
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="px-1 text-[10px] text-[var(--mk-cinnabar-soft)]">본인 · {personA.name}</p>
          <SurnameHanjaPanel slots={personA.slots} name={personA.name} />
        </div>
        <div className="space-y-2">
          <p className="px-1 text-[10px] text-emerald-400/90">상대 · {personB.name}</p>
          <SurnameHanjaPanel slots={personB.slots} name={personB.name} />
        </div>
      </motion.div>

      {/* 무료 요약 */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="mk-card p-6">
        <p className="mk-kicker">무료 궁합 요약</p>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-[var(--mk-ivory-dim)]">
          <SummaryRow label="일간 관계" value={relationLabel(result.dayRelation).split("—")[0].trim()} />
          <p>{result.dayRelationSummary.split(".").slice(0, 1).join(".")}.</p>
          <p>{result.crossHarmonySummary}</p>
        </div>
        {result.strengths.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {result.strengths.slice(0, 2).map((s) => (
              <span key={s} className="border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                {s.length > 28 ? `${s.slice(0, 28)}…` : s}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* 차원별 티저 (무료) */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="space-y-3">
        <p className="mk-kicker px-1">항목별 궁합 (미리보기)</p>
        {result.dimensions.map((d) => (
          <div key={d.key} className="mk-card p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="font-musok text-[var(--mk-cinnabar-soft)]">{d.hanja}</span>
                <span className="ml-2 text-sm text-[var(--mk-ivory)]">{d.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`border px-2 py-0.5 text-[10px] ${gilBadgeClass(d.gilHeung)}`}>{d.gilHeung}</span>
                <span className="text-sm text-[var(--mk-ivory-dim)]">{d.score}점</span>
              </div>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--mk-ivory-muted)]">{d.teaser}</p>
          </div>
        ))}
      </motion.div>

      {/* 유료 상세 */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <PremiumPaywall
          pairScore={result.pairScore}
          nameA={personA.name}
          nameB={personB.name}
          teaser={
            <p className="mb-2 text-center text-[10px] text-[var(--mk-ivory-muted)]">
              아래는 상세 궁합 명통 미리보기입니다
            </p>
          }
        >
          <div className="space-y-6 p-2">
            <section className="mk-card p-6">
              <p className="mk-kicker">사주·이름 교차 조화</p>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--mk-ivory-dim)]">
                <p>{result.dayRelationSummary}</p>
                <p>{result.crossHarmonySummary}</p>
                <p>{result.nameBridgeSummary}</p>
                <p>{result.placeSummary}</p>
                <p>{result.marriageWindowSummary}</p>
              </div>
            </section>

            {result.dimensions.map((d) => (
              <section key={`detail-${d.key}`} className="mk-card p-6">
                <div className="flex items-center justify-between">
                  <p className="mk-kicker">
                    {d.hanja} {d.label}
                  </p>
                  <span className="text-sm text-[var(--mk-cinnabar-soft)]">{d.score}점</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[var(--mk-ivory-dim)]">{d.detail}</p>
                <p className="mt-3 border-t border-[var(--mk-border)] pt-3 text-xs text-[var(--mk-ivory-muted)]">
                  💡 {d.advice}
                </p>
              </section>
            ))}

            <section className="mk-card p-6">
              <p className="mk-kicker">앞으로 4년 흐름</p>
              <div className="mt-4 space-y-3">
                {result.yearOutlook.map((y) => (
                  <div key={y.year} className="border border-[var(--mk-border)] p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-musok text-[var(--mk-ivory)]">{y.year}년</span>
                      <span className={`text-[10px] ${gilBadgeClass(y.flow)} border px-2 py-0.5`}>{y.flow}</span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--mk-cinnabar-soft)]">{y.theme}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--mk-ivory-muted)]">{y.advice}</p>
                  </div>
                ))}
              </div>
            </section>

            {(result.strengths.length > 0 || result.cautions.length > 0) && (
              <section className="mk-card p-6">
                <p className="mk-kicker">종합 처방</p>
                {result.strengths.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {result.strengths.map((s) => (
                      <li key={s} className="text-xs text-emerald-400">
                        + {s}
                      </li>
                    ))}
                  </ul>
                )}
                {result.cautions.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {result.cautions.map((c) => (
                      <li key={c} className="text-xs text-[var(--mk-cinnabar-soft)]">
                        · {c}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </div>
        </PremiumPaywall>
      </motion.div>

      {(adsConfig.adsenseSlotMid || adsConfig.coupangWidgetId) && (
        <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="space-y-4">
          {adsConfig.adsenseSlotMid && <AdSlot slotId={adsConfig.adsenseSlotMid} />}
          <CoupangSlot />
        </motion.div>
      )}

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <button type="button" onClick={onReset} className="mk-btn mk-btn-ghost w-full">
          다른 궁합 명통 열기
        </button>
        <p className="mt-4 text-center text-[10px] tracking-widest text-[var(--mk-ivory-muted)]">
          전통 성명학 · 사주 궁합 · 참고용 풀이
        </p>
      </motion.div>
    </motion.div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--mk-border)] pb-2">
      <span className="text-[10px] text-[var(--mk-ivory-muted)]">{label}</span>
      <span className="text-sm text-[var(--mk-ivory)]">{value}</span>
    </div>
  );
}
