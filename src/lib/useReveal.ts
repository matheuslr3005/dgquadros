import { useEffect } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { prefersReducedMotion } from "./env";

/** Reveals every `[data-reveal]` element once it enters the viewport. */
export const useReveal = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    if (prefersReducedMotion()) {
      root.classList.remove("reveal-ready");
      return;
    }
    root.classList.add("reveal-ready");

    const ctx = gsap.context(() => {
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 90%",
        once: true,
        onEnter: (elements) => {
          elements.forEach((element, index) => {
            if (!(element instanceof HTMLElement)) return;
            const kind = element.dataset["reveal"];
            const delay = Number(element.dataset["revealDelay"] ?? 0) + index * 0.08;
            const from =
              kind === "fade"
                ? { opacity: 0 }
                : kind === "scale"
                  ? { opacity: 0, scale: 0.88 }
                  : kind === "left"
                    ? { opacity: 0, x: -60 }
                    : kind === "right"
                      ? { opacity: 0, x: 60 }
                      : { opacity: 0, y: 48 };
            gsap.fromTo(element, from, {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              duration: 1.1,
              delay,
              ease: "power3.out",
              clearProps: "transform,opacity",
              onComplete: () => element.classList.add("is-revealed"),
            });
          });
        },
      });
    });

    return () => {
      ctx.revert();
      root.classList.remove("reveal-ready");
    };
  }, [enabled]);
};
