"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import IntroRitual from "@/components/occult/IntroRitual";
import OccultDashboard from "@/components/occult/OccultDashboard";
import OracleLoader from "@/components/OracleLoader";
import HanjaPicker from "@/components/seongmyung/HanjaPicker";
import Step1Form, { buildBirthProfile } from "@/components/seongmyung/Step1Form";
import { getHanjaCandidates, loadHanjaIndex, type HanjaSelection } from "@/lib/hanja";
import { analyzeSeongmyung, isValidKoreanName, type SeongmyungResult } from "@/lib/seongmyung";
import type { CalendarType, Gender } from "@/types/birth";

function sanitizeName(value: string) {
  return value.replace(/[^가-힣]/g, "").slice(0, 4);
}

type Step = "intro" | 1 | 2 | "loading" | "result";

const slide = {
  initial: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  animate: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

export default function SeongmyungApp() {
  const [step, setStep] = useState<Step>("intro");
  const [direction, setDirection] = useState(1);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [calendarType, setCalendarType] = useState<CalendarType>("solar");
  const [isLeapMonth, setIsLeapMonth] = useState(false);
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthRegion, setBirthRegion] = useState("");
  const [hanjaSelections, setHanjaSelections] = useState<(HanjaSelection | null)[]>([]);
  const [hanjaIndexReady, setHanjaIndexReady] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [result, setResult] = useState<SeongmyungResult | null>(null);
  const [error, setError] = useState("");

  const chars = useMemo(() => [...name], [name]);

  const goTo = useCallback((next: Step, dir: number) => {
    setDirection(dir);
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
      .catch(() => setError("문양 데이터를 불러오지 못했습니다. 의식을 재시작해 주세요."));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setError("천상의 기록(생년월일)을 모두 입력해 주세요.");
      return;
    }
    const y = Number(birthYear);
    const m = Number(birthMonth);
    const d = Number(birthDay);
    if (y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) {
      setError("올바른 생년월일을 입력해 주세요.");
      return;
    }
    if (!birthRegion) {
      setError("대지의 좌표(태생지)를 선택해 주세요.");
      return;
    }
    goTo(2, 1);
  }

  function handleAnalyze() {
    setError("");
    if (hanjaSelections.some((s) => !s)) {
      setError("모든 글자에 한자를 동조해 주세요.");
      return;
    }
    try {
      const slots = hanjaSelections as HanjaSelection[];
      const analyzed = analyzeSeongmyung({
        name,
        hanjaSlots: slots.map((s) => ({
          hangul: s.hangul,
          hanja: s.hanja,
          meaning: s.meaning,
          oheng: s.oheng,
          wonStrokes: s.wonStrokes,
        })),
        birth: buildBirthProfile({
          birthYear,
          birthMonth,
          birthDay,
          birthRegion,
          gender,
          calendarType,
          isLeapMonth,
        }),
      });
      setResult(analyzed);
      goTo("loading", 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "해독 중 오류가 발생했습니다.");
    }
  }

  function reset() {
    setDirection(-1);
    setStep("intro");
    setResult(null);
    setName("");
    setGender("male");
    setCalendarType("solar");
    setIsLeapMonth(false);
    setBirthYear("");
    setBirthMonth("");
    setBirthDay("");
    setBirthRegion("");
    setHanjaSelections([]);
    setError("");
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-6">
      {step !== "result" && step !== "intro" && step !== "loading" && (
        <div className="mb-8 flex items-center justify-center gap-3">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 items-center justify-center text-sm font-semibold ${
                  step === s ? "oc-step oc-step-active" : step > s ? "oc-step oc-step-done" : "oc-step oc-step-idle"
                }`}
              >
                {s === 1 ? "生" : "字"}
              </span>
              <span className={`text-xs tracking-wider ${step === s ? "text-red-200/80" : "text-white/25"}`}>
                {s === 1 ? "태생" : "동조"}
              </span>
              {s === 1 && <span className="h-px w-8 bg-red-950/50" />}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        {step === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <IntroRitual onEnter={() => goTo(1, 1)} />
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" custom={direction} variants={slide} initial="initial" animate="animate" exit="exit" transition={slide.transition}>
            <Step1Form
              name={name}
              gender={gender}
              calendarType={calendarType}
              isLeapMonth={isLeapMonth}
              birthYear={birthYear}
              birthMonth={birthMonth}
              birthDay={birthDay}
              birthRegion={birthRegion}
              isComposing={isComposing}
              error={error}
              onNameChange={handleNameChange}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={(v) => {
                setIsComposing(false);
                handleNameChange(sanitizeName(v));
              }}
              setGender={setGender}
              setCalendarType={setCalendarType}
              setIsLeapMonth={setIsLeapMonth}
              setBirthYear={setBirthYear}
              setBirthMonth={setBirthMonth}
              setBirthDay={setBirthDay}
              setBirthRegion={setBirthRegion}
              onSubmit={goStep2}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" custom={direction} variants={slide} initial="initial" animate="animate" exit="exit" transition={slide.transition} className="space-y-5">
            <div className="text-center">
              <p className="oc-kicker">Step II · 字</p>
              <p className="font-occult mt-2 text-xl text-red-100/90">「{name}」의 영적 주파수 동조</p>
              <p className="mt-2 text-xs text-white/30">각 한자의 원소 기호를 선택하여 문양을 완성하십시오</p>
            </div>

            {chars.map((ch, i) => (
              <HanjaPicker
                key={`${ch}-${i}`}
                hangul={ch}
                index={i}
                selected={hanjaSelections[i] ?? null}
                onSelect={handleHanjaSelect}
                variant="occult"
              />
            ))}

            {error && <p className="text-center text-sm text-red-400">{error}</p>}

            <div className="flex gap-3">
              <button type="button" onClick={() => goTo(1, -1)} className="oc-btn oc-btn-ghost flex-1">
                이전
              </button>
              <button type="button" onClick={handleAnalyze} className="oc-btn oc-btn-primary flex-[2]">
                봉인 해제 · 해독
              </button>
            </div>
          </motion.div>
        )}

        {step === "loading" && result && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <OracleLoader onComplete={() => goTo("result", 1)} />
          </motion.div>
        )}

        {step === "result" && result && (
          <motion.div key="result" custom={direction} variants={slide} initial="initial" animate="animate" exit="exit" transition={slide.transition}>
            <OccultDashboard result={result} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
