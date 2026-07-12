import SeongmyungApp from "@/components/SeongmyungApp";
import { brandUrls } from "@/config/brand";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="ap-bg relative min-h-screen">
      <div className="relative">
        <header className="mx-auto flex max-w-2xl items-center justify-between px-5 py-6">
          <a href={brandUrls.hub} className="text-sm text-neutral-500 transition hover:text-neutral-900">
            ← 돌고래
          </a>
          <Link href="/privacy" className="text-sm text-neutral-400 hover:text-neutral-600">
            개인정보
          </Link>
        </header>

        <main>
          <section className="mx-auto max-w-2xl px-5 pb-4 text-center">
            <p className="text-xs font-medium tracking-[0.2em] text-neutral-400">NAME FORTUNE</p>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              이름 속 숨겨진 운명
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-neutral-500">
              {siteConfig.tagline}
            </p>
            <p className="mt-3 text-xs text-neutral-400">한자 원획법 · 자원오행 · 81수리 사격</p>
          </section>

          <SeongmyungApp />

          <section className="sr-only" aria-label="서비스 설명">
            <h2>이름 풀이 무료</h2>
            <p>{siteConfig.description}</p>
          </section>
        </main>

        <footer className="mx-auto max-w-2xl px-5 py-12 text-center text-xs text-neutral-400">
          {siteConfig.brand} · ehfrhfo.com
        </footer>
      </div>
    </div>
  );
}
