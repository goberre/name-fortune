"use client";

import { motion } from "framer-motion";
import type { GilHeung, Oheng, PronunciationOheng, StrokeSlot, YinYang } from "@/lib/seongmyung";
import { OHENG_LABEL } from "@/lib/seongmyung";

const OHENG_COLOR: Record<Oheng, string> = {
  목: "bg-emerald-500/90",
  화: "bg-orange-500/90",
  토: "bg-amber-500/90",
  금: "bg-slate-400/90",
  수: "bg-blue-500/90",
};

function Badge({ status }: { status: GilHeung }) {
  if (status === "길") return <span className="nf-badge-gil">{status}</span>;
  if (status === "흉") return <span className="nf-badge-heung">{status}</span>;
  return <span className="nf-badge-pyeong">{status}</span>;
}

export default function AnalysisPanels({
  slots,
  yinYangPattern,
  yinYangGilHeung,
  yinYangSummary,
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
      <motion.div variants={card} className="nf-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-violet-200">음양 조화</h3>
          <Badge status={yinYangGilHeung} />
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          {slots.map((s, i) => (
            <div key={s.char} className="rounded-lg border border-violet-500/20 bg-black/30 px-3 py-2 text-center">
              <p className="text-lg font-semibold text-white">{s.char}</p>
              <p className="text-[10px] text-white/40">
                {s.strokes}획 · {yinYangPattern[i]}
              </p>
            </div>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-white/55">{yinYangSummary}</p>
      </motion.div>

      <motion.div variants={card} className="nf-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-violet-200">발음오행</h3>
          <Badge status={pronunciationGilHeung} />
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          {pronunciationFlow.map((o, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-white/20">→</span>}
              <span className={`rounded-lg px-2 py-1 text-xs font-medium text-white ${OHENG_COLOR[o]}`}>
                {OHENG_LABEL[o]} {o}
              </span>
            </span>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-white/55">{pronunciationSummary}</p>
      </motion.div>
    </motion.div>
  );
}
