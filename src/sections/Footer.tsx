import { useRef } from "react";
import type { PointerEvent } from "react";
import { ArrowIcon, InstagramIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "../components/Icons";
import { Logo } from "../components/Logo";
import { CONTACTS, COMPANY, buildWhatsAppUrl, DEFAULT_MESSAGE } from "../lib/contacts";

export const Footer = () => {
  const bigRef = useRef<HTMLParagraphElement>(null);

  const handleMove = (event: PointerEvent<HTMLParagraphElement>) => {
    const node = bigRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    node.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <footer className="footer">
      <div className="hazard" aria-hidden="true" />
      <div className="footer__inner container">
        <div className="footer__cta">
          <p className="eyebrow">Vamos nivelar o seu terreno?</p>
          <p ref={bigRef} className="footer__big" onPointerMove={handleMove} aria-hidden="true">
            Fala com a gente.
          </p>
        </div>

        <div className="footer__cols">
          <div className="footer__col footer__col--brand">
            <Logo />
            <p>Nova marca. Mesma força. Terraplanagem e transportes em Canoas e Grande Porto Alegre.</p>
          </div>

          <div className="footer__col">
            <h4>Contato direto</h4>
            {CONTACTS.map((contact) => (
              <div className="footer__contact" key={contact.id}>
                <strong>{contact.name}</strong>
                <a href={`tel:+${contact.whatsappNumber}`} className="footer__phone">
                  <PhoneIcon /> {contact.phoneLabel}
                </a>
                <a
                  href={buildWhatsAppUrl(contact.whatsappNumber, DEFAULT_MESSAGE)}
                  target="_blank"
                  rel="noreferrer"
                  className="footer__wa"
                  data-cursor="link"
                >
                  <WhatsAppIcon /> WhatsApp <ArrowIcon />
                </a>
              </div>
            ))}
          </div>

          <div className="footer__col">
            <h4>Onde estamos</h4>
            <p className="footer__line">
              <PinIcon />
              <span>
                {COMPANY.address}
                <br />
                {COMPANY.neighborhood} · {COMPANY.city}
              </span>
            </p>
            <h4>Redes</h4>
            <a className="footer__line footer__link" href={COMPANY.instagramUrl} target="_blank" rel="noreferrer" data-cursor="link">
              <InstagramIcon />
              <span>@{COMPANY.instagramHandle}</span>
            </a>
          </div>

          <div className="footer__col">
            <h4>Navegue</h4>
            <a href="#servicos">Serviços</a>
            <a href="#frota">Frota</a>
            <a href="#terra-nivelada">Terraplanagem</a>
            <a href="#processo">Como funciona</a>
            <a href="#orcamento">Orçamento</a>
          </div>
        </div>

        <div className="footer__legal">
          <span>© {new Date().getFullYear()} D.G. de Quadros Terraplanagem e Transportes</span>
          <a href="#topo" data-cursor="link">
            Voltar ao topo ↑
          </a>
        </div>
      </div>
    </footer>
  );
};
