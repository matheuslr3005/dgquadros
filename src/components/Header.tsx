import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./Icons";
import { MagneticButton } from "./MagneticButton";
import { primaryWhatsAppUrl } from "../lib/contacts";

const NAV_ITEMS = [
  { href: "#servicos", label: "Serviços" },
  { href: "#frota", label: "Frota" },
  { href: "#terra-nivelada", label: "Terraplanagem" },
  { href: "#processo", label: "Como funciona" },
  { href: "#orcamento", label: "Orçamento" },
] as const;

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`header ${scrolled ? "is-scrolled" : ""} ${menuOpen ? "is-open" : ""}`}>
      <a href="#topo" className="header__brand" aria-label="D.G. de Quadros — início" onClick={closeMenu}>
        <Logo />
      </a>

      <nav className="header__nav" aria-label="Principal">
        {NAV_ITEMS.map((item) => (
          <a key={item.href} href={item.href} onClick={closeMenu}>
            {item.label}
          </a>
        ))}
      </nav>

      <MagneticButton
        className="header__cta"
        href={primaryWhatsAppUrl()}
        target="_blank"
        rel="noreferrer"
        strength={0.25}
      >
        <WhatsAppIcon />
        <span>Orçamento</span>
      </MagneticButton>

      <button
        type="button"
        className="header__burger"
        aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
      </button>
    </header>
  );
};
