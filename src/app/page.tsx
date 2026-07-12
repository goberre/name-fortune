import MysticAmbience from "@/components/MysticAmbience";
import NameFortuneApp from "@/components/NameFortuneApp";
import { brandUrls } from "@/config/brand";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <MysticAmbience />

      <div className="relative z-10">
        <header className="mx-auto flex max-w-lg items-center justify-between px-4 py-4">
          <a href={brandUrls.hub} className="myst-header-link text-xs text-red-300/50">
            ← 돌고래 홈
          </a>
          <Link href="/privacy" className="myst-header-link text-xs text-white/30">
            개인정보
          </Link>
        </header>

        <main>
          <section className="mx-auto max-w-lg px-4 pt-2 text-center">
            <p className="text-xs tracking-widest text-red-400/50">이름으로 풀어보자</p>
            <h1 className="mt-4 text-[2rem] font-bold leading-[1.25] tracking-tight sm:text-5xl">
              <span className="block text-white/85">이름 속,</span>
              <span className="myst-title mt-1 block bg-gradient-to-b from-red-300 via-red-400 to-red-900 bg-clip-text text-transparent">
                숨겨진 운명
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-red-200/45">
              {siteConfig.tagline}
            </p>
            <p className="mt-3 text-xs text-violet-300/35">도깨비불이 이름을 비춥니다</p>
          </section>

          <NameFortuneApp />

          <section className="sr-only" aria-label="서비스 설명">
            <h2>이름 풀이 무료</h2>
            <p>{siteConfig.description}</p>
          </section>
        </main>

        <footer className="mx-auto max-w-lg px-4 py-10 text-center text-xs text-red-900/60">
          ehfrhfo.com · {siteConfig.brand}
        </footer>
      </div>
    </>
  );
}
