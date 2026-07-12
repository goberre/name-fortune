"use client";

import { motion } from "framer-motion";
import EasyTip from "@/components/infographics/EasyTip";
import OhengCycleChart from "@/components/infographics/OhengCycleChart";
import YinYangChart from "@/components/infographics/YinYangChart";
import OhengFlowChart from "@/components/seongmyung/OhengFlowChart";
import { OhengBadge } from "@/components/seongmyung/HanjaPicker";
import type { GilHeung, Oheng, PronunciationOheng, StrokeSlot, YinYang } from "@/lib/seongmyung";

function Badge({ status }: { status: GilHeung }) {
  const cls =
    status === "길"
      ? "bg-emerald-50 text-emerald-700"
      : status === "흉"
        ? "bg-rose-50 text-rose-700"
        : "bg-neutral-100 text-neutral-600";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{status}</span>;
}

export default function AnalysisPanels({
  slots,
  yinYangPattern,
  yinYangGilHeung,
  yinYangSummary,
  pronunciation,
  pronunciationFlow,
  pronunciationGilHeung,
  pronunciationSummary,
}: {
  slots: StrokeSlot[];
  yinYangPattern: YinYang[];
  yinYangGilHeung: GilHeung;
  yinYangSummary: string;
  pronunciation: PronunciationOheng[];
  pronunciationFlow: Oheng[];
  pronunciationGilHeung: GilHeung;
  pronunciationSummary: string;
}) {
  const card = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
  const sourceOheng = slots.map((s) => s.sourceOheng).filter(Boolean) as Oheng[];

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="grid gap-4 sm:grid-cols-2"
    >
      <motion.div variants={card} className="ap-card p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-900">음양 · 획수 균형</h3>
          <Badge status={yinYangGilHeung} />
        </div>

        <EasyTip>
          한자 획수가 <strong>홀수=양(陽)</strong>, <strong>짝수=음(陰)</strong>입니다. 양과 음이
          고르게 섞이면 균형 잡힌 이름입니다.
        </EasyTip>

        <div className="mb-2 mt-4 flex flex-wrap gap-2">
          {slots.map((s, i) => (
            <div
              key={`${s.char}-${i}`}
              className="rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2.5 text-center"
            >
              <p className="text-lg font-semibold text-neutral-900">{s.char}</p>
              {s.hanja && <p className="font-serif text-sm text-neutral-600">{s.hanja}</p>}
              <p className="mt-1 text-[10px] text-neutral-500">
                {s.strokes}획 · {yinYangPattern[i]}
              </p>
              {s.sourceOheng && (
                <div className="mt-1.5 flex justify-center">
                  <OhengBadge oheng={s.sourceOheng} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4">
          <YinYangChart pattern={yinYangPattern} />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">{yinYangSummary}</p>
      </motion.div>

      <motion.div variants={card} className="ap-card p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-900">발음오행 · 소리의 기운</h3>
          <Badge status={pronunciationGilHeung} />
        </div>

        <EasyTip>
          이름을 <strong>소리 내어 읽을 때</strong>의 초성(ㄱ·ㄴ·ㄷ…)에 따라 목·화·토·금·수 기운이
          붙습니다. 소리끼리 상생하면 좋습니다.
        </EasyTip>

        <OhengFlowChart items={pronunciation} flow={pronunciationFlow} />

        <div className="mt-4">
          <OhengCycleChart highlight={[...pronunciationFlow, ...sourceOheng]} />
        </div>

        <dl className="info-glossary mt-4">
          <div>
            <dt>상생 · 상극</dt>
            <dd>상생 = 서로 돕는 관계(좋음). 상극 = 서로 겹치는 관계(주의).</dd>
          </div>
        </dl>

        <p className="mt-4 text-sm leading-relaxed text-neutral-600">{pronunciationSummary}</p>
      </motion.div>
    </motion.div>
  );
}
