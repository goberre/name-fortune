"use client";

import { useEffect, useRef } from "react";
import { adsConfig } from "@/config/ads";

type Props = {
  slotId: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
};

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

function loadAdSenseScript(client: string) {
  if (document.querySelector(`script[data-adsense-client="${client}"]`)) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
  s.crossOrigin = "anonymous";
  s.setAttribute("data-adsense-client", client);
  document.head.appendChild(s);
}

export default function AdSlot({ slotId, format = "auto", className = "" }: Props) {
  const pushed = useRef(false);
  const client = adsConfig.adsenseClient;

  useEffect(() => {
    if (!client || !slotId || pushed.current) return;
    loadAdSenseScript(client);
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ignore ad block */
    }
  }, [client, slotId]);

  if (!client || !slotId) return null;

  return (
    <div className={`mk-ad-slot overflow-hidden ${className}`} aria-label="광고">
      <ins
        className="adsbygoogle block min-h-[90px] w-full"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
