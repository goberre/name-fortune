import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mk-body min-h-screen text-[var(--mk-ivory)]">
      <header className="mx-auto max-w-lg px-4 py-8">
        <Link href="/" className="text-sm text-[var(--mk-cinnabar-soft)] hover:underline">
          ← 돌아가기
        </Link>
        <h1 className="font-musok mt-4 text-xl">개인정보처리방침</h1>
      </header>
      <main className="mx-auto max-w-lg px-4 pb-12">
        <article className="mk-card p-6 text-sm leading-7 text-[var(--mk-ivory-dim)]">
          <p className="mb-6">
            {siteConfig.url} ({siteConfig.name}) 이용 시 개인정보 처리 방침입니다.
          </p>
          <p>
            입력한 이름은 브라우저에서만 분석되며 서버에 저장하지 않습니다. 접속 로그·쿠키는 Cloudflare 및
            분석·광고 서비스에서 수집될 수 있습니다.
          </p>
        </article>
      </main>
    </div>
  );
}
