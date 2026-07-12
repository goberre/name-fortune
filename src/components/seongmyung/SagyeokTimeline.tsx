"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import EasyTip from "@/components/infographics/EasyTip";
import SagyeokLifeChart from "@/components/infographics/SagyeokLifeChart";
import type { GilHeung, SagyeokGrid } from "@/lib/seongmyung";

function StatusBadge({ gilHeung }: { gilHeung: GilHeung }) {
  const cls =
    gilHeung === "길"
      ? "bg-emerald-50 text-emerald-700"
      : gilHeung === "흉"
        ? "bg-rose-50 text-rose-700"
        : "bg-neutral-100 text-neutral-600";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{gilHeung}</span>;
}

const TAB_HINT: Record<string, string> = {
  won: "어릴 때 · 학업·성장",
  hyung: "★ 주운 · 직업·배우자",
  i: "중년 · 가정·사회",
  jeong: "말년 · 건강·총운",
};

const GIL_LABEL = { 길: "좋은 흐름", 흉: "주의 필요", 평: "무난한 흐름" } as const;

export default function SagyeokTimeline({ grids }: { grids: SagyeokGrid[] }) {
  const [active, setActive] = useState(0);
  const g = grids[active];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="ap-card p-6 sm:p-8"
    >
      <h3 className="text-base font-semibold text-neutral-900">사격 · 인생 4단계 운세</h3>
      <p className="mt-1 text-sm text-neutral-500">이름 한자 획수로 보는 시기별 운</p>

      <EasyTip title="한 줄 요약">
        이름 한자 <strong>몇 획인지</strong>를 더해서, 어릴 때 → 청년 → 중년 → 말년 네 구간의 운이
        좋은지(길) 나쁜지(흉)를 봅니다. <strong>형격(★)</strong>이 가장 중요합니다.
      </EasyTip>

      <div className="mt-5">
        <SagyeokLifeChart grids={grids} activeKey={g.key} onSelect={setActive} />
      </div>

      <div className="mt-6 flex gap-1 rounded-xl bg-neutral-100 p-1">
        {grids.map((grid, i) => (
          <button
            key={grid.key}
            type="button"
            onClick={() => setActive(i)}
            className={`flex-1 rounded-lg py-2.5 text-xs font-medium transition sm:text-sm ${
              active === i ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {grid.label}
            {grid.key === "hyung" && " ★"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={g.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mt-6 rounded-2xl border border-neutral-100 bg-neutral-50/80 p-5"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xl font-semibold text-neutral-900">{g.label}</span>
            <StatusBadge gilHeung={g.gilHeung} />
            <span className="text-xs text-neutral-400">{TAB_HINT[g.key]}</span>
          </div>
          <p className="mt-1 text-xs text-neutral-400">{g.period}</p>

          <div className="mt-4 rounded-lg border border-neutral-200/80 bg-white px-4 py-3">
            <p className="text-xs font-medium text-neutral-500">어떻게 계산하나요?</p>
            <p className="mt-1 text-sm font-medium text-neutral-900">{g.formula}</p>
            <p className="mt-1 text-[10px] text-neutral-400">↑ 한자 획수를 더한 뒤 81수리 길흉표로 변환</p>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-semibold tracking-tight text-neutral-900">{g.suri}</span>
            <span className="text-sm text-neutral-500">수 · {g.gridName}</span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-neutral-700">{g.plainGuide}</p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">{g.lifeGuide}</p>
          <p className="mt-3 rounded-lg bg-white px-3 py-2 text-sm text-neutral-600">{g.description}</p>
          <p className="mt-2 text-xs text-neutral-400">
            {g.rawSum}획 → 81수리 {g.suri}수 ({GIL_LABEL[g.gilHeung]})
          </p>
        </motion.div>
      </AnimatePresence>

      <dl className="info-glossary mt-6">
        <div>
          <dt>81수리란?</dt>
          <dd>획수를 1~81 숫자로 환산해 길·흉을 판단하는 전통 수리표입니다.</dd>
        </div>
        <div>
          <dt>형격(★)이 왜 중요한가요?</dt>
          <dd>20~40대 직업·결혼·사회생활 등 인생의 핵심 시기를 나타내는 &apos;주운&apos;이기 때문입니다.</dd>
        </div>
      </dl>
    </motion.div>
  );
}
