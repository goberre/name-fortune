"use client";

import { motion } from "framer-motion";
import OhengRune from "@/components/occult/OhengRune";
import type { SajuOhengProfile, SourceOhengHarmony } from "@/lib/saju";
import type { Oheng } from "@/lib/seongmyung";
import { OHENG_RUNE } from "@/lib/occult-copy";

const ORDER: Oheng[] = ["목", "화", "토", "금", "수"];
const OVERCOMES: Record<Oheng, Oheng> = { 목: "토", 토: "수", 수: "화", 화: "금", 금: "목" };

export default function ElementalBalance({
  saju,
  nameOheng,
  harmony,
}: {
  saju: SajuOhengProfile;
  nameOheng: Oheng[];
  harmony: SourceOhengHarmony;
}) {
  const cx = 120;
  const cy = 120;
  const r = 78;
  const nodes = ORDER.map((o, i) => {
    const a = (i * 72 - 90) * (Math.PI / 180);
    return { o, x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });

  const sajuSet = new Set(
    [saju.yearOheng, saju.monthOheng, saju.dayOheng, saju.regionOheng].filter(Boolean) as Oheng[],
  );
  const lacking = new Set(saju.lacking);
  const fills = new Set(harmony.fillsLacking);

  return (
    <div className="oc-card p-6 sm:p-8">
      <p className="oc-kicker">Elemental Balance</p>
      <p className="mt-2 text-sm text-white/50">오행의 상생(푸른 실) · 상극(붉은 실) · 영적 보완</p>

      <div className="info-chart oc-chart mt-6 border-red-950/30 bg-black/40">
        <svg viewBox="0 0 240 240" className="mx-auto h-56 w-full max-w-xs">
          {nodes.map((n, i) => {
            const next = nodes[(i + 1) % nodes.length];
            return (
              <line
                key={`gen-${n.o}`}
                x1={n.x}
                y1={n.y}
                x2={next.x}
                y2={next.y}
                stroke="rgba(96,165,250,0.35)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}
          {fills.size > 0 &&
            nodes
              .filter((n) => lacking.has(n.o) && fills.has(n.o))
              .map((n) => (
                <circle
                  key={`fill-${n.o}`}
                  cx={n.x}
                  cy={n.y}
                  r="28"
                  fill="none"
                  stroke="rgba(96,165,250,0.6)"
                  strokeWidth="2"
                />
              ))}
          {nodes.map((n) =>
            nameOheng
              .filter((no) => OVERCOMES[no] === n.o || OVERCOMES[n.o] === no)
              .map((no, j) => {
                const target = nodes.find((x) => x.o === no);
                if (!target || no === n.o) return null;
                return (
                  <line
                    key={`over-${n.o}-${no}-${j}`}
                    x1={n.x}
                    y1={n.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="rgba(248,113,113,0.45)"
                    strokeWidth="1"
                  />
                );
              }),
          )}
          {nodes.map((n) => (
            <g key={n.o}>
              <circle
                cx={n.x}
                cy={n.y}
                r={sajuSet.has(n.o) ? 22 : lacking.has(n.o) ? 18 : 16}
                fill={lacking.has(n.o) ? "rgba(127,29,29,0.25)" : "rgba(0,0,0,0.5)"}
                stroke={OHENG_RUNE[n.o].hue}
                strokeWidth={fills.has(n.o) ? 2.5 : 1}
                opacity={sajuSet.has(n.o) || nameOheng.includes(n.o) ? 1 : 0.45}
              />
              <text
                x={n.x}
                y={n.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={OHENG_RUNE[n.o].hue}
                fontSize="11"
                fontWeight="600"
              >
                {n.o}
              </text>
            </g>
          ))}
        </svg>
        <div className="mt-2 flex justify-center gap-4 text-[10px] text-white/40">
          <span className="flex items-center gap-1">
            <span className="inline-block h-px w-4 bg-sky-400/60" /> 상생
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-px w-4 bg-red-400/60" /> 상극
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {nameOheng.map((o, i) => (
          <OhengRune key={i} oheng={o} />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-5 text-sm leading-relaxed text-red-100/70"
      >
        {harmony.summary}
      </motion.p>
      {saju.lacking.length > 0 && (
        <p className="mt-2 text-xs text-indigo-300/60">
          공허(虛)의 오행: {saju.lacking.join(" · ")} — 선택한 한자가 이 틈을{" "}
          {harmony.fillsLacking.length > 0 ? "영적으로 메웁니다" : "아직 메우지 못합니다"}
        </p>
      )}
    </div>
  );
}
