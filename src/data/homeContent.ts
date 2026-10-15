import { GameSelection } from "@/types";
import { rankNames } from "@/data/gameSelection";
export function getHomeContent({playerCount, mode}: GameSelection) {
  const individual = mode === "individual";
  const twoDecks = individual && playerCount >= 7;
  const ranks = individual ? rankNames[playerCount as keyof typeof rankNames] : [];
  return {
    playerCount, individual, twoDecks, ranks,
    eyebrow: individual ? "ABOUT ZHENG SHANGYOU" : "ABOUT TICHU",
    title: individual ? "쟁상유는 어떤 게임일까요?" : playerCount === 6 ? "6인 티츄는 어떤 게임일까요?" : "티츄는 어떤 게임일까요?",
    description: individual ? [
      `쟁상유는 티츄 카드를 활용해 ${playerCount}명이 각자 경쟁하는 개인전 게임입니다.`,
      "팀 없이 카드를 모두 낸 순서로 개인 순위와 계급이 정해지며, 다음 라운드에도 계급이 영향을 줍니다.",
      twoDecks ? "7명 이상은 카드 2세트 준비를 권장합니다. 실제 사용 카드와 세부 규칙은 규칙 메뉴에서 확인하세요." : "팀 점수 대신 개인의 순위와 계급을 중심으로 진행합니다.",
    ] : playerCount === 4 ? [
      "티츄는 4인이 두 명씩 두 팀을 이뤄서 대결하는 카드게임입니다.",
      "여러 라운드를 진행하며 1000점에 먼저 도달하는 팀이 승리합니다. 동시에 도달하면 더 높은 점수의 팀이 이깁니다.",
      "한 세트는 일반 카드 52장과 특수 카드 4장, 총 56장으로 구성됩니다.",
    ] : [
      "6인 티츄는 세 명씩 두 팀을 이뤄서 대결하는 팀 카드게임입니다.",
      "게임은 여러 번의 라운드를 통해 진행되며, 1000점을 먼저 획득하는 팀이 승리합니다.",
      "한 세트는 일반 카드 52장과 특수 카드 4장, 총 56장으로 구성됩니다.",
    ],
    playerTitle: individual ? "플레이 인원 및 게임 방식" : "플레이 인원 및 팀 구성",
    playerLabel: individual ? "FREE FOR ALL" : `${playerCount / 2} VS ${playerCount / 2}`,
    victoryTitle: individual ? "순위 및 계급" : "승리 조건",
    victoryNumber: !individual ? "1000" : "TEAM",
    victoryLabel: !individual ? "POINTS" : "VICTORY",
    rankNote: playerCount === 5 ? "기존 5인 계급 · 순위가 계급의 기준이에요." : "수업용 예시 명칭 · 공식 계급명이 아니에요.",
    cardTitle: twoDecks ? "카드 준비" : "카드 구성",
    cardLabel: twoDecks ? "2 DECKS" : individual ? "CARD DECK" : "56 CARDS",
    cardNote: twoDecks ? "카드 2세트 사용 권장 · 준비 기준 112장. 실제 사용량과 중복 특수 카드 처리는 공식 설명서 확인 필요." : individual ? playerCount === 5 ? "기본 한 세트는 56장. 5인은 개를 뺀 55장을 사용해요. 분배는 규칙 메뉴에서 확인하세요." : "기본 한 세트는 56장. 6인 개인전의 실제 사용 카드와 분배량은 공식 설명서 확인 필요." : "일반 카드 52장 + 특수 카드 4장",
  };
}
