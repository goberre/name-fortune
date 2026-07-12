"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import EasyTip from "@/components/infographics/EasyTip";
import SagyeokLifeChart from "@/components/infographics/SagyeokLifeChart";
import { calcAge, defaultSagyeokIndex, isPastStage, stageForAge } from "@/lib/future-fortune";
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
  won: "지나간 시기 · 참고용",
  hyung: "★ 지금~앞으로 · 직업·연애",
  i: "앞으로 · 가정·재물",
  jeong: "앞으로 · 노후·총운",
};

const GIL_LABEL = { 길: "좋은 흐름", 흉: "주의 필요", 평: "무난한 흐름" } as const;

export default function SagyeokTimeline({
  grids,
  birthYear,
  birthMonth,
  birthDay,
}: {
  grids: SagyeokGrid[];
  birthYear?: number;
  birthMonth?: number;
  birthDay?: number;
}) {
  const age = useMemo(() => {
    if (!birthYear || !birthMonth || !birthDay) return undefined;
    return calcAge({ year: birthYear, month: birthMonth, day: birthDay });
  }, [birthYear, birthMonth, birthDay]);

  const defaultIdx = age !== undefined ? defaultSagyeokIndex(age) : 1;
  const [active, setActive] = useState(defaultIdx);
  const g = grids[active];
  const currentStage = age !== undefined ? stageForAge(age) : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="ap-card p-6 sm:p-8"
    >
      <h3 className="text-base font-semibold text-neutral-900">사격 · 앞으로의 인생 운세</h3>
      <p className="mt-1 text-sm text-neutral-500">
        {age !== undefined ? `현재 ${age}세 · 지금부터 펼쳐질 운을 중심으로 봅니다` : "이름 한자 획수로 보는 시기별 운"}
      </p>

      <EasyTip title="미래 중심으로 보기">
        과거(어릴 때)보다 <strong>지금·앞으로</strong>가 궁금하시죠? 형격(21~40세) · 이격(41~60세) ·
        정격(61세~)을 중점적으로 확인해 주세요. 원격(1~20세)은 이미 지난 흐름입니다.
      </EasyTip>

      <div className="mt-5">
        <SagyeokLifeChart
          grids={grids}
          activeKey={g.key}
          currentStage={currentStage}
          onSelect={setActive}
        />
      </div>

      <div className="mt-6 flex gap-1 rounded-xl bg-neutral-100 p-1">
        {grids.map((grid, i) => {
          const isPast = currentStage ? isPastStage(grid.key as "won" | "hyung" | "i" | "jeong", currentStage) : false;
          return (
            <button
              key={grid.key}
              type="button"
              onClick={() => setActive(i)}
              className={`flex-1 rounded-lg py-2.5 text-xs font-medium transition sm:text-sm ${
                active === i ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
              } ${isPast ? "opacity-50" : ""}`}
            >
              {grid.label}
              {grid.key === "hyung" && " ★"}
              {grid.key === currentStage && " ·지금"}
            </button>
          );
        })}
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
            {g.key === currentStage && (
              <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-bold text-white">지금</span>
            )}
            {g.key === "won" && currentStage && isPastStage(g.key, currentStage) && (
              <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] text-neutral-500">지나감</span>
            )}
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
            {g.rawSum}획 → 81수리 {g.suri}수 ({GIL_LABEL[g.gilHeung]})
          </p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
