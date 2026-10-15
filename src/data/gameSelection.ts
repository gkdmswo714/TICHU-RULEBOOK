import { GameSelection, PlayerCount } from "@/types";
export const DEFAULT_GAME: GameSelection = { playerCount: 5, mode: "individual" };
export function isGameSelection(value: unknown): value is GameSelection {
  if (!value || typeof value !== "object") return false;
  const { playerCount: p, mode } = value as GameSelection;
  return Number.isInteger(p) && ((mode === "team" && (p === 4 || p === 6)) || (mode === "individual" && p >= 5 && p <= 12));
}
export function legacySelection(value: unknown): GameSelection | null {
  return value === 4 || value === 5 || value === 6 ? { playerCount: value, mode: value === 5 ? "individual" : "team" } : null;
}
export function restoreSelection(saved: string | null, legacy: string | null): GameSelection | null {
  try { const value: unknown = JSON.parse(saved ?? "null"); if (isGameSelection(value)) return value; } catch {}
  return legacySelection(Number(legacy));
}
export const modeLabel = ({playerCount, mode}: GameSelection) => `${playerCount}인 · ${mode === "team" ? "티츄 팀전" : "쟁상유 개인전"}`;
// Five-player names are preserved. Other names are classroom labels, not official ranks.
export const rankNames: Record<Exclude<PlayerCount, 4>, readonly string[]> = {
  5: ["황제", "재상", "장군", "평민", "천민"],
  6: ["황제", "재상", "귀족", "상인", "평민", "천민"],
  7: ["황제", "재상", "장군", "귀족", "상인", "평민", "천민"],
  8: ["황제", "재상", "장군", "귀족", "관리", "상인", "평민", "천민"],
  9: ["황제", "재상", "장군", "귀족", "관리", "상인", "시민", "평민", "천민"],
  10: ["황제", "재상", "장군", "귀족", "관리", "상인", "시민", "평민", "농민", "천민"],
  11: ["황제", "재상", "장군", "귀족", "영주", "관리", "상인", "시민", "평민", "농민", "천민"],
  12: ["황제", "재상", "장군", "귀족", "영주", "관리", "상인", "시민", "평민", "농민", "하인", "천민"],
};
