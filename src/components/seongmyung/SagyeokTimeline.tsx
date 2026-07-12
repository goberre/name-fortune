"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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
  won: "어릴 때 · 성장기",
  hyung: "★ 주운 · 가장 중요",
  i: "중년 · 가정·사회",
  jeong: "말년 · 인생 총운",
};

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
      <h3 className="text-base font-semibold text-neutral-900">사격 운세 타임라인</h3>
      <p className="mt-1 text-sm text-neutral-500">이름 한자 획수로 보는 인생 4단계 운세</p>

      <div className="mt-5 rounded-xl bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-600">
        <p className="font-medium text-neutral-800">사격이란?</p>
        <p className="mt-2">
          성명학에서 이름을 <strong>성</strong>과 <strong>이름</strong>으로 나눠, 한자 획수를 더해
          인생 4시기의 운세를 보는 방법입니다. 획수 합계를 81수리로 환산해 길·흉을 판단합니다.
        </p>
        <ul className="mt-3 space-y-1.5 text-xs text-neutral-500">
          <li>· <strong>원격</strong> — 이름 획수 → 어릴 때 (1~20세)</li>
          <li>· <strong>형격</strong> — 성+이름 첫 글자 → 청년기 주운 (21~40세) ★</li>
          <li>· <strong>이격</strong> — 성+이름 둘째 글자 → 중년기 (41~60세)</li>
          <li>· <strong>정격</strong> — 전체 획수 → 말년·총운 (61세~)</li>
        </ul>
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
            <p className="text-xs font-medium text-neutral-500">획수 계산</p>
            <p className="mt-1 text-sm font-medium text-neutral-900">{g.formula}</p>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-semibold tracking-tight text-neutral-900">{g.suri}</span>
            <span className="text-sm text-neutral-500">수 · {g.gridName}</span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-neutral-700">{g.plainGuide}</p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">{g.lifeGuide}</p>
          <p className="mt-3 rounded-lg bg-white px-3 py-2 text-sm text-neutral-600">{g.description}</p>
          <p className="mt-2 text-xs text-neutral-400">
            {g.rawSum}획 → 81수리 {g.suri}수 ({g.gilHeung === "길" ? "좋은 흐름" : g.gilHeung === "흉" ? "주의 필요" : "무난한 흐름"})
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="relative mt-8 space-y-0 pl-6 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-px before:bg-neutral-200">
        {grids.map((grid, i) => (
          <button
            key={grid.key}
            type="button"
            onClick={() => setActive(i)}
            className="group relative flex w-full gap-3 pb-6 text-left last:pb-0"
          >
            <span
              className={`absolute -left-6 top-1 z-10 h-[10px] w-[10px] shrink-0 rounded-full transition ${
                i === active ? "bg-neutral-900 ring-2 ring-neutral-900 ring-offset-2" : "bg-white ring-2 ring-neutral-300"
              }`}
            />
            <div>
              <p className={`text-sm font-medium ${i === active ? "text-neutral-900" : "text-neutral-400"}`}>
                {grid.label} · {grid.suri}수 {grid.gridName}
                {grid.key === "hyung" && " ★"}
              </p>
              <p className="text-xs text-neutral-400">{grid.period}</p>
              <p className="mt-0.5 text-xs text-neutral-500">{TAB_HINT[grid.key]}</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
