import { MessageCircle, Phone, Send } from "lucide-react";
import { whatsappUrl } from "./data";

export default function FinalCta() {
  return (
    <section id="contato" className="final-cta-section">
      <div className="container final-cta-card">
        <div className="telegram-icon"><Send size={42} /></div>
        <div>
          <h2>Vamos transformar sua presença digital em algo mais profissional?</h2>
          <p>Fale com a gente e receba uma proposta personalizada para o seu negócio.</p>
        </div>
        <div className="final-actions">
          <a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer">Conversar no WhatsApp <MessageCircle size={18} /></a>
          <a className="btn btn-ghost" href="tel:+5521988359825">Ligação rápida <Phone size={18} /></a>
        </div>
      </div>
    </section>
  );
}
