"use client";
import { useRef } from "react";
import { Card } from "@/types";
import { PlayingCard } from "./PlayingCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
export function CardCarousel({
  cards,
  index,
  onMove,
}: {
  cards: Card[];
  index: number;
  onMove: (direction: number) => void;
}) {
  const touch = useRef<{ x: number; y: number } | null>(null);
  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="캐러셀"
      aria-label="카드 이미지"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          onMove(-1);
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          onMove(1);
        }
      }}
    >
      <div
        className="carousel-window"
        onTouchStart={(e) => {
          touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }}
        onTouchEnd={(e) => {
          if (!touch.current) return;
          const dx = e.changedTouches[0].clientX - touch.current.x,
            dy = e.changedTouches[0].clientY - touch.current.y;
          if (
            Math.abs(dx) > 45 &&
            Math.abs(dx) > Math.abs(dy) &&
            cards.length > 1
          )
            onMove(dx < 0 ? 1 : -1);
          touch.current = null;
        }}
        onTouchCancel={() => {
          touch.current = null;
        }}
      >
        {cards.length > 1 && (
          <button
            className="peek peek-left"
            tabIndex={-1}
            aria-label="이전 카드 미리보기"
            onClick={() => onMove(-1)}
          >
            <PlayingCard
              card={cards[(index - 1 + cards.length) % cards.length]}
            />
          </button>
        )}
        <div
          key={cards[index].id}
          className="current-card"
          aria-label={`${cards[index].name} 카드 이미지`}
        >
          <PlayingCard card={cards[index]} />
        </div>
        {cards.length > 1 && (
          <button
            className="peek peek-right"
            tabIndex={-1}
            aria-label="다음 카드 미리보기"
            onClick={() => onMove(1)}
          >
            <PlayingCard card={cards[(index + 1) % cards.length]} />
          </button>
        )}
      </div>
      <div className="carousel-controls">
        <button
          aria-label="이전 카드"
          disabled={cards.length < 2}
          onClick={() => onMove(-1)}
        >
          <ChevronLeft size={22} />
        </button>
        <span aria-live="polite">
          {String(index + 1).padStart(2, "0")} <span>/ {cards.length}</span>
        </span>
        <button
          aria-label="다음 카드"
          disabled={cards.length < 2}
          onClick={() => onMove(1)}
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}
