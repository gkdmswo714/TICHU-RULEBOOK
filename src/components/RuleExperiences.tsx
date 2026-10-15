"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cards } from "@/data/cards";
import { Players } from "@/types";
import { PlayingCard } from "./PlayingCard";

function FAQ({ items }: { items: [string, string][] }) {
  return <div className="lesson-faq"><h4>헷갈리기 쉬워요!</h4>{items.map(([q,a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>;
}
export function CardSequence({ dragon = false }: { dragon?: boolean }) {
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();
  const ids = dragon ? ["s1-K", "s2-A", "dragon"] : ["s1-3", "s2-5", "s3-8", "s4-A"];
  const messages = dragon ? ["A가 K를 냈어요. 10점이에요.", "B가 A로 이겼어요. A는 0점이에요.", "C가 용을 냈어요. 용은 25점이에요.", "D → A → B가 모두 패스했어요.", "트릭 승자: C. 아직 손에 카드가 남아 있어요.", "카드 수령자: 상대 B. K·A·용 3장, 총 35점을 넘겨요.", "다음 선: C. 받은 사람 B가 아니라 승자 C가 새 조합을 내요."] : ["A가 3으로 시작해요.", "B가 더 높은 5를 내요.", "C가 8을 내요.", "D가 A(에이스)를 내요.", "A → B → C가 모두 패스해요.", "D가 트릭에서 승리했어요! 3·5·8·A, 네 장을 획득 더미로 가져가요."];
  const collected = dragon ? step >= 5 : step === 5;
  return <div className="card-lesson" aria-label={dragon ? "용의 35점 예시" : "트릭 진행 예시"}>
    <p className="eyebrow">4인 예시 · STEP {step + 1} / {messages.length}</p>
    <p className="muted">{dragon ? "A·C 한 팀 / B·D 한 팀 · C는 용을 내고도 패가 남아 있어요." : "이 예시의 A·B·C·D는 차례 순서예요. 모두 아직 패가 남아 있어요."}</p>
    <div className={`lesson-cards ${collected ? "collected" : ""}`}>
      {ids.map((id,i) => <motion.div key={id} initial={false} animate={{opacity:step >= i ? 1 : 0.12, y:collected ? 24 : 0, x:collected ? `${((ids.length-1)/2-i)*35}%` : "0%", scale:collected ? 0.9 : 1}} transition={{duration:reduce ? 0 : 0.3,delay:reduce ? 0 : i*0.04}}><span>{String.fromCharCode(65+i)}</span><PlayingCard card={cards.find(c=>c.id===id)!}/>{dragon && <small>{[10,0,25][i]}점</small>}</motion.div>)}
    </div>
    <div className="collection-target">{collected ? dragon ? "→ 상대 B의 획득 더미 · 35점" : "→ D의 획득 더미 · 4장" : "탁자에 놓인 카드"}</div>
    <p className="lesson-status" role="status" aria-live="polite">{messages[step]}</p>
    <div className="lesson-actions"><button onClick={()=>setStep(s=>s+1)} disabled={step===messages.length-1}>다음 단계 →</button><button onClick={()=>setStep(0)}>다시 보기 ↺</button></div>
    <p className="muted">{dragon ? "이전에 모아둔 카드는 그대로예요. 이번 트릭의 세 장만 넘깁니다." : "가져간 카드는 손패에 넣지 않아요. D가 다음 트릭을 시작해요."}</p>
  </div>;
}
export function TrickRound({players}:{players:Players}) {
 return <section className="rule-lesson" aria-label="트릭과 라운드 비교">
  <h3>트릭과 라운드</h3>
  <article className="term-explanation"><span className="eyebrow">01 / TRICK</span><h4>한 번의 카드 대결</h4><p>플레이어들이 차례대로 카드를 내고, 마지막으로 카드를 낸 사람을 제외한 모두가 패스하면 트릭이 끝나요.</p><p>{players===5 ? "탁자의 카드는 치워요. 점수를 모으지 않아요." : "일반적으로 트릭의 승자가 나온 카드를 가져가요."}</p></article>
  <article className="term-explanation"><span className="eyebrow">02 / ROUND</span><h4>여러 번의 트릭이 모인 하나의 판</h4><p>트릭을 이어가며 손패를 비워요. {players===4 ? "기본 4인 규칙에서는 세 명이 카드를 모두 내면 끝나요. 같은 팀이 1등과 2등을 차지하는 원투가 성립하면 즉시 종료돼요." : players===5 ? "다섯 명 중 네 명이 손을 비우면 끝나고, 손을 비운 순서로 순위를 정해요." : "팀이 목표를 달성하거나 라운드 종료 조건에 도달하면 판을 마쳐요."}</p></article>
  <div className="round-nesting"><b>트릭 1</b><span>→</span><b>트릭 2</b><span>→</span><b>트릭 3</b><span>→</span><b>…</b><span>→</span><b>라운드 종료</b></div>
  {players===4 && <details className="lesson-expand"><summary>실제 카드로 트릭 진행해 보기</summary><CardSequence/></details>}
 </section>;
}
export function StartSummary({players,onPlay}:{players:Players;onPlay:()=>void}) {
 const [trickOpen,setTrickOpen]=useState(false);
 const trickRanks=players===4?["2","3","J","A"]:players===5?["2","3","5","J","A"]:["2","3","5","7","J","A"];
 const trickCards=trickRanks.map(rank=>cards.find(card=>card.rank===rank&&card.suit===1)!);
 return <aside className="start-summary">
  <b>게임 시작 전에 알아둘 것</b>
  <ol>
   <li>참새를 가진 사람이 첫 번째 <button className="inline-term" aria-expanded={trickOpen} aria-controls="trick-definition" onClick={()=>setTrickOpen(open=>!open)}>트릭</button>을 시작해요.</li>
   <li>게임은 반시계 방향, 앉은 사람의 오른쪽으로 진행해요.</li>
   <li>참새를 반드시 첫 카드로 낼 필요는 없어요.</li>
  </ol>
  {trickOpen&&<figure className="inline-term-definition" id="trick-definition" aria-label={`반시계 차례로 ${players}명이 ${trickRanks.join(", ")}를 내고 모두 패스하면 한 트릭이 끝나는 예시`}>
   <figcaption><span aria-hidden="true">↺</span> {players}명이 반시계 차례로 내요</figcaption>
   <div className="trick-example-cards" data-player-count={players}>
    {trickCards.map((card,index)=><span className="trick-example-step" key={card.id}>{index>0&&<span className="trick-example-arrow" aria-hidden="true">→</span>}<PlayingCard card={card}/></span>)}
   </div>
   <p><b>A 뒤 모두 패스하면 한 트릭 끝!</b></p>
  </figure>}
  <p>{players===5 ? "첫 판은 11장씩 받은 뒤 시작해요. 둘째 판부터는 세금 교환을 마친 뒤 시작해요." : players===4 ? "준비 → 분배 → 카드 교환 → 첫 트릭 순서예요." : "준비와 카드 교환을 마친 뒤 첫 트릭을 시작해요."}</p>
  <button onClick={onPlay}>게임 진행 단계에서 자세히 보기 →</button>
 </aside>;
}
export function StartLesson({players}:{players:Players}) {
 const [turn,setTurn]=useState(0),[running,setRunning]=useState(false);
 const seats=Array.from({length:players},(_,index)=>String.fromCharCode(65+index));
 const order=[0,...Array.from({length:players-1},(_,index)=>players-1-index),0];
 const markerId=`direction-arrow-${players}`;
 const arrows=seats.map((_,index)=>{
  const startAngle=(-90+index*360/players+12)*Math.PI/180;
  const endAngle=(-90+((index+players-1)%players)*360/players-12)*Math.PI/180;
  const point=(angle:number)=>`${150+Math.cos(angle)*112} ${150+Math.sin(angle)*112}`;
  return `M ${point(startAngle)} A 112 112 0 0 0 ${point(endAngle)}`;
 });
 useEffect(()=>{if(!running)return;const timer=setTimeout(()=>{if(turn<order.length-1)setTurn(turn+1);else setRunning(false);},850);return()=>clearTimeout(timer);},[turn,running,order.length]);
 const sequence=order.map(index=>seats[index]).join(" → ");
 return <section className="rule-lesson"><h3>게임은 어떻게 시작하나요?</h3><p><b>참새를 가진 사람이 첫 번째 트릭을 시작해요.</b> 참새부터 내야 하는 것은 아니에요. 원하는 유효한 조합을 낼 수 있어요.</p><p>반시계 방향으로 카드를 내거나 패스해요.</p><div className="direction-table" aria-label={`${players}인 좌석 배치. ${sequence} 순서로 반시계 방향 진행`}><svg viewBox="0 0 300 300" aria-hidden="true"><defs><marker id={markerId} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#747474"/></marker></defs>{arrows.map((path,index)=><path key={index} d={path} fill="none" stroke="#747474" strokeWidth="2" markerEnd={`url(#${markerId})`}/>)}</svg><div className="table-center">게임 테이블<br/><b>↺ 반시계</b></div>{seats.map((name,index)=>{const angle=(-90+index*360/players)*Math.PI/180;const left=50+Math.cos(angle)*43;const top=50+Math.sin(angle)*43;const active=name===seats[order[turn]];return <div key={name} className={`table-player ${active?"active":""}`} style={{left:`${left}%`,top:`${top}%`,transform:"translate(-50%,-50%)"}}><b>{name}</b>{name==="A"&&<small>참새 소지자</small>}{active&&<small>현재 차례</small>}</div>})}</div><p role="status" aria-live="polite">진행 순서: <b>{sequence}</b> · 현재 {seats[order[turn]]}</p><div className="lesson-actions"><button disabled={running} onClick={()=>{setTurn(0);setRunning(true);}}>진행 방향 확인하기</button><button onClick={()=>{setRunning(false);setTurn(0);}}>다시 보기 ↺</button></div>
 <FAQ items={[["참새를 가진 사람은 반드시 참새부터 내야 하나요?","아니에요. 첫 트릭을 시작할 권리만 주어져요. 참새를 가지고 있어도 다른 유효한 카드나 조합부터 낼 수 있어요."]]}/></section>;
}
export function DragonLesson({players}:{players:Players}) {
 if(players!==4) return <section className="rule-lesson"><h3>용의 점수, 인원에 따라 달라요</h3><p>{players===5 ? "5인 개인전에서는 카드 점수를 계산하지 않아요. 용의 25점을 상대 팀에 준다는 4인 설명은 적용하지 않아요. 용은 가장 강한 싱글이지만 폭탄에는 져요." : "6인 팀전에서 용은 가장 강한 싱글이에요. 점수 카드와 트릭 승패를 함께 살펴보며 팀 점수를 계산해요."}</p></section>;
 return <section className="rule-lesson" id="dragon-lesson"><span className="eyebrow">4인 기본 규칙</span><h3>용은 무조건 좋은 카드일까요?</h3><p><b>가장 강한 싱글이지만, 이긴 트릭을 상대에게 주는 대가가 있어요.</b></p><div className="lesson-columns"><article><h4>＋ 용의 장점</h4><ul><li>A와 봉황도 이기는 싱글이에요.</li><li>이기고 패가 남아 있으면 다음 선을 잡아요.</li><li>원하는 조합으로 시작해 손을 줄이거나 원투를 노릴 수 있어요.</li></ul></article><article><h4>− 용의 단점</h4><ul><li>용으로 이긴 해당 트릭을 상대 한 명에게 줘요.</li><li>용의 25점도 함께 넘어가요.</li><li>폭탄에는 질 수 있어요. 높은 카드라고 무조건 유리하지 않아요.</li></ul></article></div><details className="lesson-expand"><summary>K + A + 용 = 35점, 어디로 갈까요?</summary><CardSequence dragon/></details><details className="lesson-expand"><summary>마지막 카드·폭탄 예외와 사용 전략</summary><p>폭탄이 용을 이기면 용의 선물 규칙은 적용되지 않아요. 폭탄으로 이긴 사람이 트릭을 가져가요.</p><p>용으로 마지막 카드를 내고 나갔다면 직접 다음 트릭을 시작하지 못해요. 라운드가 계속되는 경우, 승자의 오른쪽에서 패가 남아 있는 첫 사람이 선을 받아요. 이미 라운드 종료 조건이 되었다면 새 트릭을 시작하지 않아요.</p><h4>용은 언제 사용하는 게 좋을까요?</h4><p>다음 선을 잡아 손에 남은 페어나 스트레이트를 먼저 내고 싶을 때 유용해요. 먼저 나가거나 팀원과 원투를 노리는 데도 도움이 되지만, 넘기는 점수와 폭탄 가능성을 함께 생각하세요.</p><b>용은 강력하지만 대가가 따르는 카드예요. 언제 사용하는지가 중요해요!</b></details><FAQ items={[["용으로 이기면 왜 상대에게 카드를 주나요?","가장 강한 싱글인 대신, 이긴 트릭을 상대에게 주는 특수 규칙이 있기 때문이에요."],["이전에 가져간 카드도 줘야 하나요?","아니에요. 용으로 이긴 해당 트릭만 줘요. 이전 획득 더미는 그대로예요."],["용의 25점도 상대에게 가나요?","네. 용이 이겨 트릭을 상대에게 넘겼다면 용의 25점도 상대 팀 획득 카드에 포함돼요."],["용을 내면 무조건 다음 차례가 되나요?","아니에요. 실제로 트릭을 이기고 손에 카드가 남아 있어야 해요. 폭탄에 졌거나 이미 나갔다면 직접 시작하지 못해요."]]}/></section>;
}
