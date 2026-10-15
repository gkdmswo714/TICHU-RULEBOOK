import { rulesFor } from "@/data/rules";
import { Players } from "@/types";
const normalize = (s: string) => s.toLowerCase().replace(/[\s?!.,？]/g, "");
export function questionIntent(query: string, p?: Players): string | undefined {
  const q = normalize(query);
  if (/용|드래곤|dragon/.test(q) && !/용보다/.test(q) && !/세금|상납|하사/.test(q)) return "dragon";
  if (/누가.*(먼저|시작)|반시계|진행방향|참새.*(먼저|시작|부터)|시작.*(누구|누가)/.test(q)) return "lead";
  if (p === 5) {
    if (
      /세금|상납|하사/.test(q) &&
      /순서|순위|참새|강한|높은|좋은|뭘|어떤/.test(q)
    )
      return "tax-rank5";
    if (/세금|상납|하사|교환|첫판|첫라운드|두번째|돌려/.test(q))
      return "tribute";
    if (/몇장|분배|나눠|나누|11장|55장/.test(q)) return "deal5";
    if (
      /자리|신분|황제|재상|장군|평민|천민|언제.*끝|라운드.*끝|마지막사람|종료조건/.test(
        q,
      )
    )
      return "rank5";
    if (/티츄선언|스몰|라지|원투|점수|몇점|승리목표/.test(q)) return "seigneur";
  }
  if (/라운드/.test(q) && /트릭/.test(q)) return "round";
  if (/한바퀴|한번씩|다음바퀴|가져가|가져간|다주워|다먹|손패|회수/.test(q))
    return "trick";
  if (/폭탄|bomb|포카드|스티플|용보다/.test(q))
    return /포카드/.test(q) && !/폭탄|언제/.test(q) ? "four" : "bomb";
  if (
    /좋은카드|강한카드|센카드|카드.*(순서|순위)|뭐가.*(세|강)|가장.*(높|강|센)|서열/.test(
      q,
    )
  )
    return "strength";
  if (/점수|몇점|계산/.test(q)) return "points";
  return undefined;
}
export function searchRules(query: string, p: Players) {
  const q = normalize(query);
  const available = rulesFor(p);
  if (!q) return available;
  const intent = questionIntent(query, p);
  return available
    .map((rule) => {
      const keys = [rule.title, rule.en, ...rule.aliases].map(normalize);
      let score = rule.id === intent ? 100 : 0;
      for (const k of keys) {
        if (q === k) score += 30;
        else if (k.length > 1 && q.includes(k)) score += 10;
        else if (q.length > 1 && k.includes(q)) score += 3;
        else if (
          k.length === 1 &&
          new RegExp(
            `(?:^|\\s)${k}(?:은|는|이|가|을|를|도|으로|에|보다|$|\\s)`,
          ).test(query)
        )
          score += 8;
      }
      return { rule, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.rule);
}
