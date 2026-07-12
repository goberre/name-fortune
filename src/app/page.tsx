import DolphinLogo from "@/components/DolphinLogo";
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
        <header className="mx-auto flex max-w-lg items-center justify-between px-4 py-5">
          <a
            href={brandUrls.hub}
            className="inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-violet-200/80"
          >
            <DolphinLogo size={22} className="text-violet-400/70" />
            <span>돌고래</span>
          </a>
          <Link href="/privacy" className="text-xs text-white/30 hover:text-white/50">
            개인정보
          </Link>
        </header>

        <main>
          <section className="mx-auto max-w-lg px-4 pt-4 text-center">
            <p className="myst-whisper text-xs font-medium text-emerald-400/60">
              ◈ 운명 · 오행 · 성명 ◈
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              <span className="text-white/90">이름 속에 숨은</span>
              <br />
              <span className="myst-hero-glow bg-gradient-to-r from-violet-300 via-purple-200 to-emerald-300 bg-clip-text text-transparent">
                비밀을 풀어보자
              </span>
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-white/45">
              {siteConfig.tagline}
              <br />
              <span className="text-xs text-violet-300/40">
                이름만 남기면, 당신의 기운이 드러납니다
              </span>
            </p>
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

        <footer className="mx-auto max-w-lg px-4 py-8 text-center text-xs text-white/25">
          <a href={brandUrls.hub} className="hover:text-violet-300/50">
            ehfrhfo.com
          </a>
          <span className="mx-2">·</span>
          <span>{siteConfig.brand}</span>
        </footer>
      </div>
    </>
  );
}
