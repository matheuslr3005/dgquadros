import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { prefersReducedMotion } from "../lib/env";
import { Marquee } from "../components/Marquee";

const MARQUEE_ITEMS = ["Escavação", "Aterro", "Demolição", "Limpeza de terreno", "Locação de retroescavadeira", "Transporte"] as const;

type Stat = { value: number; suffix?: string; label: string; pad?: number };

const STATS: readonly Stat[] = [
  { value: 5, label: "tipos de máquina na frota", pad: 2 },
  { value: 4, label: "serviços de terraplanagem", pad: 2 },
  { value: 100, suffix: "%", label: "frota própria" },
  { value: 2, label: "contatos diretos no WhatsApp", pad: 2 },
];

const formatValue = (value: number, pad = 0): string => String(Math.round(value)).padStart(pad, "0");

export const Numbers = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
        const target = Number(node.dataset["count"]);
        const pad = Number(node.dataset["pad"] ?? 0);
        if (prefersReducedMotion()) {
          node.textContent = formatValue(target, pad);
          return;
        }
        const counter = { value: 0 };
        gsap.to(counter, {
          value: target,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            node.textContent = formatValue(counter.value, pad);
          },
          scrollTrigger: { trigger: node, start: "top 92%", once: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="numbers">
      <Marquee items={MARQUEE_ITEMS} />
      <div className="numbers__row container">
        {STATS.map((stat) => (
          <div className="numbers__item" key={stat.label} data-reveal>
            <strong>
              <span data-count={stat.value} data-pad={stat.pad ?? 0}>
                {formatValue(stat.value, stat.pad)}
              </span>
              {stat.suffix}
            </strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
