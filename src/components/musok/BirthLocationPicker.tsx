"use client";

import { useMemo } from "react";
import {
  BIRTH_CITIES,
  formatCoordinates,
  formatCoordinatesKorean,
  getDistrict,
  getDistrictsByCity,
  type BirthDistrict,
} from "@/lib/birth-districts";

type Props = {
  birthCity: string;
  birthDistrict: string;
  setBirthCity: (v: string) => void;
  setBirthDistrict: (v: string) => void;
};

export default function BirthLocationPicker({
  birthCity,
  birthDistrict,
  setBirthCity,
  setBirthDistrict,
}: Props) {
  const districts = useMemo(
    () => (birthCity ? getDistrictsByCity(birthCity) : []),
    [birthCity],
  );
  const selected: BirthDistrict | undefined = birthDistrict ? getDistrict(birthDistrict) : undefined;

  function onCityChange(cityId: string) {
    setBirthCity(cityId);
    const list = getDistrictsByCity(cityId);
    setBirthDistrict(list[0]?.id ?? "");
  }

  return (
    <div>
      <p className="mk-label mb-3">태생 좌표 (生所) — 시·군·구</p>
      <p className="mb-3 text-xs text-[var(--mk-ivory-muted)]">
        태어난 곳의 위도·경도로 지기(地氣)를 정밀하게 반영합니다
      </p>

      <select
        value={birthCity}
        onChange={(e) => onCityChange(e.target.value)}
        className="mk-input w-full px-4 py-3.5 text-base"
        aria-label="시·도"
      >
        <option value="">시·도 선택</option>
        {BIRTH_CITIES.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>

      {birthCity && districts.length > 0 && (
        <select
          value={birthDistrict}
          onChange={(e) => setBirthDistrict(e.target.value)}
          className="mk-input mt-3 w-full px-4 py-3.5 text-base"
          aria-label="구·군·시"
        >
          <option value="">구·군·시 선택</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
      )}

      {selected && (
        <div className="mt-4 border border-[var(--mk-border)] bg-[var(--mk-charcoal)] p-4">
          <p className="font-musok text-sm text-[var(--mk-ivory)]">
            {BIRTH_CITIES.find((c) => c.id === selected.cityId)?.label} {selected.label}
          </p>
          <p className="mt-2 font-mono text-xs text-[var(--mk-cinnabar-soft)]">
            {formatCoordinates(selected.lat, selected.lng)}
          </p>
          <p className="mt-1 text-[10px] text-[var(--mk-ivory-muted)]">
            {formatCoordinatesKorean(selected.lat, selected.lng)} · {selected.oheng}행 · {selected.terrain}
          </p>
          <CoordinateMiniMap lat={selected.lat} lng={selected.lng} />
        </div>
      )}
    </div>
  );
}

function CoordinateMiniMap({ lat, lng }: { lat: number; lng: number }) {
  // 한반도 대략 범위: lat 33~38.5, lng 125~130
  const x = ((lng - 125) / 5) * 100;
  const y = ((38.5 - lat) / 5.5) * 100;
  const cx = Math.max(4, Math.min(96, x));
  const cy = Math.max(4, Math.min(96, y));

  return (
    <svg viewBox="0 0 100 100" className="mt-3 h-24 w-full opacity-80" aria-hidden>
      <rect x="0" y="0" width="100" height="100" fill="rgba(245,240,232,0.03)" stroke="var(--mk-border)" strokeWidth="0.5" />
      <ellipse cx="50" cy="48" rx="22" ry="38" fill="none" stroke="var(--mk-border)" strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r="3" fill="var(--mk-cinnabar)" />
      <circle cx={cx} cy={cy} r="6" fill="none" stroke="var(--mk-cinnabar)" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}
