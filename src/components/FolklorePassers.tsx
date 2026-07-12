/** 도깨비불 + 도깨비·백호 — 한국 무속 실루엣 (구름/블롭 아님) */
export default function FolklorePassers() {
  const fires = [
    { top: "14%", left: "6%", size: 16, delay: "0s" },
    { top: "52%", left: "84%", size: 14, delay: "0.4s" },
    { top: "72%", left: "12%", size: 18, delay: "0.9s" },
    { top: "28%", left: "62%", size: 13, delay: "1.4s" },
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
            height: f.size * 1.4,
            animationDelay: f.delay,
          }}
        >
          <span className="dok-fire-core" />
        </div>
      ))}

      {/* 도깨비 — 뿔·방망이·얼굴 실루엣 */}
      <div className="dok-spirit dok-spirit-1">
        <svg viewBox="0 0 160 200" className="spirit-svg dok-svg" aria-hidden>
          <g className="dok-body">
            <path d="M48 38 L42 6 L58 34 Z" />
            <path d="M78 34 L84 4 L68 36 Z" />
            <ellipse cx="62" cy="62" rx="32" ry="30" />
            <circle cx="50" cy="58" r="6" className="dok-eye" />
            <circle cx="74" cy="58" r="6" className="dok-eye" />
            <path d="M46 78 Q62 92 78 76" className="dok-mouth" />
            <ellipse cx="62" cy="118" rx="38" ry="44" />
            <rect x="34" y="148" width="18" height="38" rx="9" />
            <rect x="72" y="150" width="18" height="36" rx="9" />
            <rect x="88" y="52" width="14" height="78" rx="7" transform="rotate(28 95 91)" />
            <circle cx="108" cy="44" r="16" />
            <circle cx="108" cy="44" r="10" opacity="0.35" />
          </g>
        </svg>
        <span className="spirit-label dok-label">도깨비</span>
      </div>

      <div className="dok-spirit dok-spirit-2">
        <svg viewBox="0 0 140 180" className="spirit-svg spirit-svg-sm dok-svg" aria-hidden>
          <g className="dok-body dok-body-alt">
            <path d="M38 32 L34 8 L48 30 Z" />
            <ellipse cx="52" cy="54" rx="26" ry="24" />
            <circle cx="42" cy="50" r="5" className="dok-eye" />
            <circle cx="62" cy="50" r="5" className="dok-eye" />
            <ellipse cx="52" cy="98" rx="30" ry="36" />
            <rect x="28" y="124" width="14" height="32" rx="7" />
            <rect x="62" y="126" width="14" height="30" rx="7" />
            <rect x="72" y="44" width="11" height="64" rx="5" transform="rotate(32 77 76)" />
            <circle cx="92" cy="38" r="13" />
          </g>
        </svg>
      </div>

      {/* 백호 — 호랑이 옆모습 (줄무늬·다리·꼬리) */}
      <div className="baekho-spirit">
        <svg viewBox="0 0 360 160" className="spirit-svg baekho-svg" aria-hidden>
          <g className="tiger-body">
            <path
              className="tiger-tail"
              d="M285 68 Q318 28 338 42 Q348 58 322 72 L300 76 Z"
            />
            <path className="tiger-leg" d="M248 98 L242 138 L262 138 L268 98 Z" />
            <path className="tiger-leg" d="M218 96 L212 136 L232 136 L238 96 Z" />
            <ellipse cx="195" cy="78" rx="78" ry="38" />
            <path className="tiger-leg" d="M128 94 L122 134 L142 134 L148 94 Z" />
            <path className="tiger-leg" d="M98 92 L92 132 L112 132 L118 92 Z" />
            <ellipse cx="72" cy="62" rx="42" ry="36" />
            <path className="tiger-ear" d="M48 38 L38 14 L62 32 Z" />
            <ellipse cx="52" cy="72" rx="20" ry="16" />
            <circle cx="66" cy="56" r="5" className="tiger-eye" />
            <path className="tiger-nose" d="M38 68 L32 74 L44 74 Z" />
            <path className="tiger-stripe" d="M120 52 L128 88" />
            <path className="tiger-stripe" d="M148 48 L156 86" />
            <path className="tiger-stripe" d="M176 46 L184 84" />
            <path className="tiger-stripe" d="M204 50 L212 86" />
            <path className="tiger-stripe" d="M232 54 L240 90" />
            <path className="tiger-stripe" d="M156 62 L168 72" />
            <path className="tiger-stripe" d="M188 60 L200 70" />
            <path className="tiger-whisker" d="M46 76 L18 72" />
            <path className="tiger-whisker" d="M46 80 L16 84" />
          </g>
        </svg>
        <span className="spirit-label baekho-label">백호 · 白虎</span>
      </div>
    </div>
  );
}
