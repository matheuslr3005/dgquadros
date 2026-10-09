import { SplitHeading } from "../components/SplitHeading";
import type { CSSProperties } from "react";
import { StairMark } from "../components/Logo";

type Step = {
  number: string;
  title: string;
  text: string;
};

const STEPS: readonly Step[] = [
  { number: "01", title: "Chama no WhatsApp", text: "Fale direto com o Danilo ou com o Jr. Conte o que precisa e onde fica a obra." },
  { number: "02", title: "Avaliação", text: "Entendemos o terreno, o volume de terra e escolhemos as máquinas certas para o serviço." },
  { number: "03", title: "Orçamento", text: "Você recebe valor e prazo combinados antes de qualquer máquina sair do pátio." },
  { number: "04", title: "Máquina na obra", text: "Frota própria e operador no local. Terra nivelada, obra pronta para começar." },
];

export const Process = () => (
  <section id="processo" className="section section--graphite process">
    <div className="container">
      <header className="process__head">
        <p className="eyebrow" data-reveal>
          Como funciona
        </p>
        <SplitHeading className="display-lg">Do WhatsApp à obra, degrau por degrau.</SplitHeading>
      </header>

      <ol className="process__steps">
        {STEPS.map((step, index) => (
          <li
            key={step.number}
            className={`process__step ${index === STEPS.length - 1 ? "is-last" : ""}`}
            style={{ "--rise": `${index * 64}px` } as CSSProperties}
            data-reveal
            data-reveal-delay={index * 0.05}
          >
            <span className="process__number">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
            {index === STEPS.length - 1 ? <StairMark className="process__stairs" color="rgba(28,29,31,0.14)" /> : null}
          </li>
        ))}
      </ol>
    </div>
  </section>
);
