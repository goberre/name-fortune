"use client";

import { getSurnameGlossForChar } from "@/lib/surname-hanja";
import type { StrokeSlot } from "@/lib/seongmyung";

/** 성씨(姓) 한자 풀이 패널 */
export default function SurnameHanjaPanel({ slots, name }: { slots: StrokeSlot[]; name: string }) {
  const surnameSlots = slots.filter((s) => s.role === "성" && s.hanja);
  if (surnameSlots.length === 0) return null;

  const surnameHangul = surnameSlots.map((s) => s.char).join("");
  const surnameHanja = surnameSlots.map((s) => s.hanja).join("");
  const glossParts = surnameSlots.map((s) => {
    const charIndex = slots.findIndex((slot) => slot === s);
    return getSurnameGlossForChar(name, charIndex, s.hanja!) ?? s.hanjaMeaning ?? "성씨 한자";
  });

  return (
    <div className="mk-card border border-[var(--mk-cinnabar)]/25 p-5">
      <p className="mk-kicker">성씨 (姓) · 한자 풀이</p>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-musok text-lg text-[var(--mk-ivory)]">{surnameHangul}</span>
        <span className="font-musok text-xl text-[var(--mk-cinnabar-soft)]">{surnameHanja}</span>
      </div>
      <ul className="mt-3 space-y-2">
        {surnameSlots.map((s, i) => (
          <li key={`${s.char}-${i}`} className="text-sm leading-relaxed text-[var(--mk-ivory-dim)]">
            <span className="text-[var(--mk-cinnabar-soft)]">
              {s.char}({s.hanja})
            </span>
            {" — "}
            {glossParts[i]}
          </li>
        ))}
      </ul>
      {name.length > surnameHangul.length && (
        <p className="mt-3 text-xs text-[var(--mk-ivory-muted)]">
          이름 {name.slice(surnameHangul.length)}(
          {slots
            .filter((s) => s.role !== "성")
            .map((s) => s.hanja)
            .join("")}
          )과 함께 사격(四格)을 읽습니다.
        </p>
      )}
    </div>
  );
}
