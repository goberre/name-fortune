"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  getHanjaCandidates,
  HANJA_SEARCH_KEYWORDS,
  isPopularHanja,
  type HanjaCandidate,
  type HanjaSelection,
} from "@/lib/hanja";
import { OHENG_OBANG } from "@/lib/musok-copy";
import { getCompoundSurname, getSurnameGloss, getSurnameSummary } from "@/lib/surname-hanja";
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

export type HanjaPickerPerson = "self" | "partner";

type Props = {
  hangul: string;
  index: number;
  selected: HanjaSelection | null;
  onSelect: (index: number, selection: HanjaSelection) => void;
  variant?: "light" | "musok";
  role?: "성" | "이름1" | "이름2";
  person?: HanjaPickerPerson;
  fullName?: string;
};

export default function HanjaPicker({
  hangul,
  index,
  selected,
  onSelect,
  variant = "musok",
  role,
  person,
  fullName,
}: Props) {
  const [candidates, setCandidates] = useState<HanjaCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [pulseKey, setPulseKey] = useState<string | null>(null);
  const musok = variant === "musok";
  const isSurname = role === "성";

  const compoundSurname = fullName ? getCompoundSurname(fullName) : undefined;
  const surnameSummary = isSurname
    ? (index === 0 && compoundSurname
        ? getSurnameSummary(compoundSurname)
        : getSurnameSummary(hangul))
    : undefined;

  useEffect(() => {
    let cancelled = false;
    getHanjaCandidates(hangul, { asSurname: isSurname })
      .then((list) => {
        if (!cancelled) {
          setCandidates(list);
          setError(list.length === 0 ? `「${hangul}」에 해당하는 인명용 한자가 없습니다.` : "");
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "한자 데이터 로드 실패");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [hangul, isSurname]);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return candidates;

    // 한국어 조사·어미를 제거한 어간으로 재검색 (높은→높, 빛나는→빛나, 번성하는→번성하)
    const KO_ENDINGS = /[을를은는이가의도에서며아어]$/;
    const stem = q.length >= 2 ? q.replace(KO_ENDINGS, "") : "";

    return candidates.filter((c) => {
      if (c.hanja.includes(q) || c.meaning.includes(q)) return true;
      // 어간 매칭 (높은→높, 빛나는→빛나)
      if (stem && stem !== q && stem.length >= 1 && c.meaning.includes(stem)) return true;
      // 확장 키워드 매칭 (아름다운→美·麗, 뛰어난→俊·秀 등)
      const kw = HANJA_SEARCH_KEYWORDS[c.hanja];
      if (kw) {
        if (kw.includes(q)) return true;
        if (stem && stem !== q && kw.includes(stem)) return true;
      }
      return false;
    });
  }, [candidates, query]);

  const visibleLimit = isSurname ? 12 : 8;
  const visible = expanded ? filtered : filtered.slice(0, visibleLimit);
  const hasMore = filtered.length > visibleLimit;

  const selectedGloss =
    isSurname && selected ? getSurnameGloss(hangul, selected.hanja) : undefined;

  function pick(c: HanjaCandidate) {
    setPulseKey(c.hanja);
    onSelect(index, { hangul, ...c });
    setTimeout(() => setPulseKey(null), 500);
  }

  const cardCls = musok
    ? person === "partner"
      ? "mk-card border border-[var(--mk-border)] border-l-4 border-l-emerald-600/70 bg-[var(--mk-charcoal)]/80 p-4 sm:p-5"
      : person === "self"
        ? "mk-card border border-[var(--mk-border)] border-l-4 border-l-[var(--mk-cinnabar)] bg-[var(--mk-charcoal)]/80 p-4 sm:p-5"
        : "mk-card p-4 sm:p-5"
    : "ap-card p-4 sm:p-5";

  const roleLabel =
    role === "성" ? "성씨 (姓)" : role === "이름1" ? "이름 (名)" : role === "이름2" ? "이름 (名)" : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cardCls}
    >
      <div className="mb-4 flex items-start gap-3">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center text-xl font-semibold ${
            musok
              ? isSurname
                ? "border border-[var(--mk-cinnabar)]/50 bg-[var(--mk-cinnabar)]/10 font-musok text-[var(--mk-cinnabar-soft)]"
                : "border border-[var(--mk-border)] bg-[var(--mk-charcoal-light)] font-musok text-[var(--mk-ivory)]"
              : "rounded-2xl bg-neutral-100 text-neutral-900"
          }`}
        >
          {hangul}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {roleLabel && (
              <span
                className={`text-[10px] tracking-wider ${
                  isSurname ? "text-[var(--mk-cinnabar-soft)]" : "text-[var(--mk-ivory-muted)]"
                }`}
              >
                {roleLabel}
              </span>
            )}
            {person === "self" && (
              <span className="rounded border border-[var(--mk-cinnabar)]/30 px-1.5 py-0.5 text-[10px] text-[var(--mk-cinnabar-soft)]">
                본인
              </span>
            )}
            {person === "partner" && (
              <span className="rounded border border-emerald-600/40 px-1.5 py-0.5 text-[10px] text-emerald-400/90">
                상대
              </span>
            )}
          </div>
          <p className={`text-sm font-medium ${musok ? "text-[var(--mk-ivory)]" : "text-neutral-900"}`}>
            {isSurname ? "성씨 한자 · 원획 · 오행" : "한자 · 원획 · 오행"}
          </p>
          <p className={`text-xs ${musok ? "text-[var(--mk-ivory-muted)]" : "text-neutral-500"}`}>
            {loading ? "불러오는 중…" : `${candidates.length}개 · ${isSurname ? "성씨 한자 우선" : "인기 한자 우선"} · 원획법`}
          </p>
        </div>
      </div>

      {isSurname && surnameSummary && !loading && (
        <div className="mb-3 border border-[var(--mk-cinnabar)]/25 bg-[var(--mk-cinnabar)]/5 px-3 py-2.5">
          <p className="text-[10px] tracking-wider text-[var(--mk-cinnabar-soft)]">성씨 풀이</p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--mk-ivory-dim)]">{surnameSummary}</p>
        </div>
      )}

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
              const gloss = isSurname ? getSurnameGloss(hangul, c.hanja) : undefined;
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
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-3">
                      <span className={`shrink-0 text-xl font-serif sm:text-2xl ${musok ? "text-[var(--mk-ivory)]" : active ? "text-white" : "text-neutral-900"}`}>
                        {c.hanja}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className={`text-sm font-medium ${musok ? "text-[var(--mk-ivory-dim)]" : active ? "text-white" : "text-neutral-900"}`}>
                            {c.meaning}
                          </p>
                          {popular && (
                            <span className={`text-[10px] ${musok ? "text-[var(--mk-obang)]" : "rounded-full bg-neutral-900 px-1.5 text-white"}`}>
                              {isSurname ? "성씨" : "인기"}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs ${musok ? "text-[var(--mk-ivory-muted)]" : "text-neutral-500"}`}>
                          원획 {c.wonStrokes}획
                        </p>
                        {gloss && (
                          <p className="mt-1 text-[11px] leading-snug text-[var(--mk-cinnabar-soft)]/90">{gloss}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {musok ? (
                    <OhengMusokBadge oheng={c.oheng} />
                  ) : (
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs ring-1 ${active ? "bg-white/15 text-white" : OHENG_STYLE[c.oheng]}`}>
                      {c.oheng}행
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {hasMore && !expanded && (
            <button type="button" onClick={() => setExpanded(true)} className={`mt-3 w-full py-3 text-sm min-h-[44px] ${musok ? "mk-btn mk-btn-ghost" : "text-neutral-500"}`}>
              {filtered.length - visibleLimit}개 더 보기
            </button>
          )}
          {expanded && hasMore && (
            <button type="button" onClick={() => setExpanded(false)} className={`mt-3 w-full py-3 text-sm min-h-[44px] ${musok ? "mk-btn mk-btn-ghost" : "text-neutral-500"}`}>
              접기
            </button>
          )}

          {selected && selectedGloss && (
            <p className="mt-3 border-t border-[var(--mk-border)] pt-3 text-xs leading-relaxed text-[var(--mk-ivory-dim)]">
              선택: {selectedGloss}
            </p>
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
