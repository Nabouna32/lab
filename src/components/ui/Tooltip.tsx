"use client";

import { cloneElement, isValidElement, useEffect, useId, useRef, useState, type ReactElement, type ReactNode } from "react";
import styles from "./Tooltip.module.css";

type TooltipProps = {
  openOnClick?: boolean;
  children: ReactNode;
  content: ReactNode;
  title?: string;
  variant?: "plain" | "rich";
  placement?: "top" | "bottom" | "start" | "end";
  delayMs?: number;
  className?: string;
};

/** Source-informed Web adaptation of AndroidX TooltipBox with PlainTooltip/RichTooltip patterns. */
export function Tooltip({
  children, content, title, variant = "plain", placement = "top", delayMs = 500, className = "", openOnClick = false,
}: TooltipProps) {
  const id = useId();
  const rootRef = useRef<HTMLSpanElement>(null);
  const openedByFocus = useRef(false);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);


  const clearTimer = () => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  };
  const showAfterDelay = () => {
    clearTimer();
    timer.current = setTimeout(() => setOpen(true), Math.max(0, delayMs));
  };
  const hide = () => { clearTimer(); setOpen(false); };
  const anchor = isValidElement(children) ? children as ReactElement<{ "aria-describedby"?: string }> : null;

  useEffect(() => () => clearTimer(), []);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        if (timer.current !== null) clearTimeout(timer.current);
        timer.current = null;
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (timer.current !== null) clearTimeout(timer.current);
        timer.current = null;
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return <span ref={rootRef} className={[styles.root, className].filter(Boolean).join(" ")}
    onMouseEnter={showAfterDelay} onMouseLeave={hide}
    onClick={openOnClick ? () => {
      if (openedByFocus.current) {
        openedByFocus.current = false;
        setOpen(true);
      } else {
        setOpen((current) => !current);
      }
    } : undefined}
    onFocusCapture={() => { openedByFocus.current = true; setOpen(true); }} onBlurCapture={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        openedByFocus.current = false;
        hide();
      }
    }}
    onPointerDown={(event) => {
      if (event.pointerType === "touch") {
        showAfterDelay();
      }
    }}
    onPointerUp={(event) => { if (event.pointerType === "touch" && !open) clearTimer(); }}
    onPointerCancel={hide}
    onKeyDown={(event) => { if (event.key === "Escape") hide(); }}>
    <span className={styles.anchor}>{anchor ? cloneElement(anchor, { "aria-describedby": [anchor.props["aria-describedby"], open ? id : undefined].filter(Boolean).join(" ") || undefined }) : children}</span>
    {open && <span id={id} role="tooltip" className={[styles.tooltip, styles[variant], styles[placement]].join(" ")} data-open="true">
      {title && <strong className={styles.title}>{title}</strong>}
      <span>{content}</span>
    </span>}
  </span>;
}
