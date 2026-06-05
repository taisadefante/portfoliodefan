import Image from "next/image";
import { values } from "./data";

export default function About() {
  return (
    <section id="sobre" className="section-block about-section">
      <div className="container about-grid">
        <article className="glass-card about-main">
          <span className="eyebrow">Sobre a Defan</span>
          <h2>Cada projeto é criado para representar melhor a empresa por trás da tela.</h2>
          <p>
            A Defan Soluções Digitais cria páginas, sites, sistemas e automações para empresas que querem
            melhorar sua presença online, apresentar seus serviços com mais profissionalismo e vender com mais segurança.
          </p>
          <p>
            O objetivo não é apenas criar uma tela bonita. É construir uma solução que comunique valor,
            facilite o contato do cliente e ajude o negócio a funcionar melhor no dia a dia.
          </p>
        </article>
        <article className="glass-card founder-card">
          <Image src="/logo-white.png" alt="Defan Soluções Digitais" width={260} height={90} />
          <span className="eyebrow">Criado por</span>
          <h3>Tais Defante</h3>
          <p>
            Desenvolvimento, design, automação e organização de processos para criar soluções digitais com cara de empresa grande.
          </p>
        </article>
      </div>
      <div className="container values-grid">
        {values.map((value, index) => {
          const Icon = value.icon;
          return (
            <article className="value-card" key={value.title} style={{ animationDelay: `${index * 90}ms` }}>
              <Icon size={25} />
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
