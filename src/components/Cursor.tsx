import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { isCoarsePointer } from "../lib/env";

type CursorMode = "default" | "cta" | "drag" | "link";

const LABELS: Record<CursorMode, string> = {
  default: "",
  cta: "",
  drag: "Arraste",
  link: "",
};

const readMode = (target: EventTarget | null): CursorMode => {
  if (!(target instanceof Element)) return "default";
  const tagged = target.closest<HTMLElement>("[data-cursor]");
  const value = tagged?.dataset["cursor"];
  if (value === "cta" || value === "drag" || value === "link") return value;
  return target.closest("a, button") ? "link" : "default";
};

export const Cursor = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>("default");
  const [enabled] = useState(() => !isCoarsePointer());

  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "none" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "none" });

    const handleMove = (event: PointerEvent) => {
      ringX(event.clientX);
      ringY(event.clientY);
      dotX(event.clientX);
      dotY(event.clientY);
      setMode(readMode(event.target));
    };
    const handleDown = () => gsap.to(ring, { scale: 0.8, duration: 0.2 });
    const handleUp = () => gsap.to(ring, { scale: 1, duration: 0.4, ease: "back.out(2)" });

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className={`cursor cursor--${mode}`} aria-hidden="true">
        <span className="cursor__label">{LABELS[mode]}</span>
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
};
