import type { Metadata, Viewport } from "next";
import JsonLd from "@/components/JsonLd";
import { brandUrls } from "@/config/brand";
import { seoConfig } from "@/config/seo";
import { siteConfig } from "@/config/site";
import "./globals.css";

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
    siteName: siteConfig.brand,
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
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="home" href={brandUrls.hub} />
        <link rel="preload" href="/data/hanja-index.json" as="fetch" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="mk-body min-h-screen antialiased">
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
