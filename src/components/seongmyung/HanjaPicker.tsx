"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { getHanjaCandidates, type HanjaCandidate, type HanjaSelection } from "@/lib/hanja";
import { OHENG_LABEL, type Oheng } from "@/lib/seongmyung";

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
};

export default function HanjaPicker({ hangul, index, selected, onSelect }: Props) {
  const [candidates, setCandidates] = useState<HanjaCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

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
    return candidates.filter(
      (c) => c.hanja.includes(q) || c.meaning.includes(q),
    );
  }, [candidates, query]);

  const visible = expanded ? filtered : filtered.slice(0, 8);
  const hasMore = filtered.length > 8;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="ap-card p-5"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-xl font-semibold text-neutral-900">
          {hangul}
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-900">한자 선택</p>
          <p className="text-xs text-neutral-500">
            {loading ? "인명용 한자 불러오는 중…" : `${candidates.length}개 후보 · 원획법 · 자원오행`}
          </p>
        </div>
      </div>

      {!loading && candidates.length > 6 && (
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="한자 또는 뜻 검색"
          className="ap-input mb-3 px-4 py-2.5 text-sm"
        />
      )}

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-neutral-100" />
          ))}
        </div>
      )}

      {error && !loading && (
        <p className="rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-500">{error}</p>
      )}

      {!loading && !error && (
        <>
          <div className="space-y-2">
            {visible.map((c) => {
              const active = selected?.hanja === c.hanja;
              return (
                <button
                  key={c.hanja}
                  type="button"
                  onClick={() => onSelect(index, { hangul, ...c })}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                    active
                      ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                      : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-serif ${active ? "text-white" : "text-neutral-900"}`}>
                      {c.hanja}
                    </span>
                    <div>
                      <p className={`text-sm font-medium ${active ? "text-white" : "text-neutral-900"}`}>
                        {c.meaning}
                      </p>
                      <p className={`text-xs ${active ? "text-neutral-300" : "text-neutral-500"}`}>
                        원획 {c.wonStrokes}획
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                      active ? "bg-white/15 text-white ring-white/20" : OHENG_STYLE[c.oheng]
                    }`}
                  >
                    {OHENG_LABEL[c.oheng]} {c.oheng}
                  </span>
                </button>
              );
            })}
          </div>

          {hasMore && !expanded && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="mt-3 w-full py-2 text-sm font-medium text-neutral-500 hover:text-neutral-900"
            >
              {filtered.length - 8}개 더 보기
            </button>
          )}

          {expanded && hasMore && (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="mt-3 w-full py-2 text-sm font-medium text-neutral-500 hover:text-neutral-900"
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
      {OHENG_LABEL[oheng]} {oheng}
    </span>
  );
}
