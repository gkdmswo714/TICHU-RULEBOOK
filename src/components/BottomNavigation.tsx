"use client";
import { Home, BookOpen, Layers, Search, MessageCircle } from "lucide-react";
export function BottomNavigation({
  panel,
  open,
  view,
  navigate,
}: {
  panel: string | null;
  open: (panel: string | null) => void;
  view: "home" | "rules";
  navigate: (view: "home" | "rules") => void;
}) {
  const active =
    panel === "gallery"
      ? "cards"
      : panel === "search"
        ? "search"
        : panel === "chat"
          ? "ask"
          : panel === "quick" || view === "rules"
            ? "rules"
            : "home";
  return (
    <nav className="bottom-navigation" aria-label="하단 메뉴">
      {([
        { id: "home", name: "홈", Icon: Home },
        { id: "cards", name: "카드", Icon: Layers, panel: "gallery" },
        { id: "rules", name: "규칙", Icon: BookOpen },
        { id: "search", name: "검색", Icon: Search, panel: "search" },
        { id: "ask", name: "질문", Icon: MessageCircle, panel: "chat" },
      ] as const).map((item) => {
        const { id, name, Icon } = item;
        const target = "panel" in item ? item.panel : null;
        return id === "home" || id === "rules" ? (
          <button
            key={id}
            aria-current={active === id ? "page" : undefined}
            onClick={() => {
              open(null);
              navigate(id);
            }}
          >
            <Icon size={22} />
            <span>{name}</span>
          </button>
        ) : (
          <button
            key={id}
            aria-current={active === id ? "page" : undefined}
            onClick={() => open(target!)}
          >
            <Icon size={22} />
            <span>{name}</span>
          </button>
        );
      })}
    </nav>
  );
}
