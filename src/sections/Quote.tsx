import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { SplitHeading } from "../components/SplitHeading";
import { CheckIcon, WhatsAppIcon } from "../components/Icons";
import { NutMark } from "../components/Logo";
import { MagneticButton } from "../components/MagneticButton";
import { QUOTE_OPTIONS } from "../data/services";
import type { ServiceId } from "../data/services";
import { CONTACTS, buildWhatsAppUrl } from "../lib/contacts";
import type { Contact } from "../lib/contacts";
import { DEADLINES, buildQuoteMessage } from "../lib/quoteMessage";
import type { Deadline } from "../lib/quoteMessage";
import { QUOTE_SELECT_EVENT } from "../lib/quoteBus";

const MIN_AREA = 50;
const MAX_AREA = 5000;
const AREA_STEP = 50;

export const Quote = () => {
  const [services, setServices] = useState<ServiceId[]>([]);
  const [place, setPlace] = useState("");
  const [area, setArea] = useState<number | null>(null);
  const [deadline, setDeadline] = useState<Deadline | null>(null);
  const [name, setName] = useState("");
  const [contactId, setContactId] = useState<Contact["id"]>("danilo");

  useEffect(() => {
    const handleSelect = (event: Event) => {
      const id = (event as CustomEvent<ServiceId>).detail;
      setServices((current) => (current.includes(id) ? current : [...current, id]));
    };
    window.addEventListener(QUOTE_SELECT_EVENT, handleSelect);
    return () => window.removeEventListener(QUOTE_SELECT_EVENT, handleSelect);
  }, []);

  const contact = CONTACTS.find((entry) => entry.id === contactId) ?? CONTACTS[0];
  const message = useMemo(
    () => buildQuoteMessage({ services, place, area, deadline, name }, contact.name),
    [services, place, area, deadline, name, contact.name],
  );
  const href = buildWhatsAppUrl(contact.whatsappNumber, message);

  const toggleService = (id: ServiceId) =>
    setServices((current) => (current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]));

  const areaPercent = area === null ? 0 : ((area - MIN_AREA) / (MAX_AREA - MIN_AREA)) * 100;

  return (
    <section id="orcamento" className="section section--sand quote">
      <div className="container">
        <header className="quote__head">
          <p className="eyebrow" data-reveal>
            Orçamento
          </p>
          <SplitHeading className="display-lg">Monte o pedido. A gente responde no zap.</SplitHeading>
          <p className="lead" data-reveal>
            Responda em 30 segundos. Sua mensagem já vai pronta para o WhatsApp do Danilo ou do Jr., sem cadastro e sem formulário perdido.
          </p>
        </header>

        <div className="quote__layout">
          <form className="quote__form" onSubmit={(event) => event.preventDefault()} data-reveal>
            <fieldset className="field">
              <legend>
                <span>1</span> O que você precisa?
              </legend>
              <div className="chips">
                {QUOTE_OPTIONS.map((option) => {
                  const active = services.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={`chip ${active ? "is-active" : ""}`}
                      aria-pressed={active}
                      onClick={() => toggleService(option.id)}
                    >
                      {active ? <CheckIcon /> : null}
                      {option.title}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="field">
              <label htmlFor="quote-place">
                <span>2</span> Onde fica a obra?
              </label>
              <input
                id="quote-place"
                type="text"
                placeholder="Bairro e cidade. Ex.: Niterói, Canoas"
                value={place}
                onChange={(event) => setPlace(event.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="field">
              <label htmlFor="quote-area">
                <span>3</span> Tamanho do terreno
                <output className="field__value">{area === null ? "não sei" : `~ ${area.toLocaleString("pt-BR")} m²`}</output>
              </label>
              <input
                id="quote-area"
                className="range"
                type="range"
                min={MIN_AREA}
                max={MAX_AREA}
                step={AREA_STEP}
                value={area ?? 500}
                style={{ "--fill": `${areaPercent}%` } as CSSProperties}
                onChange={(event) => setArea(Number(event.target.value))}
              />
              {area !== null ? (
                <button type="button" className="field__reset" onClick={() => setArea(null)}>
                  Não sei informar
                </button>
              ) : null}
            </div>

            <fieldset className="field">
              <legend>
                <span>4</span> Para quando?
              </legend>
              <div className="chips">
                {DEADLINES.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    className={`chip ${deadline === entry.id ? "is-active" : ""}`}
                    aria-pressed={deadline === entry.id}
                    onClick={() => setDeadline((current) => (current === entry.id ? null : entry.id))}
                  >
                    {entry.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="field">
              <label htmlFor="quote-name">
                <span>5</span> Seu nome <em>(opcional)</em>
              </label>
              <input id="quote-name" type="text" placeholder="Como podemos te chamar?" value={name} onChange={(event) => setName(event.target.value)} autoComplete="given-name" />
            </div>
          </form>

          <aside className="quote__preview" data-reveal data-reveal-delay={0.15}>
            <div className="phone">
              <div className="phone__bar">
                <span className="phone__avatar">
                  <NutMark />
                </span>
                <span className="phone__who">
                  <strong>{contact.name} · D.G. de Quadros</strong>
                  <small>online</small>
                </span>
              </div>
              <div className="phone__chat">
                <div className="bubble" key={message}>
                  {message.split("\n").map((line, index) => (
                    <p key={index}>{line || " "}</p>
                  ))}
                  <span className="bubble__meta">agora ✓✓</span>
                </div>
              </div>
            </div>

            <div className="quote__send">
              <div className="segmented" role="radiogroup" aria-label="Quem vai receber">
                {CONTACTS.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    role="radio"
                    aria-checked={entry.id === contactId}
                    className={entry.id === contactId ? "is-active" : ""}
                    onClick={() => setContactId(entry.id)}
                  >
                    {entry.name}
                    <small>{entry.phoneLabel}</small>
                  </button>
                ))}
              </div>
              <MagneticButton href={href} target="_blank" rel="noreferrer" className="quote__submit">
                <WhatsAppIcon />
                Enviar para {contact.name}
              </MagneticButton>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
