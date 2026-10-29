"use client";

import { useId, useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import styles from "./BottomSheetScaffold.module.css";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

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
  const id = useId().replace(/:/g, "");
  const startY = useRef<number | null>(null);
  const dragOffsetRef = useRef(0);
  const wasDragging = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);

  function onPointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    startY.current = event.clientY;
    dragOffsetRef.current = 0;
    wasDragging.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (startY.current === null) return;
    const next = Math.max(-120, Math.min(120, event.clientY - startY.current));
    dragOffsetRef.current = next;
    if (Math.abs(next) > 8) wasDragging.current = true;
    setDragOffset(next);
  }

  function onPointerUp() {
    if (startY.current === null) return;
    if (dragOffsetRef.current < -40) onExpandedChange(true);
    else if (dragOffsetRef.current > 40) onExpandedChange(false);
    startY.current = null;
    dragOffsetRef.current = 0;
    setDragOffset(0);
  }

  function cancelDrag() {
    startY.current = null;
    dragOffsetRef.current = 0;
    wasDragging.current = false;
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
          aria-controls={`m3-bottom-sheet-content-${id}`}
          aria-label={expanded ? expandedLabel : collapsedLabel}
          onClick={() => { if (wasDragging.current) { wasDragging.current = false; return; } onExpandedChange(!expanded); }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={cancelDrag}
        >
          <span className={styles.dragHandle} aria-hidden="true" />
          <span>{title}</span>
          <span aria-hidden="true"><MaterialIcon name={expanded ? "keyboard_arrow_down" : "keyboard_arrow_up"} size={24} /></span>
        </button>
        <div id={`m3-bottom-sheet-content-${id}`} className={styles.sheetContent} hidden={!expanded}>{sheetContent}</div>
      </section>
    </section>
  );
}
