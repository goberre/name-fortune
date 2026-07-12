"use client";

import { motion } from "framer-motion";
import { COUPLE_UPSELL_LINES } from "@/lib/compatibility-copy";

export default function CoupleUpsellCard({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mk-card-elevated border border-[var(--mk-cinnabar)]/25 p-6 sm:p-8"
    >
      <p className="mk-kicker">2차 — 배우자 · 연인 궁합</p>
      <h3 className="font-musok mt-2 text-xl text-[var(--mk-ivory)]">신수 쌍통(身數 雙通) 열기</h3>
      <div className="mt-4 space-y-2">
        {COUPLE_UPSELL_LINES.map((line) => (
          <p key={line} className="text-sm leading-relaxed text-[var(--mk-ivory-dim)]">
            {line}
          </p>
        ))}
      </div>
      <p className="mt-4 text-[10px] text-[var(--mk-ivory-muted)]">
        본인 정보는 그대로 — 상대만 추가하면 궁합 점수와 상세 풀이를 확인할 수 있습니다.
      </p>
      <button type="button" onClick={onStart} className="mk-btn mk-btn-primary mt-6 w-full">
        배우자 · 연인 추가하기 — 合
      </button>
      <p className="mt-3 text-center text-[10px] text-[var(--mk-cinnabar-soft)]">
        기본 궁합 무료 · 상세 명통 유료
      </p>
    </motion.div>
  );
}
