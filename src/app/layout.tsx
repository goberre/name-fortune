import type { Metadata, Viewport } from "next";
import { Noto_Serif_KR } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import { brandUrls } from "@/config/brand";
import { seoConfig } from "@/config/seo";
import { siteConfig } from "@/config/site";
import "./globals.css";

const notoSerifKr = Noto_Serif_KR({
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-noto-serif-kr",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0B0C",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: seoConfig.title, template: `%s | ${siteConfig.brand}` },
  description: seoConfig.description,
  keywords: [...seoConfig.keywords],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/", languages: { "ko-KR": "/" } },
  openGraph: {
    type: "website",
    locale: seoConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: seoConfig.title,
    description: seoConfig.description,
    images: [{ url: seoConfig.ogImage, width: 1200, height: 630, alt: seoConfig.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.title,
    description: seoConfig.description,
    images: [seoConfig.ogImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={notoSerifKr.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="home" href={brandUrls.hub} />
        <link rel="preload" href="/data/hanja-index.json" as="fetch" crossOrigin="anonymous" />
      </head>
      <body className="mk-body min-h-screen antialiased">
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
