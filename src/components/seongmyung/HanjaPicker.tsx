"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { getHanjaCandidates, isPopularHanja, type HanjaCandidate, type HanjaSelection } from "@/lib/hanja";
import { OHENG_OBANG } from "@/lib/musok-copy";
import { type Oheng } from "@/lib/seongmyung";

const OHENG_STYLE: Record<Oheng, string> = {
  목: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  화: "bg-orange-50 text-orange-700 ring-orange-200",
  토: "bg-amber-50 text-amber-800 ring-amber-200",
  금: "bg-slate-100 text-slate-700 ring-slate-200",
  수: "bg-sky-50 text-sky-700 ring-sky-200",
};

function OhengMusokBadge({ oheng }: { oheng: Oheng }) {
  const ob = OHENG_OBANG[oheng];
  return (
    <span
      className="inline-flex flex-col items-center px-2 py-1 text-[10px] font-medium"
      style={{ color: ob.color, border: `1px solid ${ob.color}44` }}
    >
      <span>{ob.label}</span>
      <span>{oheng}</span>
    </span>
  );
}

type Props = {
  hangul: string;
  index: number;
  selected: HanjaSelection | null;
  onSelect: (index: number, selection: HanjaSelection) => void;
  variant?: "light" | "musok";
};

export default function HanjaPicker({ hangul, index, selected, onSelect, variant = "musok" }: Props) {
  const [candidates, setCandidates] = useState<HanjaCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [pulseKey, setPulseKey] = useState<string | null>(null);
  const musok = variant === "musok";

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
    setTimeout(() => setPulseKey(null), 500);
  }

  const cardCls = musok ? "mk-card p-5" : "ap-card p-5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cardCls}
    >
      <div className="mb-4 flex items-center gap-3">
        <span
          className={`flex h-12 w-12 items-center justify-center text-xl font-semibold ${
            musok
              ? "border border-[var(--mk-border)] bg-[var(--mk-charcoal-light)] font-musok text-[var(--mk-ivory)]"
              : "rounded-2xl bg-neutral-100 text-neutral-900"
          }`}
        >
          {hangul}
        </span>
        <div className="flex-1">
          <p className={`text-sm font-medium ${musok ? "text-[var(--mk-ivory)]" : "text-neutral-900"}`}>
            {musok ? "한자 · 원획 · 오행" : "한자 선택"}
          </p>
          <p className={`text-xs ${musok ? "text-[var(--mk-ivory-muted)]" : "text-neutral-500"}`}>
            {loading ? "불러오는 중…" : `${candidates.length}개 · 인기 한자 우선 · 원획법`}
          </p>
        </div>
      </div>

      {!loading && candidates.length > 6 && (
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="한자 · 뜻 검색"
          className={musok ? "mk-input mb-3 px-4 py-2.5 text-sm" : "ap-input mb-3 px-4 py-2.5 text-sm"}
        />
      )}

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-14 animate-pulse ${musok ? "bg-[var(--mk-charcoal-light)]" : "rounded-xl bg-neutral-100"}`} />
          ))}
        </div>
      )}

      {error && !loading && <p className="text-sm text-[var(--mk-cinnabar-soft)]">{error}</p>}

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
                  animate={pulsing && musok ? { scale: [1, 1.01, 1] } : {}}
                  transition={{ duration: 0.35 }}
                  className={
                    musok
                      ? `flex w-full items-center justify-between border px-4 py-3 text-left transition ${
                          active
                            ? "border-[var(--mk-cinnabar)] bg-[var(--mk-ivory)]/5"
                            : "border-[var(--mk-border)] bg-[var(--mk-charcoal-light)] hover:border-[var(--mk-cinnabar)]/40"
                        } ${pulsing ? "mk-ink-flash" : ""}`
                      : `flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                          active
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-neutral-200 bg-white hover:bg-neutral-50"
                        }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-serif ${musok ? "text-[var(--mk-ivory)]" : active ? "text-white" : "text-neutral-900"}`}>
                      {c.hanja}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium ${musok ? "text-[var(--mk-ivory-dim)]" : active ? "text-white" : "text-neutral-900"}`}>
                          {c.meaning}
                        </p>
                        {popular && (
                          <span className={`text-[10px] ${musok ? "text-[var(--mk-obang)]" : "text-white bg-neutral-900 px-1.5 rounded-full"}`}>
                            인기
                          </span>
                        )}
                      </div>
                      <p className={`text-xs ${musok ? "text-[var(--mk-ivory-muted)]" : "text-neutral-500"}`}>
                        원획 {c.wonStrokes}획
                      </p>
                    </div>
                  </div>
                  {musok ? (
                    <OhengMusokBadge oheng={c.oheng} />
                  ) : (
                    <span className={`rounded-full px-2.5 py-1 text-xs ring-1 ${active ? "bg-white/15 text-white" : OHENG_STYLE[c.oheng]}`}>
                      {c.oheng}행
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {hasMore && !expanded && (
            <button type="button" onClick={() => setExpanded(true)} className={`mt-3 w-full py-2 text-sm ${musok ? "mk-btn mk-btn-ghost" : "text-neutral-500"}`}>
              {filtered.length - 8}개 더 보기
            </button>
          )}
          {expanded && hasMore && (
            <button type="button" onClick={() => setExpanded(false)} className={`mt-3 w-full py-2 text-sm ${musok ? "mk-btn mk-btn-ghost" : "text-neutral-500"}`}>
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
    <span className={`inline-flex items-center rounded-full font-medium ring-1 ${OHENG_STYLE[oheng]} ${large ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-xs"}`}>
      {oheng}행
    </span>
  );
}
