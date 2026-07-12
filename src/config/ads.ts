/** 1차 수익: AdSense · 쿠팡 파트너스 (솔로 결과 화면) */
export const adsConfig = {
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "",
  adsenseSlotTop: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP ?? "",
  adsenseSlotMid: process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID ?? "",
  coupangWidgetId: process.env.NEXT_PUBLIC_COUPANG_WIDGET_ID ?? "",
  coupangTrackingCode: process.env.NEXT_PUBLIC_COUPANG_TRACKING ?? "",
} as const;

export function isAdsEnabled(): boolean {
  return Boolean(adsConfig.adsenseClient || adsConfig.coupangWidgetId);
}
