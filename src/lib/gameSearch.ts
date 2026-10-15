import { GameMode, PlayerCount, Players } from "@/types";
import { rulesForGame } from "@/data/gameRules";
import { searchRules } from "@/lib/search";
export function searchGameRules(query: string, p: PlayerCount, mode: GameMode) {
  if (mode === "team" || p === 5) return searchRules(query, p as Players);
  const all = rulesForGame(p, mode);
  const q = query.replace(/\s/g, "").toLowerCase();
  if (!q) return all;
  const intent = /세금|상납|하사|교환/.test(q) ? "exchange-individual" : /몇장|분배|세트|중복/.test(q) ? "deal-individual" : /순위|계급|황제|천민|재상|자리/.test(q) ? "rank-individual" : /점수|선언|원투|트리플승리|스몰|라지/.test(q) ? "individual" : undefined;
  return all.map(rule => ({rule, score: (intent === rule.id ? 100 : 0) + [rule.title, ...rule.aliases].reduce((sum, term) => { const key = term.replace(/\s/g, "").toLowerCase(); return sum + (q.includes(key) || key.includes(q) ? 10 : 0); }, 0)})).filter(x => x.score > 0).sort((a,b) => b.score - a.score).map(x => x.rule);
}
