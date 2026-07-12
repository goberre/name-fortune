"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import IntroMusok from "@/components/musok/IntroMusok";
import MusokDashboard from "@/components/musok/MusokDashboard";
import MusokLoader from "@/components/musok/MusokLoader";
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
  initial: (dir: number) => ({ x: dir > 0 ? 32 : -32, opacity: 0 }),
  animate: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -32 : 32, opacity: 0 }),
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
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
  const [birthHour, setBirthHour] = useState("");
  const [birthMinute, setBirthMinute] = useState("");
  const [hanjaSelections, setHanjaSelections] = useState<(HanjaSelection | null)[]>([]);
  const [hanjaIndexReady, setHanjaIndexReady] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [result, setResult] = useState<SeongmyungResult | null>(null);
  const [error, setError] = useState("");
  const [inkPulse, setInkPulse] = useState(false);

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
      .catch(() => setError("한자 데이터를 불러오지 못했습니다."));
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
    setInkPulse(true);
    setTimeout(() => setInkPulse(false), 400);
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
    if (birthHour !== "" && (Number(birthHour) < 0 || Number(birthHour) > 23)) {
      setError("태어난 시는 0~23 사이로 입력해 주세요.");
      return;
    }
    goTo(2, 1);
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
          birth: buildBirthProfile({
            birthYear,
            birthMonth,
            birthDay,
            birthHour,
            birthMinute,
            gender,
            calendarType,
            isLeapMonth,
          }),
        }),
      );
      goTo("loading", 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "분석 중 오류가 발생했습니다.");
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
    setBirthHour("");
    setBirthMinute("");
    setHanjaSelections([]);
    setError("");
  }

  return (
    <div className={`mx-auto max-w-2xl px-5 pb-24 pt-6 ${inkPulse ? "mk-ink-pulse" : ""}`}>
      {step !== "result" && step !== "intro" && step !== "loading" && (
        <div className="mb-8 flex items-center justify-center gap-3">
          {[
            { id: 1, label: "生", sub: "천기" },
            { id: 2, label: "字", sub: "보완" },
          ].map((s, i) => (
            <div key={s.id} className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 items-center justify-center font-musok text-sm ${
                  step === s.id
                    ? "mk-step mk-step-active"
                    : step > s.id
                      ? "mk-step mk-step-done"
                      : "mk-step mk-step-idle"
                }`}
              >
                {s.label}
              </span>
              <span className={`text-xs ${step === s.id ? "text-[var(--mk-ivory-dim)]" : "text-[var(--mk-ivory-muted)]"}`}>
                {s.sub}
              </span>
              {i === 0 && <span className="h-px w-8 bg-[var(--mk-border)]" />}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        {step === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <IntroMusok onEnter={() => goTo(1, 1)} />
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
              birthHour={birthHour}
              birthMinute={birthMinute}
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
              setBirthHour={setBirthHour}
              setBirthMinute={setBirthMinute}
              onSubmit={goStep2}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" custom={direction} variants={slide} initial="initial" animate="animate" exit="exit" transition={slide.transition} className="space-y-5">
            <div className="text-center">
              <p className="mk-kicker">명줄 보완 (補完)</p>
              <p className="font-musok mt-2 text-xl text-[var(--mk-ivory)]">「{name}」 한자 · 원획 · 오행</p>
              <p className="mt-2 text-xs text-[var(--mk-ivory-muted)]">원획법(原劃法) 획수와 토속 오행 기운을 확인하십시오</p>
            </div>

            {chars.map((ch, i) => (
              <HanjaPicker
                key={`${ch}-${i}`}
                hangul={ch}
                index={i}
                selected={hanjaSelections[i] ?? null}
                onSelect={handleHanjaSelect}
                variant="musok"
              />
            ))}

            {error && <p className="text-center text-sm text-[var(--mk-cinnabar-soft)]">{error}</p>}

            <div className="flex gap-3">
              <button type="button" onClick={() => goTo(1, -1)} className="mk-btn mk-btn-ghost flex-1">
                이전
              </button>
              <button type="button" onClick={handleAnalyze} className="mk-btn mk-btn-primary flex-[2]">
                신수 명통 열기
              </button>
            </div>
          </motion.div>
        )}

        {step === "loading" && result && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MusokLoader onComplete={() => goTo("result", 1)} />
          </motion.div>
        )}

        {step === "result" && result && (
          <motion.div key="result" custom={direction} variants={slide} initial="initial" animate="animate" exit="exit" transition={slide.transition}>
            <MusokDashboard result={result} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
