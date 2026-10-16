"use client";

import { useEffect, useRef, useState, type AnimationEvent, type PointerEvent } from "react";

type RippleState = {
  id: number;
  left: number;
  top: number;
  diameter: number;
  released: boolean;
};

export function ButtonRipple() {
  const [ripples, setRipples] = useState<RippleState[]>([]);
  const layerRef = useRef<HTMLSpanElement>(null);
  const nextId = useRef(0);
  const activePointers = useRef(new Map<number, number>());
  const activeKeys = useRef(new Map<string, number>());

  useEffect(() => {
    const button = layerRef.current?.parentElement;
    if (!button) return;

    function release(id: number) {
      setRipples((current) => current.map((ripple) => ripple.id === id ? { ...ripple, released: true } : ripple));
    }

    function handleKeyDown(event: KeyboardEvent) {
      if ((event.key !== " " && event.key !== "Enter") || event.repeat || button.hasAttribute("disabled")) return;
      if (activeKeys.current.has(event.key)) return;

      const rect = button.getBoundingClientRect();
      const x = rect.width / 2;
      const y = rect.height / 2;
      const farthestCorner = Math.max(
        Math.hypot(x, y),
        Math.hypot(rect.width - x, y),
        Math.hypot(x, rect.height - y),
        Math.hypot(rect.width - x, rect.height - y),
      );
      const diameter = Math.max(1, Math.ceil(farthestCorner * 2));
      const id = ++nextId.current;
      activeKeys.current.set(event.key, id);
      setRipples((current) => [...current, {
        id,
        left: x - diameter / 2,
        top: y - diameter / 2,
        diameter,
        released: false,
      }]);
    }

    function handleKeyUp(event: KeyboardEvent) {
      const id = activeKeys.current.get(event.key);
      if (id === undefined) return;
      activeKeys.current.delete(event.key);
      release(id);
    }

    function handleBlur() {
      activeKeys.current.forEach((id) => release(id));
      activeKeys.current.clear();
    }

    button.addEventListener("keydown", handleKeyDown);
    button.addEventListener("keyup", handleKeyUp);
    button.addEventListener("blur", handleBlur);
    return () => {
      button.removeEventListener("keydown", handleKeyDown);
      button.removeEventListener("keyup", handleKeyUp);
      button.removeEventListener("blur", handleBlur);
    };
  }, []);

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
      ref={layerRef}
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
