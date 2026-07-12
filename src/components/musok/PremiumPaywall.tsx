"use client";

import { useState } from "react";
import {
  COUPLE_PREMIUM_PRICE_LABEL,
  getCouplePremiumPayUrl,
  isCouplePremiumUnlocked,
  unlockCouplePremium,
} from "@/lib/premium";
import { PREMIUM_FEATURES } from "@/lib/compatibility-copy";

type Props = {
  pairScore: number;
  nameA: string;
  nameB: string;
  children: React.ReactNode;
  teaser?: React.ReactNode;
};

export default function PremiumPaywall({ pairScore, nameA, nameB, children, teaser }: Props) {
  const [unlocked, setUnlocked] = useState(() =>
    typeof window !== "undefined" ? isCouplePremiumUnlocked() : false,
  );

  function handlePay() {
    window.open(getCouplePremiumPayUrl({ pairScore, nameA, nameB }), "_blank", "noopener,noreferrer");
  }

  function handleConfirmPaid() {
    unlockCouplePremium();
    setUnlocked(true);
  }

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {teaser}
      <div className="mk-premium-lock relative mt-4 overflow-hidden rounded-sm border border-[var(--mk-border)]">
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
            상세 궁합 명통 열기
          </button>
          <button type="button" onClick={handleConfirmPaid} className="mk-btn mk-btn-ghost mt-3 w-full max-w-xs text-xs">
            결제 완료 확인 (결제 페이지에서 돌아온 경우)
          </button>
          <p className="mt-3 max-w-xs text-[10px] leading-relaxed text-[var(--mk-ivory-muted)]">
            결제 연동 전까지는 결제 후 위 버튼으로 잠금을 해제합니다. 추후 자동 확인으로 전환됩니다.
          </p>
          <button
            type="button"
            onClick={() => setUnlocked(isCouplePremiumUnlocked())}
            className="mt-4 text-[10px] text-[var(--mk-ivory-muted)] underline"
          >
            잠금 상태 새로고침
          </button>
        </div>
      </div>
    </div>
  );
}
