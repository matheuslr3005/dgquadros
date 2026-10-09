import { useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { gsap } from "../lib/gsap";
import { prefersReducedMotion } from "../lib/env";

type ScrollShovelProps = {
  visible: boolean;
};

const BLADE_PATH = "M7 27 Q7 25 9 25 H31 Q33 25 33 27 V37 Q33 51 20 54 Q7 51 7 37 Z";
const BLADE_TOP = 25;
const BLADE_BOTTOM = 54;
const MAX_MOUND = 15;
const GRAIN_COUNT = 10;

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const maxScroll = (): number => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

/** Small shovel that rides a rail beside the scrollbar and fills with soil as the page is scrolled. */
export const ScrollShovel = ({ visible }: ScrollShovelProps) => {
  const railRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const toolRef = useRef<HTMLDivElement>(null);
  const sandRef = useRef<SVGRectElement>(null);
  const moundRef = useRef<SVGPathElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const grainRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dragging = useRef(false);

  useEffect(() => {
    const rail = railRef.current;
    const tool = toolRef.current;
    const trail = trailRef.current;
    const sand = sandRef.current;
    const mound = moundRef.current;
    const label = labelRef.current;
    if (!rail || !tool || !trail || !sand || !mound || !label) return;

    const reduced = prefersReducedMotion();
    let shown = clamp(window.scrollY / maxScroll(), 0, 1);
    let tilt = 0;
    let lastScroll = window.scrollY;
    let grainTimer = 0;
    let grainIndex = 0;

    const dropGrain = (x: number, y: number) => {
      const grain = grainRefs.current[grainIndex % GRAIN_COUNT];
      grainIndex += 1;
      if (!grain) return;
      gsap.fromTo(
        grain,
        { x: x + (Math.random() - 0.5) * 18, y, opacity: 1, scale: 0.6 + Math.random() * 0.9 },
        { y: y + 14 + Math.random() * 22, opacity: 0, duration: 0.6 + Math.random() * 0.5, ease: "power1.out", overwrite: true },
      );
    };

    const tick = (_time: number, deltaMs: number) => {
      const dt = Math.min(deltaMs, 50) / 1000 || 0.016;
      const target = clamp(window.scrollY / maxScroll(), 0, 1);
      shown += (target - shown) * (reduced ? 1 : Math.min(1, dt * 9));

      const velocity = (window.scrollY - lastScroll) / dt;
      lastScroll = window.scrollY;
      const targetTilt = reduced ? 0 : clamp(velocity / 160, -16, 16);
      tilt += (targetTilt - tilt) * Math.min(1, dt * 10);

      const railHeight = rail.clientHeight;
      const toolHeight = tool.offsetHeight;
      const y = shown * Math.max(0, railHeight - toolHeight);
      tool.style.transform = `translate3d(-50%, ${y}px, 0) rotate(${tilt}deg)`;
      trail.style.height = `${y + toolHeight * 0.55}px`;

      const fillHeight = (BLADE_BOTTOM - BLADE_TOP) * shown;
      sand.setAttribute("y", String(BLADE_BOTTOM - fillHeight));
      sand.setAttribute("height", String(fillHeight + 1));

      const heap = clamp((shown - 0.78) / 0.22, 0, 1) * MAX_MOUND;
      mound.setAttribute(
        "d",
        heap < 0.4
          ? ""
          : `M9 ${BLADE_TOP + 1} Q13 ${BLADE_TOP - heap * 0.55} 20 ${BLADE_TOP - heap} Q27 ${BLADE_TOP - heap * 0.55} 31 ${BLADE_TOP + 1} Z`,
      );

      label.textContent = `${Math.round(shown * 100)}`;

      grainTimer -= dt;
      if (!reduced && Math.abs(velocity) > 80 && grainTimer <= 0) {
        dropGrain(rail.clientWidth / 2, y + toolHeight * 0.85);
        grainTimer = 0.05;
      }
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, []);

  const scrollToPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    const tool = toolRef.current;
    if (!rail || !tool) return;
    const rect = rail.getBoundingClientRect();
    const travel = Math.max(1, rect.height - tool.offsetHeight);
    const progress = clamp((event.clientY - rect.top - tool.offsetHeight / 2) / travel, 0, 1);
    window.scrollTo({ top: progress * maxScroll(), behavior: "instant" });
  };

  const handleDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    scrollToPointer(event);
  };
  const handleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragging.current) scrollToPointer(event);
  };
  const handleUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div
      className={`shovel ${visible ? "is-visible" : ""}`}
      role="presentation"
      title="Arraste para rolar a página"
      data-cursor="drag"
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onPointerCancel={handleUp}
    >
      <div ref={railRef} className="shovel__rail">
        <span className="shovel__line" />
        <div ref={trailRef} className="shovel__trail" />
        {Array.from({ length: GRAIN_COUNT }, (_, index) => (
          <span
            key={index}
            className="shovel__grain"
            ref={(node) => {
              grainRefs.current[index] = node;
            }}
          />
        ))}
        <div ref={toolRef} className="shovel__tool">
          <svg viewBox="0 0 40 56" aria-hidden="true">
            <defs>
              <clipPath id="shovel-blade">
                <path d={BLADE_PATH} />
              </clipPath>
            </defs>
            <rect x="14" y="0" width="12" height="4" rx="2" fill="#f5b700" />
            <rect x="18.2" y="2" width="3.6" height="24" rx="1.8" fill="#d9a000" />
            <rect x="16.5" y="19" width="7" height="8" rx="1.5" fill="#8a8f96" />
            <path d={BLADE_PATH} fill="#aab0b7" />
            <g clipPath="url(#shovel-blade)">
              <rect ref={sandRef} x="0" y={BLADE_BOTTOM} width="40" height="1" fill="#b9803f" />
            </g>
            <path ref={moundRef} d="" fill="#b9803f" />
            <path d={BLADE_PATH} fill="none" stroke="#1c1d1f" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <span className="shovel__pct">
        <span ref={labelRef}>0</span>%
      </span>
    </div>
  );
};
