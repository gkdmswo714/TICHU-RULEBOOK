"use client";
import { RankRecorder, RankSystem } from "./IndividualGuide";
import { StepNavigation, StepActions } from "./StepNavigation";
import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { Players, Character } from "@/types";
import { rulesFor } from "@/data/rules";
import { fiveRule, fiveSeats, fiveTax } from "@/data/fivePlayer";
import { RuleDetail } from "./Rules";
import { PixelCharacter } from "./PixelCharacter";
import { StartSummary, StartLesson } from "./RuleExperiences";
const learningTabs = [
  { label: "필수 용어", panel: 1 },
  { label: "카드 설명", panel: 3 },
  { label: "조합", panel: 2 },
  { label: "기본 순서", panel: 0 },
];
function move(
  e: KeyboardEvent,
  index: number,
  count: number,
  select: (n: number) => void,
) {
  const next =
    e.key === "ArrowRight"
      ? (index + 1) % count
      : e.key === "ArrowLeft"
        ? (index + count - 1) % count
        : e.key === "Home"
          ? 0
          : e.key === "End"
            ? count - 1
            : -1;
  if (next < 0) return;
  e.preventDefault();
  select(next);
  (e.currentTarget.parentElement?.children[next] as HTMLElement)?.focus();
}
export function GuideTabs({
  active,
  select,
}: {
  active: number;
  select: (n: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const visibleIndex = learningTabs.findIndex((tab) => tab.panel === active);
    const el = ref.current?.children[visibleIndex] as HTMLElement;
    if (el && ref.current)
      ref.current.scrollTo({
        left: el.offsetLeft - ref.current.offsetLeft - 20,
        behavior: "instant",
      });
  }, [active]);
  return (
    <div className="guide-tabs" role="tablist" aria-label="학습 메뉴" ref={ref}>
      {learningTabs.map(({ label, panel }, i) => (
        <button
          key={label}
          role="tab"
          id={`guide-tab-${panel}`}
          aria-controls={`guide-panel-${panel}`}
          aria-selected={active === panel}
          tabIndex={active === panel ? 0 : -1}
          onClick={() => select(panel)}
          onKeyDown={(e) => move(e, i, 4, (next) => select(learningTabs[next].panel))}
        >
          {String(i + 1).padStart(2, "0")} {label}
          <span aria-hidden="true">⌄</span>
        </button>
      ))}
    </div>
  );
}
export function MiniCard({
  rank,
  character,
}: {
  rank: string;
  character?: Character;
}) {
  return (
    <span className="score-card" aria-label={`${rank} 카드`}>
      <span>{character ? <PixelCharacter kind={character} /> : rank}</span>
    </span>
  );
}
export function ScoreCards() {
  return (
    <>
      <p className="score-caption">
        획득한 카드 <b>한 장당</b> 점수예요. 카드를 낼 때 받는 점수가 아니에요.
      </p>
      <div className="score-strip score-visual">
        {[
          { rank: "5", points: "+5" },
          { rank: "10", points: "+10" },
          { rank: "K", points: "+10" },
          { rank: "용", points: "+25", character: "dragon" },
          { rank: "봉황", points: "−25", character: "phoenix" },
        ].map((c) => (
          <div key={c.rank}>
            <MiniCard
              rank={c.rank}
              character={c.character as Character | undefined}
            />
            <span>{c.rank}</span>
            <strong>
              {c.points}
              <small>점</small>
            </strong>
          </div>
        ))}
      </div>
      <p className="score-caption">
        예: 5 두 장 + K 한 장 + 봉황 한 장 = <b>−5점</b>
        <br />
        카드의 강함과 점수는 달라요. A는 높은 카드지만 0점이에요.
      </p>
    </>
  );
}
export function StepProgress({ players }: { players: Players }) {
  const [step, setStep] = useState(0);
  useEffect(() => setStep(0), [players]);
  const labels =
    players === 5
      ? ["게임 준비", "카드 분배", "첫 판 진행", "세금 교환", "게임 진행"]
      : [
          "게임 준비",
          "카드 분배",
          "카드 교환",
          "게임 진행",
          "종료 · 점수",
        ];
  const data = [
    {
      title:
        players === 5
          ? "개를 빼고, 각자의 승부를 준비해요"
          : "팀원을 확인하고 자리를 잡아요",
      text:
        players === 4
          ? "네 명이 두 팀으로 나뉘어요. 맞은편에 앉은 사람이 내 팀원이에요. 일반 카드 52장과 특수 카드 4장을 모두 사용해요."
          : players === 5
            ? "다섯 명의 개인전이에요. 개를 제외한 55장을 사용하며, 티츄 선언과 카드 점수 계산은 하지 않아요."
            : "여섯 명이 세 명씩 두 팀으로 나뉘어요. 서로 다른 팀이 번갈아 앉아요.",
      r: players === 5 ? "seigneur" : "round",
      visual: ["2", "3", "A"],
    },
    {
      title:
        players === 4
          ? "처음 8장 → 선언 기회 → 나머지 6장"
          : "인원에 맞춰 카드를 받아요",
      text:
        players === 4
          ? "각자 총 14장을 받아요. 라지 티츄는 9번째 카드를 받기 전에 선언해요. 처음 8장까지만 본 상태에서 결정한 뒤 남은 6장을 확인하세요."
          : players === 6
            ? "라지 티츄는 7번째 카드를 받기 전에 선언해요. 선언 후 남은 카드를 모두 받아 게임을 시작해요."
            : "개를 뺀 55장을 각자 11장씩 나눠요.",
      r: players === 4 ? "grand" : players === 6 ? "grand6" : "seigneur",
      visual: players === 4 ? ["8장", "+6장"] : ["?"],
    },
    {
      title:
        players === 5
          ? "지난 순위에 따라 상납해요"
          : "받기 전에, 보낼 카드를 골라요",
      text:
        players === 4
          ? "팀원과 상대 두 사람에게 각각 한 장씩, 총 세 장을 보내요. 보낼 카드를 모두 정하기 전에는 받은 카드를 보지 않아요."
          : players === 6
            ? "두 팀원에게 한 장씩 보내고 한 장씩 받아요. 4인처럼 상대에게 보내지 않아요."
            : "첫 판에는 교환하지 않아요. 다음 판부터 천민과 황제는 2장, 평민과 재상은 1장을 동시에 주고받아요.",
      r: players === 4 ? "exchange" : players === 6 ? "exchange6" : "tribute",
      visual: ["→", "←"],
    },
    {
      title: "조합을 내고, 트릭을 이어가요",
      text:
        "참새를 가진 사람이 첫 선이에요. 원하는 조합으로 시작하고, 이후 같은 조합·같은 장수로 더 높게 내거나 패스해요. 폭탄은 예외예요. " +
        (players === 5
          ? "5인에는 티츄 선언이 없어요."
          : "스몰 티츄는 내가 첫 카드를 내기 전까지 선언할 수 있어요."),
      r: "trick",
      visual: ["5", "K", "A"],
    },
    {
      title:
        players === 5
          ? "다음 라운드의 순위를 정해요"
          : "손을 비운 순서와 획득 카드를 정리해요",
      text:
        players === 4
          ? "한 사람만 패가 남으면 라운드가 끝나요. 마지막 사람의 남은 패는 상대 팀, 획득 트릭은 1등에게 줘요. 같은 팀이 1·2등이면 즉시 종료하고 카드 점수 대신 200점을 받아요. 선언 점수는 별도예요."
          : players === 6
            ? "한 팀이 1·2·3등이면 카드 점수 대신 300점이에요. 일반 종료에서는 마지막 사람의 패와 트릭을 상대 팀에, 5등의 트릭을 1등에게 넘겨요."
            : "한 사람만 패가 남으면 끝나요. 손을 비운 순서로 신분을 정하고 다음 판의 자리로 이동해요.",
      r: players === 4 ? "points" : players === 6 ? "triple" : "seigneur",
      visual: players === 5 ? ["1등"] : ["5", "10", "K"],
    },
  ];
  const fiveIds = ["seigneur", "deal5", "trick", "tribute", "trick"];
  const five =
    players === 5 ? rulesFor(5).find((r) => r.id === fiveIds[step])! : null;
  const d = five
    ? {
        title:
          step === 2
            ? "첫 판은 교환 없이 진행해요"
            : step === 3
              ? "계급 및 순위 안내"
              : step === 4
                ? "두 번째 판부터 계급제로 이어가요"
                : five.title,
        text:
          step === 2
            ? "참새 소지자가 시작해 여러 트릭을 진행해요. 첫 판에는 세금이나 카드를 교환하지 않아요. 한 사람만 패가 남으면 끝나고, 손을 비운 순서대로 1~5등을 정해 황제·재상·장군·평민·천민 계급과 자리를 정해요."
            : step === 3
              ? `지난 판 순위로 정한 계급에 따라 세금과 하사를 동시에 교환해요. ${five.summary} ${five.detail}`
              : step === 4
                ? "새 카드를 받은 뒤 계급에 따라 세금을 교환하고 게임을 시작해요. 라운드가 끝날 때마다 손을 비운 순서로 계급과 자리를 다시 정해요."
                : `${five.summary} ${five.detail}`,
        r: five.id,
        visual:
          step === 1
            ? ["11장"]
            : step === 2
              ? []
              : step === 3
                ? ["2장", "1장", "0장"]
                : step === 4
                  ? ["계급", "세금", "진행"]
                  : data[step].visual,
      }
    : data[step];
  const rule = rulesFor(players).find((r) => r.id === d.r);
  const firstPlayStep = players === 5 ? 2 : 3;
  const stepMarkers =
    players === 5 ? ["1", "2", "3", "★", "4"] : ["1", "2", "3", "4", "5"];
  return (
    <>
      <StepNavigation labels={labels} markers={stepMarkers} step={step} onChange={setStep} prefix="step-tab"/>
      <div
        className="step-content"
        id="step-tab-content"
        role="tabpanel"
        aria-labelledby={`step-tab-${step}`}
        tabIndex={0}
      >
        <div key={`${players}-${step}`} className="step-copy">
          <span className="eyebrow">
            {players === 5 && step === 3
              ? "★ 세금 교환 · 5인"
              : `STEP 0${step === 4 && players === 5 ? 4 : step + 1} / ${players}인`}
          </span>
          {step === 0 && (
            <StartSummary players={players} onPlay={() => setStep(firstPlayStep)} />
          )}
          <h3>{d.title}</h3>
          {!(players === 5 && step === 3) && <p>{d.text}</p>}
          {players !== 5 ? (
            <TeamStepVisual players={players} step={step} />
          ) : players === 5 && step === 1 ? (
            <FivePlayerDealVisual />
          ) : players === 5 && step === 2 ? (
            <ol className="five-rank-order" aria-label="순위에 따른 계급">
              {["황제", "재상", "장군", "평민", "천민"].map((title, i) => (
                <li key={title}>
                  <span>{i + 1}등</span>
                  <strong>{title}</strong>
                </li>
              ))}
            </ol>
          ) : players === 5 && step === 3 ? (
            <RankSystem players={5}/>
          ) : (
            <div className="step-cards" aria-label="단계 카드 예시">
              {d.visual.map((rank, i) => (
                <MiniCard key={i} rank={rank} />
              ))}
            </div>
          )}
          {step === firstPlayStep && <StartLesson players={players} />}
          {players === 5 && step === 4 && <RankRecorder players={5}/>}
          {rule && !(players === 5 && step === 3) && (
            <details className="step-more">
              <summary>자세히 알아보기</summary>
              <RuleDetail rule={rule} />
            </details>
          )}
        </div>
        <StepActions step={step} count={labels.length} onChange={setStep}/>
      </div>
    </>
  );
}

