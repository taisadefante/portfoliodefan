import { services } from "./data";
import SectionTitle from "./SectionTitle";

export default function Services() {
  return (
    <section id="servicos" className="section-block">
      <div className="container">
        <SectionTitle eyebrow="Serviços" title="Soluções digitais para empresas que precisam transmitir confiança" />
        <div className="services-grid">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <article className="service-card" key={service.title} style={{ animationDelay: `${index * 80}ms` }}>
                <div className="service-icon"><Icon size={30} /></div>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
                <span className="card-arrow">↗</span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
