"use client";

import type { BirthProfile, CalendarType, Gender } from "@/types/birth";

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
    <div className="flex rounded-xl bg-neutral-100 p-1">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
            value === opt.id ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
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
    <form onSubmit={props.onSubmit} className="ap-card space-y-8 p-6 sm:p-10">
      <div>
        <label htmlFor="name" className="ap-label">
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
          className="ap-input mt-3 px-5 py-5 text-center text-3xl font-semibold tracking-[0.15em]"
        />
        <p className="mt-2 text-center text-xs text-neutral-400">2~4글자 · 성+이름</p>
      </div>

      <div>
        <p className="ap-label mb-3">성별</p>
        <Segmented
          value={props.gender}
          options={[
            { id: "male", label: "남" },
            { id: "female", label: "여" },
          ]}
          onChange={props.setGender}
        />
      </div>

      <div>
        <p className="ap-label mb-3">생년월일</p>
        <Segmented
          value={props.calendarType}
          options={[
            { id: "solar", label: "양력" },
            { id: "lunar", label: "음력" },
          ]}
          onChange={props.setCalendarType}
        />
        {props.calendarType === "lunar" && (
          <label className="mt-3 flex items-center gap-2 text-sm text-neutral-600">
            <input
              type="checkbox"
              checked={props.isLeapMonth}
              onChange={(e) => props.setIsLeapMonth(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300"
            />
            윤달
          </label>
        )}
        <div className="mt-3 grid grid-cols-3 gap-3">
          <input
            type="number"
            inputMode="numeric"
            placeholder="1990"
            min={1900}
            max={2100}
            value={props.birthYear}
            onChange={(e) => props.setBirthYear(e.target.value.slice(0, 4))}
            className="ap-input px-4 py-3.5 text-center text-lg"
            aria-label="출생년"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="01"
            min={1}
            max={12}
            value={props.birthMonth}
            onChange={(e) => props.setBirthMonth(e.target.value.slice(0, 2))}
            className="ap-input px-4 py-3.5 text-center text-lg"
            aria-label="출생월"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="01"
            min={1}
            max={31}
            value={props.birthDay}
            onChange={(e) => props.setBirthDay(e.target.value.slice(0, 2))}
            className="ap-input px-4 py-3.5 text-center text-lg"
            aria-label="출생일"
          />
        </div>
      </div>

      <div>
        <p className="ap-label mb-3">태어난 시간 (선택)</p>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            inputMode="numeric"
            placeholder="14"
            min={0}
            max={23}
            value={props.birthHour}
            onChange={(e) => props.setBirthHour(e.target.value.slice(0, 2))}
            className="ap-input px-4 py-3.5 text-center text-lg"
            aria-label="출생 시"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="30"
            min={0}
            max={59}
            value={props.birthMinute}
            onChange={(e) => props.setBirthMinute(e.target.value.slice(0, 2))}
            className="ap-input px-4 py-3.5 text-center text-lg"
            aria-label="출생 분"
          />
        </div>
        <p className="mt-2 text-xs text-neutral-400">시주(時柱) 오행 분석에 반영됩니다</p>
      </div>

      {props.error && <p className="text-center text-sm text-rose-600">{props.error}</p>}

      <button type="submit" disabled={props.name.length < 2} className="ap-btn">
        다음 — 한자 선택
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
}): BirthProfile {
  const profile: BirthProfile = {
    year: Number(p.birthYear),
    month: Number(p.birthMonth),
    day: Number(p.birthDay),
    gender: p.gender,
    calendarType: p.calendarType,
    isLeapMonth: p.isLeapMonth,
  };
  if (p.birthHour !== "") profile.hour = Number(p.birthHour);
  if (p.birthMinute !== "") profile.minute = Number(p.birthMinute);
  return profile;
}
