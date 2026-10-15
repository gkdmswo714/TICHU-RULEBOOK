"use client";
import { CardOverview } from "./CardOverview";
import { GuideCTA } from "./GuideCTA";
import { useState, useEffect, useRef } from "react";
import { suits } from "@/data/images";
import { cards, ranks } from "@/data/cards";
import { PlayerCount, GameMode } from "@/types";
import { PlayingCard } from "./PlayingCard";
import { Modal } from "./Modal";
import { rulesForGame } from "@/data/gameRules";
import { CardCarousel } from "./CardCarousel";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Button, Surface } from "./UI";
export function CardGallery({
  players,
  mode,
  close,
  onRules,
}: {
  players: PlayerCount;
  mode: GameMode;
  close: () => void;
  onRules: () => void;
}) {
  const [category, setCategory] = useState("all"),
    [suit, setSuit] = useState("all"),
    [rank, setRank] = useState("all"),
    [selected, setSelected] = useState<string | null>(null);
  const shown = cards.filter(
    (c) =>
      (category === "all" ||
        (category === "normal" ? c.suit !== 0 : c.suit === 0)) &&
      (suit === "all" || c.suit === Number(suit)) &&
      (rank === "all" || c.rank === rank),
  );
  const index = shown.findIndex((c) => c.id === selected),
    card = shown[index];
  const rule = card ? rulesForGame(players, mode).find((r) => r.id === card.rule) : null;
  const detailRef = useRef<HTMLDivElement>(null);
  const detailOpen = Boolean(card);
  useEffect(() => {
    if (detailOpen) detailRef.current?.closest(".modal")?.scrollTo({ top: 0 });
  }, [detailOpen]);
  const move = (dir: number) =>
    setSelected(shown[(index + dir + shown.length) % shown.length].id);
  return (
    <Modal
      title={card ? "카드 자세히 보기" : "카드 도감"}
      close={close}
      kind="gallery-overlay"
    >
      {card ? (
        <>
          <button className="back-button" onClick={() => setSelected(null)}>
            <ArrowLeft size={18} /> 카드 목록
          </button>
          <div className="card-detail" ref={detailRef}>
            <CardCarousel cards={shown} index={index} onMove={move} />
            <div className="card-information">
              <span className="eyebrow">
                {card.suit
                  ? `${suits[card.suit - 1].name} · ${suits[card.suit - 1].en}`
                  : card.rank}
              </span>
              <h3>{card.name}</h3>
              <p className="card-core">
                {players === 5 && card.id === "dog"
                  ? "5인 쟁상유에서는 사용하지 않아요."
                  : mode === "individual" && players !== 5 ? (rule?.summary ?? card.description) : (rule?.summary ?? card.description)}
              </p>
              <div className="detail-section">
                <h4>카드 사용 방법</h4>
                <p>
                  {mode === "individual" && players !== 5 ? (rule?.detail ?? card.description) : rule?.detail ??
                    (players === 5 && card.id === "dog"
                      ? "개를 제외하고 게임을 준비해요."
                      : "싱글로 내거나 같은 숫자·연속된 숫자를 모아 유효한 조합으로 내요. 같은 형태와 장수의 더 높은 조합이 이겨요.")}
                </p>
              </div>
              <div className="detail-section">
                <h4>주의할 점</h4>
                <p>
                  {mode === "individual" && players !== 5 ? card.description : rule?.caution ??
                    (players === 5 && card.id === "dog"
                      ? "개를 빼면 55장이에요. 다섯 명이 11장씩 나눠요."
                      : card.suit
                        ? "무늬 사이에는 우열이 없어요. 같은 무늬의 스트레이트는 폭탄이 될 수 있어요."
                        : "선택한 인원의 규칙을 확인해주세요.")}
                </p>
              </div>
              <a
                className="secondary-button"
                href={`#${rule?.section ?? "combinations"}`}
                onClick={close}
              >
                관련 규칙 보기 <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </>
      ) : (
        <>
          <CardOverview suit={suit} players={players} onSuit={next => {
            setCategory("normal");
            setSuit(next);
            setRank("all");
          }}/>
          <GuideCTA title="카드 구성을 알아봤어요!" description="이제 본격적으로 게임 규칙을 알아볼 차례예요." label="본격적인 규칙 알아보기" onClick={onRules}/>
          <h3 className="gallery-list-title">실제 카드 살펴보기</h3>
          <p className="muted">티츄의 모든 카드를 확인해보세요.</p>
          <div className="category-tabs" aria-label="카드 카테고리">
            {[
              ["all", "전체"],
              ["normal", "일반 카드"],
              ["special", "특수 카드"],
            ].map(([id, name]) => (
              <button
                key={id}
                aria-pressed={category === id}
                onClick={() => {
                  setCategory(id);
                  setSuit("all");
                  setRank("all");
                }}
              >
                {name}
              </button>
            ))}
          </div>
          {category !== "special" && <Surface className="gallery-filters">
            <label>
              무늬
              <select
                aria-label="무늬"
                value={suit}
                disabled={category === "special"}
                onChange={(e) => setSuit(e.target.value)}
              >
                <option value="all">모든 무늬</option>
                {[1, 2, 3, 4].map((s) => (
                  <option value={s} key={s}>
                    {suits[s - 1].name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              숫자
              <select
                aria-label="숫자"
                value={rank}
                disabled={category === "special"}
                onChange={(e) => setRank(e.target.value)}
              >
                <option value="all">모든 숫자</option>
                {ranks.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
          </Surface>}
          <div className="gallery-meta">
            <span>총 {shown.length}장</span>
            <span>카드 56장 · 뒷면 제외</span>
          </div>
          {shown.length ? (
            <div className="card-grid">
              {shown.map((c) => (
                <button
                  key={c.id}
                  className="card-item"
                  onClick={() => setSelected(c.id)}
                >
                  <PlayingCard card={c} />
                  <strong>{c.name}</strong>
                  <span>
                    {c.suit ? "일반 카드" : "특수 카드"}
                    {players === 5 && c.id === "dog" ? " · 5인 사용 제외" : ""}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="empty">
              <p>선택한 조건에 맞는 카드가 없어요.</p>
              <Button
                onClick={() => {
                  setSuit("all");
                  setRank("all");
                }}
              >
                필터 초기화
              </Button>
            </div>
          )}
          
        </>
      )}
    </Modal>
  );
}
