"use client";

import { useEffect, useRef, useState, type AnimationEvent, type PointerEvent } from "react";

type RippleState = {
  id: number;
  left: number;
  top: number;
  diameter: number;
  released: boolean;
};

function isDisabledControl(control: HTMLElement) {
  return (control instanceof HTMLButtonElement && control.disabled) || control.getAttribute("aria-disabled") === "true";
}

function getRippleGeometry(x: number, y: number, width: number, height: number) {
  const farthestCorner = Math.max(
    Math.hypot(x, y),
    Math.hypot(width - x, y),
    Math.hypot(x, height - y),
    Math.hypot(width - x, height - y),
  );
  const diameter = Math.max(1, Math.ceil(farthestCorner * 2));
  return { left: x - diameter / 2, top: y - diameter / 2, diameter };
}

export function ButtonRipple() {
  const [ripples, setRipples] = useState<RippleState[]>([]);
  const layerRef = useRef<HTMLSpanElement>(null);
  const nextId = useRef(0);
  const activePointers = useRef(new Map<number, number>());
  const activeKeys = useRef(new Map<string, number>());

  useEffect(() => {
    const candidate = layerRef.current?.parentElement;
    if (!(candidate instanceof HTMLButtonElement) && !(candidate instanceof HTMLAnchorElement)) return;
    const control: HTMLButtonElement | HTMLAnchorElement = candidate;

    function release(id: number) {
      setRipples((current) => current.map((ripple) => ripple.id === id ? { ...ripple, released: true } : ripple));
    }

    function handleKeyDown(event: Event) {
      const keyboardEvent = event as KeyboardEvent;
      const isAnchor = control instanceof HTMLAnchorElement;
      if ((isAnchor ? keyboardEvent.key !== "Enter" : keyboardEvent.key !== " " && keyboardEvent.key !== "Enter") || keyboardEvent.repeat || isDisabledControl(control)) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (activeKeys.current.has(keyboardEvent.key)) return;

      const rect = control.getBoundingClientRect();
      const x = rect.width / 2;
      const y = rect.height / 2;
      const { left, top, diameter } = getRippleGeometry(x, y, rect.width, rect.height);
      const id = ++nextId.current;
      activeKeys.current.set(keyboardEvent.key, id);
      setRipples((current) => [...current, {
        id,
        left,
        top,
        diameter,
        released: false,
      }]);
    }

    function handleKeyUp(event: Event) {
      const keyboardEvent = event as KeyboardEvent;
      const id = activeKeys.current.get(keyboardEvent.key);
      if (id === undefined) return;
      activeKeys.current.delete(keyboardEvent.key);
      release(id);
    }

    function handleBlur() {
      activeKeys.current.forEach((id) => release(id));
      activeKeys.current.clear();
    }

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    function handleMotionPreferenceChange(event: MediaQueryListEvent) {
      if (!event.matches) return;
      activePointers.current.clear();
      activeKeys.current.clear();
      setRipples([]);
    }

    motionPreference.addEventListener("change", handleMotionPreferenceChange);
    control.addEventListener("keydown", handleKeyDown);
    control.addEventListener("keyup", handleKeyUp);
    control.addEventListener("blur", handleBlur);
    return () => {
      motionPreference.removeEventListener("change", handleMotionPreferenceChange);
      control.removeEventListener("keydown", handleKeyDown);
      control.removeEventListener("keyup", handleKeyUp);
      control.removeEventListener("blur", handleBlur);
    };
  }, []);

  function handlePointerDown(event: PointerEvent<HTMLSpanElement>) {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const control = event.currentTarget.parentElement;
    if (!control || isDisabledControl(control)) return;

    const rect = control.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const { left, top, diameter } = getRippleGeometry(x, y, rect.width, rect.height);
    const id = ++nextId.current;

    activePointers.current.set(event.pointerId, id);
    setRipples((current) => [...current, {
      id,
      left,
      top,
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
      className="button-ripple-layer"
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
