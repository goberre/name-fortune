"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import AnalysisPanels from "@/components/seongmyung/AnalysisPanels";
import HanjaPicker from "@/components/seongmyung/HanjaPicker";
import OhengHarmonyPanel from "@/components/seongmyung/OhengHarmonyPanel";
import SagyeokTimeline from "@/components/seongmyung/SagyeokTimeline";
import ScoreGauge from "@/components/seongmyung/ScoreGauge";
import { getHanjaCandidates, loadHanjaIndex, type HanjaSelection } from "@/lib/hanja";
import {
  analyzeSeongmyung,
  isValidKoreanName,
  type SeongmyungResult,
} from "@/lib/seongmyung";

function sanitizeName(value: string) {
  return value.replace(/[^가-힣]/g, "").slice(0, 4);
}

type Step = 1 | 2 | "result";

export default function SeongmyungApp() {
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [hanjaSelections, setHanjaSelections] = useState<(HanjaSelection | null)[]>([]);
  const [hanjaIndexReady, setHanjaIndexReady] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [result, setResult] = useState<SeongmyungResult | null>(null);
  const [error, setError] = useState("");

  const chars = useMemo(() => [...name], [name]);

  const handleNameChange = useCallback(
    (value: string) => {
      const next = isComposing ? value.slice(0, 4) : sanitizeName(value);
      setName(next);
      setHanjaSelections((prev) =>
        next.split("").map((ch, i) => {
          const existing = prev[i];
          if (existing?.hangul === ch) return existing;
          return null;
        }),
      );
    },
    [isComposing],
  );

  useEffect(() => {
    if (step !== 2) return;
    loadHanjaIndex()
      .then(() => setHanjaIndexReady(true))
      .catch(() => setError("한자 데이터를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요."));
  }, [step]);

  useEffect(() => {
    if (step !== 2 || !hanjaIndexReady) return;
    let cancelled = false;
    (async () => {
      const next = await Promise.all(
        chars.map(async (ch, i) => {
          if (hanjaSelections[i]?.hangul === ch) return hanjaSelections[i];
          const list = await getHanjaCandidates(ch);
          return list[0] ? { hangul: ch, ...list[0] } : null;
        }),
      );
      if (!cancelled) setHanjaSelections(next);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- auto-pick first candidate per char
  }, [step, hanjaIndexReady, name]);

  function handleHanjaSelect(index: number, selection: HanjaSelection) {
    setHanjaSelections((prev) => {
      const next = [...prev];
      next[index] = selection;
      return next;
    });
  }

  function goStep2(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!isValidKoreanName(name)) {
      setError("2~4글자 한글 이름을 입력해 주세요.");
      return;
    }
    if (!birthYear || !birthMonth || !birthDay) {
      setError("생년월일을 모두 입력해 주세요.");
      return;
    }
    const y = Number(birthYear);
    const m = Number(birthMonth);
    const d = Number(birthDay);
    if (y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) {
      setError("올바른 생년월일을 입력해 주세요.");
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleAnalyze() {
    setError("");
    if (hanjaSelections.some((s) => !s)) {
      setError("모든 글자에 한자를 선택해 주세요.");
      return;
    }
    try {
      const slots = hanjaSelections as HanjaSelection[];
      setResult(
        analyzeSeongmyung({
          name,
          hanjaSlots: slots.map((s) => ({
            hangul: s.hangul,
            hanja: s.hanja,
            meaning: s.meaning,
            oheng: s.oheng,
            wonStrokes: s.wonStrokes,
          })),
          birthDate: {
            year: Number(birthYear),
            month: Number(birthMonth),
            day: Number(birthDay),
          },
        }),
      );
      setStep("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "분석 중 오류가 발생했습니다.");
    }
  }

  function reset() {
    setStep(1);
    setResult(null);
    setName("");
    setBirthYear("");
    setBirthMonth("");
    setBirthDay("");
    setHanjaSelections([]);
    setError("");
  }

  const stagger = { show: { transition: { staggerChildren: 0.1 } } };
  const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-10">
      {step !== "result" && (
        <div className="mb-8 flex items-center justify-center gap-3">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  step === s ? "bg-neutral-900 text-white" : step > s ? "bg-neutral-200 text-neutral-600" : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {s}
              </span>
              <span className={`text-sm ${step === s ? "font-medium text-neutral-900" : "text-neutral-400"}`}>
                {s === 1 ? "기본 정보" : "한자 선택"}
              </span>
              {s === 1 && <span className="h-px w-8 bg-neutral-200" />}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.form
            key="step1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onSubmit={goStep2}
            className="ap-card space-y-8 p-6 sm:p-10"
          >
            <div>
              <label htmlFor="name" className="ap-label">
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
                className="ap-input mt-3 px-5 py-5 text-center text-3xl font-semibold tracking-[0.15em]"
              />
              <p className="mt-2 text-center text-xs text-neutral-400">2~4글자 · 성+이름</p>
            </div>

            <div>
              <p className="ap-label">생년월일</p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="1990"
                  min={1900}
                  max={2100}
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value.slice(0, 4))}
                  className="ap-input px-4 py-3.5 text-center text-lg"
                  aria-label="출생년"
                />
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="01"
                  min={1}
                  max={12}
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value.slice(0, 2))}
                  className="ap-input px-4 py-3.5 text-center text-lg"
                  aria-label="출생월"
                />
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="01"
                  min={1}
                  max={31}
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value.slice(0, 2))}
                  className="ap-input px-4 py-3.5 text-center text-lg"
                  aria-label="출생일"
                />
              </div>
              <p className="mt-2 text-xs text-neutral-400">사주 자원오행 분석에 사용됩니다</p>
            </div>

            {error && <p className="text-center text-sm text-rose-600">{error}</p>}

            <button type="submit" disabled={name.length < 2} className="ap-btn">
              다음 — 한자 선택
            </button>
          </motion.form>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            <div className="text-center">
              <p className="text-sm text-neutral-500">「{name}」의 한자를 선택하세요</p>
              <p className="mt-1 text-xs text-neutral-400">원획법 획수 · 자원오행이 실시간 반영됩니다</p>
            </div>

            {chars.map((ch, i) => (
              <HanjaPicker
                key={`${ch}-${i}`}
                hangul={ch}
                index={i}
                selected={hanjaSelections[i] ?? null}
                onSelect={handleHanjaSelect}
              />
            ))}

            {error && <p className="text-center text-sm text-rose-600">{error}</p>}

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="ap-btn-secondary flex-1">
                이전
              </button>
              <button type="button" onClick={handleAnalyze} className="ap-btn flex-[2]">
                역학 풀이 보기
              </button>
            </div>
          </motion.div>
        )}

        {step === "result" && result && (
          <motion.div
            key="result"
            initial="hidden"
            animate="show"
            variants={stagger}
            className="space-y-6"
          >
            <motion.div variants={fadeUp} className="ap-card p-8 text-center sm:p-10">
              <p className="text-sm font-medium text-neutral-500">성명학 분석 결과</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900">{result.name}</p>
              <p className="mt-1 font-serif text-2xl text-neutral-600">{result.hanjaDisplay}</p>
              <div className="mt-8 flex justify-center">
                <ScoreGauge score={result.totalScore} grade={result.gradeLabel} />
              </div>
            </motion.div>

            {result.sajuProfile && result.sourceOhengHarmony && result.sourceOheng && (
              <motion.div variants={fadeUp}>
                <OhengHarmonyPanel
                  saju={result.sajuProfile}
                  nameOheng={result.sourceOheng}
                  harmony={result.sourceOhengHarmony}
                />
              </motion.div>
            )}

            <motion.div variants={fadeUp}>
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
            </motion.div>

            <motion.div variants={fadeUp}>
              <SagyeokTimeline grids={result.sagyeok} />
            </motion.div>

            <motion.div variants={fadeUp}>
              <button type="button" onClick={reset} className="ap-btn-secondary w-full">
                다른 이름 풀기
              </button>
              <p className="mt-4 text-center text-xs text-neutral-400">
                전통 성명학 · 원획법 · 81수리 기반 참고용 풀이입니다.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
