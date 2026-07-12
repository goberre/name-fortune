"use client";

import type { CalendarType, Gender } from "@/types/birth";
import BirthLocationPicker from "@/components/musok/BirthLocationPicker";

type Props = {
  name: string;
  gender: Gender;
  calendarType: CalendarType;
  isLeapMonth: boolean;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthCity: string;
  birthDistrict: string;
  isComposing: boolean;
  error: string;
  onNameChange: (v: string) => void;
  onCompositionStart: () => void;
  onCompositionEnd: (v: string) => void;
  setGender: (g: Gender) => void;
  setCalendarType: (c: CalendarType) => void;
  setIsLeapMonth: (v: boolean) => void;
  setBirthYear: (v: string) => void;
  setBirthMonth: (v: string) => void;
  setBirthDay: (v: string) => void;
  setBirthCity: (v: string) => void;
  setBirthDistrict: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  kicker?: string;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
};

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex border border-[var(--mk-border)] bg-[var(--mk-charcoal-light)] p-1">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`flex-1 py-2.5 text-sm transition ${
            value === opt.id
              ? "bg-[var(--mk-ivory)]/10 text-[var(--mk-ivory)]"
              : "text-[var(--mk-ivory-muted)] hover:text-[var(--mk-ivory-dim)]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function Step1Form(props: Props) {
  const kicker = props.kicker ?? "생년천기 (生年天氣)";
  const title = props.title ?? "선천 사주 기록";
  const subtitle = props.subtitle ?? "태어난 해·달·날과 태생 좌표(지기)를 고합니다.";
  const submitLabel = props.submitLabel ?? "명줄 보완(補完)으로 — 字";

  return (
    <form onSubmit={props.onSubmit} className="mk-card p-6 sm:p-10">
      <p className="mk-kicker">{kicker}</p>
      <h2 className="font-musok mt-2 text-2xl text-[var(--mk-ivory)]">{title}</h2>
      <p className="mt-2 text-sm text-[var(--mk-ivory-dim)]">{subtitle}</p>

      <div className="mt-8">
        <label htmlFor="name" className="mk-label">
          한글 이름
        </label>
        <input
          id="name"
          value={props.name}
          onChange={(e) => props.onNameChange(e.target.value)}
          onCompositionStart={props.onCompositionStart}
          onCompositionEnd={(e) => props.onCompositionEnd(e.currentTarget.value)}
          placeholder="홍길동"
          maxLength={4}
          lang="ko"
          className="mk-input mt-3 px-5 py-5 text-center font-musok text-3xl tracking-[0.15em]"
        />
      </div>

      <div className="mt-8">
        <p className="mk-label mb-3">음양 (성별)</p>
        <Segmented
          value={props.gender}
          options={[
            { id: "male", label: "남 (陽)" },
            { id: "female", label: "여 (陰)" },
          ]}
          onChange={props.setGender}
        />
      </div>

      <div className="mt-8">
        <p className="mk-label mb-3">생년월일</p>
        <Segmented
          value={props.calendarType}
          options={[
            { id: "solar", label: "양력" },
            { id: "lunar", label: "음력" },
          ]}
          onChange={props.setCalendarType}
        />
        {props.calendarType === "lunar" && (
          <>
            <label className="mt-3 flex items-center gap-2 text-sm text-[var(--mk-ivory-dim)]">
              <input
                type="checkbox"
                checked={props.isLeapMonth}
                onChange={(e) => props.setIsLeapMonth(e.target.checked)}
                className="h-4 w-4"
              />
              윤달 (閏月)
            </label>
            <p className="mt-2 rounded border border-amber-600/30 bg-amber-950/20 px-3 py-2 text-xs leading-relaxed text-amber-200/80">
              음력·윤달은 양력으로 자동 변환되지 않습니다. 사주·궁합은 입력한 날짜 기준 참고 풀이이며, 정확한
              사주는 양력 생일을 권장합니다.
            </p>
          </>
        )}
        <div className="mt-3 grid grid-cols-3 gap-3">
          <input
            type="number"
            placeholder="1990"
            value={props.birthYear}
            onChange={(e) => props.setBirthYear(e.target.value.slice(0, 4))}
            className="mk-input px-4 py-3.5 text-center text-lg"
            aria-label="년"
          />
          <input
            type="number"
            placeholder="01"
            value={props.birthMonth}
            onChange={(e) => props.setBirthMonth(e.target.value.slice(0, 2))}
            className="mk-input px-4 py-3.5 text-center text-lg"
            aria-label="월"
          />
          <input
            type="number"
            placeholder="01"
            value={props.birthDay}
            onChange={(e) => props.setBirthDay(e.target.value.slice(0, 2))}
            className="mk-input px-4 py-3.5 text-center text-lg"
            aria-label="일"
          />
        </div>
      </div>

      <div className="mt-8">
        <BirthLocationPicker
          birthCity={props.birthCity}
          birthDistrict={props.birthDistrict}
          setBirthCity={props.setBirthCity}
          setBirthDistrict={props.setBirthDistrict}
        />
      </div>

      {props.error && <p className="mt-4 text-center text-sm text-[var(--mk-cinnabar-soft)]">{props.error}</p>}

      <button type="submit" disabled={props.name.length < 2} className="mk-btn mk-btn-primary mt-10">
        {submitLabel}
      </button>
    </form>
  );
}

export function buildBirthProfile(p: {
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthDistrict: string;
  gender: Gender;
  calendarType: CalendarType;
  isLeapMonth: boolean;
}) {
  return {
    year: Number(p.birthYear),
    month: Number(p.birthMonth),
    day: Number(p.birthDay),
    birthDistrict: p.birthDistrict,
    gender: p.gender,
    calendarType: p.calendarType,
    isLeapMonth: p.isLeapMonth,
  } satisfies import("@/types/birth").BirthProfile;
}
