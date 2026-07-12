/** 도깨비불 + 도깨비·백호 실루엣 — 한국 무속·사신록 분위기 */
export default function FolklorePassers() {
  const fires = [
    { top: "18%", left: "12%", size: 14, delay: "0s", dur: "7s" },
    { top: "32%", left: "78%", size: 10, delay: "1.2s", dur: "9s" },
    { top: "55%", left: "22%", size: 18, delay: "2.5s", dur: "8s" },
    { top: "68%", left: "65%", size: 12, delay: "0.8s", dur: "10s" },
    { top: "42%", left: "45%", size: 8, delay: "3s", dur: "6s" },
    { top: "75%", left: "38%", size: 16, delay: "1.8s", dur: "11s" },
    { top: "25%", left: "55%", size: 11, delay: "4s", dur: "8.5s" },
  ] as const;

  return (
    <div className="folklore-layer pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* 도깨비불 */}
      {fires.map((f, i) => (
        <div
          key={i}
          className="dok-fire"
          style={{
            top: f.top,
            left: f.left,
            width: f.size,
            height: f.size * 1.4,
            animationDelay: f.delay,
            animationDuration: f.dur,
          }}
        >
          <span className="dok-fire-core" />
          <span className="dok-fire-tail" />
        </div>
      ))}

      {/* 도깨비 — 지나감 */}
      <div className="dok-spirit dok-spirit-1">
        <svg viewBox="0 0 120 160" className="h-28 w-20 opacity-[0.14] sm:h-36 sm:w-24">
          <defs>
            <filter id="dok-blur">
              <feGaussianBlur stdDeviation="1.2" />
            </filter>
          </defs>
          <g filter="url(#dok-blur)" fill="#86efac">
            {/* 뿔 */}
            <path d="M38 18 L32 4 L42 16 Z" />
            <path d="M72 16 L78 2 L68 17 Z" />
            {/* 몸 */}
            <ellipse cx="55" cy="72" rx="28" ry="36" opacity="0.9" />
            {/* 방망이 */}
            <rect x="78" y="48" width="8" height="52" rx="3" transform="rotate(18 82 74)" opacity="0.7" />
            <circle cx="88" cy="44" r="10" opacity="0.6" />
            {/* 다리 */}
            <ellipse cx="42" cy="118" rx="10" ry="16" />
            <ellipse cx="68" cy="120" rx="10" ry="16" />
            {/* 눈 */}
            <circle cx="46" cy="62" r="3" fill="#052e16" />
            <circle cx="64" cy="62" r="3" fill="#052e16" />
          </g>
        </svg>
      </div>

      <div className="dok-spirit dok-spirit-2">
        <svg viewBox="0 0 100 140" className="h-24 w-16 opacity-[0.1] sm:h-32 sm:w-20">
          <defs>
            <filter id="dok-blur-2">
              <feGaussianBlur stdDeviation="1.2" />
            </filter>
          </defs>
          <g fill="#6ee7b7" filter="url(#dok-blur-2)">
            <path d="M30 14 L26 2 L36 13 Z" />
            <path d="M58 13 L62 1 L52 14 Z" />
            <ellipse cx="44" cy="58" rx="22" ry="30" />
            <rect x="62" y="38" width="6" height="44" rx="2" transform="rotate(22 65 60)" opacity="0.65" />
            <circle cx="70" cy="35" r="8" opacity="0.55" />
          </g>
        </svg>
      </div>

      {/* 백호 — 서쪽 수호신, 안개 속을 지나감 */}
      <div className="baekho-spirit">
        <svg viewBox="0 0 280 120" className="h-16 w-56 opacity-[0.08] sm:h-20 sm:w-72">
          <defs>
            <linearGradient id="baekho-fade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0" />
              <stop offset="30%" stopColor="#cbd5e1" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#f1f5f9" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0" />
            </linearGradient>
            <filter id="baekho-mist">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>
          <g filter="url(#baekho-mist)" fill="url(#baekho-fade)">
            {/* 백호 실루엣 */}
            <path d="M30 75 Q20 55 35 45 Q50 30 70 38 Q85 25 105 32 Q130 28 155 40 Q175 35 195 48 Q215 42 230 55 Q245 50 250 65 Q248 80 235 85 Q220 92 200 88 Q180 95 160 90 Q140 98 120 92 Q100 96 80 90 Q60 94 45 88 Q32 82 30 75 Z" />
            {/* 머리 */}
            <path d="M235 55 Q250 48 258 58 Q262 68 252 72 Q245 65 235 55 Z" />
            {/* 꼬리 */}
            <path d="M30 75 Q15 70 8 58 Q5 48 18 52 Q25 62 30 75 Z" opacity="0.7" />
            {/* 줄무늬 */}
            <path d="M90 72 Q110 68 130 72" stroke="#94a3b8" strokeWidth="2" fill="none" opacity="0.4" />
            <path d="M150 68 Q170 64 190 70" stroke="#94a3b8" strokeWidth="2" fill="none" opacity="0.35" />
            {/* 눈 — 서늘한 기운 */}
            <ellipse cx="248" cy="60" rx="3" ry="2" fill="#fef08a" opacity="0.6" />
          </g>
        </svg>
      </div>

      {/* 산신/정령 안개 */}
      <div className="mountain-mist mountain-mist-1" />
      <div className="mountain-mist mountain-mist-2" />
    </div>
  );
}
