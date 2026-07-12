"use client";

import { motion } from "framer-motion";

/** 붓글씨가 써지듯 순차 등장 */
export default function BrushText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
      whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {text}
    </motion.p>
  );
}
