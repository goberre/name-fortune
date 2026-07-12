import type { Oheng } from "@/lib/seongmyung";

export type BirthCity = {
  id: string;
  label: string;
  province: string;
};

export type BirthDistrict = {
  id: string;
  cityId: string;
  label: string;
  lat: number;
  lng: number;
  direction: "동" | "서" | "남" | "북" | "중";
  oheng: Oheng;
  terrain: string;
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

/** 구·군·시 — 위도·경도(대표 좌표) */
export const BIRTH_DISTRICTS: BirthDistrict[] = [
  // 서울 25구
  { id: "seoul-gangnam", cityId: "seoul", label: "강남구", lat: 37.5172, lng: 127.0473, direction: "남", oheng: "화", terrain: "도시" },
  { id: "seoul-seocho", cityId: "seoul", label: "서초구", lat: 37.4837, lng: 127.0324, direction: "남", oheng: "화", terrain: "도시" },
  { id: "seoul-songpa", cityId: "seoul", label: "송파구", lat: 37.5145, lng: 127.1059, direction: "동", oheng: "목", terrain: "도시" },
  { id: "seoul-gangdong", cityId: "seoul", label: "강동구", lat: 37.5301, lng: 127.1238, direction: "동", oheng: "목", terrain: "도시" },
  { id: "seoul-mapo", cityId: "seoul", label: "마포구", lat: 37.5663, lng: 126.9019, direction: "서", oheng: "금", terrain: "도시" },
  { id: "seoul-yongsan", cityId: "seoul", label: "용산구", lat: 37.5326, lng: 126.9905, direction: "중", oheng: "토", terrain: "도시" },
  { id: "seoul-jongno", cityId: "seoul", label: "종로구", lat: 37.5729, lng: 126.9794, direction: "중", oheng: "토", terrain: "도시" },
  { id: "seoul-jung", cityId: "seoul", label: "중구", lat: 37.5641, lng: 126.9979, direction: "중", oheng: "토", terrain: "도시" },
  { id: "seoul-gangbuk", cityId: "seoul", label: "강북구", lat: 37.6396, lng: 127.0257, direction: "북", oheng: "수", terrain: "도시" },
  { id: "seoul-nowon", cityId: "seoul", label: "노원구", lat: 37.6542, lng: 127.0568, direction: "북", oheng: "수", terrain: "도시" },
  { id: "seoul-dobong", cityId: "seoul", label: "도봉구", lat: 37.6688, lng: 127.0471, direction: "북", oheng: "수", terrain: "도시" },
  { id: "seoul-eunpyeong", cityId: "seoul", label: "은평구", lat: 37.6027, lng: 126.9291, direction: "서", oheng: "금", terrain: "도시" },
  { id: "seoul-seodaemun", cityId: "seoul", label: "서대문구", lat: 37.5791, lng: 126.9368, direction: "서", oheng: "금", terrain: "도시" },
  { id: "seoul-yangcheon", cityId: "seoul", label: "양천구", lat: 37.5170, lng: 126.8664, direction: "서", oheng: "금", terrain: "도시" },
  { id: "seoul-guro", cityId: "seoul", label: "구로구", lat: 37.4954, lng: 126.8874, direction: "서", oheng: "금", terrain: "도시" },
  { id: "seoul-yeongdeungpo", cityId: "seoul", label: "영등포구", lat: 37.5264, lng: 126.8962, direction: "서", oheng: "금", terrain: "도시" },
  { id: "seoul-dongjak", cityId: "seoul", label: "동작구", lat: 37.5124, lng: 126.9393, direction: "남", oheng: "화", terrain: "도시" },
  { id: "seoul-gwanak", cityId: "seoul", label: "관악구", lat: 37.4784, lng: 126.9516, direction: "남", oheng: "화", terrain: "도시" },
  { id: "seoul-seongdong", cityId: "seoul", label: "성동구", lat: 37.5634, lng: 127.0366, direction: "동", oheng: "목", terrain: "도시" },
  { id: "seoul-gwangjin", cityId: "seoul", label: "광진구", lat: 37.5385, lng: 127.0823, direction: "동", oheng: "목", terrain: "도시" },
  { id: "seoul-dongdaemun", cityId: "seoul", label: "동대문구", lat: 37.5744, lng: 127.0396, direction: "동", oheng: "목", terrain: "도시" },
  { id: "seoul-jungnang", cityId: "seoul", label: "중랑구", lat: 37.6066, lng: 127.0927, direction: "동", oheng: "목", terrain: "도시" },
  { id: "seoul-seongbuk", cityId: "seoul", label: "성북구", lat: 37.5894, lng: 127.0167, direction: "북", oheng: "수", terrain: "도시" },
  { id: "seoul-geumcheon", cityId: "seoul", label: "금천구", lat: 37.4569, lng: 126.8956, direction: "남", oheng: "화", terrain: "도시" },
  { id: "seoul-gangseo", cityId: "seoul", label: "강서구", lat: 37.5509, lng: 126.8495, direction: "서", oheng: "금", terrain: "도시" },

  // 부산
  { id: "busan-haeundae", cityId: "busan", label: "해운대구", lat: 35.1631, lng: 129.1635, direction: "동", oheng: "목", terrain: "바다" },
  { id: "busan-suyeong", cityId: "busan", label: "수영구", lat: 35.1455, lng: 129.1133, direction: "동", oheng: "목", terrain: "바다" },
  { id: "busan-jung", cityId: "busan", label: "중구", lat: 35.1064, lng: 129.0324, direction: "남", oheng: "화", terrain: "바다" },
  { id: "busan-sasang", cityId: "busan", label: "사상구", lat: 35.1527, lng: 128.9910, direction: "서", oheng: "금", terrain: "도시" },

  // 인천
  { id: "incheon-namdong", cityId: "incheon", label: "남동구", lat: 37.4486, lng: 126.7313, direction: "서", oheng: "금", terrain: "바다" },
  { id: "incheon-bupyeong", cityId: "incheon", label: "부평구", lat: 37.5070, lng: 126.7219, direction: "서", oheng: "금", terrain: "도시" },
  { id: "incheon-yeonsu", cityId: "incheon", label: "연수구", lat: 37.4101, lng: 126.6784, direction: "서", oheng: "금", terrain: "바다" },

  // 대구·대전·광주·울산·세종
  { id: "daegu-suseong", cityId: "daegu", label: "수성구", lat: 35.8581, lng: 128.6309, direction: "동", oheng: "목", terrain: "도시" },
  { id: "daegu-jung", cityId: "daegu", label: "중구", lat: 35.8694, lng: 128.6062, direction: "동", oheng: "목", terrain: "도시" },
  { id: "daejeon-yuseong", cityId: "daejeon", label: "유성구", lat: 36.3626, lng: 127.3566, direction: "중", oheng: "토", terrain: "도시" },
  { id: "daejeon-seo", cityId: "daejeon", label: "서구", lat: 36.3556, lng: 127.3838, direction: "중", oheng: "토", terrain: "도시" },
  { id: "gwangju-seo", cityId: "gwangju", label: "서구", lat: 35.1520, lng: 126.8895, direction: "서", oheng: "금", terrain: "도시" },
  { id: "ulsan-nam", cityId: "ulsan", label: "남구", lat: 35.5439, lng: 129.3292, direction: "동", oheng: "목", terrain: "바다" },
  { id: "sejong-center", cityId: "sejong", label: "세종시", lat: 36.4800, lng: 127.2890, direction: "중", oheng: "토", terrain: "도시" },

  // 경기 주요
  { id: "gyeonggi-suwon", cityId: "gyeonggi", label: "수원시", lat: 37.2636, lng: 127.0286, direction: "중", oheng: "토", terrain: "도시" },
  { id: "gyeonggi-seongnam", cityId: "gyeonggi", label: "성남시", lat: 37.4200, lng: 127.1265, direction: "남", oheng: "화", terrain: "도시" },
  { id: "gyeonggi-goyang", cityId: "gyeonggi", label: "고양시", lat: 37.6584, lng: 126.8320, direction: "서", oheng: "금", terrain: "도시" },
  { id: "gyeonggi-yongin", cityId: "gyeonggi", label: "용인시", lat: 37.2411, lng: 127.1776, direction: "남", oheng: "화", terrain: "도시" },
  { id: "gyeonggi-bucheon", cityId: "gyeonggi", label: "부천시", lat: 37.5034, lng: 126.7660, direction: "서", oheng: "금", terrain: "도시" },

  // 도 단위 대표
  { id: "gangwon-chuncheon", cityId: "gangwon", label: "춘천시", lat: 37.8813, lng: 127.7298, direction: "동", oheng: "목", terrain: "산" },
  { id: "chungbuk-cheongju", cityId: "chungbuk", label: "청주시", lat: 36.6424, lng: 127.4890, direction: "중", oheng: "토", terrain: "평야" },
  { id: "chungnam-cheonan", cityId: "chungnam", label: "천안시", lat: 36.8151, lng: 127.1139, direction: "서", oheng: "금", terrain: "평야" },
  { id: "jeonbuk-jeonju", cityId: "jeonbuk", label: "전주시", lat: 35.8242, lng: 127.1480, direction: "서", oheng: "금", terrain: "평야" },
  { id: "jeonnam-gwangyang", cityId: "jeonnam", label: "광양시", lat: 34.9407, lng: 127.6959, direction: "남", oheng: "화", terrain: "바다" },
  { id: "gyeongbuk-pohang", cityId: "gyeongbuk", label: "포항시", lat: 36.0190, lng: 129.3435, direction: "동", oheng: "목", terrain: "바다" },
  { id: "gyeongnam-changwon", cityId: "gyeongnam", label: "창원시", lat: 35.2280, lng: 128.6811, direction: "남", oheng: "화", terrain: "바다" },
  { id: "jeju-jeju", cityId: "jeju", label: "제주시", lat: 33.4996, lng: 126.5312, direction: "남", oheng: "화", terrain: "바다" },
  { id: "jeju-seogwipo", cityId: "jeju", label: "서귀포시", lat: 33.2541, lng: 126.5600, direction: "남", oheng: "화", terrain: "바다" },
  { id: "overseas-other", cityId: "overseas", label: "해외·기타", lat: 37.5665, lng: 126.9780, direction: "중", oheng: "토", terrain: "기타" },
];

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
  const dLat = lat - 36.3;
  const dLng = lng - 127.8;
  if (Math.abs(dLat) < 0.3 && Math.abs(dLng) < 0.3) return "중심부";
  const parts: string[] = [];
  if (dLat > 0.3) parts.push("북쪽");
  else if (dLat < -0.3) parts.push("남쪽");
  if (dLng > 0.3) parts.push("동쪽");
  else if (dLng < -0.3) parts.push("서쪽");
  return parts.join("·") || "중심부";
}
