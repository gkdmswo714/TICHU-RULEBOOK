import { useId } from "react";
import { cards, ranks } from "@/data/cards";
import { suits, cardImages } from "@/data/images";
import { PlayerCount } from "@/types";

const suitOrder = [1, 2, 4, 3];
const suitLabels: Record<number, string> = {1: "검은색 칼", 2: "초록색 달", 4: "청회색 집", 3: "주황색 별"};
export function CardOverview({suit, onSuit, players, learning = false}: {suit: string; onSuit: (suit: string) => void; players: PlayerCount; learning?: boolean}) {
  const titleId = useId();
  return <section className="card-overview" aria-labelledby={titleId}>
    <h3 id={titleId}>카드 구성 한눈에 보기</h3>
    <section><h4><span>01</span> 카드 구성</h4><p>티츄 카드는 총 56장입니다.</p><div className="overview-total"><span>일반 카드 <strong>52장</strong></span><b aria-hidden="true">＋</b><span>특수 카드 <strong>4장</strong></span><b aria-hidden="true">＝</b><strong>56장</strong></div></section>
    <section><h4><span>02</span> 일반 카드 무늬</h4><p>{learning?"네 가지 무늬마다 13장씩 있어요.":"네 가지 무늬마다 13장씩 있어요. 무늬를 누르면 아래 목록에서 해당 카드를 볼 수 있어요."}</p><div className="overview-suits">{suitOrder.map(id=>{const item=suits.find(s=>s.id===id)!;return <button key={id} disabled={learning} aria-pressed={learning?undefined:suit===String(id)} onClick={()=>onSuit(suit===String(id)?"all":String(id))}><img src={`/cards/symbols/${item.slug}.png`} alt="" width={48} height={48}/><span><strong>{suitLabels[id]}</strong><small>13장{suit===String(id)?" · 선택됨":""}</small></span></button>;})}</div></section>
    <section><h4><span>03</span> 일반 카드 숫자</h4><p>각 무늬는 2부터 A까지, 총 13장으로 구성됩니다.</p><ol className="overview-ranks" aria-label="각 무늬의 카드 숫자">{ranks.map(rank=><li key={rank}>{rank}</li>)}</ol><p className="overview-equation"><strong>13 × 4 = 52</strong><span>13장 × 네 가지 무늬 = 일반 카드 52장</span></p></section>
    {learning && <section><h4><span>04</span> 카드 위계질서</h4><p>일반 카드는 숫자가 클수록 강해요.</p><div className="card-hierarchy" aria-label={[...ranks].reverse().join(" > ")}>{[...ranks].reverse().map((rank,i)=><span key={rank}>{i>0&&<b aria-hidden="true">&gt;</b>}<strong>{rank}</strong></span>)}</div><p>A는 가장 강한 일반 카드, 2는 가장 약한 일반 카드예요. 무늬가 달라도 같은 숫자는 강함이 같아요. 특수 카드의 효과는 별도로 적용해요.</p></section>}
    <section><h4><span>{learning?"05":"04"}</span> 특수 카드 설명</h4><p>일반 카드와 별도로 특수 카드 4장이 있어요.</p><div className="overview-specials">{["sparrow","dragon","dog","phoenix"].map(id=>{const card=cards.find(c=>c.id===id)!;return <figure key={id}><img src={cardImages[id]} alt={card.name} width={224} height={384}/><figcaption>{id==="sparrow"?"참새(1)":card.name}</figcaption></figure>;})}</div><p className="overview-mode-note">위 안내는 기본 카드 한 세트의 구성이에요. 실제 사용 카드와 분배 방식은 선택한 게임 모드의 규칙을 따라요.{players===5?" 5인 개인전에서는 개를 제외한 55장을 사용해요.":players>=7?" 7인 이상은 카드 2세트 준비를 권장해요.":""}</p></section>
  </section>;
}
