import { Star } from "lucide-react";
import { testimonials } from "./data";

export default function Testimonials() {
  return (
    <section id="depoimentos" className="section-block testimonials-section">
      <div className="container testimonial-layout">
        <div className="testimonial-title">
          <span className="eyebrow">Depoimentos</span>
          <h2>Empresas que confiam no nosso trabalho</h2>
          <a className="btn btn-ghost" href="#contato">Ver proposta</a>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((item, index) => (
            <article className="testimonial-card" key={item.name} style={{ animationDelay: `${index * 90}ms` }}>
              <div className="stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
              <p>{item.text}</p>
              <strong>{item.name}</strong>
              <span>{item.company}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
