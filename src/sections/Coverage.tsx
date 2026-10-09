import { PinIcon } from "../components/Icons";
import { NutMark } from "../components/Logo";
import { SplitHeading } from "../components/SplitHeading";
import { COMPANY } from "../lib/contacts";

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${COMPANY.address}, ${COMPANY.neighborhood}, Canoas, RS`,
)}`;

export const Coverage = () => (
  <section className="section section--sand coverage" id="atendimento">
    <div className="container coverage__layout">
      <div className="coverage__copy">
        <p className="eyebrow" data-reveal>
          Onde atuamos
        </p>
        <SplitHeading className="display-lg">Canoas e Grande Porto Alegre.</SplitHeading>
        <p className="lead" data-reveal>
          Nosso pátio fica no bairro Niterói, em Canoas. De lá, a frota sai para obras na cidade e na região.
        </p>
        <a className="coverage__address" href={MAPS_URL} target="_blank" rel="noreferrer" data-reveal data-cursor="link">
          <PinIcon />
          <span>
            {COMPANY.address} · {COMPANY.neighborhood}
            <small>{COMPANY.city} · ver no mapa</small>
          </span>
        </a>
      </div>

      <div className="radar" data-reveal="scale" aria-hidden="true">
        <div className="radar__rings">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="radar__sweep" />
        <span className="radar__axis radar__axis--h" />
        <span className="radar__axis radar__axis--v" />
        <div className="radar__center">
          <NutMark />
          <span className="radar__pulse" />
        </div>
        <span className="radar__ping radar__ping--a">
          <i /> Porto Alegre
        </span>
        <span className="radar__ping radar__ping--b">
          <i /> Grande POA
        </span>
        <span className="radar__ping radar__ping--c">
          <i /> Canoas
        </span>
        <span className="radar__north">N</span>
      </div>
    </div>
  </section>
);
