
import { Link } from "react-router-dom";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
  primary?: { label: string; to: string };
  secondary?: { label: string; to: string };
};

export default function Hero({ eyebrow, title, subtitle, image, primary, secondary }: Props) {
  return (
    <section className="hero">
      <div className="container grid cols-2 gap-24 center-vert">
        <div className="stack gap-16">
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h1 dangerouslySetInnerHTML={{ __html: title }} />
          {subtitle && <p className="lead">{subtitle}</p>}
          <div className="flex gap-12">
            {primary && <Link className="btn primary" to={primary.to}>{primary.label}</Link>}
            {secondary && <Link className="btn ghost" to={secondary.to}>{secondary.label}</Link>}
          </div>
          <ul className="kpis">
            <li><strong>60%</strong><span>Cost savings</span></li>
            <li><strong>&lt;60s</strong><span>First reply</span></li>
            <li><strong>24/7</strong><span>Coverage</span></li>
          </ul>
        </div>
        <div className="hero-media">
          {image
            ? <img src={image} alt="" />
            : <div className="media-fallback" aria-hidden />}
        </div>
      </div>
      <div className="hero-glow" />
    </section>
  );
}
