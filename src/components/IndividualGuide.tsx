"use client";
import { StepNavigation, StepActions } from "./StepNavigation";
import { useEffect, useState } from "react";
import { PlayerCount } from "@/types";
import { rankNames } from "@/data/gameSelection";
import { rulesForGame } from "@/data/gameRules";
import { RuleDetail } from "./Rules";
import { Combinations } from "./Rules";
import { cards } from "@/data/cards";
import { PlayingCard } from "./PlayingCard";
import { emptyRecord, validRecord, finishPlayer, moveRank, RankRecord } from "@/lib/rankRecord";
type IndividualCount = Exclude<PlayerCount, 4>;
export function TwoDeckNotice({players = 7}: {players?: PlayerCount}) {
  const two = players >= 7;
  return <aside className="two-deck-notice"><div className="deck-pair" aria-hidden="true"><PlayingCard card={cards[12]}/>{two && <PlayingCard card={cards[12]}/>}</div><div><h3>카드 {two?2:1}세트를 준비해요.</h3><p>{two?"7명 이상이라면 카드 2세트 사용을 권장합니다. 한 세트는 56장, 두 세트는 총 112장이에요.":"한 세트는 총 56장으로, 일반 카드 52장과 특수 카드 4장으로 구성되어 있어요."}</p></div></aside>;
}
export function IndividualSteps({players}: {players: IndividualCount}) {
  const [step,setStep]=useState(0);
  const labels=["게임 준비","카드 분배","게임 진행","순위 결정","다음 라운드"];
  const ids=["individual","deal-individual","round-individual","rank-individual","exchange-individual"];
  const rule=rulesForGame(players,"individual").find(r=>r.id===ids[step])!;
  return <><StepNavigation labels={labels} step={step} onChange={setStep} prefix="individual-step"/>
    <div className="step-content" role="tabpanel" id="individual-step-content" aria-labelledby={`individual-step-${step}`}><span className="eyebrow">STEP 0{step+1} / {players}인 개인전</span><h3>{rule.title}</h3><p>{rule.summary}</p><p>{rule.detail}</p>{step===0&&<TwoDeckNotice players={players}/>}{step===3&&<RankSystem players={players}/>}{step===2&&<RankRecorder players={players}/>}<p className="notice">{rule.caution}</p><details className="step-more"><summary>자세히 알아보기</summary><RuleDetail rule={rule}/></details><StepActions step={step} count={labels.length} onChange={setStep}/></div>
  </>;
}
export function IndividualCombinations({players}: {players: IndividualCount}) {
  return <Combinations players={players}/>;
}
export function RankSystem({players}: {players: IndividualCount}) {
  return <div className="rank-system"><span className="eyebrow">RANK SYSTEM</span><h3>계급은 어떻게 정해질까요?</h3><p>손을 비운 순서가 순위가 돼요. 높은 순위부터 계급을 정해 다음 라운드에 사용해요.</p><p className="muted">계급 이름은 순위를 쉽게 구분하기 위한 안내예요.</p><ol className="rank-ladder">{rankNames[players].map((name,i)=><li key={name}><span className="rank-number">{String(i+1).padStart(2,"0")}위</span><strong>{name}</strong></li>)}</ol></div>;
}
export function RankRecorder({players}: {players: IndividualCount}) {
  const [record,setRecord]=useState<RankRecord>(()=>emptyRecord(players));
  const [loaded,setLoaded]=useState(false),[storageError,setStorageError]=useState(false),[resetOpen,setResetOpen]=useState(false);
  const key=`tichu-ranking-individual-${players}`;
  useEffect(()=>{try{const value:unknown=JSON.parse(localStorage.getItem(key)??"null");if(validRecord(value,players))setRecord(value);}catch{setStorageError(true);}setLoaded(true);},[key,players]);
  useEffect(()=>{if(loaded)try{localStorage.setItem(key,JSON.stringify(record));}catch{setStorageError(true);}},[loaded,key,record]);
  const displayName=(id:number)=>record.names[id].trim()||`플레이어 ${id+1}`;
  const complete=record.order.length===players;
  return <section className="rank-recorder" aria-label="개인전 순위 기록"><span className="eyebrow">ROUND {record.round}</span><h3>이번 판의 순위를 기록해요</h3><p>이름을 적고 손을 비운 순서대로 눌러주세요. 마지막 남은 사람도 마지막 순위로 기록해요.</p><p className="muted">기록은 이 브라우저에 인원별로 저장됩니다. 같은 이름이어도 플레이어 번호로 구분해요.</p>{storageError&&<p role="status">브라우저에 저장하지 못했어요. 새로고침하면 기록이 사라질 수 있습니다.</p>}
  <div className="rank-players">{record.names.map((name,id)=><div key={id}><label htmlFor={`player-name-${id}`}>플레이어 {id+1}</label><input id={`player-name-${id}`} value={name} maxLength={30} onChange={e=>setRecord(r=>({...r,names:r.names.map((n,i)=>i===id?e.target.value:n)}))}/><button disabled={!loaded||record.order.includes(id)} onClick={()=>setRecord(r=>finishPlayer(r,id))}>{record.order.includes(id)?`${record.order.indexOf(id)+1}위 기록됨`:`${record.order.length+1}위로 기록`}</button></div>)}</div>
  <ol className="recorded-ranks" aria-live="polite">{record.order.map((id,i)=><li key={id}><span>{i+1}위</span><strong>{displayName(id)} <small>#{id+1}</small></strong><span>{rankNames[players][i]}</span><div><button aria-label={`${displayName(id)} 순위 올리기`} disabled={i===0} onClick={()=>setRecord(r=>moveRank(r,i,-1))}>↑</button><button aria-label={`${displayName(id)} 순위 내리기`} disabled={i===record.order.length-1} onClick={()=>setRecord(r=>moveRank(r,i,1))}>↓</button></div></li>)}</ol>
  {!record.order.length&&<p className="muted">아직 기록한 순위가 없어요.</p>}
  <div className="lesson-actions"><button disabled={!record.order.length} onClick={()=>setRecord(r=>({...r,order:r.order.slice(0,-1)}))}>마지막 기록 취소</button><button disabled={!complete} onClick={()=>setRecord(r=>({...r,previous:r.order.map((id,i)=>({name:displayName(id),rank:i+1})),order:[],round:r.round+1}))}>순위 저장 · 다음 라운드 →</button></div>
  {!complete&&<p className="muted">{record.order.length} / {players}명 기록 · 모두 기록하면 다음 라운드로 넘어갈 수 있어요.</p>}
  {!!record.previous.length&&<details className="previous-ranks" open><summary>지난 라운드 순위 · 이번 판 계급 확인</summary><ol>{record.previous.map(row=><li key={row.rank}>{row.rank}위 · {row.name} · <b>{rankNames[players][row.rank-1]}</b></li>)}</ol></details>}
  <div className="record-reset">{resetOpen ? <><p>이 인원의 이름과 현재·지난 라운드 기록을 초기화할까요?</p><button onClick={()=>{setRecord(emptyRecord(players));setResetOpen(false);}}>초기화하기</button><button onClick={()=>setResetOpen(false)}>취소</button></> : <button onClick={()=>setResetOpen(true)}>이 인원의 기록 초기화</button>}</div>
  </section>;
}
export function IndividualExchange() { return <section className="individual-exchange"><h3>계급이 정해지면 어떻게 하나요?</h3><p>이전 라운드 순위로 다음 라운드 계급을 정해요. 상위 계급과 하위 계급이 카드를 주고받고, 교환을 마치면 새 라운드를 시작해요.</p><div className="rank-relation"><b>상위 계급 · 황제</b><span>↕ 카드 교환</span><b>하위 계급 · 천민</b></div></section>; }
