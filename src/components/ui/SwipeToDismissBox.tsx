"use client";

import { useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import styles from "./SwipeToDismissBox.module.css";

export type SwipeToDismissBoxProps = {
  children: ReactNode;
  onDismiss: () => void;
  dismissLabel: string;
  direction?: "start-to-end" | "end-to-start" | "both";
  disabled?: boolean;
};

/** Web adaptation of AndroidX Material 3 SwipeToDismissBox with keyboard action. */
export function SwipeToDismissBox({
  children,
  onDismiss,
  dismissLabel,
  direction = "end-to-start",
  disabled = false,
}: SwipeToDismissBoxProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<{ x: number; y: number; id: number } | null>(null);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (disabled || !event.isPrimary || event.button !== 0) return;
    pointerStart.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = pointerStart.current;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dy) > Math.abs(dx) * 1.2) return;
    if (direction === "start-to-end" && dx < 0) return;
    if (direction === "end-to-start" && dx > 0) return;
    setOffset(Math.max(-180, Math.min(180, dx)));
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = pointerStart.current;
    if (!start || start.id !== event.pointerId) return;
    const width = rootRef.current?.getBoundingClientRect().width ?? 320;
    const threshold = Math.min(120, width * 0.35);
    const permitted = direction === "both" || (direction === "start-to-end" && offset > 0) || (direction === "end-to-start" && offset < 0);
    if (permitted && Math.abs(offset) >= threshold) onDismiss();
    pointerStart.current = null;
    setDragging(false);
    setOffset(0);
  }

  function cancelPointer() {
    pointerStart.current = null;
    setDragging(false);
    setOffset(0);
  }

  return (
    <div ref={rootRef} className={styles.root} data-disabled={disabled ? "true" : "false"}>
      <div className={styles.background} aria-hidden="true"><span>{dismissLabel}</span></div>
      <div
        className={styles.content}
        style={{ transform: `translateX(${offset}px)` }}
        data-dragging={dragging ? "true" : "false"}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={cancelPointer}
      >
        {children}
        <button type="button" className={styles.dismissAction} onClick={onDismiss} disabled={disabled} aria-label={dismissLabel}>×</button>
      </div>
    </div>
  );
}
