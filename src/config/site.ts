export const siteConfig = {
  brand: "돌고래",
  name: "이름으로 풀어보자",
  tagline: "한글 이름과 획수로 성명학 기반 역학을 확인하세요",
  description:
    "음양 조화, 발음오행, 81수리 원격·형격·이격·정격 분석. 한글 이름·한자 획수·생년 자원오행. 무료, ehfrhfo.com 돌고래.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://name.ehfrhfo.com",
  locale: "ko_KR",
  ogImage: "/og-image.svg",
} as const;

export const seoConfig = {
  title: "이름으로 풀어보자 | 무료 이름 풀이 · 오행·운세 분석",
  description: siteConfig.description,
  keywords: [
    "이름 풀이",
    "이름 사주",
    "이름으로 사주",
    "이름 운세",
    "이름 오행",
    "성명학",
    "이름 분석",
    "무료 이름 풀이",
    "한글 이름 풀이",
    "이름 궁합",
    "돌고래",
    "ehfrhfo",
  ],
  ogImage: siteConfig.ogImage,
  locale: siteConfig.locale,
  siteName: siteConfig.name,
} as const;
