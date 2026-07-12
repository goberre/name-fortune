import DolphinLogo from "@/components/DolphinLogo";
import NameFortuneApp from "@/components/NameFortuneApp";
import { brandUrls } from "@/config/brand";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <header className="mx-auto flex max-w-lg items-center justify-between px-4 py-5">
        <a href={brandUrls.hub} className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white/80">
          <DolphinLogo size={22} className="text-violet-400" />
          <span>돌고래</span>
        </a>
        <Link href="/privacy" className="text-xs text-white/40 hover:text-white/60">
          개인정보
        </Link>
      </header>

      <main>
        <section className="mx-auto max-w-lg px-4 pt-4 text-center">
          <p className="text-sm font-medium tracking-widest text-violet-300/70">NAME FORTUNE</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            이름으로
            <br />
            <span className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
              풀어보자
            </span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/50">{siteConfig.tagline}</p>
        </section>

        <NameFortuneApp />

        <section className="sr-only" aria-label="서비스 설명">
          <h2>이름 풀이 무료</h2>
          <p>
            {siteConfig.description} 이름만 입력하면 오행, 성격, 연애운, 재물운, 직업운을
            확인할 수 있습니다.
          </p>
        </section>
      </main>

      <footer className="mx-auto max-w-lg px-4 py-8 text-center text-xs text-white/30">
        <a href={brandUrls.hub} className="hover:text-white/50">
          ehfrhfo.com
        </a>
        <span className="mx-2">·</span>
        <span>{siteConfig.brand}</span>
      </footer>
    </>
  );
}