function TeamStepVisual({ players, step }: { players: 4 | 6; step: number }) {
  const seats = Array.from({ length: players }, (_, i) => String.fromCharCode(65 + i));
  const teamOne = players === 4 ? "A · C" : "A · C · E";
  const teamTwo = players === 4 ? "B · D" : "B · D · F";
  const flow = step === 1
    ? players === 4
      ? [["먼저", "8장 확인"], ["선택", "라지 티츄 선언"], ["이어서", "6장 더 받기"]]
      : [["먼저", "처음 6장 확인"], ["선택", "라지 티츄 선언"], ["시점", "7번째 카드 전"]]
    : step === 2
      ? players === 4
        ? [["A → C", "팀원에게 1장"], ["A → B", "상대에게 1장"], ["A → D", "상대에게 1장"]]
        : [["A → C", "팀원에게 1장"], ["A → E", "팀원에게 1장"]]
      : step === 3
        ? [["시작", "참새 소지자"], ["내 차례", "더 높게 / 패스"], ["모두 패스", "트릭 정리"], ["다음 트릭", "새 조합으로"]]
        : players === 4
          ? [["우리 팀 1등", "먼저 손 비우기"], ["우리 팀 2등", "원투 성공"], ["카드 점수 대신", "+200점"]]
          : [["우리 팀 1등", "손 비우기"], ["우리 팀 2등", "이어서 나가기"], ["우리 팀 3등", "트리플 +300점"]];
  return <div className="team-step-visual">
    {(step === 0 || step === 1) && <>
      <figure className="five-deal-table" aria-label={`${players}인 ${step === 0 ? "팀 좌석 배치" : "카드 분배"}`}>
        <div className="five-deal-center">
          <strong>{step === 0 ? "두 팀" : players === 4 ? "56장" : "분배 안내"}</strong>
          <span>{step === 0 ? `${players / 2}명씩 한 팀` : players === 4 ? "각자 14장" : "각자 손패를 받고 시작"}</span>
        </div>
        {seats.map((seat, index) => {
          const angle = (-90 + index * 360 / players) * Math.PI / 180;
          return <div key={seat} className={`five-deal-player team-seat-${index % 2}`} style={{ left: `${50 + Math.cos(angle) * 34}%`, top: `${50 + Math.sin(angle) * 34}%` }}>
            <strong>{seat}</strong><span>{step === 1 && players === 4 ? "14장씩" : `팀 ${index % 2 + 1}`}</span>
          </div>;
        })}
      </figure>
      <p className="team-seat-legend">팀 1 · {teamOne}<br/>팀 2 · {teamTwo}</p>
    </>}
    {step !== 0 && <ol className="five-rank-order team-step-flow" aria-label={step === 2 ? "A가 보내는 카드 예시" : "단계별 안내"}>
      {flow.map(([label, text]) => <li key={label}><span>{label}</span><strong>{text}</strong></li>)}
    </ol>}
    {step === 0 && <p className="five-tax-note">{players === 4 ? "맞은편에 앉은 사람이 같은 팀이에요." : "팀 1과 팀 2가 한 자리씩 번갈아 앉아요."}</p>}
    {step === 1 && players === 6 && <p className="notice">라지 티츄를 선언하려면 처음 6장을 확인한 뒤 7번째 카드를 받기 전에 결정해요.</p>}
    {step === 2 && <p className="five-tax-note">A를 기준으로 한 예시예요. 모두 보낼 카드를 고른 뒤 주고받아요. {players === 4 ? "총 3장을 보내고 3장을 받아요." : "두 팀원에게 총 2장을 보내고 2장을 받아요."}</p>}
    {step === 3 && <p className="five-tax-note">첫 판부터 카드 교환을 마친 뒤 시작해요. 패스해도 다음 차례에 다시 낼 수 있어요. 폭탄과 라운드 종료는 예외예요.</p>}
    {step === 4 && <p className="five-tax-note">{players === 4 ? "원투가 아닌 일반 종료에서는 획득 카드 점수를 계산해요. 티츄 선언 점수는 별도로 더해요." : "트리플이 아닌 일반 종료의 한국어 세부 규칙은 확인이 필요해요."}</p>}
  </div>;
}

