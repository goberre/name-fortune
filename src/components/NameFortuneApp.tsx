"use client";

import { useMemo, useState } from "react";
import {
  analyzeName,
  GRADE_COLORS,
  isValidKoreanName,
  OHENG_COLORS,
  type NameAnalysis,
  type Oheng,
} from "@/lib/nameFortune";

const OHENG_LIST: Oheng[] = ["목", "화", "토", "금", "수"];

function OhengChart({ count }: { count: Record<Oheng, number> }) {
  const max = Math.max(...OHENG_LIST.map((o) => count[o]), 1);
  return (
    <div className="grid grid-cols-5 gap-2">
      {OHENG_LIST.map((o) => (
        <div key={o} className="flex flex-col items-center gap-2">
          <div className="flex h-24 w-full items-end justify-center rounded-lg bg-white/5 px-1">
            <div
              className="w-full rounded-t-md transition-all duration-700"
              style={{
                height: `${(count[o] / max) * 100}%`,
                minHeight: count[o] > 0 ? "12%" : "4%",
                backgroundColor: OHENG_COLORS[o],
                opacity: count[o] > 0 ? 1 : 0.2,
              }}
            />
          </div>
          <span className="text-xs font-medium" style={{ color: OHENG_COLORS[o] }}>
            {o}
          </span>
          <span className="text-[10px] text-white/40">{count[o]}</span>
        </div>
      ))}
    </div>
  );
}

function ResultCard({ result }: { result: NameAnalysis }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/80 to-indigo-950/60 p-6 text-center backdrop-blur-xl">
        <p className="text-sm text-violet-300">이름 풀이 결과</p>
        <p className="mt-2 text-4xl font-bold tracking-widest text-white">{result.name}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <span
            className="rounded-full px-4 py-1 text-sm font-bold"
            style={{
              backgroundColor: `${GRADE_COLORS[result.grade]}22`,
              color: GRADE_COLORS[result.grade],
              border: `1px solid ${GRADE_COLORS[result.grade]}55`,
            }}
          >
            {result.grade}
          </span>
          <span className="text-sm text-white/50">성명수 {result.nameNumber}/81</span>
          <span className="text-sm text-white/50">주기운 {result.dominant}</span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-white/70">{result.summary}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
        <h3 className="mb-4 text-sm font-semibold text-violet-200">글자별 오행</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {result.syllables.map((s) => (
            <div
              key={s.char}
              className="flex flex-col items-center rounded-xl border border-white/10 bg-black/20 px-4 py-3"
            >
              <span className="text-2xl font-bold text-white">{s.char}</span>
              <span className="mt-1 text-xs" style={{ color: OHENG_COLORS[s.oheng] }}>
                {s.oheng} · {s.strokes}획
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
        <h3 className="mb-4 text-sm font-semibold text-violet-200">오행 균형</h3>
        <OhengChart count={result.ohengCount} />
        {result.lacking.length > 0 && (
          <p className="mt-4 text-center text-xs text-amber-300/80">
            부족한 기운: {result.lacking.join(", ")}
          </p>
        )}
      </div>

      {(
        [
          ["성격", result.personality],
          ["직업·진로", result.career],
          ["연애·인연", result.love],
          ["재물·금전", result.wealth],
          ["건강", result.health],
          ["조언", result.advice],
        ] as const
      ).map(([title, body]) => (
        <div
          key={title}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
        >
          <h3 className="text-sm font-semibold text-violet-200">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/65">{body}</p>
        </div>
      ))}

      <p className="text-center text-xs text-white/30">
        참고용 풀이입니다. 성명학·오행 해석은 전통적 기준을 바탕으로 한 간편 분석입니다.
      </p>
    </div>
  );
}

function sanitizeName(value: string) {
  return value.replace(/[^가-힣]/g, "").slice(0, 4);
}

export default function NameFortuneApp() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<NameAnalysis | null>(null);
  const [error, setError] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const canSubmit = useMemo(() => name.trim().length >= 2, [name]);

  function handleNameChange(value: string) {
    if (isComposing) {
      setName(value.slice(0, 4));
      return;
    }
    setName(sanitizeName(value));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (!isValidKoreanName(name)) {
        setError("2~4글자 한글 이름을 입력해 주세요.");
        setResult(null);
        return;
      }
      setResult(analyzeName(name));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "분석 중 오류가 발생했습니다.");
      setResult(null);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 pb-16">
      {!result && (
        <form onSubmit={handleSubmit} className="mt-8">
          <label htmlFor="name" className="block text-center text-sm text-violet-200/80">
            이름을 입력하세요
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={(e) => {
              setIsComposing(false);
              setName(sanitizeName(e.currentTarget.value));
            }}
            placeholder="홍길동"
            maxLength={4}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            lang="ko"
            inputMode="text"
            enterKeyHint="go"
            className="mt-4 w-full rounded-2xl border border-violet-400/30 bg-black/30 px-6 py-5 text-center text-3xl font-bold tracking-[0.3em] text-white placeholder:text-white/20 outline-none transition focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/30"
          />
          <p className="mt-2 text-center text-xs text-white/35">2~4글자 한글 · 성만 또는 이름 전체</p>
          {error && <p className="mt-3 text-center text-sm text-rose-400">{error}</p>}
          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-4 text-base font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            이름으로 풀어보기
          </button>
        </form>
      )}

      {result && (
        <>
          <ResultCard result={result} />
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setName("");
            }}
            className="mt-8 w-full rounded-xl border border-white/15 py-3 text-sm text-white/60 transition hover:bg-white/5"
          >
            다른 이름 풀기
          </button>
        </>
      )}
    </div>
  );
}
