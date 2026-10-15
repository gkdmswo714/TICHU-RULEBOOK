"use client";
import { useState, useRef, useEffect } from "react";
import { Character, PlayerCount, GameMode } from "@/types";
import { PixelCharacter } from "./PixelCharacter";
import { Modal } from "./Modal";
import { Send } from "lucide-react";
const names: Record<Character, string> = {
  dragon: "용",
  dog: "개",
  phoenix: "봉황",
  sparrow: "참새",
};
export function NPCWorld({
  onSelect,
  paused,
}: {
  onSelect: (c: Character) => void;
  paused: boolean;
}) {
  return (
    <div className={`npc-world ${paused ? "paused" : ""}`}>
      <div className="npc-label">
        <span className="status-dot" /> 작은 친구에게 물어보세요
      </div>
      <div className="npc-track">
        {(Object.keys(names) as Character[]).map((c, i) => (
          <button
            key={c}
            className={`npc npc-${i}`}
            aria-label={`${names[c]}에게 질문하기`}
            onClick={() => onSelect(c)}
          >
            <PixelCharacter kind={c} />
            <span>{names[c]}</span>
          </button>
        ))}
      </div>
      <span className="npc-hint">규칙이 궁금해? 클릭!</span>
    </div>
  );
}
export function NPCChat({
  character,
  players,
  mode,
  close,
}: {
  character: Character;
  players: PlayerCount;
  mode: GameMode;
  close: () => void;
}) {
  const [q, setQ] = useState(""),
    [busy, setBusy] = useState(false),
    [messages, setMessages] = useState<
      {
        q: string;
        answer: string;
        rule?: { id: string; title: string; section: string };
      }[]
    >([]);
  const messageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messageRef.current?.scrollTo({ top: messageRef.current.scrollHeight });
  }, [messages, busy]);
  async function ask(question: string) {
    if (!question.trim() || busy) return;
    setQ("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          players,
          gameMode: mode,
          previousRuleId: messages.at(-1)?.rule?.id,
        }),
      });
      if (!res.ok) throw Error();
      const data = await res.json();
      setMessages((m) => [...m, { q: question, ...data }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          q: question,
          answer:
            "잠시 연결되지 않았어요. 상단 검색에서 같은 용어를 찾아주세요.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }
  const suggestions =
    mode === "individual" && players !== 5 ? ["카드 분배는 어떻게 해?", "계급은 어떻게 정해?", "카드 교환은 어떻게 해?", "용은 어떻게 써?"] : players === 5
      ? [
          "5인은 몇 장씩 받아?",
          "세금은 몇 장씩 보내?",
          "세금 카드 순서는?",
          "자리는 어떻게 앉아?",
          "언제 라운드가 끝나?",
        ]
      : [
          "카드가 강한 순서를 알려줘",
          "라운드와 트릭은 어떻게 달라?",
          "한 바퀴 돌면 다 가져가?",
          "폭탄은 언제 낼 수 있어?",
        ];
  return (
    <Modal
      title={`${names[character]}의 규칙 안내`}
      close={close}
      kind="chat-overlay"
    >
      <div className="chat-intro">
        <PixelCharacter kind={character} />
        <div>
          <span className="tag">규칙 검색 모드 · {players}인 {mode === "individual" ? "개인전" : "팀전"}</span>
          <h3>무엇을 도와줄까요?</h3>
          <p>준비된 규칙에서 답을 찾아드려요.</p>
        </div>
      </div>
      <div className="chat-messages" ref={messageRef} aria-live="polite">
        {messages.map((m, i) => (
          <div key={i}>
            <p className="user-message">{m.q}</p>
            <div className="answer">
              {m.answer}
              {m.rule && (
                <a href={`#${m.rule.section}`} onClick={close}>
                  {m.rule.title} 자세히 보기 ↗
                </a>
              )}
            </div>
          </div>
        ))}
        {busy && <p>규칙을 찾고 있어요…</p>}
      </div>
      <div className="suggestions">
        {suggestions.map((s) => (
          <button key={s} onClick={() => ask(s)} disabled={busy}>
            {s} ↗
          </button>
        ))}
      </div>
      <form
        className="chat-form"
        onSubmit={(e) => {
          e.preventDefault();
          ask(q);
        }}
      >
        <input
          aria-label="규칙 질문"
          placeholder="궁금한 규칙을 물어보세요"
          value={q}
          maxLength={500}
          onChange={(e) => setQ(e.target.value)}
        />
        <button aria-label="질문 보내기" disabled={busy || !q.trim()}>
          <Send size={18} />
        </button>
      </form>
      <small className="muted">
        {players === 5
          ? "한국어 설명서의 5인 규칙을 바탕으로 답해요. 생성형 AI가 아닌 규칙 검색입니다."
          : "생성형 AI가 아닌 규칙 검색입니다."}
      </small>
    </Modal>
  );
}
