"use client";
import { HomeIntroduction } from "./HomeIntroduction";
import { TrickRound } from "./RuleExperiences";
import { useState, useEffect, useCallback } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  Menu,
  BookOpen,
  X,
  ChevronDown,
} from "lucide-react";
import { Players, Character, GameSelection } from "@/types";
import { cards } from "@/data/cards";
import { rulesForGame } from "@/data/gameRules";
import { DEFAULT_GAME, modeLabel, restoreSelection, isGameSelection } from "@/data/gameSelection";
import { GameSelector } from "./GameSelector";
import { IndividualSteps, IndividualCombinations, RankSystem } from "./IndividualGuide";
import { searchGameRules } from "@/lib/gameSearch";
import { PlayingCard } from "./PlayingCard";
import { Modal } from "./Modal";
import { CardGallery } from "./CardGallery";
import { NPCWorld, NPCChat } from "./NPC";
import { RuleList, RuleDetail, Combinations, EssentialTerms } from "./Rules";
import { CardOverview } from "./CardOverview";
import { SectionHeading as Heading, SearchInput } from "./UI";
import { BottomNavigation } from "./BottomNavigation";
import {
  GuideTabs,
  StepProgress,
  ScoreCards,
} from "./Learning";
const chapters = [
  ["intro", "GAME INTRO", "게임 소개"],
  ["basic", "BASIC RULES", "기본 규칙"],
  ["combinations", "COMBINATIONS", "카드 조합"],
  ["special", "SPECIAL CARDS", "특수 카드"],
  ["collection", "CARD COLLECTION", "카드 도감"],
  ["scoring", "SCORING", "점수 계산 규칙"],
  ["glossary", "GLOSSARY", "용어집"],
];
export default function GuideApp() {
  const [selection, setSelection] = useState<GameSelection>(DEFAULT_GAME),
    [loaded, setLoaded] = useState(false),
    [compact, setCompact] = useState(false),
    [panel, setPanel] = useState<string | null>(null),
    [view, setView] = useState<"home" | "rules">("home"),
    [character, setCharacter] = useState<Character>("dog"),
    [query, setQuery] = useState(""),
    [glossary, setGlossary] = useState("");
  const [activeTab, setActiveTab] = useState(1);
  const [learningVisit, setLearningVisit] = useState(0);
  const [overviewSuit, setOverviewSuit] = useState("all");
  const { playerCount: players, mode } = selection;
  const individual = mode === "individual";
  const expandedIndividual = individual && players !== 5;
  const legacyPlayers = players as Players;
  const individualPlayers = (players === 4 ? 5 : players);
  const close = useCallback(() => setPanel(null), []);
  useEffect(() => {
    try {
      const restored = restoreSelection(localStorage.getItem("tichu-game-selection"), localStorage.getItem("tichu-players"));
      if (restored) setSelection(restored);
      if (!restored || localStorage.getItem("tichu-selection-complete") !== "true") setPanel("selection");
    } catch { setPanel("selection"); }
    setLoaded(true);
    const onScroll = () => setCompact(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (loaded)
      try {
        localStorage.setItem("tichu-game-selection", JSON.stringify(selection));
      } catch {}
  }, [selection, loaded]);
  useEffect(() => {
    const destinations: Record<string, number> = {
      intro: 1,
      learn: 0,
      basic: 0,
      scoring: 0,
      glossary: 1,
      combinations: 2,
      special: 3,
      collection: 3,
    };
    const navigate = () => {
      const id = window.location.hash.slice(1);
      if (id === "home" || !id) {
        setView("home");
        return;
      }
      const tab = destinations[id];
      if (tab === undefined) return;
      setView("rules");
      setActiveTab(tab);
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          document.getElementById(id === "basic" ? "learn" : id)?.scrollIntoView({ block: "start" }),
        ),
      );
    };
    const click = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      const id = anchor?.getAttribute("href")?.slice(1);
      if (id && destinations[id] !== undefined) {
        event.preventDefault();
        history.pushState(null, "", `#${id}`);
        navigate();
      }
    };
    navigate();
    window.addEventListener("hashchange", navigate);
    document.addEventListener("click", click);
    return () => {
      window.removeEventListener("hashchange", navigate);
      document.removeEventListener("click", click);
    };
  }, []);
  const select = (next: GameSelection) => {
    if (!isGameSelection(next)) return;
    setSelection(next);
    try {
      localStorage.setItem("tichu-game-selection", JSON.stringify(next));
      localStorage.setItem("tichu-selection-complete", "true");
    } catch {}
    setQuery(""); setGlossary(""); setActiveTab(1); setPanel(null);
    navigateView("home");
  };
  const navigateView = (next: "home" | "rules") => {
    setPanel(null);
    setView(next);
    const hash = next === "home" ? "#home" : "#glossary";
    history.pushState(null, "", hash);
    if (next === "rules") { setActiveTab(1); setLearningVisit(n => n + 1); }
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
  };
  const playerButtons = <button className="mode-change" onClick={() => setPanel("selection")}>인원 · 방식 변경</button>;
  const label = individual ? "쟁상유 개인전" : "티츄 팀전";
  return (
    <>
      <header className={compact ? "compact" : ""}>
        <div className="header-main">
          <a href="#home" className="wordmark" aria-label="티츄 홈">
            tichu<span>®</span>
          </a>
          <nav className="desktop-nav">
            <button onClick={() => setPanel("gallery")}>
              카드 <ArrowUpRight size={13} />
            </button>
            <button onClick={() => navigateView("rules")}>규칙</button>
          </nav>
          <div className="header-actions">
            <button className="compact-players" aria-label="인원과 게임 방식 변경" onClick={() => setPanel("selection")}>{players}인 <ChevronDown size={14}/></button>
            <button
              className="icon"
              aria-label="규칙 검색"
              onClick={() => setPanel("search")}
            >
              <Search size={21} />
            </button>
            <button
              className="icon"
              aria-label="전체 메뉴"
              onClick={() => setPanel("menu")}
            >
              <Menu size={23} />
            </button>
          </div>
        </div>
        <div className="mode-indicator"><span>{modeLabel(selection)}</span><button onClick={() => setPanel("selection")}>변경</button></div>
      </header>
      <main id="home">
        {view === "home" ? <HomeIntroduction selection={selection} onCards={() => setPanel("gallery")} /> : <>
        <div id="rules-view" className="rules-view">

        <div id="learning" className="learning-hub">
          <GuideTabs active={activeTab} select={setActiveTab} />
          <div
            id="guide-panel-0"
            role="tabpanel"
            aria-labelledby="guide-tab-0"
            hidden={activeTab !== 0}
            tabIndex={0}
          >
            <section id="learn" className="section learn">
              <Heading en="04" title="기본 순서"/>
              {expandedIndividual ? <IndividualSteps key={`${players}-${learningVisit}`} players={individualPlayers}/> : <StepProgress key={`${players}-${learningVisit}`} players={legacyPlayers} />}
            </section>
            <section id="scoring" className="section">
              <Heading
                en={individual ? "RANKING" : "SCORING"}
                title={
                  individual
                    ? "순위와 계급"
                    : "점수 계산"
                }
                description={
                  individual
                    ? "개인전에서는 손을 비운 순위를 기록해요."
                    : "획득 카드와 선언 점수를 합산해요."
                }
              />
              {individual ? (
                <RankSystem players={individualPlayers}/>
              ) : (
                <>
                  <ScoreCards />
                  <div className="rank-graphic">
                    <span>
                      1등 <b>우리 팀</b>
                    </span>
                    <ArrowRight />
                    <span>
                      2등 <b>우리 팀</b>
                    </span>
                    {players === 6 && (
                      <>
                        <ArrowRight />
                        <span>
                          3등 <b>우리 팀</b>
                        </span>
                      </>
                    )}
                    <strong>+{players === 4 ? "200" : "300"}</strong>
                  </div>
                  <RuleList players={legacyPlayers} section="scoring" />
                  <div className="notice">
                    {players === 4
                      ? "일반 라운드에서는 마지막 사람의 남은 패는 상대 팀에게, 얻은 트릭은 1등에게 넘겨요. 원투 때는 카드 점수 대신 200점을 적용해요. 1,000점에 먼저 도달하는 팀이 승리하며, 동시에 도달하면 더 높은 팀이 이겨요."
                      : "6인에서는 마지막 사람의 남은 패와 트릭을 상대 팀에, 5등의 트릭은 1등에게 넘겨요."}
                  </div>
                </>
              )}
            </section>
            <NextLearningButton label="필수 용어" onClick={() => setActiveTab(1)} />
          </div>
          <div
            id="guide-panel-1"
            role="tabpanel"
            aria-labelledby="guide-tab-1"
            hidden={activeTab !== 1}
            tabIndex={0}
          >
            <section id="glossary" className="section">
              <Heading en="01" title="필수 용어"/>
              <SearchInput
                value={glossary}
                onChange={setGlossary}
                label="용어 검색"
                placeholder={individual ? "용어를 입력하세요. 예: 계급, 교환" : "용어를 입력하세요. 예: 원투, 폭탄"}
              />
              <EssentialTerms players={players} mode={mode} query={glossary}/>
            </section>
            <NextLearningButton label="카드 설명" onClick={() => setActiveTab(3)} />
          </div>
          <div
            id="guide-panel-2"
            role="tabpanel"
            aria-labelledby="guide-tab-2"
            hidden={activeTab !== 2}
            tabIndex={0}
          >
            <section id="combinations" className="section">
              <Heading en="03" title="조합"/>
              {expandedIndividual ? <IndividualCombinations players={individualPlayers}/> : <Combinations players={players} />}
            </section>
            <NextLearningButton label="기본 순서" onClick={() => setActiveTab(0)} />
          </div>
          <div
            id="guide-panel-3"
            role="tabpanel"
            aria-labelledby="guide-tab-3"
            hidden={activeTab !== 3}
            tabIndex={0}
          >
            <section id="special" className="section card-learning-section">
              <Heading en="02" title="카드 설명"/>
              <CardOverview suit={overviewSuit} onSuit={setOverviewSuit} players={players} learning/>
              <div className="special-function-list">
                {["sparrow", "dragon", "dog", "phoenix"].map((id) => {
                  const card = cards.find((item) => item.id === id)!;
                  const rule = rulesForGame(players, mode).find((item) => item.id === card.rule);
                  const summary = id === "dog" && players === 5 ? "5인 개인전에서는 사용하지 않아요." : rule?.summary ?? card.description;
                  return <article key={id}><strong>{id === "sparrow" ? "참새" : card.name}</strong><span>{summary}</span>{rule && <details><summary>자세히 보기</summary><p>{rule.detail}</p><p><b>예시</b> {rule.example}</p><p className="muted">{rule.caution}</p></details>}</article>;
                })}
              </div>
              <button className="secondary-button card-catalog-link" onClick={() => setPanel("gallery")}>전체 카드 도감 열기 <ArrowUpRight size={18}/></button>
            </section>
            <NextLearningButton label="조합" onClick={() => setActiveTab(2)} />
          </div>
        </div>
        <footer>
          <a className="wordmark" href="#home">
            tichu®
          </a>

          <div>
            <span>비공식 디지털 가이드 · 제공된 카드 이미지 사용</span>
            <a
              href="https://fatamorgana.ch/fatamorgana/tichu/english-rules"
              target="_blank"
              rel="noreferrer"
            >
              공개 영문 규칙 출처 ↗
            </a>
            <span>
              {players === 5
                ? "5인 안내 출처: 제공된 한국어 설명서 ‘쟁상유’ 16–18쪽"
                : expandedIndividual ? "6~12인 개인전 안내 · 순위와 계급 중심" : "4·6인 팀전 안내"}
            </span>
          </div>
        </footer>
        </div>
        </>}
      </main>
      {view === "rules" && <button className="floating-quick" onClick={() => setPanel("quick")}>
        <BookOpen size={17} /> 빠른 규칙
      </button>}
      <NPCWorld
        paused={panel !== null}
        onSelect={(c) => {
          setCharacter(c);
          setPanel("chat");
        }}
      />
      <BottomNavigation panel={panel} open={setPanel} view={view} navigate={navigateView} />
      {panel === "selection" && <GameSelector value={selection} select={select} close={close}/>}
      {panel === "menu" && (
        <Modal title="어디부터 볼까요?" close={close} kind="menu-overlay">
          <div className="menu-links">
            {chapters.map(([id, en, title], i) => (
              <a key={id} href={`#${id}`} onClick={close}>
                <span>0{i + 1}</span>
                <div>
                  <strong>
                    {individual && id === "scoring"
                      ? "순위와 다음 판 계급"
                      : title}
                  </strong>
                  <small>{en}</small>
                </div>
                <ArrowUpRight />
              </a>
            ))}
          </div>
          <div className="menu-bottom">
            <button onClick={() => setPanel("quick")}>빠른 규칙 ↗</button>
            <button onClick={() => setPanel("chat")}>
              작은 친구에게 질문 ↗
            </button>
          </div>
          <div className="menu-players">
            <span>플레이 인원</span>
            {playerButtons}
          </div>
        </Modal>
      )}
      {panel === "gallery" && <CardGallery players={players} mode={mode} close={close} onRules={() => navigateView("rules")} />}
      {(panel === "search" || panel === "quick") && (
        <Modal
          title={panel === "quick" ? "QUICK GUIDE" : "규칙 검색"}
          close={close}
          kind="quick-overlay"
        >
          <p className="muted">
            {players}인 · {label}에 맞는 안내
          </p>
          <SearchInput
            value={query}
            onChange={setQuery}
            label="통합 규칙 검색"
            placeholder="원투, 봉황, 폭탄…"
            autoFocus={panel === "search"}
          />
          {panel === "quick" && !query && (
            <>
              <div className="quick-tabs">
                <button onClick={() => setQuery("폭탄")}>폭탄</button>
                <button onClick={() => setQuery("소원")}>소원</button>
                <button onClick={() => setPanel("gallery")}>카드 도감 ↗</button>
              </div>
              <details className="quick-combos">
                <summary>카드 조합표 펼치기</summary>
                {expandedIndividual ? <IndividualCombinations players={individualPlayers}/> : <Combinations players={legacyPlayers} />}
              </details>
            </>
          )}
          <div className="search-results">
            {searchGameRules(query, players, mode).map((r) => (
              <RuleDetail key={r.id} rule={r} onNavigate={close} />
            ))}
            {!searchGameRules(query, players, mode).length && (
              <p className="empty">
                찾는 규칙이 없어요. 짧은 용어로 다시 검색해보세요.
                <br />
                현재 선택한 {players}인 규칙만 검색합니다.
              </p>
            )}
          </div>
        </Modal>
      )}
      {panel === "chat" && (
        <NPCChat
          key={`${players}-${mode}`}
          mode={mode}
          character={character}
          players={players}
          close={close}
        />
      )}
    </>
  );
}

function NextLearningButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <div className="next-learning-wrap"><button className="next-learning" onClick={onClick}>다음 학습: {label} <ArrowRight size={18}/></button></div>;
}
