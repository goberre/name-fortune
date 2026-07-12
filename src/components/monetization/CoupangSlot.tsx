"use client";

import { adsConfig } from "@/config/ads";

/** 쿠팡 파트너스 위젯 — ID 설정 시 iframe 삽입 */
export default function CoupangSlot({ className = "" }: { className?: string }) {
  const { coupangWidgetId, coupangTrackingCode } = adsConfig;
  if (!coupangWidgetId) return null;

  const src = `https://ads-partners.coupang.com/widgets.html?id=${coupangWidgetId}${coupangTrackingCode ? `&trackingCode=${coupangTrackingCode}` : ""}`;

  return (
    <div className={`mk-ad-slot overflow-hidden ${className}`} aria-label="쿠팡 파트너스">
      <iframe
        title="쿠팡 파트너스"
        src={src}
        width="100%"
        height="280"
        className="border-0"
        scrolling="no"
        referrerPolicy="unsafe-url"
      />
    </div>
  );
}
