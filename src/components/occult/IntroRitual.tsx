"use client";

import { motion } from "framer-motion";
import RitualCircle from "@/components/RitualCircle";
import { INTRO_LINES } from "@/lib/occult-copy";

export default function IntroRitual({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center"
    >
      <div className="oc-smoke absolute inset-0" aria-hidden />
      <RitualCircle active />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1.2 }}
        className="relative z-10 max-w-lg"
      >
        <p className="oc-kicker">Dark Occult Edition</p>
        <h1 className="font-occult mt-6 text-3xl font-light leading-relaxed tracking-wide text-white/95 sm:text-4xl">
          봉인된 이름의 해독
        </h1>
        <div className="mt-8 space-y-2">
          {INTRO_LINES.map((line, i) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 1 + i * 0.5, duration: 0.8 }}
              className="font-occult text-base italic leading-relaxed text-red-200/70 sm:text-lg"
            >
              {line}
            </motion.p>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
          className="mt-10 text-xs tracking-[0.3em] text-indigo-300/50"
        >
          당신이 평생 불려온 이름의 봉인을 해제합니다
        </motion.p>
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2 }}
          onClick={onEnter}
          className="oc-btn oc-btn-primary mt-12 px-10 py-4"
        >
          의식 시작
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
