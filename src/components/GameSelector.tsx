"use client";
import { useState } from "react";
import { GameSelection, PlayerCount } from "@/types";
import { Modal } from "./Modal";
import { TwoDeckNotice } from "./IndividualGuide";
export function GameSelector({value, select, close}: {value: GameSelection; select: (value: GameSelection) => void; close: () => void}) {
  const [stage, setStage] = useState<"count" | "six" | "many">("count");
  const [count, setCount] = useState<PlayerCount>(value.playerCount >= 7 ? value.playerCount : 7);
  return <Modal title={stage === "six" ? "6명이서 어떤 방식으로 플레이할까요?" : "몇 명이서 게임하나요?"} close={close} kind="selection-overlay">
    {stage !== "count" && <button className="back-button" onClick={() => setStage("count")}>← 인원 다시 선택</button>}
    {stage === "count" && <><p className="muted">4명부터 12명까지 선택할 수 있어요.</p><div className="game-choice-grid">
      {([4,5,6,7] as const).map(p => <button key={p} className="game-choice" aria-pressed={p === 7 ? value.playerCount >= 7 : value.playerCount === p} onClick={() => p === 6 ? setStage("six") : p === 7 ? setStage("many") : select({playerCount:p,mode:p===4?"team":"individual"})}>
        <strong>{p === 7 ? "7~12" : p}인</strong><span>{p === 6 ? "플레이 방식 선택" : p === 4 ? "티츄 · 팀전" : "쟁상유 · 개인전"}</span>
      </button>)}
    </div></>}
    {stage === "six" && <><p className="muted">팀전과 개인전 중 원하는 방식을 선택하세요.</p><div className="game-mode-options">
      <button className="game-choice" aria-pressed={value.playerCount===6 && value.mode==="team"} onClick={() => select({playerCount:6,mode:"team"})}><small>TICHU</small><strong>티츄 팀전</strong><span>3명씩 두 팀으로 협력해요.</span><span>3 VS 3 · 팀 점수 · 티츄 선언 · 트리플 승리</span><b>선택하기 →</b></button>
      <button className="game-choice" aria-pressed={value.playerCount===6 && value.mode==="individual"} onClick={() => select({playerCount:6,mode:"individual"})}><small>ZHENG SHANGYOU</small><strong>쟁상유 개인전</strong><span>6명이 각자의 순위를 겨뤄요.</span><span>개인 순위 · 계급 · 자리와 카드 교환 안내</span><b>선택하기 →</b></button>
    </div></>}
    {stage === "many" && <><p className="muted">7명부터 12명까지 선택할 수 있어요.</p><div className="exact-player-grid">{([7,8,9,10,11,12] as const).map(p => <button key={p} aria-pressed={count===p} onClick={() => setCount(p)}>{p}인</button>)}</div><p className="selection-summary">{count}인 · 쟁상유 개인전</p><TwoDeckNotice/><button className="primary-button" onClick={() => select({playerCount:count,mode:"individual"})}>{count}인으로 시작하기 →</button></>}
  </Modal>;
}
