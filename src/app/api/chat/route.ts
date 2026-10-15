import { NextResponse } from "next/server";
import { rulesFor } from "@/data/rules";
import { searchGameRules } from "@/lib/gameSearch";
import { rulesForGame } from "@/data/gameRules";
import { isGameSelection, legacySelection } from "@/data/gameSelection";
export async function POST(request: Request) {
  try {
    const { question, players, previousRuleId, gameMode } = await request.json();
    const selection = gameMode === undefined ? legacySelection(players) : {playerCount: players, mode: gameMode};
    if (
      typeof question !== "string" ||
      question.length > 500 ||
      !question.trim() ||
      !isGameSelection(selection)
    )
      return NextResponse.json(
        { error: "질문과 인원을 확인해주세요." },
        { status: 400 },
      );
    if (!isGameSelection(selection)) return NextResponse.json({error:"인원과 방식을 확인해주세요."}, {status:400});
    const found = searchGameRules(question, selection.playerCount, selection.mode)[0];
    const followup = /^(그럼|그러면|그건|그것|다시|예시|예를|왜|어떻게)/.test(
      question.trim(),
    );
    const r =
      found ||
      (followup && typeof previousRuleId === "string"
        ? rulesForGame(selection.playerCount, selection.mode).find((rule) => rule.id === previousRuleId)
        : undefined);
    if (selection.mode === "individual" && players !== 5) {
      return NextResponse.json({mode:"규칙 검색 모드", answer:r ? `${r.summary}\n${r.detail}\n${r.caution}` : "개인전은 손을 비운 순서로 순위를 정하고, 계급에 따라 다음 라운드를 이어가요. 계급·카드 분배·교환·특수 카드 중 궁금한 내용을 적어주세요.", rule:r ? {id:r.id,title:r.title,section:r.section} : null});
    }
    const difference = /라운드/.test(question) && /트릭/.test(question);
    const dragonFocus = players === 4 && r?.id === "dragon"
      ? /마지막|끝내|나갔|나가면/.test(question)
        ? "용이 마지막 카드라 이미 나갔다면 다음 트릭을 직접 시작하지 못해요. 용이 이기고 라운드가 계속되면 오른쪽의 패가 남은 첫 사람이 선을 받아요."
        : /이전|모아|전부|모든/.test(question)
          ? "이전에 모아둔 카드는 주지 않아요. 용으로 이긴 해당 트릭만 상대 한 명에게 넘겨요."
          : /25|점수|몇점/.test(question)
            ? "용으로 트릭을 이겨 상대에게 넘겼다면 용의 25점도 상대 팀으로 가요. K·A·용이면 10 + 0 + 25 = 35점이에요."
            : undefined
      : undefined;
    const answer = dragonFocus ? `${dragonFocus}\n${r!.detail}\n${r!.caution}` : difference
      ? players === 5
        ? "5인에서 라운드는 11장씩 받아 한 사람만 패가 남을 때까지의 한 판이에요. 그 안에서 여러 트릭을 진행해요. 트릭은 마지막 조합을 나머지 사람들이 모두 패스하면 끝나요. 이긴 사람은 다음 조합을 시작하지만, 손을 먼저 비운 순위와는 별개예요.\n탁자에 낸 카드는 치우고 손패에 다시 넣지 않아요. 점수를 계산하지 않으므로 개인별 획득 더미를 만들 필요도 없어요. 첫 판에는 교환 없이, 둘째 판부터는 분배 후 세금과 하사를 동시에 교환해요."
        : "라운드는 카드를 새로 받아 결과를 정산할 때까지의 한 판이고, 트릭은 그 안에서 탁자 위 카드를 누가 가져갈지 정하는 작은 승부예요. 한 라운드에 여러 트릭이 있어요.\n트릭을 이기면 탁자 위 카드 전부를 획득 더미에 따로 두어요. 손패에 다시 넣지 않아요. 트릭을 이기는 것과 손을 먼저 비워 라운드 1등이 되는 것은 달라요.\n예: 카드 받기 → 교환 → 트릭 1 → 트릭 2 → … → 라운드 종료."
      : players === 5 && r?.id !== "dragon" && /점수|몇점/.test(question)
        ? "5인 쟁상유(그랑 세뇨르)에서는 카드 점수와 티츄 선언을 사용하지 않아요. 손을 비운 순서로 다음 판의 순위를 정해요."
        : r
          ? `${r.summary}\n${r.detail}\n예시: ${r.example}\n${r.caution}`
          : "이 질문에 맞는 준비된 설명을 찾지 못했어요. ‘카드 순서’, ‘트릭을 가져간다’, ‘폭탄’, ‘봉황’처럼 궁금한 대상을 함께 적어주세요. 자유로운 AI 대화는 아직 연결되지 않았어요.";
    return NextResponse.json({
      mode: "규칙 검색 모드",
      answer,
      rule: r ? { id: r.id, title: r.title, section: r.section } : null,
    });
  } catch {
    return NextResponse.json(
      { error: "올바른 질문을 입력해주세요." },
      { status: 400 },
    );
  }
}
