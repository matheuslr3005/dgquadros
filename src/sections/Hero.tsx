import { lazy, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { isSmallScreen, prefersReducedMotion } from "../lib/env";
import { useInView } from "../lib/useInView";
import { SplitHeading } from "../components/SplitHeading";
import { MagneticButton } from "../components/MagneticButton";
import { ArrowDownIcon, ArrowIcon, WhatsAppIcon } from "../components/Icons";
import { LazySceneCanvas as SceneCanvas } from "../three/LazySceneCanvas";
import { primaryWhatsAppUrl } from "../lib/contacts";

const HeroScene = lazy(() => import("../three/HeroScene").then((module) => ({ default: module.HeroScene })));

type HeroProps = {
  introDone: boolean;
};

export const Hero = ({ introDone }: HeroProps) => {
  const sectionRef = useRef<HTMLElement>(null!);
  const scrollProgress = useRef(0);
  const pokes = useRef(0);
  const [viewRef, inView] = useInView<HTMLDivElement>({ rootMargin: "0px" });
  const compact = isSmallScreen();

  useEffect(() => {
    const section = sectionRef.current;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      });
      if (!prefersReducedMotion()) {
        gsap.to(".hero__headline", {
          yPercent: -18,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
        });
      }
    }, section);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!introDone || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".hero__eyebrow", { opacity: 0, y: 20, duration: 0.8 }, 0.1)
        .from(".hero__lead", { opacity: 0, y: 30, duration: 0.9 }, 0.5)
        .from(".hero__actions > *", { opacity: 0, y: 30, duration: 0.8, stagger: 0.12 }, 0.7)
        .from(".hero__chip", { opacity: 0, x: 40, duration: 0.8, stagger: 0.1 }, 0.9)
        .from(".hero__scroll", { opacity: 0, duration: 1 }, 1.4);
    }, sectionRef);
    return () => ctx.revert();
  }, [introDone]);

  return (
    <section
      id="topo"
      ref={sectionRef}
      className="hero"
      onClick={() => {
        pokes.current += 1;
      }}
    >
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__grid" aria-hidden="true" />

      <div className="hero__copy">
        <p className="eyebrow hero__eyebrow">Terraplanagem e Transportes · Canoas/RS</p>
        <div className="hero__headline">
          <SplitHeading as="h1" className="display-xl hero__title" mode="manual" play={introDone} delay={0.15}>
            Terra nivelada.
          </SplitHeading>
          <SplitHeading as="h1" className="display-xl hero__title hero__title--accent" mode="manual" play={introDone} delay={0.4}>
            Força de máquina.
          </SplitHeading>
        </div>
      </div>

      <div ref={viewRef} className="hero__canvas" aria-hidden="true">
        <SceneCanvas active={inView && introDone} eventSource={sectionRef} camera={{ position: [2.6, 5.4, 19], fov: 34 }}>
          <HeroScene scrollRef={scrollProgress} pokeRef={pokes} compact={compact} />
        </SceneCanvas>
      </div>

      <div className="hero__spacer" aria-hidden="true" />

      <div className="hero__foot">
        <p className="hero__lead">
          Escavação, aterro, demolição e limpeza de terreno com <strong>frota própria</strong> e operador. Atendemos Canoas e Grande Porto Alegre.
        </p>
        <div className="hero__actions">
          <MagneticButton href={primaryWhatsAppUrl()} target="_blank" rel="noreferrer">
            <WhatsAppIcon />
            Pedir orçamento
          </MagneticButton>
          <MagneticButton variant="ghost" href="#frota">
            Ver a frota
            <ArrowIcon />
          </MagneticButton>
        </div>
      </div>

      <ul className="hero__chips" aria-label="Diferenciais">
        <li className="hero__chip">
          <strong>05</strong>
          <span>tipos de máquina</span>
        </li>
        <li className="hero__chip">
          <strong>100%</strong>
          <span>frota própria</span>
        </li>
        <li className="hero__chip">
          <strong>Direto</strong>
          <span>no WhatsApp</span>
        </li>
      </ul>

      <a href="#servicos" className="hero__scroll" aria-label="Rolar para os serviços">
        <span>Role</span>
        <ArrowDownIcon />
      </a>
      <p className="hero__hint" aria-hidden="true">
        Clique na cena para cavar
      </p>
    </section>
  );
};
