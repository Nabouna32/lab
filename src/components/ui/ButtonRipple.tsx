"use client";

import { useRef, useState, type AnimationEvent, type PointerEvent } from "react";

type RippleState = {
  id: number;
  left: number;
  top: number;
  diameter: number;
  released: boolean;
};

export function ButtonRipple() {
  const [ripples, setRipples] = useState<RippleState[]>([]);
  const nextId = useRef(0);
  const activePointers = useRef(new Map<number, number>());

  function handlePointerDown(event: PointerEvent<HTMLSpanElement>) {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    const button = event.currentTarget.parentElement;
    if (!button || button.hasAttribute("disabled")) return;

    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const farthestCorner = Math.max(
      Math.hypot(x, y),
      Math.hypot(rect.width - x, y),
      Math.hypot(x, rect.height - y),
      Math.hypot(rect.width - x, rect.height - y),
    );
    const diameter = Math.max(1, Math.ceil(farthestCorner * 2));
    const id = ++nextId.current;

    activePointers.current.set(event.pointerId, id);
    setRipples((current) => [...current, {
      id,
      left: x - diameter / 2,
      top: y - diameter / 2,
      diameter,
      released: false,
    }]);

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture can fail if the browser has already cancelled the pointer.
    }
  }

  function releasePointer(event: PointerEvent<HTMLSpanElement>) {
    const id = activePointers.current.get(event.pointerId);
    if (id === undefined) return;
    activePointers.current.delete(event.pointerId);
    setRipples((current) => current.map((ripple) => ripple.id === id ? { ...ripple, released: true } : ripple));
  }

  function removeRipple(id: number, event: AnimationEvent<HTMLSpanElement>) {
    if (event.animationName !== "button-ripple-fade") return;
    setRipples((current) => current.filter((ripple) => ripple.id !== id));
  }

  return (
    <span
      aria-hidden="true"
      className={"button-ripple-layer" + (ripples.length > 0 ? " button-ripple-layer--pointer" : "")}
      onPointerDown={handlePointerDown}
      onPointerUp={releasePointer}
      onPointerCancel={releasePointer}
      onLostPointerCapture={releasePointer}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="button-ripple"
          style={{
            left: ripple.left,
            top: ripple.top,
            width: ripple.diameter,
            height: ripple.diameter,
          }}
        >
          <span
            className={"button-ripple__fill" + (ripple.released ? " button-ripple__fill--released" : "")}
            onAnimationEnd={(event) => removeRipple(ripple.id, event)}
          />
        </span>
      ))}
    </span>
  );
}