function FivePlayerDealVisual() {
  const players = ["A", "B", "C", "D", "E"];
  return (
    <figure className="five-deal-table" aria-label="5명이 55장을 나눠 각자 11장씩 받아요">
      <div className="five-deal-center">
        <strong>55장</strong>
        <span>5명에게 분배</span>
      </div>
      {players.map((player, index) => {
        const angle = (-90 + (index * 360) / players.length) * (Math.PI / 180);
        const left = 50 + Math.cos(angle) * 34;
        const top = 50 + Math.sin(angle) * 34;
        return (
          <div
            key={player}
            className="five-deal-player"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <strong>{player}</strong>
            <span>11장씩</span>
          </div>
        );
      })}
    </figure>
  );
}

function FivePlayerTaxDiagram() {
  const ranks = [
    {
      title: "황제",
      exchanges: [
        { from: "천민", cards: "가장 강한 카드 2장", to: "황제" },
        { from: "황제", cards: "원하는 카드 2장", to: "천민" },
      ],
    },
    {
      title: "재상",
      exchanges: [
        { from: "평민", cards: "가장 강한 카드 1장", to: "재상" },
        { from: "재상", cards: "원하는 카드 1장", to: "평민" },
      ],
    },
    { title: "장군", exchanges: [] },
    {
      title: "평민",
      exchanges: [
        { from: "평민", cards: "가장 강한 카드 1장", to: "재상" },
        { from: "재상", cards: "원하는 카드 1장", to: "평민" },
      ],
    },
    {
      title: "천민",
      exchanges: [
        { from: "천민", cards: "가장 강한 카드 2장", to: "황제" },
        { from: "황제", cards: "원하는 카드 2장", to: "천민" },
      ],
    },
  ];
  return (
    <div className="five-tax-diagram" aria-label="5인 계급별 세금과 하사 교환">
      <ol className="five-tax-ranks" aria-label="순위별 세금과 하사">
        {ranks.map(({ title, exchanges }, index) => (
          <li className="five-tax-rank-entry" key={title}>
            <div className="five-tax-rank-heading">
              <span>{index + 1}등</span>
              <strong>{title}</strong>
            </div>
            {exchanges.length ? (
              <ul className="five-tax-exchanges">
                {exchanges.map(({ from, cards, to }) => (
                  <li className="five-tax-exchange" key={`${from}-${to}`}>
                    <span>{from}</span>
                    <span className="five-tax-arrow" aria-hidden="true">
                      →
                    </span>
                    <span>{to}</span>
                    <small>{cards}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="five-tax-none">교환하지 않아요</p>
            )}
          </li>
        ))}
      </ol>
      <p className="five-tax-note">모두 동시에 교환해요.</p>
    </div>
  );
}

export function FivePlayerReference() {
  const tax = fiveRule("tribute");
  const rank = fiveRule("rank5");
  return (
    <div className="five-reference">
      <div className="five-first">
        <span className="eyebrow">첫 라운드</span>
        <h3>11장씩 받고, 교환 없이 바로 시작</h3>
        <p>
          개를 제외한 55장을 똑같이 나눠요. 참새를 가진 사람이 첫 조합을 냅니다.
          처음에는 신분이 없으므로 세금도 없어요.
        </p>
      </div>
      <h3>두 번째 라운드부터 · 세금과 하사</h3>
      <p>{tax.summary}</p>
      <div className="tax-table-wrap">
        <table className="tax-table">
          <caption>5인 세금 교환표</caption>
          <thead>
            <tr>
              <th>세금을 내는 사람</th>
              <th>주고받는 카드</th>
              <th>받는 사람</th>
            </tr>
          </thead>
          <tbody>
            {fiveTax.map((t) => (
              <tr key={t.from}>
                <th scope="row">{t.from}</th>
                <td>
                  <div className="tax-flow-directions">
                    <span>
                      가장 강한 {t.count}장 <b aria-hidden="true">→</b>
                    </span>
                    <span>
                      <b aria-hidden="true">←</b> 원하는 {t.count}장
                    </span>
                  </div>
                </td>
                <td>{t.to}</td>
              </tr>
            ))}
            <tr>
              <th scope="row">장군 · 3등</th>
              <td>교환 없음</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <b>동시에 교환해요.</b> 받을 카드를 보기 전에 자신의 손패에서 보낼
        카드를 모두 고르세요. 하사 카드는 자유롭게 고르지만, 세금은 반드시 가장
        강한 카드예요.
      </p>
      <div className="tax-order">
        <span className="eyebrow">세금 선택 순서</span>
        <p>
          <b>용 → 봉황 → 참새 → A → K → Q → J → 10 → … → 2</b>
        </p>
        <p>
          왼쪽일수록 높아요. 실제 플레이에서 참새는 1이에요. 이 순서를 싱글의
          강함과 혼동하지 마세요.
        </p>
      </div>
      <h3>다음 판 자리 · 황제의 왼쪽으로</h3>
      <ol className="five-seats">
        {fiveSeats.map((seat, i) => (
          <li key={seat}>
            <span>{i + 1}등</span>
            <b>{seat}</b>
          </li>
        ))}
      </ol>
      <p>
        황제의 왼쪽이 재상, 그다음 장군·평민·천민 순서예요. 천민은 황제의
        오른쪽에 앉아요. <b>카드를 내는 차례는 오른쪽</b>으로 돌아갑니다.
      </p>
      <p>{rank.example}</p>
      <p className="muted">
        5인 표기는 여섯 자리 예시에서 상인을 생략했어요. 이름보다 순위가
        중요해요.
      </p>
      <h3>언제 끝나나요?</h3>
      <p>
        네 명이 손을 비우면 라운드가 끝나고 남은 한 명이 5등이에요. 새 순위로
        자리를 옮겨 다시 11장씩 받고, 세금을 교환하세요. 점수 목표나 정해진
        마지막 라운드는 없으니 충분히 즐긴 뒤 마쳐요.
      </p>
    </div>
  );
}
