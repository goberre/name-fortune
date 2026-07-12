/** 전통 문양 배경 — 먹·한지·문창살 */
export default function InkBackground() {
  return (
    <div className="mk-bg-layer pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <div className="mk-hanji-texture" />
      <div className="mk-munjang" />
      <div className="mk-ink-bleed" />
    </div>
  );
}
