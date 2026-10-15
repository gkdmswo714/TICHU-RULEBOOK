export type Players = 4 | 5 | 6;
export type Character = "dragon" | "dog" | "phoenix" | "sparrow";
export interface Rule {
  id: string;
  title: string;
  en: string;
  summary: string;
  detail: string;
  example: string;
  caution: string;
  players: Players[];
  aliases: string[];
  section: string;
}
export interface Card {
  id: string;
  name: string;
  rank: string;
  suit: number;
  character?: Character;
  description: string;
  rule: string;
}

export type PlayerCount = 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GameMode = "team" | "individual";
export type GameSelection = { playerCount: PlayerCount; mode: GameMode };
