"use client";

import { useState } from "react";
import {
  COUPLE_PREMIUM_PRICE_LABEL,
  getCouplePremiumPayUrl,
  isCouplePremiumTestMode,
  isCouplePremiumUnlocked,
  unlockCouplePremium,
} from "@/lib/premium";
import { PREMIUM_FEATURES } from "@/lib/compatibility-copy";

type Props = {
  pairScore: number;
  nameA: string;
  nameB: string;
  children: React.ReactNode;
};

export default function PremiumPaywall({ pairScore, nameA, nameB, children }: Props) {
  const testMode = isCouplePremiumTestMode();
  const [unlocked, setUnlocked] = useState(() =>
    typeof window !== "undefined" ? isCouplePremiumUnlocked() : false,
  );

  function handlePay() {
    if (testMode) {
      unlockCouplePremium();
      setUnlocked(true);
      return;
    }
    window.open(getCouplePremiumPayUrl({ pairScore, nameA, nameB }), "_blank", "noopener,noreferrer");
  }

  function handleConfirmPaid() {
    unlockCouplePremium();
    setUnlocked(true);
  }

  if (unlocked) {
    return <>{children}</>;
  }

  if (testMode) {
    return (
      <div className="mk-card border border-[var(--mk-cinnabar)]/30 p-5 text-center sm:p-8">
        <p className="mk-kicker">쌍통 상세 명통 (雙通 詳通)</p>
        <p className="font-musok mt-3 text-lg text-[var(--mk-ivory)]">배우자 궁합 심층 풀이</p>
        <p className="mt-2 text-sm text-[var(--mk-cinnabar-soft)]">{COUPLE_PREMIUM_PRICE_LABEL}</p>
        <ul className="mx-auto mt-5 max-w-sm space-y-2 text-left">
          {PREMIUM_FEATURES.map((f) => (
            <li key={f} className="text-[11px] text-[var(--mk-ivory-dim)]">
              · {f}
            </li>
          ))}
        </ul>
        <button type="button" onClick={handlePay} className="mk-btn mk-btn-primary mt-8 w-full max-w-xs">
          결제하기 · {COUPLE_PREMIUM_PRICE_LABEL}
        </button>
        <p className="mx-auto mt-4 max-w-xs text-[10px] leading-relaxed text-[var(--mk-ivory-muted)]">
          테스트 버전 — 결제하기를 누르면 상세 궁합 풀이가 열립니다.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mk-premium-lock relative overflow-hidden rounded-sm border border-[var(--mk-border)]">
        <div className="mk-premium-blur pointer-events-none select-none p-6 opacity-40">{children}</div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--mk-charcoal)]/85 px-6 py-10 text-center backdrop-blur-sm">
          <p className="mk-kicker">쌍통 상세 명통 (雙通 詳通)</p>
          <p className="font-musok mt-3 text-lg text-[var(--mk-ivory)]">배우자 궁합 심층 풀이</p>
          <p className="mt-2 text-sm text-[var(--mk-cinnabar-soft)]">{COUPLE_PREMIUM_PRICE_LABEL}</p>
          <ul className="mt-5 space-y-2 text-left">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="text-[11px] text-[var(--mk-ivory-dim)]">
                · {f}
              </li>
            ))}
          </ul>
          <button type="button" onClick={handlePay} className="mk-btn mk-btn-primary mt-8 w-full max-w-xs">
            결제하기 · {COUPLE_PREMIUM_PRICE_LABEL}
          </button>
          <button type="button" onClick={handleConfirmPaid} className="mk-btn mk-btn-ghost mt-3 w-full max-w-xs text-xs">
            결제 완료 확인
          </button>
        </div>
      </div>
    </div>
  );
}
