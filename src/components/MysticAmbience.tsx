/** Full-screen atmosphere — 경량화 */
import FolklorePassers from "@/components/FolklorePassers";

export default function MysticAmbience() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="myst-void" />
      <div className="myst-blood-moon" />
      <div className="myst-vignette" />
      <div className="myst-fog myst-fog-1" />
      <div className="myst-fog myst-fog-2" />
      <FolklorePassers />
      <div className="myst-candle myst-candle-l" />
      <div className="myst-candle myst-candle-r" />
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className="myst-ember"
          style={{
            left: `${(i * 12 + 5) % 90}%`,
            animationDelay: `${i * 1.4}s`,
            animationDuration: `${8 + (i % 3)}s`,
          }}
        />
      ))}
    </div>
  );
}
