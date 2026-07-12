import SeongmyungApp from "@/components/SeongmyungApp";
import NebulaBackground from "@/components/occult/NebulaBackground";
import { brandUrls } from "@/config/brand";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="oc-body relative min-h-screen">
      <NebulaBackground />
      <div className="relative">
        <header className="mx-auto flex max-w-2xl items-center justify-between px-5 py-6">
          <a href={brandUrls.hub} className="text-xs tracking-widest text-white/30 transition hover:text-red-200/70">
            ← 돌고래
          </a>
          <span className="text-[10px] tracking-[0.3em] text-red-400/40">DARK OCCULT</span>
          <Link href="/privacy" className="text-xs text-white/25 hover:text-white/50">
            개인정보
          </Link>
        </header>

        <main>
          <section className="sr-only" aria-label="서비스 설명">
            <h1>이름 성명학 오컬트 풀이</h1>
            <p>{siteConfig.description}</p>
          </section>

          <SeongmyungApp />
        </main>

        <footer className="mx-auto max-w-2xl px-5 py-12 text-center text-[10px] tracking-[0.25em] text-white/15">
          {siteConfig.brand} · ehfrhfo.com · SIGIL DECODING
        </footer>
      </div>
    </div>
  );
}
