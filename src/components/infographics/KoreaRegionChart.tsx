"use client";

import type { BirthRegion } from "@/lib/birth-region";
import { OHENG_HEX } from "@/lib/oheng-colors";

const DIR_ANGLE = { 북: -90, 동: 0, 남: 90, 서: 180, 중: 45 } as const;

function highlightPos(direction: BirthRegion["direction"]) {
  if (direction === "동") return { cx: 95, cy: 100 };
  if (direction === "서") return { cx: 55, cy: 100 };
  if (direction === "남") return { cx: 78, cy: 165 };
  if (direction === "북") return { cx: 78, cy: 35 };
  return { cx: 78, cy: 100 };
}

/** 한반도 + 방위 나침반 인포그래픽 */
export default function KoreaRegionChart({ region }: { region: BirthRegion }) {
  const color = OHENG_HEX[region.oheng];
  const angle = DIR_ANGLE[region.direction];
  const { cx, cy } = highlightPos(region.direction);

  return (
    <div className="info-chart flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <svg viewBox="0 0 160 200" className="h-44 w-32 shrink-0" aria-hidden>
        <path
          d="M78 18 C68 22 62 35 58 50 L52 75 C48 95 44 115 46 135 C48 155 55 168 62 178 L70 188 C75 192 82 190 88 182 L95 170 C102 158 108 140 110 120 L112 95 C114 70 108 45 98 30 C92 22 86 16 78 18 Z"
          fill="#f5f5f5"
          stroke="#d4d4d4"
          strokeWidth="1.5"
        />
        <circle cx={cx} cy={cy} r="10" fill={color} opacity="0.85" />
        <circle cx={cx} cy={cy} r="14" fill="none" stroke={color} strokeWidth="2" opacity="0.4" />
        <text x="80" y="198" textAnchor="middle" fontSize="9" fill="#737373">
          {region.label}
        </text>
      </svg>

      <div className="relative flex h-36 w-36 items-center justify-center">
        <svg viewBox="0 0 120 120" className="h-full w-full">
          <circle cx="60" cy="60" r="52" fill="#fafafa" stroke="#e5e5e5" />
          {(["북", "동", "남", "서"] as const).map((d) => {
            const a = (DIR_ANGLE[d] * Math.PI) / 180;
            const x = 60 + 38 * Math.sin(a);
            const y = 60 - 38 * Math.cos(a);
            const isActive = region.direction === d;
            return (
              <text
                key={d}
                x={x}
                y={y + 4}
                textAnchor="middle"
                fontSize={isActive ? "12" : "10"}
                fontWeight={isActive ? "700" : "500"}
                fill={isActive ? color : "#a3a3a3"}
              >
                {d}
              </text>
            );
          })}
          <g transform={`rotate(${angle} 60 60)`}>
            <polygon points="60,28 54,48 66,48" fill={color} />
          </g>
          <circle cx="60" cy="60" r="6" fill={color} opacity="0.3" />
        </svg>
        <div className="absolute bottom-0 text-center">
          <p className="text-xs font-semibold" style={{ color }}>
            {region.oheng}행 · {region.terrain}
          </p>
        </div>
      </div>
    </div>
  );
}
