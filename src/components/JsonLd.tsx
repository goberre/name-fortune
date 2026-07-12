import { brandUrls } from "@/config/brand";
import { seoConfig } from "@/config/seo";
import { siteConfig } from "@/config/site";

export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${brandUrls.hub}/#organization`,
        name: brandUrls.brandName,
        url: brandUrls.hub,
      },
      {
        "@type": "WebSite",
        "@id": `${brandUrls.hub}/#website`,
        name: siteConfig.name,
        url: brandUrls.hub,
        publisher: { "@id": `${brandUrls.hub}/#organization` },
        inLanguage: "ko-KR",
      },
      {
        "@type": "WebApplication",
        name: siteConfig.name,
        url: siteConfig.url,
        description: seoConfig.description,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        provider: { "@id": `${brandUrls.hub}/#organization` },
        isPartOf: { "@id": `${brandUrls.hub}/#website` },
        offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
        inLanguage: "ko-KR",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
