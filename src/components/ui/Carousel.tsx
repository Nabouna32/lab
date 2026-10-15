"use client";

import type { CSSProperties, ReactNode, KeyboardEvent } from "react";
import styles from "./Carousel.module.css";

export type CarouselItemData = {
  id: string;
  label: string;
  content: ReactNode;
};

type CarouselProps = {
  items: CarouselItemData[];
  label: string;
  layout?: "multi-browse" | "uncontained";
  itemWidth?: number;
  gap?: number;
  className?: string;
};

/** Source-informed Web adaptation of AndroidX HorizontalMultiBrowseCarousel / HorizontalUncontainedCarousel. */
export function Carousel({
  items, label, layout = "uncontained", itemWidth = 224, gap = 8, className = "",
}: CarouselProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const viewport = event.currentTarget;
    event.preventDefault();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    viewport.scrollBy({ left: (event.key === "ArrowRight" ? 1 : -1) * (itemWidth + gap), behavior: reducedMotion ? "auto" : "smooth" });
  };

  return <div className={[styles.root, className].filter(Boolean).join(" ")}
    role="region" aria-label={label} aria-roledescription="carousel" data-layout={layout}>
    <div className={styles.viewport} tabIndex={0} onKeyDown={handleKeyDown}>
      {items.map((item, index) => <div key={item.id} className={styles.item}
        role="group" aria-roledescription="slide" aria-label={`${index + 1} / ${items.length}: ${item.label}`}
        style={{ "--carousel-item-width": `${itemWidth}px`, "--carousel-gap": `${gap}px` } as CSSProperties}>
        {item.content}
      </div>)}
    </div>
  </div>;
}
