import { TwoDeckNotice } from "./IndividualGuide";
import { GuideCTA } from "./GuideCTA";
import { GameSelection } from "@/types";
import { getHomeContent } from "@/data/homeContent";
export function HomeIntroduction({selection, onCards}: {selection: GameSelection; onCards: () => void}) {
  const content = getHomeContent(selection);
  const {playerCount, individual, ranks} = content;
  return <div className="home-introduction">
    <div className="home-logo-wrap"><img className="home-wordmark" src="/images/tichu-wordmark.png" alt="TICHU" width={2025} height={776} fetchPriority="high"/></div>
    <section className="home-about" aria-labelledby="home-about-title"><span className="eyebrow">{content.eyebrow}</span><h1 id="home-about-title">{content.title}</h1>{content.description.map(text=><p key={text}>{text}</p>)}</section>
    <section className="home-facts" aria-label="선택한 게임의 핵심 정보">
      <figure className="home-fact home-team-fact"><figcaption><span>01</span><b>{content.playerTitle}</b></figcaption>
        {individual ? <div className="individual-player-graphic" role="img" aria-label={`${playerCount}명이 각자 경쟁하는 개인전`}>{Array.from({length:playerCount},(_,i)=><span className="team-dot" key={i} aria-hidden="true"/>)}</div> : <div className="team-graphic" role="img" aria-label={`${playerCount}명, ${playerCount/2}명씩 두 팀`}>{[0,1].map(team=><div className="home-team-side" key={team}>{team===1&&<span className="team-versus">VS</span>}<div className={`team-group ${team===1?"team-group-second":""}`}>{Array.from({length:playerCount/2},(_,i)=><span className="team-dot" key={i} aria-hidden="true"/>)}</div></div>)}</div>}
        <div className="home-fact-footer"><strong>{playerCount} PLAYERS</strong><span>{content.playerLabel}</span></div>{individual&&<p className="home-fact-note">{playerCount}명이 각자 경쟁하는 개인전</p>}
      </figure>
      <figure className="home-fact home-score-fact"><figcaption><span>02</span><b>{content.victoryTitle}</b></figcaption>
        {individual ? <><ol className={`home-rank-graphic ${playerCount>=7?"compact-ranks":""}`} aria-label={`1위부터 ${playerCount}위까지 계급`}>{(playerCount>=7?[0,playerCount-1]:ranks.map((_,i)=>i)).map((index,i)=><li key={index}>{playerCount>=7&&i===1&&<span className="home-rank-ellipsis" aria-hidden="true">↓ ··· ↓</span>}<span className="home-rank-entry"><span>{String(index+1).padStart(2,"0")}위</span><strong>{ranks[index]}</strong></span></li>)}</ol><p className="home-fact-note">{content.rankNote} <a href="#scoring">전체 계급 보기 ↗</a></p></> : <><div className="score-path" aria-label="여러 라운드를 거쳐 팀 단위로 승리"><span>ROUND 01</span><i/><span>ROUND 02</span><i/><span>ROUND 03</span><i className="score-path-dots"/><span>…</span><b>→</b></div><div className="home-fact-footer"><strong>{content.victoryNumber}</strong><span>{content.victoryLabel}</span></div></>}
      </figure>
      <figure className="home-fact home-cards-fact"><figcaption><span>03</span><b>{content.cardTitle}</b></figcaption>
        <TwoDeckNotice players={playerCount}/><p className="home-fact-note">{content.cardNote}</p>
      </figure>
    </section>
    <GuideCTA title="게임을 이해했다면, 이제 카드를 살펴볼까요?" label="카드 먼저 확인하기" onClick={onCards}/>
  </div>;
}
