"use client";

import { motion } from "framer-motion";
import OhengFlowChart from "@/components/seongmyung/OhengFlowChart";
import { OhengBadge } from "@/components/seongmyung/HanjaPicker";
import YinYangBalance from "@/components/seongmyung/YinYangBalance";
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

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="grid gap-4 sm:grid-cols-2"
    >
      <motion.div variants={card} className="ap-card p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-900">음양 · 원획 획수</h3>
          <Badge status={yinYangGilHeung} />
        </div>
        <div className="mb-2 flex flex-wrap gap-2">
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
        <YinYangBalance pattern={yinYangPattern} />
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">{yinYangSummary}</p>
      </motion.div>

      <motion.div variants={card} className="ap-card p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-900">발음오행</h3>
          <Badge status={pronunciationGilHeung} />
        </div>
        <OhengFlowChart items={pronunciation} flow={pronunciationFlow} />
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">{pronunciationSummary}</p>
      </motion.div>
    </motion.div>
  );
}
