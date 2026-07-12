import type { Oheng } from "@/lib/seongmyung";

export const OHENG_GENERATES: Record<Oheng, Oheng> = {
  목: "화",
  화: "토",
  토: "금",
  금: "수",
  수: "목",
};

export const OHENG_OVERCOMES: Record<Oheng, Oheng> = {
  목: "토",
  토: "수",
  수: "화",
  화: "금",
  금: "목",
};

export type OhengRelation = "상생" | "상극" | "동류";

export function ohengRelation(a: Oheng, b: Oheng): OhengRelation {
  if (a === b) return "동류";
  if (OHENG_GENERATES[a] === b || OHENG_GENERATES[b] === a) return "상생";
  if (OHENG_OVERCOMES[a] === b || OHENG_OVERCOMES[b] === a) return "상극";
  return "동류";
}

export function relationScore(relation: OhengRelation): number {
  if (relation === "상생") return 92;
  if (relation === "동류") return 72;
  return 38;
}

export function relationLabel(relation: OhengRelation): string {
  if (relation === "상생") return "상생(相生) — 서로를 키움";
  if (relation === "상극") return "상극(相剋) — 조율이 필요";
  return "동류(同類) — 비슷한 기운";
}
