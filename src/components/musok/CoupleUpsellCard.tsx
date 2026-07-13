"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { COUPLE_UPSELL_LINES, PREMIUM_FEATURES } from "@/lib/compatibility-copy";
import {
  COUPLE_PREMIUM_PRICE_LABEL,
  getCouplePremiumPayUrl,
  isCouplePremiumTestMode,
  isCouplePremiumUnlocked,
  unlockCouplePremium,
} from "@/lib/premium";

export default function CoupleUpsellCard({ onStart }: { onStart: () => void }) {
  const testMode = isCouplePremiumTestMode();
  const [unlocked, setUnlocked] = useState(() =>
    typeof window !== "undefined" ? isCouplePremiumUnlocked() : false,
  );

  function handlePay() {
    if (testMode) {
      unlockCouplePremium();
      setUnlocked(true);
      onStart();
      return;
    }
    window.open(getCouplePremiumPayUrl(), "_blank", "noopener,noreferrer");
  }

  function handleConfirmPaid() {
    unlockCouplePremium();
    setUnlocked(true);
    onStart();
  }

  if (unlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mk-card-elevated border border-[var(--mk-cinnabar)]/25 p-6 sm:p-8"
      >
        <p className="mk-kicker">2차 — 배우자 · 연인 궁합</p>
        <h3 className="font-musok mt-2 text-xl text-[var(--mk-ivory)]">신수 쌍통(身數 雙通) 열기</h3>
        <p className="mt-3 text-sm text-[var(--mk-ivory-dim)]">
          본인 정보는 그대로 유지됩니다. 상대방 정보만 입력하면 전체 궁합 풀이가 바로 열립니다.
        </p>
        <button type="button" onClick={onStart} className="mk-btn mk-btn-primary mt-6 w-full">
          배우자 · 연인 추가하기 — 合
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mk-card-elevated border border-[var(--mk-cinnabar)]/25 p-6 sm:p-8"
    >
      <p className="mk-kicker">2차 — 배우자 · 연인 궁합</p>
      <h3 className="font-musok mt-2 text-xl text-[var(--mk-ivory)]">신수 쌍통(身數 雙通)</h3>
      <div className="mt-4 space-y-2">
        {COUPLE_UPSELL_LINES.map((line) => (
          <p key={line} className="text-sm leading-relaxed text-[var(--mk-ivory-dim)]">
            {line}
          </p>
        ))}
      </div>

      <div className="mt-5 space-y-1.5 border-t border-[var(--mk-border)] pt-4">
        <p className="text-[10px] text-[var(--mk-ivory-muted)]">포함 항목</p>
        {PREMIUM_FEATURES.map((f) => (
          <p key={f} className="text-[11px] text-[var(--mk-ivory-dim)]">· {f}</p>
        ))}
      </div>

      <button
        type="button"
        onClick={handlePay}
        className="mk-btn mk-btn-primary mt-7 w-full"
      >
        결제하기 · {COUPLE_PREMIUM_PRICE_LABEL}
      </button>

      {!testMode && (
        <button
          type="button"
          onClick={handleConfirmPaid}
          className="mk-btn mk-btn-ghost mt-3 w-full text-xs"
        >
          결제 완료 확인
        </button>
      )}

      {testMode && (
        <p className="mt-3 text-center text-[10px] text-[var(--mk-ivory-muted)]">
          테스트 버전 — 결제하기를 누르면 바로 열립니다
        </p>
      )}
    </motion.div>
  );
}
