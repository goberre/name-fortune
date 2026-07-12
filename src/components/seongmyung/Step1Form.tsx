"use client";

import type { CalendarType, Gender } from "@/types/birth";
import { BIRTH_REGIONS } from "@/lib/birth-region";

type Props = {
  name: string;
  gender: Gender;
  calendarType: CalendarType;
  isLeapMonth: boolean;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthRegion: string;
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
  setBirthRegion: (v: string) => void;
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
    <div className="flex rounded-none border border-red-900/30 bg-black/40 p-1">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`flex-1 rounded-none py-2.5 text-sm font-medium transition ${
            value === opt.id
              ? "bg-red-950/60 text-red-100 shadow-[0_0_12px_rgba(127,29,29,0.4)]"
              : "text-white/40 hover:text-white/70"
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
    <form onSubmit={props.onSubmit} className="oc-card relative p-6 sm:p-10">
      <p className="oc-kicker">Step I · 生</p>
      <h2 className="font-occult mt-2 text-2xl text-white">명주의 태생</h2>
      <p className="mt-2 text-sm text-white/40">태어난 시간과 우주의 천기, 대지의 좌표를 기록하십시오</p>

      <div className="mt-8">
        <label htmlFor="name" className="oc-label">
          영적 호칭 (한글 이름)
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
          className="oc-input oc-input-glow mt-3 px-5 py-5 text-center font-occult text-3xl tracking-[0.2em]"
        />
        <p className="mt-2 text-center text-[10px] tracking-widest text-white/25">2~4자 · 성+이름</p>
      </div>

      <div className="mt-8">
        <p className="oc-label mb-3">음과 양</p>
        <Segmented
          value={props.gender}
          options={[
            { id: "male", label: "陽" },
            { id: "female", label: "陰" },
          ]}
          onChange={props.setGender}
        />
      </div>

      <div className="mt-8">
        <p className="oc-label mb-3">천상의 기록 (생년월일)</p>
        <Segmented
          value={props.calendarType}
          options={[
            { id: "solar", label: "양력" },
            { id: "lunar", label: "음력" },
          ]}
          onChange={props.setCalendarType}
        />
        {props.calendarType === "lunar" && (
          <label className="mt-3 flex items-center gap-2 text-sm text-red-200/60">
            <input
              type="checkbox"
              checked={props.isLeapMonth}
              onChange={(e) => props.setIsLeapMonth(e.target.checked)}
              className="h-4 w-4 border-red-900 bg-black"
            />
            윤달 — 달의 그림자
          </label>
        )}
        <div className="mt-3 grid grid-cols-3 gap-3">
          <input
            type="number"
            inputMode="numeric"
            placeholder="1990"
            value={props.birthYear}
            onChange={(e) => props.setBirthYear(e.target.value.slice(0, 4))}
            className="oc-input oc-input-glow px-4 py-3.5 text-center text-lg"
            aria-label="년"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="01"
            value={props.birthMonth}
            onChange={(e) => props.setBirthMonth(e.target.value.slice(0, 2))}
            className="oc-input oc-input-glow px-4 py-3.5 text-center text-lg"
            aria-label="월"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="01"
            value={props.birthDay}
            onChange={(e) => props.setBirthDay(e.target.value.slice(0, 2))}
            className="oc-input oc-input-glow px-4 py-3.5 text-center text-lg"
            aria-label="일"
          />
        </div>
      </div>

      <div className="mt-8">
        <label htmlFor="birthRegion" className="oc-label">
          대지의 좌표 (태생지)
        </label>
        <select
          id="birthRegion"
          value={props.birthRegion}
          onChange={(e) => props.setBirthRegion(e.target.value)}
          className="oc-input oc-input-glow mt-3 w-full px-4 py-3.5 text-base"
        >
          <option value="">지역을 선택하십시오</option>
          {BIRTH_REGIONS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
        <p className="mt-2 text-[10px] tracking-wide text-indigo-300/40">
          태어난 땅의 지기(地氣)가 우주 천기와 맞물려 운명의 방향을 결정합니다
        </p>
      </div>

      {props.error && <p className="mt-4 text-center text-sm text-red-400">{props.error}</p>}

      <button type="submit" disabled={props.name.length < 2} className="oc-btn oc-btn-primary mt-10">
        한자 동조 의식으로 — 字
      </button>
    </form>
  );
}

export function buildBirthProfile(p: {
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthRegion: string;
  gender: Gender;
  calendarType: CalendarType;
  isLeapMonth: boolean;
}) {
  return {
    year: Number(p.birthYear),
    month: Number(p.birthMonth),
    day: Number(p.birthDay),
    birthRegion: p.birthRegion,
    gender: p.gender,
    calendarType: p.calendarType,
    isLeapMonth: p.isLeapMonth,
  };
}
