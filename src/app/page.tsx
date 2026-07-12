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
          <a href={brandUrls.hub} className="myst-header-link text-[10px] tracking-widest text-red-300/60">
            ← ehfrhfo
          </a>
          <Link href="/privacy" className="myst-header-link text-[10px] tracking-widest text-white/30">
            秘
          </Link>
        </header>

        <main>
          <section className="mx-auto max-w-lg px-4 pt-2 text-center">
            <p className="font-occult myst-subtitle text-[10px] uppercase">Forbidden Name Oracle</p>
            <h1 className="font-occult mt-5 text-[2rem] font-bold leading-[1.25] tracking-wide sm:text-5xl">
              <span className="block text-white/80">이름 속,</span>
              <span className="myst-title mt-1 block bg-gradient-to-b from-red-300 via-red-400 to-red-900 bg-clip-text text-transparent">
                숨겨진 운명
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xs text-sm leading-relaxed text-red-200/40">
              {siteConfig.tagline}
            </p>
            <p className="myst-whisper mt-3 text-[10px]">
              名 · 運 · 咒 · 福
            </p>
          </section>

          <NameFortuneApp />

          <section className="sr-only" aria-label="서비스 설명">
            <h2>이름 풀이 무료</h2>
            <p>{siteConfig.description}</p>
          </section>
        </main>

        <footer className="mx-auto max-w-lg px-4 py-10 text-center">
          <p className="text-[10px] tracking-[0.3em] text-red-900/80">
            深淵が名を知る
          </p>
        </footer>
      </div>
    </>
  );
}
