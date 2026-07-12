/** Fixed background — fog, vignette, embers. No interaction. */
export default function MysticAmbience() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="myst-vignette" />
      <div className="myst-fog myst-fog-1" />
      <div className="myst-fog myst-fog-2" />
      <div className="myst-moon" />
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="myst-ember"
          style={{
            left: `${(i * 17 + 7) % 100}%`,
            animationDelay: `${(i * 1.3) % 9}s`,
            animationDuration: `${7 + (i % 5)}s`,
          }}
        />
      ))}
      <div className="myst-scan" />
    </div>
  );
}
