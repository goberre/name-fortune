/** Rotating occult ring behind the name input altar */
export default function RitualCircle({ active = false }: { active?: boolean }) {
  return (
    <div
      className={`ritual-ring-wrap pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${active ? "ritual-ring-active" : ""}`}
      aria-hidden
    >
      <svg viewBox="0 0 320 320" className="ritual-ring-svg h-[min(92vw,340px)] w-[min(92vw,340px)]">
        <defs>
          <radialGradient id="ring-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(220,38,38,0.08)" />
            <stop offset="55%" stopColor="rgba(88,28,135,0.12)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>
        <circle cx="160" cy="160" r="150" fill="url(#ring-glow)" />
        <circle cx="160" cy="160" r="138" className="ritual-outer" fill="none" strokeWidth="1" />
        <circle cx="160" cy="160" r="118" className="ritual-mid" fill="none" strokeWidth="0.5" strokeDasharray="4 8" />
        <circle cx="160" cy="160" r="98" className="ritual-inner" fill="none" strokeWidth="1" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          const x = 160 + Math.cos(a) * 128;
          const y = 160 + Math.sin(a) * 128;
          const branches = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
          return (
            <g key={i} transform={`translate(${x}, ${y})`}>
              <circle r="3" className="ritual-node" />
              <text y="4" textAnchor="middle" className="ritual-rune fill-current text-[9px]">
                {branches[i]}
              </text>
            </g>
          );
        })}
        <text x="160" y="28" textAnchor="middle" className="ritual-caption fill-current text-[10px]">
          이름 · 운명 · 기운
        </text>
        <text x="160" y="298" textAnchor="middle" className="ritual-caption fill-current text-[10px]">
          오행 순환
        </text>
      </svg>
    </div>
  );
}
