"use client";

import Image from "next/image";
import {
  ArrowRight,
  Code2,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";

const whatsappUrl = `https://wa.me/5521988359825?text=${encodeURIComponent(
  "Olá, Tais! Vi o site da Defan e quero falar sobre um projeto digital.",
)}`;

const footerLinks = [
  { label: "Serviços", href: "#servicos" },
  { label: "Projetos", href: "/projetos" },
  { label: "Assinaturas", href: "/assinaturas" },
  { label: "FAQ", href: "#faq" },
  { label: "Contato", href: "#contato" },
];

function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        fill="#25D366"
        d="M16.04 3C8.86 3 3.02 8.78 3.02 15.88c0 2.27.6 4.49 1.75 6.44L3 29l6.88-1.78a13.1 13.1 0 0 0 6.16 1.55c7.18 0 13.02-5.78 13.02-12.88C29.06 8.78 23.22 3 16.04 3Z"
      />
      <path
        fill="#fff"
        d="M23.47 19.08c-.4-.2-2.36-1.15-2.73-1.28-.36-.13-.63-.2-.9.2-.26.39-1.03 1.27-1.26 1.53-.23.26-.46.29-.86.1-.4-.2-1.69-.61-3.22-1.94-1.19-1.04-2-2.33-2.23-2.72-.23-.4-.02-.61.18-.81.18-.18.4-.46.6-.69.2-.23.26-.39.4-.65.13-.26.06-.49-.03-.69-.1-.2-.9-2.14-1.23-2.93-.32-.76-.65-.66-.9-.67h-.76c-.26 0-.69.1-1.05.49-.36.4-1.38 1.33-1.38 3.24s1.41 3.76 1.61 4.02c.2.26 2.78 4.2 6.73 5.88.94.4 1.67.64 2.24.82.94.3 1.8.26 2.48.16.76-.11 2.36-.95 2.69-1.87.33-.92.33-1.71.23-1.87-.1-.16-.36-.26-.76-.46Z"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <>
      <style jsx>{`
        .footer-link:hover {
          color: #38bdf8 !important;
          transform: translateX(4px);
        }

        .footer-link:hover svg {
          transform: translateX(4px);
        }

        .floating-whatsapp:hover {
          transform: translateY(-6px) scale(1.04) !important;
          box-shadow: 0 22px 60px rgba(37, 211, 102, 0.45) !important;
        }

        @media (max-width: 760px) {
          .footer-main {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }

          .footer-card {
            padding: 24px !important;
            text-align: center !important;
          }

          .footer-logo-wrap {
            justify-content: center !important;
          }

          .footer-links {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }

          .footer-cta {
            grid-template-columns: 1fr !important;
            text-align: center !important;
            padding: 24px !important;
          }

          .footer-actions {
            justify-content: center !important;
            flex-direction: column !important;
          }

          .footer-actions a {
            width: 100% !important;
            justify-content: center !important;
          }

          .footer-bottom {
            flex-direction: column !important;
            text-align: center !important;
            gap: 12px !important;
          }

          .floating-whatsapp {
            right: 16px !important;
            bottom: 16px !important;
            width: 58px !important;
            height: 58px !important;
          }
        }
      `}</style>

      <footer
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "80px 0 34px",
          background:
            "linear-gradient(180deg, rgba(2,6,23,1) 0%, rgba(7,20,47,1) 55%, rgba(2,6,23,1) 100%)",
          borderTop: "1px solid rgba(148,163,184,.12)",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(37,99,235,.16)",
            filter: "blur(100px)",
            left: -140,
            top: -120,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "rgba(56,189,248,.1)",
            filter: "blur(90px)",
            right: -120,
            bottom: -120,
            pointerEvents: "none",
          }}
        />

        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            className="footer-main"
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr .8fr",
              gap: 26,
              alignItems: "stretch",
            }}
          >
            <div
              className="footer-card"
              style={{
                padding: 34,
                borderRadius: 30,
                background:
                  "linear-gradient(145deg, rgba(15,23,42,.88), rgba(2,6,23,.78))",
                border: "1px solid rgba(148,163,184,.16)",
                boxShadow: "0 22px 80px rgba(0,0,0,.22)",
              }}
            >
              <a
                href="/"
                className="footer-logo-wrap"
                aria-label="Defan Soluções Digitais"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 22,
                  textDecoration: "none",
                }}
              >
                <Image
                  src="/logo-white.png"
                  alt="Defan Soluções Digitais"
                  width={140}
                  height={48}
                  priority={false}
                  style={{
                    width: 140,
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              </a>

              <p
                style={{
                  maxWidth: 680,
                  margin: "0 0 24px",
                  color: "#cbd5e1",
                  fontSize: 16,
                  lineHeight: 1.75,
                }}
              >
                Sites, sistemas, automações e soluções digitais para empresas
                que querem parecer mais profissionais, vender com mais confiança
                e organizar melhor sua operação.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  justifyContent: "inherit",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 13px",
                    borderRadius: 999,
                    color: "#bfdbfe",
                    background: "rgba(37,99,235,.16)",
                    border: "1px solid rgba(147,197,253,.18)",
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  <Sparkles size={16} /> Visual premium
                </span>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 13px",
                    borderRadius: 999,
                    color: "#bfdbfe",
                    background: "rgba(37,99,235,.16)",
                    border: "1px solid rgba(147,197,253,.18)",
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  <Code2 size={16} /> Tecnologia moderna
                </span>
              </div>
            </div>

            <nav
              aria-label="Links do rodapé"
              className="footer-links"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 12,
                padding: 30,
                borderRadius: 30,
                background: "rgba(15,23,42,.56)",
                border: "1px solid rgba(148,163,184,.14)",
              }}
            >
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="footer-link"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    padding: "13px 0",
                    color: "#dbeafe",
                    textDecoration: "none",
                    fontSize: 15,
                    fontWeight: 800,
                    borderBottom: "1px solid rgba(148,163,184,.1)",
                    transition: "all .3s ease",
                  }}
                >
                  {link.label}
                  <ArrowRight
                    size={15}
                    style={{ transition: "all .3s ease" }}
                  />
                </a>
              ))}
            </nav>
          </div>

          <div
            className="footer-cta"
            style={{
              marginTop: 26,
              padding: 30,
              borderRadius: 30,
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "center",
              gap: 24,
              background:
                "linear-gradient(135deg, rgba(37,99,235,.22), rgba(56,189,248,.1))",
              border: "1px solid rgba(147,197,253,.2)",
              boxShadow: "0 22px 80px rgba(0,0,0,.18)",
            }}
          >
            <div>
              <span
                style={{
                  display: "block",
                  color: "#38bdf8",
                  fontSize: 12,
                  fontWeight: 950,
                  textTransform: "uppercase",
                  letterSpacing: 3,
                  marginBottom: 10,
                }}
              >
                Próximo passo
              </span>

              <h2
                style={{
                  margin: "0 0 8px",
                  color: "#f8fafc",
                  fontSize: "clamp(26px, 3vw, 40px)",
                  lineHeight: 1.08,
                  letterSpacing: -1.2,
                }}
              >
                Pronta para transformar sua presença digital?
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#cbd5e1",
                  fontSize: 15,
                  lineHeight: 1.6,
                }}
              >
                Fale comigo e receba uma proposta alinhada com o momento do seu
                negócio.
              </p>
            </div>

            <div
              className="footer-actions"
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <a
                className="btn btn-primary"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={18} /> WhatsApp
              </a>

              <a
                className="btn btn-ghost"
                href="mailto:taisadefante@hotmail.com"
              >
                <Mail size={18} /> E-mail
              </a>
            </div>
          </div>

          <div
            className="footer-bottom"
            style={{
              marginTop: 28,
              paddingTop: 24,
              borderTop: "1px solid rgba(148,163,184,.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 18,
              color: "#94a3b8",
              fontSize: 13,
            }}
          >
            <span>
              © {new Date().getFullYear()} Defan Soluções Digitais. Todos os
              direitos reservados.
            </span>

            <a
              href="tel:+5521988359825"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                color: "#bfdbfe",
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              <Phone size={15} /> +55 21 98835-9825
            </a>
          </div>
        </div>
      </footer>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar no WhatsApp"
        className="floating-whatsapp"
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 9998,
          width: 64,
          height: 64,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          background: "#25D366",
          boxShadow: "0 18px 50px rgba(37,211,102,.35)",
          transition: "all .3s ease",
        }}
      >
        <WhatsAppIcon size={34} />
      </a>
    </>
  );
}
