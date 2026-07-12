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
      setResult(
        analyzeSeongmyung({
          name,
          strokes,
          birthYear: year,
        }),
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "분석 중 오류가 발생했습니다.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-20 pt-6">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
                className="mt-2 w-full rounded-2xl border-0 bg-gray-50 px-5 py-4 text-2xl font-semibold tracking-widest text-gray-900 ring-1 ring-gray-200 outline-none transition focus:ring-2 focus:ring-gray-900"
              />
              <p className="mt-2 text-xs text-gray-400">2~4글자 · 성+이름</p>
            </div>

            {chars.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3"
              >
                <p className="text-sm font-medium text-gray-700">한자 획수 (글자별)</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {chars.map((ch, i) => (
                    <div key={`${ch}-${i}`} className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl font-bold text-gray-900 ring-1 ring-gray-100">
                        {ch}
                      </span>
                      <div className="flex-1">
                        <label className="text-xs text-gray-400">획수</label>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setStrokeAt(i, (strokes[i] ?? 8) - 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lg ring-1 ring-gray-200"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min={1}
                            max={99}
                            value={strokes[i] ?? estimateHangulStrokes(ch)}
                            onChange={(e) => setStrokeAt(i, Number(e.target.value) || 1)}
                            className="w-14 rounded-lg bg-white py-2 text-center text-lg font-semibold ring-1 ring-gray-200 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setStrokeAt(i, (strokes[i] ?? 8) + 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lg ring-1 ring-gray-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400">한자 획수를 모르면 기본값(한글 추정)으로 분석됩니다. 정확한 풀이는 한자 획수를 맞춰 주세요.</p>
              </motion.div>
            )}

            <div>
              <label htmlFor="birth" className="block text-sm font-medium text-gray-700">
                생년 (선택 · 자원오행)
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
                className="mt-2 w-full rounded-2xl border-0 bg-gray-50 px-5 py-3 text-lg text-gray-900 ring-1 ring-gray-200 outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            {error && <p className="text-center text-sm text-rose-600">{error}</p>}

            <button
              type="submit"
              disabled={name.length < 2}
              className="w-full rounded-2xl bg-gray-900 py-4 text-base font-semibold text-white transition hover:bg-gray-800 disabled:opacity-40"
            >
              이름 역학 풀이하기
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="rounded-3xl bg-gray-50 p-8 text-center ring-1 ring-gray-100">
              <p className="text-sm text-gray-400">이름 역학 분석</p>
              <p className="mt-2 text-4xl font-bold tracking-widest text-gray-900">{result.name}</p>
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
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl bg-blue-50/50 p-5 ring-1 ring-blue-100"
              >
                <h3 className="text-sm font-semibold text-gray-900">자원오행 (생년)</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{result.birthSummary}</p>
              </motion.div>
            )}

            <button
              type="button"
              onClick={() => {
                setResult(null);
                setName("");
                setStrokes([]);
                setBirthYear("");
              }}
              className="w-full rounded-2xl py-3 text-sm font-medium text-gray-500 ring-1 ring-gray-200 transition hover:bg-gray-50"
            >
              다른 이름 분석하기
            </button>

            <p className="text-center text-xs text-gray-400">
              전통 성명학(음양·발음오행·81수리) 기반 참고용 풀이입니다.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
