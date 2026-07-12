"use client";

import { motion } from "framer-motion";

const SECTIONS = [
  {
    icon: "🔮",
    title: "미래 운세",
    desc: "지금·앞으로 펼쳐질 흐름 (가장 중요)",
    color: "#af52de",
  },
  {
    icon: "📍",
    title: "태생지",
    desc: "고향이 미래 방향에 미치는 영향",
    color: "#007aff",
  },
  {
    icon: "🔄",
    title: "사주·이름",
    desc: "앞으로의 운을 돕는 한자인지",
    color: "#34c759",
  },
  {
    icon: "📅",
    title: "사격 상세",
    desc: "시기별 운세 자세히 보기",
    color: "#ff9f0a",
  },
] as const;

/** 결과 페이지 상단 — 미래 중심 가이드 */
export default function ResultGuidePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="ap-card overflow-hidden p-5 sm:p-6"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-sm text-white">
          🔮
        </span>
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">미래 운세 중심으로 읽기</h3>
          <p className="text-xs text-neutral-500">과거보다 앞으로가 궁금하시죠? 아래 순서로 확인해 보세요</p>
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
        <strong className="text-neutral-800">미래 운세 점수</strong>는 지금부터 앞으로의 사격(시기별 운)을
        중심으로 계산합니다. 어릴 때(원격) 운은 참고용입니다.
      </div>
    </motion.div>
  );
}
