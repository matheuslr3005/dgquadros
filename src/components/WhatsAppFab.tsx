import { useEffect, useState } from "react";
import { WhatsAppIcon } from "./Icons";
import { primaryWhatsAppUrl } from "../lib/contacts";

export const WhatsAppFab = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      className={`fab ${visible ? "is-visible" : ""}`}
      href={primaryWhatsAppUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label="Pedir orçamento no WhatsApp"
      data-cursor="cta"
    >
      <span className="fab__ring" />
      <WhatsAppIcon />
      <span className="fab__label">Orçamento</span>
    </a>
  );
};
