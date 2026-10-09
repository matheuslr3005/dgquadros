import { useRef } from "react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { gsap } from "../lib/gsap";
import { isCoarsePointer } from "../lib/env";

type MagneticButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "solid" | "ghost";
  strength?: number;
};

export const MagneticButton = ({
  children,
  variant = "solid",
  strength = 0.35,
  className,
  ...anchorProps
}: MagneticButtonProps) => {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    const node = ref.current;
    if (!node || isCoarsePointer()) return;
    const rect = node.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    gsap.to(node, { x: dx * strength, y: dy * strength, duration: 0.4, ease: "power3.out" });
  };

  const handleLeave = () => {
    const node = ref.current;
    if (!node) return;
    gsap.to(node, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <a
      ref={ref}
      className={`btn ${variant === "ghost" ? "btn--ghost" : ""} ${className ?? ""}`}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      data-cursor="cta"
      {...anchorProps}
    >
      {children}
    </a>
  );
};
