import { useId } from "react";

type NutMarkProps = {
  tone?: "yellow" | "graphite";
  className?: string;
};

/** Hexagonal nut seal with the DG monogram (option B of the brand plan). */
export const NutMark = ({ tone = "yellow", className }: NutMarkProps) => {
  const hex = tone === "yellow" ? "#F5B700" : "#1C1D1F";
  const core = tone === "yellow" ? "#1C1D1F" : "#F5B700";
  return (
    <svg className={className} viewBox="0 0 120 120" role="img" aria-label="D.G. de Quadros">
      <polygon points="60,6 107,33 107,87 60,114 13,87 13,33" fill={hex} />
      <circle cx="60" cy="60" r="31" fill={core} />
      <text
        x="60"
        y="73"
        textAnchor="middle"
        fontFamily="'Barlow Condensed', 'Arial Narrow', sans-serif"
        fontWeight="900"
        fontSize="38"
        fill={hex}
      >
        DG
      </text>
    </svg>
  );
};

type StairMarkProps = {
  className?: string;
  color?: string;
};

/** Stepped terrain cut: the symbol of option A, reused as the site's visual motif. */
export const StairMark = ({ className, color = "#F5B700" }: StairMarkProps) => {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <title id={id}>Degraus de terraplanagem</title>
      <rect x="0" y="0" width="100" height="9" fill={color} />
      <path d="M0 22H34V50H60V76H100V100H0Z" fill={color} />
    </svg>
  );
};

type LogoProps = {
  className?: string;
};

export const Logo = ({ className }: LogoProps) => (
  <span className={`logo ${className ?? ""}`}>
    <StairMark className="logo__stair" />
    <span className="logo__text">
      <strong>D.G. DE QUADROS</strong>
      <small>Terraplanagem · Transportes</small>
    </span>
  </span>
);
