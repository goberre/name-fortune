#!/usr/bin/env node
/**
 * 네이버 인명용 한자 CSV → 음절별 JSON 인덱스 생성
 * 출처: https://github.com/rutopio/Korean-Name-Hanja-Charset (data-naver.csv)
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CSV_URL =
  "https://raw.githubusercontent.com/rutopio/Korean-Name-Hanja-Charset/main/data-naver.csv";
const OUT = join(ROOT, "public/data/hanja-index.json");

function parseCsvLine(line) {
  const parts = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      parts.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  parts.push(cur);
  return parts;
}

function cleanMeaning(raw) {
  return raw
    .split("/")[0]
    .trim()
    .replace(/\s+/g, " ");
}

async function main() {
  console.log("Downloading name hanja CSV...");
  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const text = await res.text();
  const lines = text.split("\n").slice(1);

  /** @type {Record<string, { hanja: string; meaning: string }[]>} */
  const index = {};

  for (const line of lines) {
    if (!line.trim()) continue;
    const [hangul, , , hanja, meaning] = parseCsvLine(line);
    if (!hangul || !hanja || !meaning) continue;
    if (!index[hangul]) index[hangul] = [];
    const cleaned = cleanMeaning(meaning);
    const dup = index[hangul].some((e) => e.hanja === hanja);
    if (!dup) {
      index[hangul].push({ hanja, meaning: cleaned });
    }
  }

  // 자주 쓰이는 글자 우선 (meaning 길이 짧은 = 대표 뜻)
  for (const key of Object.keys(index)) {
    index[key].sort((a, b) => a.meaning.length - b.meaning.length);
  }

  const meta = {
    version: 1,
    source: "Korean-Name-Hanja-Charset (Naver Dictionary, 인명용)",
    syllableCount: Object.keys(index).length,
    entryCount: Object.values(index).reduce((s, arr) => s + arr.length, 0),
    generatedAt: new Date().toISOString(),
    index,
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(meta), "utf8");

  console.log(`Wrote ${OUT}`);
  console.log(`  syllables: ${meta.syllableCount}`);
  console.log(`  entries:   ${meta.entryCount}`);
  console.log(`  고: ${index["고"]?.length ?? 0} candidates`);
  console.log(`  필: ${index["필"]?.length ?? 0} candidates`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
