"use client";

import { useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import styles from "./BottomSheetScaffold.module.css";

export type BottomSheetScaffoldProps = {
  title: string;
  content: ReactNode;
  sheetContent: ReactNode;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  collapsedLabel: string;
  expandedLabel: string;
  className?: string;
};

/** Web adaptation of AndroidX BottomSheetScaffold with an accessible sheet handle. */
export function BottomSheetScaffold({
  title,
  content,
  sheetContent,
  expanded,
  onExpandedChange,
  collapsedLabel,
  expandedLabel,
  className = "",
}: BottomSheetScaffoldProps) {
  const startY = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  function onPointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    startY.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (startY.current === null) return;
    setDragOffset(Math.max(-120, Math.min(120, event.clientY - startY.current)));
  }

  function onPointerUp() {
    if (startY.current === null) return;
    if (dragOffset < -40) onExpandedChange(true);
    else if (dragOffset > 40) onExpandedChange(false);
    startY.current = null;
    setDragOffset(0);
  }

  function cancelDrag() {
    startY.current = null;
    setDragOffset(0);
  }

  return (
    <section className={[styles.root, className].filter(Boolean).join(" ")} aria-label={title}>
      <div className={styles.content}>{content}</div>
      <section className={[styles.sheet, expanded ? styles.expanded : styles.collapsed].join(" ")} style={{ transform: dragOffset ? `translateY(${dragOffset}px)` : undefined }} aria-label={title}>
        <button
          type="button"
          className={styles.handle}
          aria-expanded={expanded}
          aria-controls="m3-bottom-sheet-content"
          aria-label={expanded ? expandedLabel : collapsedLabel}
          onClick={() => onExpandedChange(!expanded)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={cancelDrag}
        >
          <span className={styles.dragHandle} aria-hidden="true" />
          <span>{title}</span>
          <span aria-hidden="true">{expanded ? "⌄" : "⌃"}</span>
        </button>
        <div id="m3-bottom-sheet-content" className={styles.sheetContent} hidden={!expanded}>{sheetContent}</div>
      </section>
    </section>
  );
}
