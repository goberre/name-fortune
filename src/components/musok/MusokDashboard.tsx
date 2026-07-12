"use client";

import { motion } from "framer-motion";
import AdSlot from "@/components/monetization/AdSlot";
import CoupangSlot from "@/components/monetization/CoupangSlot";
import BrushText from "@/components/musok/BrushText";
import CoupleUpsellCard from "@/components/musok/CoupleUpsellCard";
import HanjiTimeline from "@/components/musok/HanjiTimeline";
import MusokBirthPlacePanel from "@/components/musok/MusokBirthPlacePanel";
import OhengSalpuriGuide from "@/components/musok/OhengSalpuriGuide";
import SinsuMyeongtongGauge from "@/components/musok/SinsuMyeongtongGauge";
import SurnameHanjaPanel from "@/components/musok/SurnameHanjaPanel";
import { adsConfig } from "@/config/ads";
import { getFullDistrictLabel, formatCoordinates } from "@/lib/birth-districts";
import { MUSOK_MOTTO } from "@/lib/musok-copy";
import type { SeongmyungResult } from "@/lib/seongmyung";
import { CALENDAR_LABEL, GENDER_LABEL } from "@/types/birth";

export default function MusokDashboard({
  result,
  onReset,
  onStartCouple,
}: {
  result: SeongmyungResult;
  onReset: () => void;
  onStartCouple?: () => void;
}) {
  const bd = result.birthDate;
  const placeLabel = bd?.birthDistrict ? getFullDistrictLabel(bd.birthDistrict) : undefined;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.12 } } }}
      className="space-y-8"
    >
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <SinsuMyeongtongGauge
          score={result.totalScore}
          grade={result.gradeLabel}
          name={result.name}
          hanja={result.hanjaDisplay}
        />
        {bd && (
          <p className="mt-3 text-center text-[10px] tracking-wider text-[var(--mk-ivory-muted)]">
            {GENDER_LABEL[bd.gender]} · {CALENDAR_LABEL[bd.calendarType]}
            {bd.isLeapMonth ? " · 윤달" : ""} · {bd.year}.{bd.month}.{bd.day}
            {placeLabel ? ` · ${placeLabel}` : ""}
          </p>
        )}
        {result.sajuProfile?.regionLat !== undefined && result.sajuProfile.regionLng !== undefined && (
          <p className="mt-1 text-center font-mono text-[10px] text-[var(--mk-cinnabar-soft)]">
            {formatCoordinates(result.sajuProfile.regionLat, result.sajuProfile.regionLng)}
          </p>
        )}
        {result.sajuProfile?.calendarNote && (
          <p className="mt-2 text-center text-[10px] leading-relaxed text-amber-200/70">{result.sajuProfile.calendarNote}</p>
        )}
      </motion.div>

      {adsConfig.adsenseSlotTop && (
        <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
          <AdSlot slotId={adsConfig.adsenseSlotTop} className="mx-auto max-w-md" />
        </motion.div>
      )}

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="mk-card p-5">
        <BrushText text={MUSOK_MOTTO} className="text-center text-sm italic text-[var(--mk-ivory-dim)]" />
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <SurnameHanjaPanel slots={result.slots} name={result.name} />
      </motion.div>

      {result.birthRegionAnalysis && (
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <MusokBirthPlacePanel analysis={result.birthRegionAnalysis} />
        </motion.div>
      )}

      {result.futureFortune && (
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="mk-card p-6">
          <p className="mk-kicker">앞으로의 명줄</p>
          <BrushText
            text={result.futureFortune.focusMessage}
            className="mt-3 text-sm leading-relaxed text-[var(--mk-ivory-dim)]"
          />
        </motion.div>
      )}

      {(adsConfig.adsenseSlotMid || adsConfig.coupangWidgetId) && (
        <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="space-y-4">
          {adsConfig.adsenseSlotMid && <AdSlot slotId={adsConfig.adsenseSlotMid} />}
          <CoupangSlot />
        </motion.div>
      )}

      {result.sajuProfile && result.sourceOhengHarmony && result.sourceOheng && (
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <OhengSalpuriGuide
            saju={result.sajuProfile}
            nameOheng={result.sourceOheng}
            harmony={result.sourceOhengHarmony}
          />
        </motion.div>
      )}

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <HanjiTimeline
          grids={result.sagyeok}
          birthYear={bd?.year}
          birthMonth={bd?.month}
          birthDay={bd?.day}
        />
      </motion.div>

      {onStartCouple && (
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <CoupleUpsellCard onStart={onStartCouple} />
        </motion.div>
      )}

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <button type="button" onClick={onReset} className="mk-btn mk-btn-ghost w-full">
          다른 이름 명통 열기
        </button>
        <p className="mt-4 text-center text-[10px] tracking-widest text-[var(--mk-ivory-muted)]">
          전통 성명학 · 원획법 · 81수리 · 참고용 풀이
        </p>
      </motion.div>
    </motion.div>
  );
}
