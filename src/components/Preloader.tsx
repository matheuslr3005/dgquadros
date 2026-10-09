import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { prefersReducedMotion } from "../lib/env";
import { NutMark } from "./Logo";

type PreloaderProps = {
  ready: boolean;
  onDone: () => void;
};

const STEPS = 5;

export const Preloader = ({ ready, onDone }: PreloaderProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const nutRef = useRef<HTMLDivElement>(null);
  const progress = useRef({ value: 0 });
  const [percent, setPercent] = useState(0);
  const finished = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(nutRef.current, { rotation: 360, duration: 2.4, ease: "none", repeat: -1 });
      gsap.fromTo(
        ".preloader__step",
        { scaleY: 0 },
        { scaleY: 1, duration: 0.6, ease: "power4.out", stagger: 0.12, transformOrigin: "bottom" },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Fake-load up to 90% while we wait, then finish once the 3D chunk is ready.
    const target = ready ? 100 : 90;
    const tween = gsap.to(progress.current, {
      value: target,
      duration: ready ? 0.6 : 1.6,
      ease: "power2.out",
      onUpdate: () => setPercent(Math.round(progress.current.value)),
      onComplete: () => {
        if (!ready || finished.current) return;
        finished.current = true;
        const exit = gsap.timeline({ onComplete: onDone });
        if (prefersReducedMotion()) {
          exit.to(rootRef.current, { opacity: 0, duration: 0.3 });
          return;
        }
        exit
          .to(".preloader__content", { y: -40, opacity: 0, duration: 0.5, ease: "power3.in" })
          .to(".preloader__panel", { yPercent: -100, duration: 0.9, ease: "power4.inOut", stagger: 0.08 }, "-=0.2")
          .set(rootRef.current, { display: "none" });
      },
    });
    return () => {
      tween.kill();
    };
  }, [ready, onDone]);

  return (
    <div ref={rootRef} className="preloader" role="status" aria-label="Carregando o site">
      {Array.from({ length: STEPS }, (_, index) => (
        <div className="preloader__panel" key={index} style={{ left: `${(index * 100) / STEPS}%`, width: `${100 / STEPS + 0.2}%` }} />
      ))}
      <div className="preloader__content">
        <div ref={nutRef} className="preloader__nut">
          <NutMark />
        </div>
        <div className="preloader__steps" aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => (
            <span className="preloader__step" key={index} style={{ height: `${20 + index * 14}px` }} />
          ))}
        </div>
        <p className="preloader__label">
          Nivelando o terreno <strong>{String(percent).padStart(3, "0")}%</strong>
        </p>
      </div>
    </div>
  );
};
