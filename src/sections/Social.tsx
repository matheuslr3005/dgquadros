import type { ReactNode } from "react";
import { ArrowIcon, InstagramIcon } from "../components/Icons";
import { NutMark, StairMark } from "../components/Logo";
import { SplitHeading } from "../components/SplitHeading";
import { COMPANY } from "../lib/contacts";

type Tile = {
  id: string;
  tone: "dark" | "yellow";
  content: ReactNode;
};

const TILES: readonly Tile[] = [
  {
    id: "marca",
    tone: "dark",
    content: (
      <>
        <NutMark className="tile__nut" />
        <p className="tile__line">
          Nova marca.
          <br />
          <em>Mesma força.</em>
        </p>
      </>
    ),
  },
  {
    id: "retro",
    tone: "yellow",
    content: (
      <>
        <p className="tile__kicker">Locação de</p>
        <p className="tile__big">Retro&shy;escavadeira</p>
        <p className="tile__kicker">com operador</p>
        <StairMark className="tile__stairs" color="#1c1d1f" />
      </>
    ),
  },
  {
    id: "reels",
    tone: "dark",
    content: (
      <>
        <span className="tile__tag">Reels</span>
        <span className="tile__play" aria-hidden="true" />
        <p className="tile__line">Um dia de obra</p>
      </>
    ),
  },
  {
    id: "antes",
    tone: "yellow",
    content: (
      <>
        <div className="tile__split">
          <span>Antes</span>
          <span>Depois</span>
        </div>
        <p className="tile__line tile__line--dark">Limpeza de terreno</p>
      </>
    ),
  },
  {
    id: "frota",
    tone: "dark",
    content: (
      <>
        <p className="tile__big tile__big--yellow">Nossa frota</p>
        <ul className="tile__list">
          <li>Escavadeira hidráulica</li>
          <li>Retroescavadeira</li>
          <li>Trator de esteira</li>
          <li>Rolo compactador</li>
          <li>Caminhões caçamba</li>
        </ul>
      </>
    ),
  },
  {
    id: "orcamento",
    tone: "yellow",
    content: (
      <>
        <p className="tile__kicker">Peça seu</p>
        <p className="tile__big">Orçamento</p>
        <span className="tile__pill">51 99952-1037</span>
      </>
    ),
  },
];

export const Social = () => (
  <section className="section section--graphite social" id="instagram">
    <div className="container">
      <header className="social__head">
        <div>
          <p className="eyebrow" data-reveal>
            Acompanhe as obras
          </p>
          <SplitHeading className="display-lg">Siga a obra no Instagram.</SplitHeading>
        </div>
        <a className="social__handle" href={COMPANY.instagramUrl} target="_blank" rel="noreferrer" data-reveal data-cursor="cta">
          <InstagramIcon />
          <span>@{COMPANY.instagramHandle}</span>
          <ArrowIcon />
        </a>
      </header>

      <div className="social__grid">
        {TILES.map((tile, index) => (
          <a
            key={tile.id}
            className={`tile tile--${tile.tone}`}
            href={COMPANY.instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Ver post no Instagram: ${tile.id}`}
            data-reveal="scale"
            data-reveal-delay={index * 0.04}
            data-cursor="link"
          >
            <span className="tile__number">{index + 1}</span>
            {tile.content}
          </a>
        ))}
      </div>
    </div>
  </section>
);
