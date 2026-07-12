"use client";

import type { CalendarType, Gender } from "@/types/birth";

type Props = {
  name: string;
  gender: Gender;
  calendarType: CalendarType;
  isLeapMonth: boolean;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  birthMinute: string;
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
  setBirthHour: (v: string) => void;
  setBirthMinute: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
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
  return (
    <form onSubmit={props.onSubmit} className="mk-card p-6 sm:p-10">
      <p className="mk-kicker">생년천기 (生年天氣)</p>
      <h2 className="font-musok mt-2 text-2xl text-[var(--mk-ivory)]">선천 사주 기록</h2>
      <p className="mt-2 text-sm text-[var(--mk-ivory-dim)]">
        태어난 해와 달, 날과 시의 기운(사주선천운)을 먼저 고합니다.
      </p>

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
          <label className="mt-3 flex items-center gap-2 text-sm text-[var(--mk-ivory-dim)]">
            <input
              type="checkbox"
              checked={props.isLeapMonth}
              onChange={(e) => props.setIsLeapMonth(e.target.checked)}
              className="h-4 w-4"
            />
            윤달 (閏月)
          </label>
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
        <p className="mk-label mb-3">태어난 시 (時)</p>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="14"
            min={0}
            max={23}
            value={props.birthHour}
            onChange={(e) => props.setBirthHour(e.target.value.slice(0, 2))}
            className="mk-input px-4 py-3.5 text-center text-lg"
            aria-label="시"
          />
          <input
            type="number"
            placeholder="30"
            min={0}
            max={59}
            value={props.birthMinute}
            onChange={(e) => props.setBirthMinute(e.target.value.slice(0, 2))}
            className="mk-input px-4 py-3.5 text-center text-lg"
            aria-label="분"
          />
        </div>
        <p className="mt-2 text-[10px] text-[var(--mk-ivory-muted)]">
          모르시면 비워 두셔도 됩니다. 시주(時柱)는 입력 시에만 반영합니다.
        </p>
      </div>

      {props.error && <p className="mt-4 text-center text-sm text-[var(--mk-cinnabar-soft)]">{props.error}</p>}

      <button type="submit" disabled={props.name.length < 2} className="mk-btn mk-btn-primary mt-10">
        명줄 보완(補完)으로 — 字
      </button>
    </form>
  );
}

export function buildBirthProfile(p: {
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  birthMinute: string;
  gender: Gender;
  calendarType: CalendarType;
  isLeapMonth: boolean;
  birthRegion?: string;
}) {
  const profile: import("@/types/birth").BirthProfile = {
    year: Number(p.birthYear),
    month: Number(p.birthMonth),
    day: Number(p.birthDay),
    gender: p.gender,
    calendarType: p.calendarType,
    isLeapMonth: p.isLeapMonth,
  };
  if (p.birthHour !== "") profile.hour = Number(p.birthHour);
  if (p.birthMinute !== "") profile.minute = Number(p.birthMinute);
  if (p.birthRegion) profile.birthRegion = p.birthRegion;
  return profile;
}
