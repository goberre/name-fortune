"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import CoupleMusokDashboard from "@/components/musok/CoupleMusokDashboard";
import IntroMusok from "@/components/musok/IntroMusok";
import MusokDashboard from "@/components/musok/MusokDashboard";
import MusokLoader from "@/components/musok/MusokLoader";
import HanjaPicker from "@/components/seongmyung/HanjaPicker";
import Step1Form, { buildBirthProfile } from "@/components/seongmyung/Step1Form";
import { analyzeCoupleCompatibility, type CoupleCompatibilityResult } from "@/lib/compatibility";
import { getHanjaCandidates, loadHanjaIndex, type HanjaSelection } from "@/lib/hanja";
import { analyzeSeongmyung, isValidKoreanName, type SeongmyungResult } from "@/lib/seongmyung";
import type { CalendarType, Gender } from "@/types/birth";

function sanitizeName(value: string) {
  return value.replace(/[^가-힣]/g, "").slice(0, 4);
}

type AppMode = "solo" | "couple";
type Step = "intro" | 1 | "1b" | 2 | "loading" | "result";

const slide = {
  initial: (dir: number) => ({ x: dir > 0 ? 32 : -32, opacity: 0 }),
  animate: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -32 : 32, opacity: 0 }),
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

function validateBirth(
  birthYear: string,
  birthMonth: string,
  birthDay: string,
  birthCity: string,
  birthDistrict: string,
): string | null {
  if (!birthYear || !birthMonth || !birthDay) return "생년월일을 모두 입력해 주세요.";
  const y = Number(birthYear);
  const m = Number(birthMonth);
  const d = Number(birthDay);
  if (y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return "올바른 생년월일을 입력해 주세요.";
  if (!birthCity || !birthDistrict) return "태어난 시·도와 구·군·시를 선택해 주세요.";
  return null;
}

export default function SeongmyungApp() {
  const [mode, setMode] = useState<AppMode>("solo");
  const [step, setStep] = useState<Step>("intro");
  const [direction, setDirection] = useState(1);

  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [calendarType, setCalendarType] = useState<CalendarType>("solar");
  const [isLeapMonth, setIsLeapMonth] = useState(false);
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [birthDistrict, setBirthDistrict] = useState("");
  const [hanjaSelections, setHanjaSelections] = useState<(HanjaSelection | null)[]>([]);
  const [isComposing, setIsComposing] = useState(false);

  const [partnerName, setPartnerName] = useState("");
  const [partnerGender, setPartnerGender] = useState<Gender>("female");
  const [partnerCalendarType, setPartnerCalendarType] = useState<CalendarType>("solar");
  const [partnerIsLeapMonth, setPartnerIsLeapMonth] = useState(false);
  const [partnerBirthYear, setPartnerBirthYear] = useState("");
  const [partnerBirthMonth, setPartnerBirthMonth] = useState("");
  const [partnerBirthDay, setPartnerBirthDay] = useState("");
  const [partnerBirthCity, setPartnerBirthCity] = useState("");
  const [partnerBirthDistrict, setPartnerBirthDistrict] = useState("");
  const [partnerHanjaSelections, setPartnerHanjaSelections] = useState<(HanjaSelection | null)[]>([]);
  const [partnerIsComposing, setPartnerIsComposing] = useState(false);

  const [hanjaIndexReady, setHanjaIndexReady] = useState(false);
  const [result, setResult] = useState<SeongmyungResult | null>(null);
  const [coupleResult, setCoupleResult] = useState<CoupleCompatibilityResult | null>(null);
  const [error, setError] = useState("");
  const [inkPulse, setInkPulse] = useState(false);

  const chars = useMemo(() => [...name], [name]);
  const partnerChars = useMemo(() => [...partnerName], [partnerName]);

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

  const handlePartnerNameChange = useCallback(
    (value: string) => {
      const next = partnerIsComposing ? value.slice(0, 4) : sanitizeName(value);
      setPartnerName(next);
      setPartnerHanjaSelections((prev) =>
        next.split("").map((ch, i) => {
          const existing = prev[i];
          if (existing?.hangul === ch) return existing;
          return null;
        }),
      );
    },
    [partnerIsComposing],
  );

  useEffect(() => {
    if (step === "intro" || step === 1 || step === "1b") {
      loadHanjaIndex().catch(() => {});
    }
  }, [step]);

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
      const selfNext = await Promise.all(
        chars.map(async (ch, i) => {
          if (hanjaSelections[i]?.hangul === ch) return hanjaSelections[i];
          const list = await getHanjaCandidates(ch);
          return list[0] ? { hangul: ch, ...list[0] } : null;
        }),
      );
      if (cancelled) return;
      setHanjaSelections(selfNext);

      if (mode === "couple") {
        const partnerNext = await Promise.all(
          partnerChars.map(async (ch, i) => {
            if (partnerHanjaSelections[i]?.hangul === ch) return partnerHanjaSelections[i];
            const list = await getHanjaCandidates(ch);
            return list[0] ? { hangul: ch, ...list[0] } : null;
          }),
        );
        if (!cancelled) setPartnerHanjaSelections(partnerNext);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, hanjaIndexReady, name, partnerName, mode]);

  function handleHanjaSelect(index: number, selection: HanjaSelection) {
    setInkPulse(true);
    setTimeout(() => setInkPulse(false), 400);
    setHanjaSelections((prev) => {
      const next = [...prev];
      next[index] = selection;
      return next;
    });
  }

  function handlePartnerHanjaSelect(index: number, selection: HanjaSelection) {
    setInkPulse(true);
    setTimeout(() => setInkPulse(false), 400);
    setPartnerHanjaSelections((prev) => {
      const next = [...prev];
      next[index] = selection;
      return next;
    });
  }

  function enterApp() {
    setMode("solo");
    setError("");
    goTo(1, 1);
  }

  function startCoupleFromResult() {
    setMode("couple");
    setError("");
    setCoupleResult(null);
    if (result) {
      setHanjaSelections(
        result.slots.map((s) =>
          s.hanja
            ? {
                hangul: s.char,
                hanja: s.hanja,
                meaning: s.hanjaMeaning ?? "",
                oheng: s.sourceOheng ?? "토",
                wonStrokes: s.strokes,
              }
            : null,
        ),
      );
    }
    goTo("1b", 1);
  }

  function goStep2(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!isValidKoreanName(name)) {
      setError("2~4글자 한글 이름을 입력해 주세요.");
      return;
    }
    const birthErr = validateBirth(birthYear, birthMonth, birthDay, birthCity, birthDistrict);
    if (birthErr) {
      setError(birthErr);
      return;
    }
    if (mode === "couple") goTo("1b", 1);
    else goTo(2, 1);
  }

  function goPartnerHanja(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!isValidKoreanName(partnerName)) {
      setError("상대 이름을 2~4글자 한글로 입력해 주세요.");
      return;
    }
    const birthErr = validateBirth(
      partnerBirthYear,
      partnerBirthMonth,
      partnerBirthDay,
      partnerBirthCity,
      partnerBirthDistrict,
    );
    if (birthErr) {
      setError(birthErr);
      return;
    }
    goTo(2, 1);
  }

  function mapHanjaSlots(slots: HanjaSelection[]) {
    return slots.map((s) => ({
      hangul: s.hangul,
      hanja: s.hanja,
      meaning: s.meaning,
      oheng: s.oheng,
      wonStrokes: s.wonStrokes,
    }));
  }

  function handleAnalyze() {
    setError("");
    if (hanjaSelections.some((s) => !s)) {
      setError("본인 이름의 모든 글자에 한자를 선택해 주세요.");
      return;
    }
    if (mode === "couple" && partnerHanjaSelections.some((s) => !s)) {
      setError("상대 이름의 모든 글자에 한자를 선택해 주세요.");
      return;
    }

    try {
      const selfSlots = hanjaSelections as HanjaSelection[];
      const selfBirth = buildBirthProfile({
        birthYear,
        birthMonth,
        birthDay,
        birthDistrict,
        gender,
        calendarType,
        isLeapMonth,
      });

      if (mode === "solo") {
        setCoupleResult(null);
        setResult(
          analyzeSeongmyung({
            name,
            hanjaSlots: mapHanjaSlots(selfSlots),
            birth: selfBirth,
          }),
        );
      } else {
        setResult(null);
        const partnerSlots = partnerHanjaSelections as HanjaSelection[];
        setCoupleResult(
          analyzeCoupleCompatibility({
            personA: { name, hanjaSlots: mapHanjaSlots(selfSlots), birth: selfBirth },
            personB: {
              name: partnerName,
              hanjaSlots: mapHanjaSlots(partnerSlots),
              birth: buildBirthProfile({
                birthYear: partnerBirthYear,
                birthMonth: partnerBirthMonth,
                birthDay: partnerBirthDay,
                birthDistrict: partnerBirthDistrict,
                gender: partnerGender,
                calendarType: partnerCalendarType,
                isLeapMonth: partnerIsLeapMonth,
              }),
            },
          }),
        );
      }
      goTo("loading", 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "분석 중 오류가 발생했습니다.");
    }
  }

  function reset() {
    setDirection(-1);
    setStep("intro");
    setMode("solo");
    setResult(null);
    setCoupleResult(null);
    setName("");
    setGender("male");
    setCalendarType("solar");
    setIsLeapMonth(false);
    setBirthYear("");
    setBirthMonth("");
    setBirthDay("");
    setBirthCity("");
    setBirthDistrict("");
    setHanjaSelections([]);
    setPartnerName("");
    setPartnerGender("female");
    setPartnerCalendarType("solar");
    setPartnerIsLeapMonth(false);
    setPartnerBirthYear("");
    setPartnerBirthMonth("");
    setPartnerBirthDay("");
    setPartnerBirthCity("");
    setPartnerBirthDistrict("");
    setPartnerHanjaSelections([]);
    setHanjaIndexReady(false);
    setError("");
  }

  const coupleSteps = [
    { id: 1, label: "本", sub: "본인" },
    { id: 2, label: "相", sub: "상대", key: "1b" as const },
    { id: 3, label: "字", sub: "한자", key: 2 as const },
  ];

  const soloSteps = [
    { id: 1, label: "生", sub: "천기" },
    { id: 2, label: "字", sub: "보완" },
  ];

  function stepActive(sid: number): boolean {
    if (mode === "solo") return step === sid;
    if (sid === 1) return step === 1;
    if (sid === 2) return step === "1b";
    return step === 2;
  }

  function stepDone(sid: number): boolean {
    if (mode === "solo") return typeof step === "number" && step > sid;
    if (sid === 1) return step === "1b" || step === 2 || step === "loading" || step === "result";
    if (sid === 2) return step === 2 || step === "loading" || step === "result";
    return false;
  }

  const showStepBar = step !== "result" && step !== "intro" && step !== "loading";
  const steps = mode === "couple" ? coupleSteps : soloSteps;

  return (
    <div className={`mx-auto max-w-2xl px-5 pb-24 pt-6 ${inkPulse ? "mk-ink-pulse" : ""}`}>
      {showStepBar && (
        <div className="mb-8 flex items-center justify-center gap-2 sm:gap-3">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2 sm:gap-3">
              <span
                className={`flex h-8 w-8 items-center justify-center font-musok text-sm ${
                  stepActive(s.id) ? "mk-step mk-step-active" : stepDone(s.id) ? "mk-step mk-step-done" : "mk-step mk-step-idle"
                }`}
              >
                {s.label}
              </span>
              <span className={`text-xs ${stepActive(s.id) ? "text-[var(--mk-ivory-dim)]" : "text-[var(--mk-ivory-muted)]"}`}>
                {s.sub}
              </span>
              {i < steps.length - 1 && <span className="h-px w-4 sm:w-8 bg-[var(--mk-border)]" />}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        {step === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <IntroMusok onEnter={enterApp} />
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
              birthCity={birthCity}
              birthDistrict={birthDistrict}
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
              setBirthCity={setBirthCity}
              setBirthDistrict={setBirthDistrict}
              onSubmit={goStep2}
              kicker={mode === "couple" ? "본인 (本人)" : undefined}
              title={mode === "couple" ? "나의 선천 사주" : undefined}
              subtitle={mode === "couple" ? "궁합 분석의 첫 번째 — 본인의 생년월일과 태생 좌표를 고합니다." : undefined}
              submitLabel={mode === "couple" ? "상대 정보(相)로 — 相" : undefined}
            />
          </motion.div>
        )}

        {step === "1b" && mode === "couple" && (
          <motion.div key="step1b" custom={direction} variants={slide} initial="initial" animate="animate" exit="exit" transition={slide.transition}>
            <Step1Form
              name={partnerName}
              gender={partnerGender}
              calendarType={partnerCalendarType}
              isLeapMonth={partnerIsLeapMonth}
              birthYear={partnerBirthYear}
              birthMonth={partnerBirthMonth}
              birthDay={partnerBirthDay}
              birthCity={partnerBirthCity}
              birthDistrict={partnerBirthDistrict}
              isComposing={partnerIsComposing}
              error={error}
              onNameChange={handlePartnerNameChange}
              onCompositionStart={() => setPartnerIsComposing(true)}
              onCompositionEnd={(v) => {
                setPartnerIsComposing(false);
                handlePartnerNameChange(sanitizeName(v));
              }}
              setGender={setPartnerGender}
              setCalendarType={setPartnerCalendarType}
              setIsLeapMonth={setPartnerIsLeapMonth}
              setBirthYear={setPartnerBirthYear}
              setBirthMonth={setPartnerBirthMonth}
              setBirthDay={setPartnerBirthDay}
              setBirthCity={setPartnerBirthCity}
              setBirthDistrict={setPartnerBirthDistrict}
              onSubmit={goPartnerHanja}
              kicker="상대 (相對)"
              title="배우자·연인 선천 사주"
              subtitle="궁합 분석의 두 번째 — 상대의 생년월일과 태생 좌표를 고합니다."
              submitLabel="한자 선택(字)으로 — 字"
            />
            <button type="button" onClick={() => goTo(1, -1)} className="mk-btn mk-btn-ghost mt-4 w-full">
              본인 정보로 돌아가기
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" custom={direction} variants={slide} initial="initial" animate="animate" exit="exit" transition={slide.transition} className="space-y-5">
            <div className="text-center">
              <p className="mk-kicker">명줄 보완 (補完)</p>
              <p className="font-musok mt-2 text-xl text-[var(--mk-ivory)]">
                {mode === "couple" ? "두 사람의 한자 · 원획 · 오행" : `「${name}」 한자 · 원획 · 오행`}
              </p>
              <p className="mt-2 text-xs text-[var(--mk-ivory-muted)]">원획법(原劃法) 획수와 토속 오행 기운을 확인하십시오</p>
            </div>

            <div>
              {mode === "couple" && <p className="mk-label mb-3 px-1">본인 — {name}</p>}
              {chars.map((ch, i) => (
                <HanjaPicker
                  key={`self-${ch}-${i}`}
                  hangul={ch}
                  index={i}
                  selected={hanjaSelections[i] ?? null}
                  onSelect={handleHanjaSelect}
                  variant="musok"
                />
              ))}
            </div>

            {mode === "couple" && (
              <div className="pt-2">
                <p className="mk-label mb-3 px-1">상대 — {partnerName}</p>
                {partnerChars.map((ch, i) => (
                  <HanjaPicker
                    key={`partner-${ch}-${i}`}
                    hangul={ch}
                    index={i + chars.length}
                    selected={partnerHanjaSelections[i] ?? null}
                    onSelect={handlePartnerHanjaSelect}
                    variant="musok"
                  />
                ))}
              </div>
            )}

            {error && <p className="text-center text-sm text-[var(--mk-cinnabar-soft)]">{error}</p>}

            <div className="flex gap-3">
              <button type="button" onClick={() => goTo(mode === "couple" ? "1b" : 1, -1)} className="mk-btn mk-btn-ghost flex-1">
                이전
              </button>
              <button type="button" onClick={handleAnalyze} className="mk-btn mk-btn-primary flex-[2]">
                {mode === "couple" ? "쌍통(雙通) 열기" : "신수 명통 열기"}
              </button>
            </div>
          </motion.div>
        )}

        {step === "loading" && (result || coupleResult) && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MusokLoader onComplete={() => goTo("result", 1)} />
          </motion.div>
        )}

        {step === "result" && result && mode === "solo" && (
          <motion.div key="result-solo" custom={direction} variants={slide} initial="initial" animate="animate" exit="exit" transition={slide.transition}>
            <MusokDashboard result={result} onReset={reset} onStartCouple={startCoupleFromResult} />
          </motion.div>
        )}

        {step === "result" && coupleResult && mode === "couple" && (
          <motion.div key="result-couple" custom={direction} variants={slide} initial="initial" animate="animate" exit="exit" transition={slide.transition}>
            <CoupleMusokDashboard result={coupleResult} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
