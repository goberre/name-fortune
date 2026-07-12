import SeongmyungApp from "@/components/SeongmyungApp";
import { brandUrls } from "@/config/brand";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="nf-bg relative min-h-screen">
      <div className="relative z-10">
        <header className="mx-auto flex max-w-2xl items-center justify-between px-5 py-5">
          <a href={brandUrls.hub} className="text-sm text-violet-300/50 transition hover:text-violet-200">
            ← 돌고래
          </a>
          <Link href="/privacy" className="text-sm text-white/30 hover:text-white/50">
            개인정보
          </Link>
        </header>

        <main>
          <section className="mx-auto max-w-2xl px-5 text-center">
            <p className="text-xs font-medium tracking-[0.25em] text-violet-400/70">NAME FORTUNE</p>
            <h1 className="nf-title-glow mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="text-white/90">이름 속</span>
              <br />
              <span className="bg-gradient-to-r from-violet-200 via-purple-200 to-fuchsia-300 bg-clip-text text-transparent">
                숨겨진 운명
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/45">
              {siteConfig.tagline}
            </p>
            <p className="mt-2 text-xs text-violet-300/40">음양 · 발음오행 · 81수리 사격</p>
          </section>

          <SeongmyungApp />

          <section className="sr-only" aria-label="서비스 설명">
            <h2>이름 풀이 무료</h2>
            <p>{siteConfig.description}</p>
          </section>
        </main>

        <footer className="mx-auto max-w-2xl px-5 py-10 text-center text-xs text-white/25">
          {siteConfig.brand} · ehfrhfo.com
        </footer>
      </div>
    </div>
  );
}
