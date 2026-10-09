import { createElement, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap, SplitText } from "../lib/gsap";
import { prefersReducedMotion } from "../lib/env";

type SplitHeadingProps = {
  as?: "h1" | "h2" | "h3";
  className?: string;
  children: ReactNode;
  /** `scroll` reveals when the heading enters the viewport; `manual` waits for `play`. */
  mode?: "scroll" | "manual";
  play?: boolean;
  delay?: number;
};

export const SplitHeading = ({ as = "h2", className, children, mode = "scroll", play = true, delay = 0 }: SplitHeadingProps) => {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion()) return;
    if (mode === "manual" && !play) {
      gsap.set(node, { visibility: "hidden" });
      return;
    }

    let split: SplitText | undefined;
    let cancelled = false;

    const run = () => {
      if (cancelled || !node) return;
      gsap.set(node, { visibility: "visible" });
      split = SplitText.create(node, {
        type: "lines,words",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.words, {
            yPercent: 115,
            rotate: 4,
            duration: 1.1,
            delay,
            stagger: 0.07,
            ease: "power4.out",
            scrollTrigger: mode === "scroll" ? { trigger: node, start: "top 88%", once: true } : undefined,
          }),
      });
    };

    void document.fonts.ready.then(run);
    return () => {
      cancelled = true;
      split?.revert();
    };
  }, [mode, play, delay]);

  return createElement(as, { ref, className }, children);
};
