import { ranks } from "./cards";
export const suits = [
  { id: 1, slug: "sword", name: "칼", en: "SWORD", color: "#111111" },
  { id: 2, slug: "crescent", name: "초승달", en: "CRESCENT", color: "#005838" },
  { id: 3, slug: "star", name: "별", en: "STAR", color: "#ff421c" },
  { id: 4, slug: "house", name: "집", en: "HOUSE", color: "#073f6b" },
];
export const cardImages: Record<string, string> = Object.fromEntries([
  ...suits.flatMap((s) =>
    ranks.map((rank) => [`s${s.id}-${rank}`, `/cards/${s.slug}/${rank}.png`]),
  ),
  ["sparrow", "/cards/special/mahjong.png"],
  ["dragon", "/cards/special/dragon.png"],
  ["dog", "/cards/special/dog.png"],
  ["phoenix", "/cards/special/phoenix.png"],
]);
export const characterImages: Record<string, string> = {};
