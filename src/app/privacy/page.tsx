import DolphinLogo from "@/components/DolphinLogo";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0612] text-white">
      <header className="mx-auto max-w-lg px-4 py-8">
        <Link href="/" className="text-sm text-violet-400 hover:underline">
          ← 돌아가기
        </Link>
        <div className="mt-4 flex items-center gap-2">
          <DolphinLogo size={24} className="text-violet-400" />
          <h1 className="text-xl font-semibold">개인정보처리방침</h1>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 pb-12">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm leading-7 text-white/60">
          <p className="mb-6">
            {siteConfig.url} (이름으로 풀어보자) 이용 시 개인정보 처리 방침입니다.
          </p>
          <p>
            입력한 이름은 브라우저에서만 분석되며 서버에 저장하지 않습니다. 접속 로그·쿠키는
            Cloudflare 및 분석·광고 서비스에서 수집될 수 있습니다.
          </p>
        </article>
      </main>
    </div>
  );
}
