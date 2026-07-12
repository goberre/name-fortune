import type { Oheng } from "@/lib/seongmyung";
import { OHENG_RUNE } from "@/lib/occult-copy";

export default function OhengRune({ oheng, size = "md" }: { oheng: Oheng; size?: "sm" | "md" | "lg" }) {
  const r = OHENG_RUNE[oheng];
  const sz = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-lg";
  return (
    <span
      className={`oc-rune inline-flex flex-col items-center gap-0.5 ${sz}`}
      style={{ color: r.hue, textShadow: `0 0 12px ${r.hue}66` }}
      title={`${oheng}행 · ${r.element}`}
    >
      <span className="font-occult leading-none">{r.rune}</span>
      <span className="text-[9px] tracking-widest opacity-70">{r.element}</span>
    </span>
  );
}
