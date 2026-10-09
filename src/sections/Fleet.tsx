import { lazy, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SplitHeading } from "../components/SplitHeading";
import { ArrowIcon } from "../components/Icons";
import { FLEET } from "../data/fleet";
import type { FleetItem, MachineId } from "../data/fleet";
import { useInView } from "../lib/useInView";
import { LazySceneCanvas as SceneCanvas } from "../three/LazySceneCanvas";
import { primaryWhatsAppUrl } from "../lib/contacts";

const FleetScene = lazy(() => import("../three/FleetScene").then((module) => ({ default: module.FleetScene })));

const EASE = [0.22, 1, 0.36, 1] as const;

type MachineInfoProps = {
  item: FleetItem;
};

const MachineInfo = ({ item }: MachineInfoProps) => (
  <motion.div
    key={item.id}
    className="fleet__info"
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    transition={{ duration: 0.45, ease: EASE }}
  >
    <p className="fleet__tagline">{item.tagline}</p>
    <h3 className="fleet__name">{item.name}</h3>
    <p className="fleet__description">{item.description}</p>
    <ul className="fleet__uses">
      {item.uses.map((use, index) => (
        <motion.li key={use} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + index * 0.07, duration: 0.4, ease: EASE }}>
          {use}
        </motion.li>
      ))}
    </ul>
    <a
      className="fleet__cta"
      href={primaryWhatsAppUrl(`Olá! Tenho interesse em ${item.name}. Pode me passar um orçamento?`)}
      target="_blank"
      rel="noreferrer"
      data-cursor="cta"
    >
      Pedir {item.short.toLowerCase()} <ArrowIcon />
    </a>
  </motion.div>
);

export const Fleet = () => {
  const [selected, setSelected] = useState<MachineId>("retroescavadeira");
  const [stageRef, inView] = useInView<HTMLDivElement>();
  const current = FLEET.find((item) => item.id === selected) ?? FLEET[0];

  return (
    <section id="frota" className="section section--graphite fleet">
      <div className="container">
        <header className="fleet__head">
          <p className="eyebrow" data-reveal>
            Frota própria
          </p>
          <SplitHeading className="display-lg">Gire, arraste e conheça as máquinas.</SplitHeading>
        </header>

        <div className="fleet__layout">
          <div ref={stageRef} className="fleet__stage" data-cursor="drag" data-reveal="scale">
            <SceneCanvas active={inView} camera={{ position: [9.6, 5.6, 11.6], fov: 33 }}>
              <FleetScene machine={selected} />
            </SceneCanvas>
            <span className="fleet__stage-label" aria-hidden="true">
              {String(FLEET.findIndex((item) => item.id === selected) + 1).padStart(2, "0")} / {String(FLEET.length).padStart(2, "0")}
            </span>
          </div>

          <div className="fleet__panel">
            <div className="fleet__tabs" role="tablist" aria-label="Máquinas da frota">
              {FLEET.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={item.id === selected}
                  className={`fleet__tab ${item.id === selected ? "is-active" : ""}`}
                  onClick={() => setSelected(item.id)}
                  data-cursor="link"
                >
                  <span className="fleet__tab-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="fleet__tab-name">{item.name}</span>
                  <ArrowIcon />
                </button>
              ))}
            </div>
            <div className="fleet__info-wrap" aria-live="polite">
              <AnimatePresence mode="wait">{current ? <MachineInfo item={current} /> : null}</AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
