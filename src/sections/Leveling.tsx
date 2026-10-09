import { lazy, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { isSmallScreen } from "../lib/env";
import { useInView } from "../lib/useInView";
import { LazySceneCanvas as SceneCanvas } from "../three/LazySceneCanvas";

const LevelingScene = lazy(() => import("../three/LevelingScene").then((module) => ({ default: module.LevelingScene })));

type Phase = {
  key: "before" | "during" | "after";
  tag: string;
  title: string;
  text: string;
};

const PHASES: readonly Phase[] = [
  { key: "before", tag: "Antes", title: "Terreno bruto.", text: "Desnível, mato e terra solta. Do jeito que está, ninguém constrói em cima." },
  { key: "during", tag: "Durante", title: "Trator em ação.", text: "A lâmina corta, empurra e espalha a terra. As esteiras já deixam a primeira camada firme." },
  { key: "after", tag: "Depois", title: "Terra nivelada.", text: "Base plana, limpa e pronta para a sua obra começar com o pé direito." },
];

const STEP_COUNT = 8;
const EASE = [0.22, 1, 0.36, 1] as const;

const phaseForProgress = (progress: number): Phase["key"] => {
  if (progress < 0.22) return "before";
  if (progress > 0.86) return "after";
  return "during";
};

export const Leveling = () => {
  const wrapperRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const levelRef = useRef(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [stickyRef, inView] = useInView<HTMLDivElement>({ rootMargin: "100px 0px" });
  const [phaseKey, setPhaseKey] = useState<Phase["key"]>("before");
  const compact = isSmallScreen();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        setPhaseKey(phaseForProgress(self.progress));
      },
    });

    const update = () => {
      const level = levelRef.current;
      if (counterRef.current) counterRef.current.textContent = String(Math.round(level * 100)).padStart(3, "0");
      if (barRef.current) barRef.current.style.transform = `scaleX(${level})`;
      stepsRef.current?.querySelectorAll<HTMLElement>("[data-step]").forEach((node, index) => {
        node.classList.toggle("is-on", level >= (index + 1) / STEP_COUNT - 0.02);
      });
    };
    gsap.ticker.add(update);
    return () => {
      gsap.ticker.remove(update);
      trigger.kill();
    };
  }, []);

  const phase = PHASES.find((entry) => entry.key === phaseKey) ?? PHASES[0];

  return (
    <section id="terra-nivelada" ref={wrapperRef} className="leveling section--sand">
      <div ref={stickyRef} className="leveling__sticky">
        <div className="leveling__canvas" aria-hidden="true">
          <SceneCanvas active={inView} camera={{ position: [0, 12.6, 10.8], fov: 36 }}>
            <LevelingScene progressRef={progressRef} levelRef={levelRef} compact={compact} />
          </SceneCanvas>
        </div>

        <div className="leveling__copy">
          <p className="eyebrow">Terraplanagem na prática</p>
          <div className="leveling__phase" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase?.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <span className={`leveling__tag leveling__tag--${phase?.key}`}>{phase?.tag}</span>
                <h2 className="display-lg">{phase?.title}</h2>
                <p className="lead">{phase?.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="leveling__meter">
          <div className="leveling__readout">
            <span className="leveling__readout-label">Nivelado</span>
            <strong>
              <span ref={counterRef}>000</span>
              <small>%</small>
            </strong>
          </div>
          <div ref={stepsRef} className="leveling__steps" aria-hidden="true">
            {Array.from({ length: STEP_COUNT }, (_, index) => (
              <span key={index} data-step style={{ height: `${18 + index * 9}px` }} />
            ))}
          </div>
          <div className="leveling__bar" aria-hidden="true">
            <span ref={barRef} />
          </div>
        </div>

        <p className="leveling__hint" aria-hidden="true">
          Role para nivelar <span>↓</span>
        </p>
      </div>
    </section>
  );
};
