"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import OhengRune from "@/components/occult/OhengRune";
import { getHanjaCandidates, isPopularHanja, type HanjaCandidate, type HanjaSelection } from "@/lib/hanja";
import { type Oheng } from "@/lib/seongmyung";

const OHENG_STYLE: Record<Oheng, string> = {
  목: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  화: "bg-orange-50 text-orange-700 ring-orange-200",
  토: "bg-amber-50 text-amber-800 ring-amber-200",
  금: "bg-slate-100 text-slate-700 ring-slate-200",
  수: "bg-sky-50 text-sky-700 ring-sky-200",
};

type Props = {
  hangul: string;
  index: number;
  selected: HanjaSelection | null;
  onSelect: (index: number, selection: HanjaSelection) => void;
  variant?: "light" | "occult";
};

export default function HanjaPicker({ hangul, index, selected, onSelect, variant = "occult" }: Props) {
  const [candidates, setCandidates] = useState<HanjaCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [pulseKey, setPulseKey] = useState<string | null>(null);
  const occult = variant === "occult";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getHanjaCandidates(hangul)
      .then((list) => {
        if (!cancelled) {
          setCandidates(list);
          if (list.length === 0) setError(`「${hangul}」에 해당하는 인명용 한자가 없습니다.`);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "한자 데이터 로드 실패");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [hangul]);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return candidates;
    return candidates.filter((c) => c.hanja.includes(q) || c.meaning.includes(q));
  }, [candidates, query]);

  const visible = expanded ? filtered : filtered.slice(0, 8);
  const hasMore = filtered.length > 8;

  function pick(c: HanjaCandidate) {
    setPulseKey(c.hanja);
    onSelect(index, { hangul, ...c });
    setTimeout(() => setPulseKey(null), 600);
  }

  const cardCls = occult ? "oc-card p-5" : "ap-card p-5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={cardCls}
    >
      <div className="mb-4 flex items-center gap-3">
        <span
          className={`flex h-12 w-12 items-center justify-center text-xl font-semibold ${
            occult
              ? "border border-red-900/50 bg-black/60 font-occult text-red-100"
              : "rounded-2xl bg-neutral-100 text-neutral-900"
          }`}
        >
          {hangul}
        </span>
        <div className="flex-1">
          <p className={`text-sm font-medium ${occult ? "text-red-100" : "text-neutral-900"}`}>
            {occult ? "영적 주파수 동조" : "한자 선택"}
          </p>
          <p className={`text-xs ${occult ? "text-white/35" : "text-neutral-500"}`}>
            {loading ? "문양 데이터 수신 중…" : `${candidates.length}개 후보 · 인기 한자 우선`}
          </p>
        </div>
      </div>

      {!loading && candidates.length > 6 && (
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="한자 · 뜻 검색"
          className={occult ? "oc-input mb-3 px-4 py-2.5 text-sm" : "ap-input mb-3 px-4 py-2.5 text-sm"}
        />
      )}

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-14 animate-pulse ${occult ? "bg-red-950/30" : "rounded-xl bg-neutral-100"}`}
            />
          ))}
        </div>
      )}

      {error && !loading && (
        <p className={`px-4 py-3 text-sm ${occult ? "text-red-300/60" : "rounded-xl bg-neutral-50 text-neutral-500"}`}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <div className="space-y-2">
            {visible.map((c, vi) => {
              const active = selected?.hanja === c.hanja;
              const popular = vi < 6 && isPopularHanja(hangul, c.hanja);
              const pulsing = pulseKey === c.hanja;
              return (
                <motion.button
                  key={c.hanja}
                  type="button"
                  onClick={() => pick(c)}
                  animate={pulsing ? { scale: [1, 1.02, 1], boxShadow: ["0 0 0 rgba(220,38,38,0)", "0 0 24px rgba(220,38,38,0.5)", "0 0 0 rgba(220,38,38,0)"] } : {}}
                  transition={{ duration: 0.5 }}
                  className={
                    occult
                      ? `flex w-full items-center justify-between border px-4 py-3 text-left transition ${
                          active
                            ? "border-red-500/60 bg-red-950/50 shadow-[0_0_20px_rgba(127,29,29,0.35)]"
                            : "border-red-900/25 bg-black/30 hover:border-red-800/50 hover:bg-black/50"
                        }`
                      : `flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                          active
                            ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                            : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
                        }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-2xl font-serif ${active ? (occult ? "text-red-100" : "text-white") : occult ? "text-white" : "text-neutral-900"}`}
                    >
                      {c.hanja}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium ${active ? (occult ? "text-red-100" : "text-white") : occult ? "text-white/90" : "text-neutral-900"}`}>
                          {c.meaning}
                        </p>
                        {popular && (
                          <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${occult ? "bg-red-800/60 text-red-200" : "bg-neutral-900 text-white"}`}>
                            인기
                          </span>
                        )}
                      </div>
                      <p className={`text-xs ${active ? (occult ? "text-red-200/50" : "text-neutral-300") : "text-white/35"}`}>
                        원획 {c.wonStrokes} · 영적 획수
                      </p>
                    </div>
                  </div>
                  {occult ? (
                    <OhengRune oheng={c.oheng} size="sm" />
                  ) : (
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${active ? "bg-white/15 text-white ring-white/20" : OHENG_STYLE[c.oheng]}`}>
                      {c.oheng}행
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {hasMore && !expanded && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className={`mt-3 w-full py-2 text-sm ${occult ? "oc-btn oc-btn-ghost" : "font-medium text-neutral-500 hover:text-neutral-900"}`}
            >
              {filtered.length - 8}개 더 보기
            </button>
          )}
          {expanded && hasMore && (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className={`mt-3 w-full py-2 text-sm ${occult ? "oc-btn oc-btn-ghost" : "font-medium text-neutral-500 hover:text-neutral-900"}`}
            >
              접기
            </button>
          )}
        </>
      )}
    </motion.div>
  );
}

export function OhengBadge({ oheng, large }: { oheng: Oheng; large?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ring-1 ${OHENG_STYLE[oheng]} ${
        large ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-xs"
      }`}
    >
      {oheng}행
    </span>
  );
}
