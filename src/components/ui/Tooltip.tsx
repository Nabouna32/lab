"use client";

import { cloneElement, isValidElement, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactElement, type ReactNode } from "react";
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
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
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

  useLayoutEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const anchorElement = rootRef.current?.querySelector<HTMLElement>("[data-tooltip-anchor]");
      const tooltipElement = tooltipRef.current;
      if (!anchorElement || !tooltipElement) return;

      const anchorRect = anchorElement.getBoundingClientRect();
      const tooltipRect = tooltipElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const spacing = 4;
      let top = 0;
      let left = 0;

      if (placement === "start" || placement === "end") {
        top = anchorRect.top + (anchorRect.height - tooltipRect.height) / 2;
        left = placement === "start"
          ? anchorRect.left - tooltipRect.width - spacing
          : anchorRect.right + spacing;
        if (left < 0) left = anchorRect.right + spacing;
        if (left + tooltipRect.width > viewportWidth) left = anchorRect.left - tooltipRect.width - spacing;
      } else {
        const aboveSpace = anchorRect.top - spacing;
        const belowSpace = viewportHeight - anchorRect.bottom - spacing;
        const canFitAbove = aboveSpace >= tooltipRect.height;
        const canFitBelow = belowSpace >= tooltipRect.height;
        const placeAbove = placement === "top"
          ? canFitAbove || !canFitBelow
          : !canFitBelow && canFitAbove;
        top = placeAbove
          ? anchorRect.top - tooltipRect.height - spacing
          : anchorRect.bottom + spacing;
        left = anchorRect.left + (anchorRect.width - tooltipRect.width) / 2;
      }

      left = Math.min(Math.max(0, left), Math.max(0, viewportWidth - tooltipRect.width));
      top = Math.min(Math.max(0, top), Math.max(0, viewportHeight - tooltipRect.height));
      setPosition((current) => current?.top === top && current.left === left ? current : { top, left });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, placement]);

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
    <span className={styles.anchor} data-tooltip-anchor>{anchor ? cloneElement(anchor, { "aria-describedby": [anchor.props["aria-describedby"], open ? id : undefined].filter(Boolean).join(" ") || undefined }) : children}</span>
    {open && <span ref={tooltipRef} id={id} role="tooltip" className={[styles.tooltip, styles[variant], styles[placement]].join(" ")} data-open="true" style={(position ? { position: "fixed", inset: "auto", top: position.top, left: position.left, transform: "none" } : { visibility: "hidden" }) as CSSProperties}>
      {title && <strong className={styles.title}>{title}</strong>}
      <span>{content}</span>
    </span>}
  </span>;
}
