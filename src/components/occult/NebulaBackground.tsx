/** 성운 + 별 노이즈 배경 레이어 */
export default function NebulaBackground() {
  return (
    <div className="oc-nebula pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="oc-nebula-blob oc-nebula-blob-1" />
      <div className="oc-nebula-blob oc-nebula-blob-2" />
      <div className="oc-nebula-blob oc-nebula-blob-3" />
      <div className="oc-starfield" />
    </div>
  );
}
