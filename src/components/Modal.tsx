"use client";
import { ReactNode, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
export function Modal({
  title,
  close,
  children,
  kind = "",
}: {
  title: string;
  close: () => void;
  children: ReactNode;
  kind?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const candidates = ref.current?.querySelectorAll<HTMLElement>(
          'button, a[href], input, select, textarea, summary, [tabindex="0"]',
        );
        const navigation = document.querySelectorAll<HTMLElement>('.bottom-navigation button, .bottom-navigation a');
        const items = [...Array.from(candidates ?? []), ...Array.from(navigation)].filter(
          (el) =>
            el.getClientRects().length > 0 && !el.hasAttribute("disabled"),
        );
        if (!items.length) return;
        const first = items[0],
          last = items[items.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key);
      previous?.focus({ preventScroll: true });
    };
  }, [close]);
  return (
    <div
      className={`overlay ${kind}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <motion.div
        initial={{ y: reduced ? 0 : 25, opacity: reduced ? 1 : 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="modal"
        role="dialog"
        aria-modal="false"
        aria-label={title}
        tabIndex={-1}
        ref={ref}
      >
        <div className="modal-heading">
          <h2>{title}</h2>
          <button className="icon" aria-label="닫기" onClick={close}>
            <X />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
