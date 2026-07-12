"use client";

import { motion } from "framer-motion";
import ElementalBalance from "@/components/occult/ElementalBalance";
import ResonanceMatrix from "@/components/occult/ResonanceMatrix";
import TarotTimeline from "@/components/occult/TarotTimeline";
import WhyRegionMatters from "@/components/infographics/WhyRegionMatters";
import KoreaRegionChart from "@/components/infographics/KoreaRegionChart";
import type { SeongmyungResult } from "@/lib/seongmyung";
import { getBirthRegion } from "@/lib/birth-region";
import { CALENDAR_LABEL, GENDER_LABEL } from "@/types/birth";

export default function OccultDashboard({
  result,
  onReset,
}: {
  result: SeongmyungResult;
  onReset: () => void;
}) {
  const region = result.birthDate?.birthDistrict
    ? getBirthRegion(result.birthDate.birthDistrict)
    : undefined;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.12 } } }}
      className="space-y-8"
    >
      <motion.div variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}>
        <ResonanceMatrix
          score={result.totalScore}
          grade={result.gradeLabel}
          name={result.name}
          hanja={result.hanjaDisplay}
        />
        {result.birthDate && (
          <p className="mt-3 text-center text-[10px] tracking-wider text-white/30">
            {GENDER_LABEL[result.birthDate.gender]} · {CALENDAR_LABEL[result.birthDate.calendarType]}
            {result.birthDate.isLeapMonth ? " · 윤달" : ""} · {result.birthDate.year}.{result.birthDate.month}.
            {result.birthDate.day}
            {region ? ` · ${region.label} 태생` : ""}
          </p>
        )}
      </motion.div>

      {result.futureFortune && (
        <motion.div variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }} className="oc-card p-6">
          <p className="oc-kicker">Future Resonance</p>
          <p className="mt-3 font-occult text-lg leading-relaxed text-red-100/80">{result.futureFortune.focusMessage}</p>
          <p className="mt-2 text-sm text-indigo-300/60">
            미래 궤적 동조율: {result.futureFortune.futureScore}%
          </p>
        </motion.div>
      )}

      {result.sajuProfile && result.sourceOhengHarmony && result.sourceOheng && (
        <motion.div variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}>
          <ElementalBalance
            saju={result.sajuProfile}
            nameOheng={result.sourceOheng}
            harmony={result.sourceOhengHarmony}
          />
        </motion.div>
      )}

      <motion.div variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}>
        <TarotTimeline
          grids={result.sagyeok}
          birthYear={result.birthDate?.year}
          birthMonth={result.birthDate?.month}
          birthDay={result.birthDate?.day}
        />
      </motion.div>

      {result.birthRegionAnalysis && region && (
        <motion.div variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }} className="oc-card p-6">
          <p className="oc-kicker">Earth Sigil · 태생지</p>
          <p className="mt-2 text-sm text-white/50">대지의 좌표가 미래 궤적에 새기는 문양</p>
          <div className="oc-chart mt-4">
            <WhyRegionMatters />
          </div>
          <div className="mt-4">
            <KoreaRegionChart region={region} />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-red-100/70">{result.birthRegionAnalysis.futureGuide}</p>
          <p className="mt-2 text-xs text-white/40">{result.birthRegionAnalysis.summary}</p>
        </motion.div>
      )}

      <motion.div variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}>
        <button type="button" onClick={onReset} className="oc-btn oc-btn-ghost w-full">
          다른 문양(Sigil) 해독하기
        </button>
        <p className="mt-4 text-center text-[10px] tracking-widest text-white/20">
          DARK OCCULT EDITION · 성명학 · 81수리 · 자원오행
        </p>
      </motion.div>
    </motion.div>
  );
}
