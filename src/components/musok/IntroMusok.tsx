"use client";

import { motion } from "framer-motion";
import GuaFrame from "@/components/musok/GuaFrame";
import { INTRO_MUSOK, MUSOK_MOTTO } from "@/lib/musok-copy";

export default function IntroMusok({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center"
    >
      <GuaFrame className="absolute opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="relative z-10 max-w-lg"
      >
        <p className="mk-kicker">명통(命通)의 시작</p>
        <div className="mt-8 space-y-3">
          {INTRO_MUSOK.map((line, i) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.8 + i * 0.6, duration: 0.9 }}
              className="font-musok text-lg leading-relaxed text-[var(--mk-ivory)] sm:text-xl"
            >
              {line}
            </motion.p>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="mt-10 text-sm leading-relaxed text-[var(--mk-ivory-dim)]"
        >
          {MUSOK_MOTTO}
        </motion.p>
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
          onClick={onEnter}
          className="mk-btn mk-btn-primary mt-12 px-12"
        >
          명통 열기
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
