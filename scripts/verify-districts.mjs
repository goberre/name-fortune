#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const path = join(__dirname, "../src/lib/birth-districts-list.ts");
const src = readFileSync(path, "utf8");
const m = src.match(/export const BIRTH_DISTRICTS_RAW[^=]*=\s*(\[[\s\S]*?\n\]);/);
const arr = eval(m[1]);

const by = {};
for (const d of arr) {
  (by[d.cityId] ??= []).push(d.label);
}

const expected = {
  seoul: 25,
  busan: 16,
  incheon: 10,
  daegu: 9,
  daejeon: 5,
  gwangju: 5,
  ulsan: 5,
  sejong: 1,
  gyeonggi: 31,
  gangwon: 18,
  chungbuk: 11,
  chungnam: 15,
  jeonbuk: 14,
  jeonnam: 22,
  gyeongbuk: 22,
  gyeongnam: 18,
  jeju: 2,
  overseas: 1,
};

const officialGyeonggi = [
  "가평군", "고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시",
  "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시",
  "양평군", "여주시", "연천군", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시",
  "평택시", "포천시", "하남시", "화성시",
];

console.log("Total:", arr.length);
console.log("\n=== By city ===");
let allOk = true;
for (const [k, labels] of Object.entries(by).sort()) {
  const exp = expected[k];
  const ok = exp ? labels.length === exp : null;
  if (exp && !ok) allOk = false;
  console.log(`${k}: ${labels.length}${exp ? ` (expected ${exp}${ok ? " OK" : " MISMATCH"})` : ""}`);
}

const haveG = new Set(by.gyeonggi ?? []);
const missG = officialGyeonggi.filter((x) => !haveG.has(x));
const extraG = (by.gyeonggi ?? []).filter((x) => !officialGyeonggi.includes(x));
console.log("\n=== Gyeonggi ===");
console.log("Missing:", missG.length ? missG.join(", ") : "none");
console.log("Extra:", extraG.length ? extraG.join(", ") : "none");
console.log("All:", [...haveG].sort((a, b) => a.localeCompare(b, "ko")).join(", "));

// Check for 구 subdivisions missing in gyeonggi cities
const gyeonggiGuCities = {
  "수원시": ["장안구", "권선구", "팔달구", "영통구"],
  "성남시": ["수정구", "중원구", "분당구"],
  "고양시": ["덕양구", "일산동구", "일산서구"],
  "용인시": ["처인구", "기흥구", "수지구"],
  "안산시": ["단원구", "상록구"],
  "안양시": ["만안구", "동안구"],
  "부천시": ["원미구", "소사구", "오정구"],
};

console.log("\n=== Gyeonggi 구-level NOT in DB (by design?) ===");
for (const [city, gus] of Object.entries(gyeonggiGuCities)) {
  const missing = gus.filter((g) => !haveG.has(g) && !haveG.has(`${city} ${g}`));
  if (missing.length) console.log(`${city}: ${missing.join(", ")} (only "${city}" exists)`);
}

console.log("\nOverall match:", allOk && missG.length === 0 ? "YES" : "ISSUES FOUND");
