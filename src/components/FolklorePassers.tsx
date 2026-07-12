/** 도깨비불 + 도깨비·백호 — 배경 최상단 레이어 */
export default function FolklorePassers() {
  const fires = [
    { top: "18%", left: "8%", size: 14, delay: "0s" },
    { top: "42%", left: "78%", size: 12, delay: "0.5s" },
    { top: "58%", left: "18%", size: 16, delay: "1s" },
    { top: "30%", left: "55%", size: 11, delay: "1.5s" },
    { top: "70%", left: "65%", size: 13, delay: "2s" },
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
            height: f.size * 1.35,
            animationDelay: f.delay,
          }}
        >
          <span className="dok-fire-core" />
        </div>
      ))}

      <div className="dok-spirit dok-spirit-1">
        <svg viewBox="0 0 120 160" className="spirit-svg dok-svg" aria-hidden>
          <g fill="#86efac">
            <path d="M38 18 L32 4 L42 16 Z" />
            <path d="M72 16 L78 2 L68 17 Z" />
            <ellipse cx="55" cy="72" rx="28" ry="36" />
            <rect x="78" y="48" width="8" height="52" rx="3" transform="rotate(18 82 74)" opacity="0.85" />
            <circle cx="88" cy="44" r="10" opacity="0.75" />
            <ellipse cx="42" cy="118" rx="10" ry="16" />
            <ellipse cx="68" cy="120" rx="10" ry="16" />
            <circle cx="46" cy="62" r="4" fill="#052e16" />
            <circle cx="64" cy="62" r="4" fill="#052e16" />
          </g>
        </svg>
      </div>

      <div className="dok-spirit dok-spirit-2">
        <svg viewBox="0 0 100 140" className="spirit-svg spirit-svg-sm dok-svg" aria-hidden>
          <g fill="#6ee7b7">
            <path d="M30 14 L26 2 L36 13 Z" />
            <path d="M58 13 L62 1 L52 14 Z" />
            <ellipse cx="44" cy="58" rx="22" ry="30" />
            <rect x="62" y="38" width="6" height="44" rx="2" transform="rotate(22 65 60)" opacity="0.8" />
            <circle cx="70" cy="35" r="8" opacity="0.7" />
          </g>
        </svg>
      </div>

      <div className="baekho-spirit">
        <svg viewBox="0 0 280 120" className="spirit-svg baekho-svg" aria-hidden>
          <g fill="#e2e8f0">
            <path d="M30 75 Q20 55 35 45 Q50 30 70 38 Q85 25 105 32 Q130 28 155 40 Q175 35 195 48 Q215 42 230 55 Q245 50 250 65 Q248 80 235 85 Q220 92 200 88 Q180 95 160 90 Q140 98 120 92 Q100 96 80 90 Q60 94 45 88 Q32 82 30 75 Z" />
            <path d="M235 55 Q250 48 258 58 Q262 68 252 72 Q245 65 235 55 Z" />
            <path d="M30 75 Q15 70 8 58 Q5 48 18 52 Q25 62 30 75 Z" opacity="0.85" />
            <path d="M90 72 Q110 68 130 72" stroke="#94a3b8" strokeWidth="2.5" fill="none" opacity="0.5" />
            <path d="M150 68 Q170 64 190 70" stroke="#94a3b8" strokeWidth="2.5" fill="none" opacity="0.45" />
            <ellipse cx="248" cy="60" rx="4" ry="2.5" fill="#fef08a" />
          </g>
        </svg>
        <span className="baekho-label">白虎 · 백호</span>
      </div>
    </div>
  );
}
