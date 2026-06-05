import Image from "next/image";
import { ArrowRight, Code2, Mail, MessageCircle, Phone, Sparkles } from "lucide-react";

const whatsappUrl = `https://wa.me/5521988359825?text=${encodeURIComponent(
  "Olá, Tais! Vi o site da Defan e quero falar sobre um projeto digital.",
)}`;

const footerColumns = [
  {
    title: "Serviços",
    links: [
      { label: "Criação de sites", href: "#servicos" },
      { label: "Landing pages", href: "#servicos" },
      { label: "Sistemas web", href: "#servicos" },
      { label: "Automações", href: "#servicos" },
    ],
  },
  {
    title: "Soluções",
    links: [
      { label: "Projetos", href: "/projetos" },
      { label: "Assinaturas", href: "/assinaturas" },
      { label: "Portfólio", href: "#projetos" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Contato",
    links: [
      { label: "WhatsApp", href: whatsappUrl, external: true },
      { label: "E-mail", href: "mailto:taisadefante@hotmail.com" },
      { label: "Proposta", href: "#contato" },
      { label: "Ver projetos reais", href: "/projetos" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-glow footer-glow-1" />
      <div className="footer-glow footer-glow-2" />

      <div className="container footer-container">
        <div className="footer-top">
          <div className="footer-brand-card glass-card">
            <a href="/" className="footer-logo" aria-label="Defan Soluções Digitais">
              <Image
                src="/logo-white.png"
                alt="Defan Soluções Digitais"
                width={260}
                height={90}
                priority={false}
              />
            </a>

            <p>
              Sites, sistemas, automações e soluções digitais para empresas que querem parecer mais profissionais,
              vender com mais confiança e organizar melhor sua operação.
            </p>

            <div className="footer-mini-grid">
              <span>
                <Sparkles size={16} /> Visual premium
              </span>
              <span>
                <Code2 size={16} /> Tecnologia moderna
              </span>
            </div>
          </div>

          <div className="footer-links-grid">
            {footerColumns.map((column) => (
              <nav key={column.title} className="footer-column" aria-label={column.title}>
                <h3>{column.title}</h3>

                {column.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                  >
                    {link.label}
                    <ArrowRight size={14} />
                  </a>
                ))}
              </nav>
            ))}
          </div>
        </div>

        <div className="footer-contact-strip glass-card">
          <div>
            <span className="eyebrow">Próximo passo</span>
            <h2>Pronta para transformar sua presença digital?</h2>
            <p>Fale comigo e receba uma proposta alinhada com o momento do seu negócio.</p>
          </div>

          <div className="footer-actions">
            <a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={18} /> WhatsApp
            </a>

            <a className="btn btn-ghost" href="mailto:taisadefante@hotmail.com">
              <Mail size={18} /> E-mail
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Defan Soluções Digitais. Todos os direitos reservados.</span>
          <span className="footer-bottom-links">
            <a href="tel:+5521988359825">
              <Phone size={15} /> +55 21 98835-9825
            </a>
            <a href="/projetos">Projetos</a>
            <a href="/assinaturas">Assinaturas</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
