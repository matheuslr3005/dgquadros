import { SplitHeading } from "../components/SplitHeading";
import { TiltCard } from "../components/TiltCard";
import { StairMark } from "../components/Logo";
import { ArrowIcon, HammerIcon, LayersIcon, LeafIcon, ShovelIcon, WhatsAppIcon } from "../components/Icons";
import { SERVICES } from "../data/services";
import type { ServiceId } from "../data/services";
import { selectQuoteService } from "../lib/quoteBus";
import { primaryWhatsAppUrl } from "../lib/contacts";
import type { ReactNode } from "react";

const ICONS: Record<ServiceId, ReactNode> = {
  escavacao: <ShovelIcon />,
  aterro: <LayersIcon />,
  demolicao: <HammerIcon />,
  limpeza: <LeafIcon />,
  locacao: <ShovelIcon />,
  transporte: <ShovelIcon />,
  compactacao: <LayersIcon />,
};

export const Services = () => (
  <section id="servicos" className="section section--sand services">
    <div className="container">
      <header className="services__head">
        <div>
          <p className="eyebrow" data-reveal>
            O que fazemos
          </p>
          <SplitHeading className="display-lg services__title">Do terreno bruto à obra pronta.</SplitHeading>
        </div>
        <p className="lead" data-reveal data-reveal-delay={0.15}>
          Cada serviço sai com a máquina certa e um operador na cabine. A frota é nossa, então o prazo também.
        </p>
      </header>

      <div className="services__grid">
        {SERVICES.map((service, index) => (
          <TiltCard key={service.id} className="service-card" data-reveal data-cursor="link">
            <span className="service-card__index">{String(index + 1).padStart(2, "0")}</span>
            <span className="service-card__icon">{ICONS[service.id]}</span>
            <h3>{service.title}</h3>
            <p>{service.text}</p>
            <a
              href="#orcamento"
              className="service-card__link"
              onClick={() => selectQuoteService(service.id)}
              aria-label={`Pedir orçamento de ${service.title}`}
            >
              Pedir orçamento <ArrowIcon />
            </a>
          </TiltCard>
        ))}

        <TiltCard className="service-card service-card--featured" data-reveal data-reveal-delay={0.1} max={4}>
          <StairMark className="service-card__stairs" color="rgba(28,29,31,0.12)" />
          <span className="service-card__badge">Carro-chefe</span>
          <h3>
            Locação de
            <br />
            retroescavadeira
          </h3>
          <p>Máquina com operador, no local da obra. Abre vala, carrega, nivela e resolve o serviço do dia.</p>
          <a className="service-card__cta" href={primaryWhatsAppUrl("Olá! Gostaria de alugar uma retroescavadeira com operador.")} target="_blank" rel="noreferrer" data-cursor="cta">
            <WhatsAppIcon /> Chamar no WhatsApp
          </a>
        </TiltCard>
      </div>
    </div>
  </section>
);
