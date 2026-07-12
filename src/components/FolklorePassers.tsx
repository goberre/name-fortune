/** 도깨비불 + 도깨비·백호 — 경량 CSS만 사용 */
export default function FolklorePassers() {
  const fires = [
    { top: "20%", left: "10%", size: 12, delay: "0s" },
    { top: "45%", left: "72%", size: 10, delay: "0.5s" },
    { top: "62%", left: "28%", size: 14, delay: "1s" },
    { top: "35%", left: "52%", size: 9, delay: "1.5s" },
  ] as const;

  return (
    <div className="folklore-layer" aria-hidden>
      {fires.map((f, i) => (
        <div
          key={i}
          className="dok-fire"
          style={{
            top: f.top,
            left: f.left,
            width: f.size,
            height: f.size * 1.3,
            animationDelay: f.delay,
          }}
        >
          <span className="dok-fire-core" />
        </div>
      ))}

      {/* 도깨비 — 0초 */}
      <div className="dok-spirit dok-spirit-1 blur-[1px]">
        <svg viewBox="0 0 120 160" className="h-28 w-20 opacity-[0.16] sm:h-32 sm:w-22">
          <g fill="#86efac">
            <path d="M38 18 L32 4 L42 16 Z" />
            <path d="M72 16 L78 2 L68 17 Z" />
            <ellipse cx="55" cy="72" rx="28" ry="36" />
            <rect x="78" y="48" width="8" height="52" rx="3" transform="rotate(18 82 74)" opacity="0.7" />
            <circle cx="88" cy="44" r="10" opacity="0.6" />
            <ellipse cx="42" cy="118" rx="10" ry="16" />
            <ellipse cx="68" cy="120" rx="10" ry="16" />
            <circle cx="46" cy="62" r="3" fill="#052e16" />
            <circle cx="64" cy="62" r="3" fill="#052e16" />
          </g>
        </svg>
      </div>

      {/* 도깨비 — 2초 후 */}
      <div className="dok-spirit dok-spirit-2 blur-[1px]">
        <svg viewBox="0 0 100 140" className="h-24 w-16 opacity-[0.12] sm:h-28 sm:w-18">
          <g fill="#6ee7b7">
            <path d="M30 14 L26 2 L36 13 Z" />
            <path d="M58 13 L62 1 L52 14 Z" />
            <ellipse cx="44" cy="58" rx="22" ry="30" />
            <rect x="62" y="38" width="6" height="44" rx="2" transform="rotate(22 65 60)" opacity="0.65" />
          </g>
        </svg>
      </div>

      {/* 백호 — 1초 후 */}
      <div className="baekho-spirit blur-[1.5px]">
        <svg viewBox="0 0 280 120" className="h-14 w-52 opacity-[0.1] sm:h-18 sm:w-64">
          <g fill="#cbd5e1">
            <path d="M30 75 Q20 55 35 45 Q50 30 70 38 Q85 25 105 32 Q130 28 155 40 Q175 35 195 48 Q215 42 230 55 Q245 50 250 65 Q248 80 235 85 Q220 92 200 88 Q180 95 160 90 Q140 98 120 92 Q100 96 80 90 Q60 94 45 88 Q32 82 30 75 Z" />
            <path d="M235 55 Q250 48 258 58 Q262 68 252 72 Q245 65 235 55 Z" />
            <path d="M30 75 Q15 70 8 58 Q5 48 18 52 Q25 62 30 75 Z" opacity="0.7" />
            <ellipse cx="248" cy="60" rx="3" ry="2" fill="#fef08a" opacity="0.55" />
          </g>
        </svg>
      </div>
    </div>
  );
}
