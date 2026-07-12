"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import AnalysisPanels from "@/components/seongmyung/AnalysisPanels";
import SagyeokTabs from "@/components/seongmyung/SagyeokTabs";
import ScoreGauge from "@/components/seongmyung/ScoreGauge";
import {
  analyzeSeongmyung,
  estimateHangulStrokes,
  isValidKoreanName,
  type SeongmyungResult,
} from "@/lib/seongmyung";

function sanitizeName(value: string) {
  return value.replace(/[^가-힣]/g, "").slice(0, 4);
}

export default function SeongmyungApp() {
  const [name, setName] = useState("");
  const [strokes, setStrokes] = useState<number[]>([]);
  const [birthYear, setBirthYear] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [result, setResult] = useState<SeongmyungResult | null>(null);
  const [error, setError] = useState("");

  const chars = useMemo(() => [...name], [name]);

  const handleNameChange = useCallback(
    (value: string) => {
      const next = isComposing ? value.slice(0, 4) : sanitizeName(value);
      setName(next);
      setStrokes((prev) => {
        const c = [...next];
        return c.map((ch, i) => prev[i] ?? estimateHangulStrokes(ch));
      });
    },
    [isComposing],
  );

  function setStrokeAt(i: number, v: number) {
    setStrokes((prev) => {
      const next = [...prev];
      next[i] = Math.min(99, Math.max(1, v));
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (!isValidKoreanName(name)) {
        setError("2~4글자 한글 이름을 입력해 주세요.");
        return;
      }
      const year = birthYear ? Number(birthYear) : undefined;
      setResult(analyzeSeongmyung({ name, strokes, birthYear: year }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "분석 중 오류가 발생했습니다.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-20 pt-8">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="nf-card space-y-6 p-6 sm:p-8"
          >
            <div>
              <label htmlFor="name" className="nf-label">
                한글 이름
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={(e) => {
                  setIsComposing(false);
                  handleNameChange(sanitizeName(e.currentTarget.value));
                }}
                placeholder="홍길동"
                maxLength={4}
                lang="ko"
                className="nf-input mt-2 px-5 py-4 text-2xl font-semibold tracking-[0.2em]"
              />
              <p className="mt-2 text-xs text-white/35">2~4글자 · 성+이름</p>
            </div>

            {chars.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <p className="nf-label">한자 획수 (글자별)</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {chars.map((ch, i) => (
                    <div
                      key={`${ch}-${i}`}
                      className="flex items-center gap-3 rounded-xl border border-violet-500/15 bg-black/30 p-3"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-950/50 text-xl font-bold text-violet-100">
                        {ch}
                      </span>
                      <div className="flex-1">
                        <span className="text-xs text-white/35">획수</span>
                        <div className="mt-1 flex items-center gap-2">
                          <button type="button" className="nf-stroke-btn" onClick={() => setStrokeAt(i, (strokes[i] ?? 8) - 1)}>
                            −
                          </button>
                          <input
                            type="number"
                            min={1}
                            max={99}
                            value={strokes[i] ?? estimateHangulStrokes(ch)}
                            onChange={(e) => setStrokeAt(i, Number(e.target.value) || 1)}
                            className="nf-input w-14 py-1.5 text-center text-lg font-semibold"
                          />
                          <button type="button" className="nf-stroke-btn" onClick={() => setStrokeAt(i, (strokes[i] ?? 8) + 1)}>
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/30">한자 획수를 모르면 추정값으로 분석됩니다.</p>
              </motion.div>
            )}

            <div>
              <label htmlFor="birth" className="nf-label">
                생년 (선택)
              </label>
              <input
                id="birth"
                type="number"
                inputMode="numeric"
                placeholder="1990"
                min={1900}
                max={2100}
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value.slice(0, 4))}
                className="nf-input mt-2 px-5 py-3 text-lg"
              />
            </div>

            {error && <p className="text-center text-sm text-rose-400">{error}</p>}

            <button type="submit" disabled={name.length < 2} className="nf-btn">
              운명 풀어보기
            </button>
          </motion.form>
        ) : (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="nf-card nf-card-highlight p-8 text-center">
              <p className="text-sm text-violet-300/60">이름 역학 분석</p>
              <p className="nf-title-glow mt-2 text-4xl font-bold tracking-[0.15em] text-white">{result.name}</p>
              <div className="mt-6 flex justify-center">
                <ScoreGauge score={result.totalScore} grade={result.gradeLabel} />
              </div>
            </div>

            <AnalysisPanels
              slots={result.slots}
              yinYangPattern={result.yinYangPattern}
              yinYangGilHeung={result.yinYangGilHeung}
              yinYangSummary={result.yinYangSummary}
              pronunciation={result.pronunciation}
              pronunciationFlow={result.pronunciationFlow}
              pronunciationGilHeung={result.pronunciationGilHeung}
              pronunciationSummary={result.pronunciationSummary}
            />

            <SagyeokTabs grids={result.sagyeok} />

            {result.birthSummary && (
              <div className="nf-card p-5">
                <h3 className="text-sm font-semibold text-violet-200">자원오행 (생년)</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{result.birthSummary}</p>
              </div>
            )}

            <button
              type="button"
              className="nf-btn-ghost"
              onClick={() => {
                setResult(null);
                setName("");
                setStrokes([]);
                setBirthYear("");
              }}
            >
              다른 이름 풀기
            </button>

            <p className="text-center text-xs text-white/25">전통 성명학 기반 참고용 풀이입니다.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
