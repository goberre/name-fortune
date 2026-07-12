#!/usr/bin/env node
/**
 * 전국 시·군·구 좌표 → birth-districts-list.ts 생성
 * 출처: sigungu.json (행정구역 중심 좌표) + 수동 보정
 */
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "src/lib/birth-districts-list.ts");
const SOURCE_URL =
  "https://gist.githubusercontent.com/hmmhmmhm/b3a950e84f865f8abbd00fa460aa4613/raw/sigungu.json";

const PROVINCE_TO_CITY = {
  서울특별시: "seoul",
  부산광역시: "busan",
  인천광역시: "incheon",
  대구광역시: "daegu",
  대전광역시: "daejeon",
  광주광역시: "gwangju",
  울산광역시: "ulsan",
  세종특별자치시: "sejong",
  경기도: "gyeonggi",
  강원도: "gangwon",
  강원특별자치도: "gangwon",
  충청북도: "chungbuk",
  충청남도: "chungnam",
  전라북도: "jeonbuk",
  전북특별자치도: "jeonbuk",
  전라남도: "jeonnam",
  경상북도: "gyeongbuk",
  경상남도: "gyeongnam",
  제주특별자치도: "jeju",
};

const COORD_OVERRIDES = {
  "경기도/광주시": { lat: 37.4294, lng: 127.2552 },
  "인천광역시/남구": { lat: 37.4636, lng: 126.65, label: "미추홀구" },
  "경상북도/군위군": { lat: 36.16995, lng: 128.64705, cityId: "daegu" },
};

const MANUAL_ENTRIES = [
  { cityId: "sejong", label: "세종시", lat: 36.48, lng: 127.289, terrain: "도시" },
  { cityId: "overseas", label: "해외·기타", lat: 37.5665, lng: 126.978, terrain: "기타" },
];

function makeId(cityId, label) {
  return `${cityId}-${label.replace(/\s/g, "")}`;
}

function inferTerrain(cityId, label) {
  if (cityId === "overseas") return "기타";
  if (label.endsWith("군")) {
    const coastal =
      /^(옹진|강화|기장|울주|거제|통영|사천|남해|하동|해남|완도|신안|진도|영암|무안|고흥|여수|목포|포항|경주|울릉)/;
    if (coastal.test(label)) return "바다";
    if (cityId === "gangwon") return "산";
    return "평야";
  }
  if (["seoul", "busan", "incheon", "daegu", "daejeon", "gwangju", "ulsan", "sejong", "gyeonggi"].includes(cityId)) {
    return label.endsWith("군") ? "평야" : "도시";
  }
  return label.endsWith("구") ? "도시" : "도시";
}

async function main() {
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`Failed to fetch sigungu.json: ${res.status}`);
  const raw = /** @type {Record<string, { lat: string; long: string }>} */ (await res.json());

  const seen = new Set();
  const districts = [];

  for (const [key, coords] of Object.entries(raw)) {
    const [province, rawLabel] = key.split("/");
    const override = COORD_OVERRIDES[key];
    const label = override?.label ?? rawLabel;
    const cityId = override?.cityId ?? PROVINCE_TO_CITY[province];
    if (!cityId) {
      console.warn("Skip unknown province:", province, label);
      continue;
    }

    const dedupeKey = `${cityId}:${label}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    const lat = Math.round((override?.lat ?? Number(coords.lat)) * 10000) / 10000;
    const lng = Math.round((override?.lng ?? Number(coords.long)) * 10000) / 10000;

    districts.push({
      id: makeId(cityId, label),
      cityId,
      label,
      lat,
      lng,
      terrain: inferTerrain(cityId, label),
    });
  }

  for (const m of MANUAL_ENTRIES) {
    const dedupeKey = `${m.cityId}:${m.label}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    districts.push({
      id: makeId(m.cityId, m.label),
      cityId: m.cityId,
      label: m.label,
      lat: m.lat,
      lng: m.lng,
      terrain: m.terrain,
    });
  }

  districts.sort((a, b) => a.cityId.localeCompare(b.cityId) || a.label.localeCompare(b.label, "ko"));

  const byCity = {};
  for (const d of districts) byCity[d.cityId] = (byCity[d.cityId] ?? 0) + 1;

  const body = `/** 자동 생성 — \`node scripts/build-birth-districts.mjs\` */
import type { BirthDistrictRaw } from "@/lib/birth-districts";

export const BIRTH_DISTRICTS_RAW: BirthDistrictRaw[] = ${JSON.stringify(districts, null, 2)};

export const BIRTH_DISTRICTS_COUNT = ${districts.length};

export const BIRTH_DISTRICTS_BY_CITY: Record<string, number> = ${JSON.stringify(byCity, null, 2)};
`;

  await writeFile(OUT, body, "utf8");
  console.log(`Wrote ${OUT} — ${districts.length} districts`);
  for (const [city, count] of Object.entries(byCity).sort()) {
    console.log(`  ${city}: ${count}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
