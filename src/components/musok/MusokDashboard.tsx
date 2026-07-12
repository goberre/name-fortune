"use client";

import { motion } from "framer-motion";
import BrushText from "@/components/musok/BrushText";
import HanjiTimeline from "@/components/musok/HanjiTimeline";
import OhengSalpuriGuide from "@/components/musok/OhengSalpuriGuide";
import SinsuMyeongtongGauge from "@/components/musok/SinsuMyeongtongGauge";
import { MUSOK_MOTTO } from "@/lib/musok-copy";
import type { SeongmyungResult } from "@/lib/seongmyung";
import { CALENDAR_LABEL, GENDER_LABEL } from "@/types/birth";

export default function MusokDashboard({
  result,
  onReset,
}: {
  result: SeongmyungResult;
  onReset: () => void;
}) {
  const bd = result.birthDate;
  const timeStr =
    bd?.hour !== undefined ? ` ${bd.hour}시${bd.minute !== undefined ? ` ${bd.minute}분` : ""}` : "";

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
            {timeStr}
          </p>
        )}
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="mk-card p-5">
        <BrushText text={MUSOK_MOTTO} className="text-center text-sm italic text-[var(--mk-ivory-dim)]" />
      </motion.div>

      {result.futureFortune && (
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="mk-card p-6">
          <p className="mk-kicker">앞으로의 명줄</p>
          <BrushText
            text={result.futureFortune.focusMessage}
            className="mt-3 text-sm leading-relaxed text-[var(--mk-ivory-dim)]"
          />
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
