"use client";

import { motion } from "framer-motion";

/** 전통 괘(卦) 미니멀 라인 프레임 */
export default function GuaFrame({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`mx-auto h-48 w-48 ${className}`}
      aria-hidden
    >
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* 상괘 건 */}
        <line x1="60" y1="40" x2="140" y2="40" stroke="var(--mk-cinnabar)" strokeWidth="2" opacity="0.5" />
        <line x1="60" y1="52" x2="140" y2="52" stroke="var(--mk-cinnabar)" strokeWidth="2" opacity="0.5" />
        <line x1="60" y1="64" x2="140" y2="64" stroke="var(--mk-cinnabar)" strokeWidth="2" opacity="0.5" />
        {/* 하괘 곤 */}
        <line x1="60" y1="120" x2="100" y2="120" stroke="var(--mk-ivory-dim)" strokeWidth="2" opacity="0.35" />
        <line x1="100" y1="132" x2="140" y2="132" stroke="var(--mk-ivory-dim)" strokeWidth="2" opacity="0.35" />
        <line x1="60" y1="144" x2="100" y2="144" stroke="var(--mk-ivory-dim)" strokeWidth="2" opacity="0.35" />
        <rect x="30" y="30" width="140" height="140" fill="none" stroke="var(--mk-border)" strokeWidth="0.5" />
      </motion.g>
    </svg>
  );
}
