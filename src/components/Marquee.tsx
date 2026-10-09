import { StairMark } from "./Logo";

type MarqueeProps = {
  items: readonly string[];
  reverse?: boolean;
  tone?: "yellow" | "graphite";
};

export const Marquee = ({ items, reverse = false, tone = "yellow" }: MarqueeProps) => {
  const track = [...items, ...items];
  return (
    <div className={`marquee marquee--${tone} ${reverse ? "is-reverse" : ""}`} aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <div className="marquee__group" key={copy}>
            {track.map((item, index) => (
              <span className="marquee__item" key={`${copy}-${item}-${index}`}>
                {item}
                <StairMark className="marquee__mark" color="currentColor" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
