export const siteConfig = {
  brand: "돌고래",
  name: "이름으로 풀어보자",
  tagline: "이름만 입력하면 성격·운세·오행을 바로 확인",
  description:
    "한글 이름으로 오행·성격·연애·재물·직업운을 무료 분석. 이름 풀이, 이름 사주, 성명학 기반. ehfrhfo.com 돌고래 — 회원가입 없음.",
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
