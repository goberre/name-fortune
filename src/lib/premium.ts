import { brandUrls } from "@/config/brand";

const STORAGE_KEY = "name-fortune-couple-premium";

/** 테스트 중이면 결제하기 → 즉시 잠금 해제 (실결제 없음) */
export function isCouplePremiumTestMode(): boolean {
  return process.env.NEXT_PUBLIC_COUPLE_PREMIUM_TEST !== "0";
}

export function isCouplePremiumUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  if (sessionStorage.getItem(STORAGE_KEY) === "1") return true;
  if (process.env.NODE_ENV === "development") {
    return new URLSearchParams(window.location.search).get("premium") === "1";
  }
  return false;
}

export function unlockCouplePremium(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, "1");
}

export function getCouplePremiumPayUrl(opts?: { pairScore?: number; nameA?: string; nameB?: string }): string {
  const params = new URLSearchParams({
    from: "name-fortune",
    product: "couple-report",
  });
  if (opts?.pairScore !== undefined) params.set("score", String(opts.pairScore));
  if (opts?.nameA) params.set("a", opts.nameA);
  if (opts?.nameB) params.set("b", opts.nameB);
  return `${brandUrls.pay}?${params.toString()}`;
}

export const COUPLE_PREMIUM_PRICE_LABEL = "9,900원";
