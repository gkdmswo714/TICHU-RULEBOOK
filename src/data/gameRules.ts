import { GameMode, PlayerCount, Players, Rule } from "@/types";
import { rulesFor } from "@/data/rules";
import { rankNames } from "@/data/gameSelection";
export function rulesForGame(p: PlayerCount, mode: GameMode): Rule[] {
  if (mode === "team" || p === 5) return rulesFor(p as Players);
  const make = (id: string, title: string, summary: string, detail: string, section = "basic", aliases: string[] = []): Rule => ({id, title, en: "ZHENG SHANGYOU", summary, detail, section, aliases, players: [], example: "손을 비운 순서대로 순위를 기록하고 다음 라운드를 시작해요.", caution: "팀 점수 대신 개인 순위를 기록해요."});
  return [
    make("individual", `${p}인 쟁상유 개인전`, "각자 손을 비운 순서로 순위를 정해요.", "팀 점수와 티츄 선언을 개인전 규칙으로 적용하지 않아요. 순위가 다음 라운드의 계급 기준이 됩니다.", "basic", ["개인전", "점수", "선언", "원투", "트리플 승리", "스몰", "라지"]),
    make("deal-individual", "카드 준비와 분배", p >= 7 ? "7인 이상은 카드 두 세트를 준비해요." : "6명이 각자 손패를 받아 개인전을 시작해요.", p >= 7 ? "한 세트는 56장, 두 세트는 112장이에요. 참가 인원에 맞춰 카드를 나누고 손패를 받은 뒤 시작해요." : "카드를 나눠 받은 뒤 각자 손패로 개인전을 진행해요. 5인 분배와는 카드 수가 달라요.", "basic", ["몇 장", "분배", "세트", "112", "준비", "중복"]),
    make("rank-individual", "순위와 계급", `1위는 황제, ${p}위는 천민으로 표시해요.`, `이 화면의 계급: ${rankNames[p as keyof typeof rankNames].join(" → ")}. 순위 이해를 위한 수업용 예시 명칭이며 공식 명칭이나 고유 능력을 뜻하지 않아요.`, "scoring", ["순위", "계급", "황제", "천민", "재상", "귀족", "이름", "자리"]),
    make("exchange-individual", "계급에 따른 카드 교환", "이전 라운드 순위가 다음 라운드의 계급을 정해요.", "상위 계급과 하위 계급이 순위에 따라 카드를 주고받아요. 카드를 교환한 뒤 손패를 정리하고 다음 라운드를 시작해요.", "scoring", ["세금", "상납", "하사", "교환", "첫 판", "첫 라운드"]),
    make("round-individual", "라운드와 트릭", "한 라운드 안에서 여러 번의 카드 대결을 진행해요.", "같은 조합의 더 높은 카드를 내거나 패스해요. 마지막 제출자 외에 아직 손패가 있는 모두가 연속으로 패스하면 트릭이 끝나요. 한 사람만 손패가 남으면 라운드를 마치고, 손을 비운 순서로 순위를 정해요.", "basic", ["라운드", "트릭", "패스", "끝", "시작", "방향", "선"]),
    make("combinations-individual", "개인전 카드 조합", "싱글·페어 등 조합의 모양을 살펴보세요.", "같은 숫자나 연속된 숫자로 조합을 만들어요. 앞서 나온 조합과 같은 종류·같은 장수로 더 높은 조합을 내면 이길 수 있어요.", "combinations", ["조합", "폭탄", "포카드", "스트레이트", "강한", "카드 순서"]),
    ...[["dragon", "용"], ["dog", "개"], ["phoenix", "봉황"], ["wish", "참새"]].map(([id, name]) => make(id, `${name} · 개인전 안내`, `${name} 카드의 기본 성격을 살펴봐요.`, "카드 도감에서 기본 효과를 확인하고, 선택한 인원과 게임 방식에 맞춰 사용해요.", "special", [name, id, ...(id === "wish" ? ["소원", "sparrow"] : [])])),
  ];
}
