import type { Oheng } from "@/lib/seongmyung";
import { BIRTH_DISTRICTS_RAW, BIRTH_DISTRICTS_BY_CITY, BIRTH_DISTRICTS_COUNT } from "@/lib/birth-districts-list";

export type BirthCity = {
  id: string;
  label: string;
  province: string;
};

export type BirthDistrictRaw = {
  id: string;
  cityId: string;
  label: string;
  lat: number;
  lng: number;
  terrain: string;
};

export type BirthDistrict = BirthDistrictRaw & {
  direction: "동" | "서" | "남" | "북" | "중";
  oheng: Oheng;
};

/** 시·도 */
export const BIRTH_CITIES: BirthCity[] = [
  { id: "seoul", label: "서울특별시", province: "서울" },
  { id: "busan", label: "부산광역시", province: "부산" },
  { id: "incheon", label: "인천광역시", province: "인천" },
  { id: "daegu", label: "대구광역시", province: "대구" },
  { id: "daejeon", label: "대전광역시", province: "대전" },
  { id: "gwangju", label: "광주광역시", province: "광주" },
  { id: "ulsan", label: "울산광역시", province: "울산" },
  { id: "sejong", label: "세종특별자치시", province: "세종" },
  { id: "gyeonggi", label: "경기도", province: "경기" },
  { id: "gangwon", label: "강원특별자치도", province: "강원" },
  { id: "chungbuk", label: "충청북도", province: "충북" },
  { id: "chungnam", label: "충청남도", province: "충남" },
  { id: "jeonbuk", label: "전북특별자치도", province: "전북" },
  { id: "jeonnam", label: "전라남도", province: "전남" },
  { id: "gyeongbuk", label: "경상북도", province: "경북" },
  { id: "gyeongnam", label: "경상남도", province: "경남" },
  { id: "jeju", label: "제주특별자치도", province: "제주" },
  { id: "overseas", label: "해외·기타", province: "기타" },
];

const CENTER_LAT = 36.3;
const CENTER_LNG = 127.8;

function deriveDirection(lat: number, lng: number): BirthDistrict["direction"] {
  const dLat = lat - CENTER_LAT;
  const dLng = lng - CENTER_LNG;
  if (Math.abs(dLat) < 0.25 && Math.abs(dLng) < 0.25) return "중";
  if (Math.abs(dLat) > Math.abs(dLng)) return dLat > 0 ? "북" : "남";
  return dLng > 0 ? "동" : "서";
}

function deriveOheng(lat: number, lng: number, terrain: string): Oheng {
  if (terrain === "바다") return "수";
  if (terrain === "산") return "목";
  const dir = deriveDirection(lat, lng);
  if (dir === "동") return "목";
  if (dir === "서") return "금";
  if (dir === "남") return "화";
  if (dir === "북") return "수";
  return "토";
}

function enrich(raw: BirthDistrictRaw): BirthDistrict {
  return {
    ...raw,
    direction: deriveDirection(raw.lat, raw.lng),
    oheng: deriveOheng(raw.lat, raw.lng, raw.terrain),
  };
}

export const BIRTH_DISTRICTS: BirthDistrict[] = BIRTH_DISTRICTS_RAW.map(enrich);

export { BIRTH_DISTRICTS_COUNT, BIRTH_DISTRICTS_BY_CITY };

export function getCity(id: string): BirthCity | undefined {
  return BIRTH_CITIES.find((c) => c.id === id);
}

export function getDistrictsByCity(cityId: string): BirthDistrict[] {
  return BIRTH_DISTRICTS.filter((d) => d.cityId === cityId);
}

export function getDistrict(id: string): BirthDistrict | undefined {
  return BIRTH_DISTRICTS.find((d) => d.id === id);
}

export function getFullDistrictLabel(districtId: string): string {
  const d = getDistrict(districtId);
  if (!d) return "";
  const city = getCity(d.cityId);
  return city ? `${city.label} ${d.label}` : d.label;
}

export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
}

export function formatCoordinatesKorean(lat: number, lng: number): string {
  return `위도 ${lat.toFixed(4)}°, 경도 ${lng.toFixed(4)}°`;
}

/** 좌표 기반 미세 방위 (한반도 중심 36.3°N, 127.8°E 기준) */
export function deriveMicroDirection(lat: number, lng: number): string {
  const dLat = lat - CENTER_LAT;
  const dLng = lng - CENTER_LNG;
  if (Math.abs(dLat) < 0.3 && Math.abs(dLng) < 0.3) return "중심부";
  const parts: string[] = [];
  if (dLat > 0.3) parts.push("북쪽");
  else if (dLat < -0.3) parts.push("남쪽");
  if (dLng > 0.3) parts.push("동쪽");
  else if (dLng < -0.3) parts.push("서쪽");
  return parts.join("·") || "중심부";
}

/** 커버리지 검증용 */
export function getDistrictCoverageReport(): { cityId: string; label: string; count: number }[] {
  return BIRTH_CITIES.map((c) => ({
    cityId: c.id,
    label: c.label,
    count: getDistrictsByCity(c.id).length,
  }));
}
