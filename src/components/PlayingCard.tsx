"use client";
import { useState, useEffect } from "react";
import { Card } from "@/types";
import { cardImages } from "@/data/images";
import { PixelCharacter } from "./PixelCharacter";
export function PlayingCard({
  card,
  mini = false,
}: {
  card: Card;
  mini?: boolean;
}) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [card.id]);
  return (
    <div
      className={`playing-card suit-${card.suit} ${mini ? "mini" : ""} ${cardImages[card.id] && !broken ? "has-artwork" : ""}`}
    >
      {cardImages[card.id] && !broken ? (
        <img
          src={cardImages[card.id]}
          alt={card.name}
          width={224}
          height={384}
          decoding="async"
          onError={() => setBroken(true)}
        />
      ) : (
        <>
          <span className="card-corner">
            {card.character ? card.rank.slice(0, 1) : card.rank}
            <small>
              {card.suit ? ["", "◇", "✳", "▥", "✦"][card.suit] : "✧"}
            </small>
          </span>
          <div className="card-center">
            {card.character ? (
              <PixelCharacter kind={card.character} />
            ) : (
              <span>{["", "◇", "✳", "▥", "✦"][card.suit]}</span>
            )}
          </div>
          <div className="card-caption">
            {card.character ? card.rank : `SUIT 0${card.suit}`}
            <small>이미지 준비 중</small>
          </div>
          <span className="card-bottom">
            {card.character ? "✧" : card.rank}
          </span>
        </>
      )}
    </div>
  );
}
