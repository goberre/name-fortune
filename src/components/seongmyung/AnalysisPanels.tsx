"use client";

import { motion } from "framer-motion";
import type { GilHeung, Oheng, PronunciationOheng, StrokeSlot, YinYang } from "@/lib/seongmyung";
import { OHENG_LABEL } from "@/lib/seongmyung";

const OHENG_COLOR: Record<Oheng, string> = {
  목: "bg-emerald-500",
  화: "bg-orange-500",
  토: "bg-amber-600",
  금: "bg-slate-400",
  수: "bg-blue-500",
};

function Badge({ status }: { status: GilHeung }) {
  const cls =
    status === "길"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
      : status === "흉"
        ? "bg-rose-50 text-rose-700 ring-rose-600/20"
        : "bg-gray-100 text-gray-600 ring-gray-500/10";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}>
      {status}
    </span>
  );
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
  const card = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="grid gap-4 sm:grid-cols-2"
    >
      <motion.div variants={card} className="rounded-2xl bg-gray-50 p-5 ring-1 ring-gray-100">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">음양(陰陽) 조화</h3>
          <Badge status={yinYangGilHeung} />
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          {slots.map((s, i) => (
            <div key={s.char} className="rounded-xl bg-white px-3 py-2 text-center ring-1 ring-gray-100">
              <p className="text-lg font-semibold text-gray-900">{s.char}</p>
              <p className="text-[10px] text-gray-400">
                {s.strokes}획 · {yinYangPattern[i]}
              </p>
            </div>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-gray-600">{yinYangSummary}</p>
      </motion.div>

      <motion.div variants={card} className="rounded-2xl bg-gray-50 p-5 ring-1 ring-gray-100">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">발음오행</h3>
          <Badge status={pronunciationGilHeung} />
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          {pronunciationFlow.map((o, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-gray-300">→</span>}
              <span
                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-white ${OHENG_COLOR[o]}`}
              >
                {OHENG_LABEL[o]} {o}
              </span>
            </span>
          ))}
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          {pronunciation.map((p) => (
            <span key={p.char} className="text-xs text-gray-500">
              {p.char}({p.cho})={p.oheng}
            </span>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-gray-600">{pronunciationSummary}</p>
      </motion.div>
    </motion.div>
  );
}
