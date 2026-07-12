/** Full-screen horror-mystic atmosphere */
export default function MysticAmbience() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="myst-void" />
      <div className="myst-blood-moon" />
      <div className="myst-vignette" />
      <div className="myst-vignette-deep" />
      <div className="myst-fog myst-fog-1" />
      <div className="myst-fog myst-fog-2" />
      <div className="myst-fog myst-fog-3" />

      {/* Candles */}
      <div className="myst-candle myst-candle-l" />
      <div className="myst-candle myst-candle-r" />

      {Array.from({ length: 36 }).map((_, i) => (
        <span
          key={i}
          className={`myst-ember ${i % 3 === 0 ? "myst-ember-red" : ""}`}
          style={{
            left: `${(i * 13 + 3) % 100}%`,
            animationDelay: `${(i * 0.9) % 11}s`,
            animationDuration: `${6 + (i % 7)}s`,
          }}
        />
      ))}

      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={`ash-${i}`}
          className="myst-ash"
          style={{
            left: `${10 + i * 11}%`,
            animationDelay: `${i * 1.7}s`,
          }}
        />
      ))}

      <div className="myst-grain" />
      <div className="myst-scan" />
    </div>
  );
}
