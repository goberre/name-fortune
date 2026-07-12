"use client";

import { motion } from "framer-motion";

const SECTIONS = [
  {
    icon: "📍",
    title: "태생지",
    desc: "어디서 태어났는지 → 그 땅의 기운(지기)",
    color: "#007aff",
  },
  {
    icon: "🔄",
    title: "사주·이름 조화",
    desc: "생년월일 + 한자 오행이 맞는지",
    color: "#34c759",
  },
  {
    icon: "⚖️",
    title: "음양·발음",
    desc: "획수 균형 + 이름 소리의 기운",
    color: "#ff9f0a",
  },
  {
    icon: "📅",
    title: "사격 타임라인",
    desc: "인생 4시기(어릴 때~말년) 운세",
    color: "#af52de",
  },
] as const;

/** 결과 페이지 상단 — 읽는 법 가이드 */
export default function ResultGuidePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="ap-card overflow-hidden p-5 sm:p-6"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-sm text-white">
          ?
        </span>
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">결과 읽는 법</h3>
          <p className="text-xs text-neutral-500">아래 4가지를 순서대로 확인해 보세요</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SECTIONS.map((s, i) => (
          <div
            key={s.title}
            className="rounded-xl border border-neutral-100 p-3"
            style={{ borderTopColor: s.color, borderTopWidth: 3 }}
          >
            <span className="text-xl">{s.icon}</span>
            <p className="mt-2 text-xs font-semibold text-neutral-900">
              {i + 1}. {s.title}
            </p>
            <p className="mt-1 text-[10px] leading-snug text-neutral-500">{s.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-neutral-50 px-4 py-3 text-xs leading-relaxed text-neutral-600">
        <strong className="text-neutral-800">종합 점수</strong>는 위 항목을 합산한 참고 점수입니다.
        85점 이상 <span className="text-emerald-600">대길</span>, 70점 이상{" "}
        <span className="text-emerald-600">길</span>, 55점 이상 보통, 그 이하는 주의가 필요합니다.
      </div>
    </motion.div>
  );
}
