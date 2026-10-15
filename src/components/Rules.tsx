import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Rule, Players, PlayerCount, Card, GameMode } from "@/types";
import { rulesFor } from "@/data/rules";
import { rulesForGame } from "@/data/gameRules";
import { cards } from "@/data/cards";
import { PlayingCard } from "./PlayingCard";
export function RuleDetail({
  rule,
  onNavigate,
}: {
  rule: Rule;
  onNavigate?: () => void;
}) {
  return (
    <details className="rule-detail">
      <summary>
        <span>
          <small>{rule.en}</small>
          <strong>{rule.title}</strong>
          <span>{rule.summary}</span>
        </span>
        <b>+</b>
      </summary>
      <div className="expanded">
        <p>{rule.detail}</p>
        <p>
          <b>플레이 예시</b> {rule.example}
        </p>
        <p className="muted">
          {rule.caution}
        </p>
        {onNavigate && (
          <a href={`#${rule.section}`} onClick={onNavigate}>
            {{
              basic: "기본 규칙",
              combinations: "카드 조합",
              special: "특수 카드",
              scoring:
                rule.id === "rank5" ? "세금과 다음 판 자리" : "점수 계산",
            }[rule.section] || "설명서"}
            에서 보기 ↗
          </a>
        )}
      </div>
    </details>
  );
}
export function RuleList({
  players,
  section,
}: {
  players: Players;
  section: string;
}) {
  return (
    <>
      {rulesFor(players)
        .filter((r) => r.section === section)
        .map((r) => (
          <RuleDetail key={r.id} rule={r} />
        ))}
    </>
  );
}
export function Combinations({ players = 4 }: { players?: PlayerCount }) {
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<string | null>(null);
  const items = [
    { id: "single", title: "싱글", count: "1장", summary: "카드 한 장을 내는 조합", ranks: ["5"] },
    { id: "pair", title: "페어", count: "2장", summary: "숫자가 같은 카드 두 장", ranks: ["4", "4"] },
    { id: "pairs", title: "연속 페어", count: "4장 이상", summary: "연속된 숫자의 페어 두 쌍 이상", ranks: ["3", "3", "4", "4"] },
    { id: "triple", title: "트리플", count: "3장", summary: "숫자가 같은 카드 세 장", ranks: ["7", "7", "7"] },
    { id: "full-house", title: "풀하우스", count: "5장", summary: "트리플 하나와 페어 하나", ranks: ["2", "2", "2", "A", "A"] },
    { id: "straight", title: "스트레이트", count: "5장 이상", summary: "숫자가 연속되는 카드 다섯 장 이상", ranks: ["2", "3", "4", "5", "6"] },
  ];
  const bombItem = { title: "폭탄", count: "특수 조합", summary: "일반 조합의 종류와 카드 수 제한을 뛰어넘어요.", ranks: ["8", "8", "8", "8"] };
  const rulePlayers: Players = players === 5 || players === 6 ? players : 4;
  const comboRule = (id: string) => rulesFor(rulePlayers).find((rule) => rule.id === id);
  const sampleCards = (ranks: string[], suits = [1, 2, 3, 4]): Card[] =>
    ranks.map((rank, index) => cards.find((card) => card.rank === rank && card.suit === suits[index % suits.length])!).filter(Boolean);
  const renderCards = (ranks: string[], suits?: number[]) => (
    <div className="combo-image-row">
      {sampleCards(ranks, suits).map((card) => <PlayingCard card={card} key={card.id} />)}
    </div>
  );
  return (
    <div className="combination-learning">
      <p className="combo-rule-callout">처음 낸 조합과 같은 종류·장수로 더 높은 카드를 내세요. 단, 폭탄은 예외예요.</p>
      <p>싱글 → 더 높은 싱글 · 페어 → 더 높은 페어 · 스트레이트 5장 → 더 높은 스트레이트 5장. 서로 다른 일반 조합으로 바꿔 낼 수 없어요.</p>
      <div className="combo-list" aria-label="카드 조합 학습 순서">
        {[...items, {...bombItem, id: "bomb"}].map((item, index) => <div className="combo-accordion-item" key={item.id}>
          <button className="combo-row" id={`combo-button-${item.id}`} aria-controls={`combo-detail-${item.id}`} aria-expanded={selected === item.id} onClick={() => setSelected(selected === item.id ? null : item.id)}>
            <span className="combo-row-number">{String(index + 1).padStart(2,"0")}</span>
            <span className="combo-row-copy"><strong>{item.title}</strong><small>{item.count}</small></span>
            <ChevronRight className="combo-row-chevron" size={20}/>
          </button>
      <AnimatePresence initial={false}>{selected === item.id && <motion.section initial={{height:0, opacity:0}} animate={{height:"auto", opacity:1}} exit={{height:0, opacity:0}} transition={{duration:reduced?0:0.2}} style={{overflow:"hidden"}} className={`combo-detail-panel ${selected === "bomb" ? "bomb-detail-panel" : ""}`} id={`combo-detail-${item.id}`} role="region" aria-labelledby={`combo-button-${item.id}`}>
        <div className="combo-detail-heading"><div><span className="eyebrow">{item.count}</span><h3>{item.title}</h3></div><button aria-label="조합 설명 닫기" onClick={() => setSelected(null)}>닫기</button></div>
        <p>{item.summary}.</p>{["single","triple","straight"].includes(item.id) && renderCards(item.ranks)}
        {selected === "pair" && <div className="combo-compare-grid">
          <article className="combo-example valid"><h4>올바른 페어 · 가능</h4>{renderCards(["4", "4"], [2, 4])}<p>무늬가 달라도 숫자가 같으면 페어예요.</p></article>
          <article className="combo-example invalid"><h4>잘못된 페어 · 불가능</h4>{renderCards(["3", "4"], [2, 2])}<p>숫자가 연속되어도 숫자가 다르면 페어가 아니에요.</p></article>
        </div>}
        {selected === "pairs" && <div className="combo-compare-grid">
          <article className="combo-example valid"><h4>올바른 연속 페어 · 가능</h4>{renderCards(["3", "3", "4", "4"], [1, 2, 3, 4])}<p>각 페어의 숫자가 연속돼요. 세 쌍 이상도 가능해요.</p>{renderCards(["3","3","4","4","5","5"], [1,2])}</article>
          <article className="combo-example invalid"><h4>잘못된 연속 페어 · 불가능</h4>{renderCards(["3", "3", "5", "5"], [1, 2, 3, 4])}<p>3과 5 사이 숫자가 빠져 연속되지 않아요.</p></article>
        </div>}
        {selected === "full-house" && <div className="full-house-compare">
          <article>{renderCards(["2", "2", "2", "A", "A"], [1, 2, 4, 1, 2])}<p><b>222AA</b><br/>트리플 숫자 <strong>2</strong></p></article>
          <span className="full-house-vs" aria-label="비교 결과 오른쪽 승리">VS</span>
          <article className="valid">{renderCards(["5", "5", "5", "6", "6"], [1, 2, 4, 1, 2])}<p><b>55566 · 승리</b><br/>트리플 숫자 <strong>5</strong></p></article>
          <b className="full-house-winner">풀하우스는 트리플의 숫자가 큰 쪽이 이겨요.</b><p className="full-house-winner">5가 2보다 커서 55566이 이겨요. A 페어가 있어도 트리플이 2인 222AA는 더 약해요.</p>
        </div>}
        {selected === "bomb" && <div className="bomb-detail-note">
          <div className="combo-compare-grid">
            <article className="combo-example"><h4>포카드 폭탄 · 같은 숫자 4장</h4>{renderCards(["8","8","8","8"], [1,2,3,4])}<p>네 가지 무늬의 같은 숫자 카드를 한 장씩 모은 조합이에요. 예를 들어 8 네 장이 포카드예요. 포카드끼리는 숫자가 높은 쪽이 이겨요.</p></article>
            <article className="combo-example"><h4>스트레이트 플러시 폭탄 · 같은 무늬로 연속 5장 이상</h4>{renderCards(["3","4","5","6","7"], [3])}<p>무늬가 모두 같고 숫자가 빠짐없이 이어져야 해요. 같은 무늬의 3·4·5·6·7이 예시예요. 무늬가 섞인 스트레이트는 폭탄이 아니에요.</p></article>
          </div>
          <p><b>폭탄끼리 비교하기</b> 모든 스트레이트 플러시는 포카드보다 강해요. 스트레이트 플러시끼리는 장수가 많은 쪽이 먼저이고, 장수가 같으면 가장 높은 카드의 숫자로 비교해요.</p>
          <p><b>언제 낼 수 있나요?</b> {comboRule("bomb")?.caution}</p>
        </div>}
        {selected === "pair" && <p>페어는 무늬가 아니라 숫자가 같아야 해요.</p>}
      </motion.section>}</AnimatePresence>
        </div>)}
      </div>
    </div>
  );
}

