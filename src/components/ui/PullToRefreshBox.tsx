"use client";

import { useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import styles from "./PullToRefreshBox.module.css";
import { Button } from "@/components/ui/Button";

export type PullToRefreshBoxProps = {
  children: ReactNode;
  isRefreshing: boolean;
  onRefresh: () => void;
  refreshLabel: string;
  refreshNowLabel: string;
  threshold?: number;
  disabled?: boolean;
};

/**
 * Web adaptation inspired by AndroidX PullToRefreshBox. Includes an explicit
 * refresh button for accessibility. Native nested-scroll arbitration and
 * platform overscroll behavior differ from Compose and require device testing.
 */
export function PullToRefreshBox({
  children,
  isRefreshing,
  onRefresh,
  refreshLabel,
  refreshNowLabel,
  threshold = 72,
  disabled = false,
}: PullToRefreshBoxProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<{ x: number; y: number; id: number } | null>(null);
  const distanceRef = useRef(0);
  const [distance, setDistance] = useState(0);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (disabled || isRefreshing || !event.isPrimary || event.button !== 0) return;
    if (rootRef.current && rootRef.current.scrollTop > 0) return;
    startRef.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
    distanceRef.current = 0;
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = startRef.current;
    if (!start || start.id !== event.pointerId || !rootRef.current) return;
    if (rootRef.current.scrollTop > 0) {
      startRef.current = null;
      distanceRef.current = 0;
      setDistance(0);
      return;
    }
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (dy <= 0 || Math.abs(dx) > dy) return;
    const next = Math.min(threshold * 1.25, dy * 0.55);
    distanceRef.current = next;
    setDistance(next);
  }

  function finishPointer(event: PointerEvent<HTMLDivElement>) {
    const start = startRef.current;
    if (!start || start.id !== event.pointerId) return;
    if (distanceRef.current >= threshold && !disabled && !isRefreshing) onRefresh();
    startRef.current = null;
    distanceRef.current = 0;
    setDistance(0);
  }

  return (
    <div
      ref={rootRef}
      className={styles.root}
      data-refreshing={isRefreshing ? "true" : "false"}
      data-disabled={disabled ? "true" : "false"}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finishPointer}
      onPointerCancel={() => { startRef.current = null; distanceRef.current = 0; setDistance(0); }}
    >
      {(distance > 0 || isRefreshing) && <div className={styles.indicator} role="status" aria-live="polite" aria-label={refreshLabel} style={{ opacity: isRefreshing ? 1 : Math.min(1, distance / threshold), transform: `translateY(${Math.min(distance, threshold)}px)` }}>
        <span className={styles.spinner} aria-hidden="true" />
        <span>{refreshLabel}</span>
      </div>}
      <div className={styles.content} style={{ transform: distance > 0 && !isRefreshing ? `translateY(${Math.min(distance, threshold)}px)` : undefined }}>
        {children}
      </div>
      <div className="flex justify-end px-4 pb-4">
        <Button type="button" onClick={onRefresh} disabled={disabled || isRefreshing}>
          {isRefreshing ? refreshLabel : refreshNowLabel}
        </Button>
      </div>
    </div>
  );
}
