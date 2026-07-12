"use client";

import { motion } from "framer-motion";
import { getHanjaCandidates, hasHanjaData, type HanjaSelection } from "@/lib/hanja";
import { OHENG_LABEL, type Oheng } from "@/lib/seongmyung";

const OHENG_STYLE: Record<Oheng, string> = {
  목: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  화: "bg-orange-50 text-orange-700 ring-orange-200",
  토: "bg-amber-50 text-amber-800 ring-amber-200",
  금: "bg-slate-100 text-slate-700 ring-slate-200",
  수: "bg-sky-50 text-sky-700 ring-sky-200",
};

type Props = {
  hangul: string;
  index: number;
  selected: HanjaSelection | null;
  onSelect: (index: number, selection: HanjaSelection) => void;
};

export default function HanjaPicker({ hangul, index, selected, onSelect }: Props) {
  const candidates = getHanjaCandidates(hangul);
  const hasData = hasHanjaData(hangul);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="ap-card p-5"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-xl font-semibold text-neutral-900">
          {hangul}
        </span>
        <div>
          <p className="text-sm font-medium text-neutral-900">한자 선택</p>
          <p className="text-xs text-neutral-500">원획법 획수 · 자원오행 매핑</p>
        </div>
      </div>

      {!hasData ? (
        <p className="rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-500">
          「{hangul}」에 대한 한자 데이터가 아직 없습니다. 다른 글자로 시도하거나 추후 업데이트를 기다려 주세요.
        </p>
      ) : (
        <div className="space-y-2">
          {candidates.map((c) => {
            const active = selected?.hanja === c.hanja;
            return (
              <button
                key={c.hanja}
                type="button"
                onClick={() => onSelect(index, { hangul, ...c })}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-2xl font-serif ${active ? "text-white" : "text-neutral-900"}`}>
                    {c.hanja}
                  </span>
                  <div>
                    <p className={`text-sm font-medium ${active ? "text-white" : "text-neutral-900"}`}>
                      {c.meaning}
                    </p>
                    <p className={`text-xs ${active ? "text-neutral-300" : "text-neutral-500"}`}>
                      원획 {c.wonStrokes}획
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                    active ? "bg-white/15 text-white ring-white/20" : OHENG_STYLE[c.oheng]
                  }`}
                >
                  {OHENG_LABEL[c.oheng]} {c.oheng}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

export function OhengBadge({ oheng, large }: { oheng: Oheng; large?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ring-1 ${OHENG_STYLE[oheng]} ${
        large ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-xs"
      }`}
    >
      {OHENG_LABEL[oheng]} {oheng}
    </span>
  );
}
