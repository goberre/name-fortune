"use client";

import type { Oheng } from "@/lib/seongmyung";
import { OHENG_BG, OHENG_DESC, OHENG_HEX } from "@/lib/oheng-colors";

const ORDER: Oheng[] = ["목", "화", "토", "금", "수"];

/** 오행 상생 순환 다이어그램 */
export default function OhengCycleChart({ highlight }: { highlight?: Oheng[] }) {
  const active = new Set(highlight ?? []);
  const cx = 100;
  const cy = 100;
  const r = 68;

  const nodes = ORDER.map((o, i) => {
    const angle = (i * 72 - 90) * (Math.PI / 180);
    return { o, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  return (
    <div className="info-chart">
      <svg viewBox="0 0 200 200" className="mx-auto h-44 w-full max-w-[220px]" aria-hidden>
        <circle cx={cx} cy={cy} r={82} fill="#fafafa" stroke="#e5e5e5" strokeWidth="1" />
        {nodes.map((n, i) => {
          const next = nodes[(i + 1) % nodes.length];
          return (
            <line
              key={`line-${n.o}`}
              x1={n.x}
              y1={n.y}
              x2={next.x}
              y2={next.y}
              stroke="#d4d4d4"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          );
        })}
        {nodes.map((n) => (
          <g key={n.o}>
            <circle
              cx={n.x}
              cy={n.y}
              r={active.has(n.o) ? 22 : 18}
              fill={OHENG_BG[n.o]}
              stroke={OHENG_HEX[n.o]}
              strokeWidth={active.has(n.o) ? 2.5 : 1.5}
            />
            <text
              x={n.x}
              y={n.y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="13"
              fontWeight="600"
              fill={OHENG_HEX[n.o]}
            >
              {n.o}
            </text>
          </g>
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="9" fill="#737373">
          상생
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="8" fill="#a3a3a3">
          목→화→토→금→수
        </text>
      </svg>
      <div className="mt-3 grid grid-cols-5 gap-1 text-center">
        {ORDER.map((o) => (
          <div key={o} className="min-w-0">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: OHENG_HEX[o] }}
            />
            <p className="mt-1 text-[10px] font-medium text-neutral-700">{o}</p>
            <p className="truncate text-[9px] text-neutral-400">{OHENG_DESC[o].split(" · ")[0]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
