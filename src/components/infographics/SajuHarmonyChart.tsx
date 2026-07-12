"use client";

import type { Oheng } from "@/lib/seongmyung";
import { OHENG_HEX } from "@/lib/oheng-colors";

function OhengPills({ items }: { items: Oheng[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-1">
      {items.map((o, i) => (
        <span
          key={i}
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
          style={{ backgroundColor: OHENG_HEX[o] }}
        >
          {o}
        </span>
      ))}
    </div>
  );
}

/** 사주 ↔ 이름 ↔ 태생지 연결 다이어그램 */
export default function SajuHarmonyChart({
  sajuOheng,
  nameOheng,
  regionOheng,
  regionLabel,
  matchScore,
}: {
  sajuOheng: Oheng[];
  nameOheng: Oheng[];
  regionOheng?: Oheng;
  regionLabel?: string;
  matchScore: number;
}) {
  const birthItems = regionOheng ? [...sajuOheng, regionOheng] : sajuOheng;
  const scoreColor = matchScore >= 70 ? "#34c759" : matchScore >= 50 ? "#8e8e93" : "#ff3b30";
  const scoreBg = matchScore >= 70 ? "#ecfdf3" : matchScore >= 50 ? "#f5f5f5" : "#fff1f0";

  return (
    <div className="info-chart">
      <div className="flex items-stretch justify-center gap-2 sm:gap-4">
        <div className="flex flex-1 flex-col items-center rounded-2xl border border-neutral-100 bg-white px-3 py-3 text-center">
          <p className="text-xs font-semibold text-neutral-700">사주·태생지</p>
          {regionLabel && <p className="text-[10px] text-neutral-400">{regionLabel}</p>}
          <div className="mt-2">
            <OhengPills items={birthItems} />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-1 px-1">
          <svg width="32" height="20" viewBox="0 0 32 20" className="text-neutral-300">
            <path d="M2 10 H24 M18 5 L26 10 L18 15" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span
            className="whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{ color: scoreColor, backgroundColor: scoreBg }}
          >
            {matchScore}%
          </span>
          <span className="text-[9px] text-neutral-400">조화</span>
        </div>

        <div className="flex flex-1 flex-col items-center rounded-2xl border border-neutral-100 bg-white px-3 py-3 text-center">
          <p className="text-xs font-semibold text-neutral-700">이름 한자</p>
          <div className="mt-2">
            <OhengPills items={nameOheng} />
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-neutral-500">
        사주에 부족한 기운을 <strong className="text-neutral-700">이름 한자</strong>가 채워주면 좋은 이름입니다
      </p>
    </div>
  );
}
