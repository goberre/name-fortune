"use client";

import { useCallback, useMemo, useState } from "react";
import OracleLoader from "@/components/OracleLoader";
import RitualCircle from "@/components/RitualCircle";
import {
  analyzeName,
  GRADE_COLORS,
  isValidKoreanName,
  OHENG_COLORS,
  type FortuneGrade,
  type NameAnalysis,
  type Oheng,
} from "@/lib/nameFortune";

const OHENG_LIST: Oheng[] = ["목", "화", "토", "금", "수"];

const FORTUNE_LABEL: Record<FortuneGrade, string> = {
  대길: "천명(天命) — 하늘이 돕는 이름",
  길: "길운(吉運) — 순조로운 흐름",
  보통: "평운(平運) — 스스로 개척",
  주의: "⚠ 흉기(凶氣) — 주의가 필요한 이름",
};

function OhengChart({ count }: { count: Record<Oheng, number> }) {
  const max = Math.max(...OHENG_LIST.map((o) => count[o]), 1);
  return (
    <div className="grid grid-cols-5 gap-2">
      {OHENG_LIST.map((o) => (
        <div key={o} className="flex flex-col items-center gap-2">
          <div className="flex h-28 w-full items-end justify-center rounded border border-red-900/30 bg-black/50 px-1">
            <div
              className="w-full transition-all duration-1000"
              style={{
                height: `${(count[o] / max) * 100}%`,
                minHeight: count[o] > 0 ? "14%" : "3%",
                background: `linear-gradient(to top, ${OHENG_COLORS[o]}88, ${OHENG_COLORS[o]})`,
                boxShadow: count[o] > 0 ? `0 0 12px ${OHENG_COLORS[o]}66` : "none",
              }}
            />
          </div>
          <span className="text-xs font-semibold" style={{ color: OHENG_COLORS[o] }}>
            {o}
          </span>
        </div>
      ))}
    </div>
  );
}

function ResultCard({ result }: { result: NameAnalysis }) {
  const isDanger = result.grade === "주의";

  return (
    <div className="myst-result-enter space-y-5">
      <div
        className={`myst-card myst-card-glow rounded-none border-2 p-6 text-center ${isDanger ? "myst-card-danger" : ""}`}
      >
        <p className="myst-whisper text-[10px] text-red-400/70">운명의 판이 열렸다</p>
        <p className="font-occult myst-name-reveal mt-4 text-5xl font-bold tracking-[0.2em] text-white">
          {result.name}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span
            className="rounded-sm px-3 py-1 text-xs font-bold tracking-wider"
            style={{
              backgroundColor: `${GRADE_COLORS[result.grade]}18`,
              color: GRADE_COLORS[result.grade],
              border: `1px solid ${GRADE_COLORS[result.grade]}66`,
              boxShadow: `0 0 16px ${GRADE_COLORS[result.grade]}33`,
            }}
          >
            {result.grade}
          </span>
          <span className="text-xs text-white/40">성명수 {result.nameNumber}/81</span>
          <span className="text-xs text-white/40">主氣 {result.dominant}</span>
        </div>
        <p className="mt-3 text-xs text-red-300/60">{FORTUNE_LABEL[result.grade]}</p>
        <p className="mt-4 text-sm leading-relaxed text-white/60">{result.summary}</p>
      </div>

      <div className="myst-card myst-tarot rounded-none p-5" style={{ animationDelay: "0.1s" }}>
        <h3 className="font-occult text-xs tracking-[0.2em] text-red-300/70">◈ 글자별 五行</h3>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {result.syllables.map((s) => (
            <div
              key={s.char}
              className="flex flex-col items-center border border-red-900/40 bg-black/60 px-5 py-4 shadow-[0_0_20px_rgba(127,29,29,0.15)]"
            >
              <span className="font-occult text-3xl font-bold text-white">{s.char}</span>
              <span className="mt-2 text-[10px] tracking-wider" style={{ color: OHENG_COLORS[s.oheng] }}>
                {s.oheng} · {s.strokes}획
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="myst-card myst-tarot rounded-none p-5" style={{ animationDelay: "0.2s" }}>
        <h3 className="font-occult text-xs tracking-[0.2em] text-red-300/70">◈ 五行 均衡</h3>
        <OhengChart count={result.ohengCount} />
        {result.lacking.length > 0 && (
          <p className="mt-4 text-center text-xs text-red-400/80">
            ⚠ 欠けた氣: {result.lacking.join(" · ")} — 균형이 무너져 있습니다
          </p>
        )}
      </div>

      {(
        [
          ["性質", result.personality, "0.3s"],
          ["職業", result.career, "0.4s"],
          ["因緣", result.love, "0.5s"],
          ["財運", result.wealth, "0.6s"],
          ["健康", result.health, "0.7s"],
          ["忠告", result.advice, "0.8s"],
        ] as const
      ).map(([title, body, delay]) => (
        <div
          key={title}
          className="myst-card myst-tarot rounded-none p-5"
          style={{ animationDelay: delay }}
        >
          <h3 className="font-occult text-xs tracking-[0.25em] text-red-300/60">◈ {title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/55">{body}</p>
        </div>
      ))}

      <p className="text-center text-[10px] tracking-wider text-red-900/70">
        此 解 釋 僅 供 參 考 · 命 運 是 自 己 開 拓 的
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
  const [pending, setPending] = useState<NameAnalysis | null>(null);
  const [error, setError] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [ritualActive, setRitualActive] = useState(false);

  const canSubmit = useMemo(() => name.trim().length >= 2, [name]);

  function handleNameChange(value: string) {
    if (isComposing) {
      setName(value.slice(0, 4));
      return;
    }
    setName(sanitizeName(value));
  }

  const finishRitual = useCallback(() => {
    if (pending) {
      setResult(pending);
      setPending(null);
      setRitualActive(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pending]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (!isValidKoreanName(name)) {
        setError("2~4글자 한글 이름을 입력해 주세요.");
        setResult(null);
        return;
      }
      setRitualActive(true);
      setPending(analyzeName(name));
      setResult(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "분석 중 오류가 발생했습니다.");
      setResult(null);
      setPending(null);
      setRitualActive(false);
    }
  }

  if (pending && ritualActive) {
    return (
      <div className="mx-auto max-w-lg px-4 pb-16 pt-4">
        <OracleLoader onComplete={finishRitual} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 pb-16">
      {!result && (
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="myst-altar">
            <RitualCircle active={name.length > 0} />
            <div className="myst-input-wrap">
              <label htmlFor="name" className="mb-4 block text-center text-xs tracking-[0.2em] text-red-300/50">
                名을 새겨 넣으라
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
                placeholder="···"
                maxLength={4}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                lang="ko"
                inputMode="text"
                enterKeyHint="go"
                className="myst-input font-occult w-full rounded-none px-4 py-6 text-center text-4xl font-bold tracking-[0.35em] text-red-100 placeholder:text-red-900/40 outline-none"
              />
            </div>
          </div>

          <p className="mt-6 text-center text-[10px] tracking-wider text-white/25">
            2~4글자 한글 · 이름 전체 또는 성
          </p>
          {error && <p className="mt-3 text-center text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            className="font-occult myst-btn mt-8 w-full py-5 text-sm font-bold text-red-100 transition disabled:cursor-not-allowed disabled:opacity-30"
          >
            運命を解く
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
            className="font-occult mt-8 w-full border border-red-900/40 py-4 text-xs tracking-[0.2em] text-red-300/50 transition hover:border-red-700/50 hover:bg-red-950/20 hover:text-red-200/70"
          >
            別の名を解く
          </button>
        </>
      )}
    </div>
  );
}
