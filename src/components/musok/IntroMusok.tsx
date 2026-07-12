"use client";

import { motion } from "framer-motion";
import GuaFrame from "@/components/musok/GuaFrame";
import { INTRO_MUSOK, MUSOK_MOTTO } from "@/lib/musok-copy";

export default function IntroMusok({
  onEnter,
  onEnterCouple,
}: {
  onEnter: () => void;
  onEnterCouple?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center"
    >
      <GuaFrame className="absolute opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="relative z-10 max-w-lg"
      >
        <p className="mk-kicker">명통(命通)의 시작</p>
        <div className="mt-8 space-y-3">
          {INTRO_MUSOK.map((line, i) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.25 + i * 0.2, duration: 0.6 }}
              className="font-musok text-lg leading-relaxed text-[var(--mk-ivory)] sm:text-xl"
            >
              {line}
            </motion.p>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-10 text-sm leading-relaxed text-[var(--mk-ivory-dim)]"
        >
          {MUSOK_MOTTO}
        </motion.p>
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.4 }}
          onClick={onEnter}
          className="mk-btn mk-btn-primary mt-12 px-12"
        >
          명통 열기
        </motion.button>
        {onEnterCouple && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.4 }}
            onClick={onEnterCouple}
            className="mk-btn mk-btn-ghost mt-4 px-10"
          >
            배우자 궁합(雙通) 바로 보기
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}