export function EssentialTerms({players, mode, query}: {players: PlayerCount; mode: GameMode; query: string}) {
  const source = rulesForGame(players, mode);
  const summary = (id: string, fallback: string) => source.find(r=>r.id===id)?.summary ?? fallback;
  const terms = [
    {id:"trick", title:"트릭", text:"트릭은 한 번의 카드 대결이에요. 마지막으로 카드를 낸 사람을 제외한 모두가 연속으로 패스하면 끝나요."},
    {id:"round", title:"라운드", text:"라운드는 여러 번의 트릭으로 이루어진 한 판이에요."},
    {id:"lead", title:"선 / 리드", text: players===4 ? "새 트릭에서 처음 카드를 내는 사람이에요. 4인 기본 티츄에서는 참새를 가진 사람이 첫 트릭을 시작하고, 반시계 방향으로 진행해요. 참새부터 낼 의무는 없고 원하는 유효한 조합으로 시작할 수 있어요." : players===5 || mode==="team" ? summary("lead", "새 트릭에서 처음 카드를 내는 사람이에요.") : "새 트릭에서 처음 카드를 내는 사람이에요. 시작 방법은 선택한 모드의 기본 순서에서 확인하세요."},
    {id:"pass", title:"패스", text:"자신의 차례에 카드를 내지 않고 넘어가는 행동이에요. 패스한 뒤에도 다른 플레이어가 새로운 카드를 내면 다시 참여할 수 있어요."},
    {id:"out", title:"나가기", text:"손에 있는 카드를 모두 내는 것을 말해요. 트릭에서 승리하는 것과 손에 있는 카드를 모두 내서 나가는 것은 달라요."},
  ].filter(term=>`${term.title} ${term.text}`.includes(query.trim()));
  return <div className="essential-terms">{terms.map(term=><article className="term-explanation" key={term.id}><h3>{term.title}</h3><p>{term.text}</p>{term.id==="lead" && (players<=5 || mode==="team") && <p className="lead-caution">※ 주의: 참새를 첫 카드로 낼 필요는 없어요. 하지만 끝까지 남겨두면 내기 어려워 손에 카드가 남을 수 있고, 1등을 하기 어려워질 수 있어요.</p>}</article>)}{!terms.length&&<p className="empty">해당하는 필수 용어가 없어요. 다른 규칙은 하단 검색에서 찾아보세요.</p>}</div>;
}
