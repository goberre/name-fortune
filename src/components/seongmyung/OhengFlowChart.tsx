"use client";

import { motion } from "framer-motion";
import { OhengBadge } from "@/components/seongmyung/HanjaPicker";
import type { Oheng, PronunciationOheng } from "@/lib/seongmyung";

const OHENG_GENERATES: Record<Oheng, Oheng> = {
  목: "화",
  화: "토",
  토: "금",
  금: "수",
  수: "목",
};

const OHENG_OVERCOMES: Record<Oheng, Oheng> = {
  목: "토",
  토: "수",
  수: "화",
  화: "금",
  금: "목",
};

function relation(a: Oheng, b: Oheng): "상생" | "상극" | "동류" {
  if (a === b) return "동류";
  if (OHENG_GENERATES[a] === b) return "상생";
  if (OHENG_OVERCOMES[a] === b) return "상극";
  return "동류";
}

const REL_STYLE = {
  상생: "text-emerald-600 bg-emerald-50",
  상극: "text-rose-600 bg-rose-50",
  동류: "text-neutral-500 bg-neutral-100",
};

export default function OhengFlowChart({
  items,
  flow,
}: {
  items: PronunciationOheng[];
  flow: Oheng[];
}) {
  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {flow.map((o, i) => {
          const prev = i > 0 ? flow[i - 1] : null;
          const rel = prev ? relation(prev, o) : null;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-2"
            >
              {rel && (
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${REL_STYLE[rel]}`}>
                  {rel}
                </span>
              )}
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-neutral-700">{items[i]?.char}</span>
                <OhengBadge oheng={o} />
              </div>
              {i < flow.length - 1 && <div className="h-px w-4 bg-neutral-200" />}
            </motion.div>
          );
        })}
      </div>
      <div className="relative mx-auto h-1 max-w-xs overflow-hidden rounded-full bg-neutral-100">
        <motion.div
          className="h-full bg-neutral-900"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    </div>
  );
}
