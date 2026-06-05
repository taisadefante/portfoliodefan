import { techItems } from "./data";

export default function TechMarquee() {
  return (
    <section className="tech-strip" aria-label="Tecnologias e soluções">
      <div className="container tech-row">
        {[...techItems, ...techItems].map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </section>
  );
}
