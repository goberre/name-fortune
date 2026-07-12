import SeongmyungApp from "@/components/SeongmyungApp";
import InkBackground from "@/components/musok/InkBackground";
import { brandUrls } from "@/config/brand";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mk-body relative min-h-screen">
      <InkBackground />
      <div className="relative">
        <header className="mx-auto flex max-w-2xl items-center justify-between gap-2 px-4 py-4 sm:px-5 sm:py-6">
          <a
            href={brandUrls.hub}
            className="inline-flex min-h-[44px] min-w-[44px] items-center text-xs tracking-widest text-[var(--mk-ivory-muted)] hover:text-[var(--mk-ivory-dim)]"
          >
            ← 돌고래
          </a>
          <span className="font-musok shrink-0 text-xs text-[var(--mk-cinnabar-soft)]">名 · 命 · 數</span>
          <Link
            href="/privacy"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-end text-xs text-[var(--mk-ivory-muted)] hover:text-[var(--mk-ivory-dim)]"
          >
            개인정보
          </Link>
        </header>

        <main>
          <section className="sr-only">
            <h1>{siteConfig.brand} — 전통 성명학 풀이</h1>
            <p>{siteConfig.description}</p>
          </section>
          <SeongmyungApp />
        </main>

        <footer className="mx-auto max-w-2xl px-4 py-10 text-center text-[10px] tracking-[0.2em] text-[var(--mk-ivory-muted)] sm:px-5 sm:py-12">
          {siteConfig.brand} · ehfrhfo.com
        </footer>
      </div>
    </div>
  );
}
