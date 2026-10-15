"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import styles from "./Tooltip.module.css";

type TooltipProps = {
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
  children, content, title, variant = "plain", placement = "top", delayMs = 500, className = "",
}: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerDown = useRef<number | null>(null);

  const clearTimer = () => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  };
  const showAfterDelay = () => {
    clearTimer();
    timer.current = setTimeout(() => setOpen(true), Math.max(0, delayMs));
  };
  const hide = () => { clearTimer(); setOpen(false); };

  useEffect(() => () => clearTimer(), []);

  return <span className={[styles.root, className].filter(Boolean).join(" ")}
    onMouseEnter={showAfterDelay} onMouseLeave={hide}
    onFocusCapture={() => setOpen(true)} onBlurCapture={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) hide();
    }}
    onPointerDown={(event) => {
      if (event.pointerType === "touch") {
        pointerDown.current = event.pointerId;
        showAfterDelay();
      }
    }}
    onPointerUp={() => { pointerDown.current = null; }}
    onPointerCancel={hide}
    onKeyDown={(event) => { if (event.key === "Escape") hide(); }}>
    <span aria-describedby={open ? id : undefined} className={styles.anchor}>{children}</span>
    {open && <span id={id} role="tooltip" className={[styles.tooltip, styles[variant], styles[placement]].join(" ")} data-open="true">
      {title && <strong className={styles.title}>{title}</strong>}
      <span>{content}</span>
    </span>}
  </span>;
}
