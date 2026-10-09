import { useRef } from "react";
import type { HTMLAttributes, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { isCoarsePointer } from "../lib/env";

type TiltCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  max?: number;
};

/** Card that tilts toward the pointer and exposes a --mx/--my spotlight position. */
export const TiltCard = ({ children, max = 7, className, ...rest }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node || isCoarsePointer()) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    node.style.setProperty("--ry", `${(px - 0.5) * max * 2}deg`);
    node.style.setProperty("--rx", `${(0.5 - py) * max * 2}deg`);
    node.style.setProperty("--mx", `${px * 100}%`);
    node.style.setProperty("--my", `${py * 100}%`);
  };

  const handleLeave = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--ry", "0deg");
    node.style.setProperty("--rx", "0deg");
  };

  return (
    <div ref={ref} className={`tilt ${className ?? ""}`} onPointerMove={handleMove} onPointerLeave={handleLeave} {...rest}>
      {children}
    </div>
  );
};
