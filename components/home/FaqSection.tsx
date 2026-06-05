import { ChevronDown } from "lucide-react";
import { faqs } from "./data";

export default function FaqSection() {
  return (
    <section id="faq" className="section-block faq-section">
      <div className="container faq-head">
        <span className="eyebrow">Perguntas frequentes</span>
        <h2>Dúvidas antes de iniciar um projeto?</h2>
      </div>
      <div className="container faq-grid">
        {faqs.map((faq, index) => (
          <details key={faq.question} className="faq-item" open={index === 0}>
            <summary>{faq.question}<ChevronDown size={18} /></summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
