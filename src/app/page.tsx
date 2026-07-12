import SeongmyungApp from "@/components/SeongmyungApp";
import { brandUrls } from "@/config/brand";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <header className="mx-auto flex max-w-2xl items-center justify-between px-5 py-5">
        <a href={brandUrls.hub} className="text-sm text-gray-400 transition hover:text-gray-600">
          ← 돌고래
        </a>
        <Link href="/privacy" className="text-sm text-gray-400 hover:text-gray-600">
          개인정보
        </Link>
      </header>

      <main>
        <section className="mx-auto max-w-2xl px-5 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Name Fortune</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            이름 역학 풀이
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-500">
            {siteConfig.tagline}
            <br />
            음양 · 발음오행 · 81수리 사격 분석
          </p>
        </section>

        <SeongmyungApp />

        <section className="sr-only" aria-label="서비스 설명">
          <h2>이름 풀이 무료</h2>
          <p>{siteConfig.description}</p>
        </section>
      </main>

      <footer className="mx-auto max-w-2xl px-5 py-10 text-center text-xs text-gray-300">
        {siteConfig.brand} · ehfrhfo.com
      </footer>
    </>
  );
}
