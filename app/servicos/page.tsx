import type { Metadata } from "next";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Code2,
  Database,
  Globe2,
  Layers3,
  LayoutDashboard,
  MessageCircle,
  Rocket,
  Sparkles,
} from "lucide-react";

import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { whatsappUrl } from "@/components/home/data";
import { styles as homeStyles } from "@/components/home/styles";

export const metadata: Metadata = {
  title: "Serviços Digitais | Sites, Landing Pages, Sistemas e Automações",
  description:
    "Criação de sites profissionais, landing pages, desenvolvimento de sistemas web, dashboards, automações e soluções digitais para empresas.",
  alternates: {
    canonical: "https://defan.com.br/servicos",
  },
};

const services = [
  {
    icon: Globe2,
    title: "Criação de Sites Profissionais",
    description:
      "Sites institucionais, empresariais e profissionais para fortalecer sua marca, transmitir confiança e gerar oportunidades.",
    items: [
      "Site institucional",
      "Site para empresa",
      "Catálogo digital",
      "Página responsiva",
    ],
  },
  {
    icon: Rocket,
    title: "Landing Pages de Alta Conversão",
    description:
      "Páginas focadas em campanhas, tráfego pago, captação de leads, WhatsApp e vendas.",
    items: [
      "Landing page para anúncios",
      "Captação de leads",
      "Página para eventos",
      "CTA para WhatsApp",
    ],
  },
  {
    icon: Code2,
    title: "Desenvolvimento de Sistemas Web",
    description:
      "Sistemas personalizados para organizar processos, controlar dados e profissionalizar sua operação.",
    items: [
      "Sistema administrativo",
      "Sistema SaaS",
      "Portal interno",
      "Área de clientes",
    ],
  },
  {
    icon: LayoutDashboard,
    title: "Dashboards e Painéis",
    description:
      "Painéis visuais para acompanhar vendas, financeiro, clientes, relatórios e indicadores.",
    items: [
      "Dashboard financeiro",
      "Painel de vendas",
      "Indicadores",
      "Relatórios",
    ],
  },
  {
    icon: Bot,
    title: "Automações Empresariais",
    description:
      "Automações para reduzir trabalho manual, melhorar atendimento e integrar ferramentas.",
    items: [
      "Automação de WhatsApp",
      "Automação de e-mail",
      "Processos internos",
      "Integrações",
    ],
  },
  {
    icon: Database,
    title: "CRM e Sistemas Personalizados",
    description:
      "Soluções para gerenciar clientes, leads, vendas, cobranças, propostas e atendimento.",
    items: [
      "CRM personalizado",
      "Controle de clientes",
      "Gestão de vendas",
      "Funil comercial",
    ],
  },
];

const technologies = [
  "Next.js",
  "React",
  "Firebase",
  "Node.js",
  "TypeScript",
  "Python",
  "APIs",
  "IA",
  "Automação",
  "Dashboards",
];

export default function ServicosPage() {
  return (
    <main className="premium-page">
      <style>{homeStyles}</style>

      <Header />

      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "145px 0 80px",
          background:
            "radial-gradient(circle at 20% 0%, rgba(56,189,248,.22), transparent 34%), radial-gradient(circle at 85% 12%, rgba(37,99,235,.22), transparent 34%), linear-gradient(180deg, #020617 0%, #061a33 52%, #020617 100%)",
        }}
      >
        <div className="container">
          <div
            style={{
              maxWidth: 980,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 15px",
                borderRadius: 999,
                color: "#bfdbfe",
                background: "rgba(37,99,235,.18)",
                border: "1px solid rgba(147,197,253,.26)",
                fontSize: 13,
                fontWeight: 900,
              }}
            >
              <Sparkles size={15} />
              Serviços digitais para empresas
            </span>

            <h1
              style={{
                margin: "24px auto 22px",
                color: "#f8fafc",
                fontSize: "clamp(36px, 4.5vw, 68px)",
                lineHeight: 1.04,
                letterSpacing: "-0.05em",
                fontWeight: 930,
                maxWidth: 980,
              }}
            >
              Criação de sites, landing pages e{" "}
              <strong style={{ color: "#38bdf8" }}>
                sistemas web personalizados
              </strong>
            </h1>

            <p
              style={{
                maxWidth: 780,
                margin: "0 auto 34px",
                color: "#dbeafe",
                fontSize: 18,
                lineHeight: 1.75,
              }}
            >
              Desenvolvemos sites profissionais, landing pages, sistemas,
              dashboards, automações e soluções digitais para empresas que
              querem vender mais, ganhar credibilidade e organizar processos.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 14,
              }}
            >
              <a
                className="btn btn-primary"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                Solicitar proposta <ArrowRight size={18} />
              </a>

              <a className="btn btn-ghost" href="/projetos">
                Ver projetos reais <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 0", background: "#020617" }}>
        <div className="container">
          <div
            style={{
              textAlign: "center",
              maxWidth: 760,
              margin: "0 auto 46px",
            }}
          >
            <span
              style={{
                color: "#38bdf8",
                fontWeight: 900,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                fontSize: 12,
              }}
            >
              O que fazemos
            </span>

            <h2
              style={{
                margin: "12px 0 0",
                color: "#f8fafc",
                fontSize: "clamp(30px, 4vw, 52px)",
                lineHeight: 1.08,
                letterSpacing: "-0.045em",
              }}
            >
              Soluções completas para presença digital, vendas e operação
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 22,
            }}
          >
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.title}
                  style={{
                    padding: 26,
                    borderRadius: 28,
                    background:
                      "linear-gradient(180deg, rgba(15,23,42,.86), rgba(8,47,73,.46))",
                    border: "1px solid rgba(56,189,248,.18)",
                    boxShadow: "0 24px 70px rgba(0,0,0,.22)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 18,
                      display: "grid",
                      placeItems: "center",
                      color: "#fff",
                      background: "linear-gradient(135deg,#2563eb,#38bdf8)",
                      boxShadow: "0 16px 34px rgba(56,189,248,.22)",
                    }}
                  >
                    <Icon size={25} />
                  </div>

                  <h3
                    style={{
                      margin: 0,
                      color: "#f8fafc",
                      fontSize: 23,
                      lineHeight: 1.15,
                      letterSpacing: "-0.035em",
                    }}
                  >
                    {service.title}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: "#cbd5e1",
                      lineHeight: 1.7,
                      fontSize: 15,
                    }}
                  >
                    {service.description}
                  </p>

                  <div style={{ display: "grid", gap: 10, marginTop: "auto" }}>
                    {service.items.map((item) => (
                      <span
                        key={item}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          color: "#e0f2fe",
                          fontSize: 14,
                          fontWeight: 800,
                        }}
                      >
                        <CheckCircle2 size={16} color="#38bdf8" />
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "78px 0",
          background:
            "radial-gradient(circle at 50% 0%, rgba(56,189,248,.13), transparent 34%), rgba(2,6,23,.98)",
          borderTop: "1px solid rgba(56,189,248,.12)",
          borderBottom: "1px solid rgba(56,189,248,.12)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 34,
              alignItems: "center",
            }}
          >
            <div>
              <span
                style={{
                  color: "#38bdf8",
                  fontWeight: 900,
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  fontSize: 12,
                }}
              >
                Como funciona
              </span>

              <h2
                style={{
                  margin: "12px 0 18px",
                  color: "#f8fafc",
                  fontSize: "clamp(30px, 4vw, 52px)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.045em",
                }}
              >
                Do planejamento ao lançamento da solução
              </h2>

              <p
                style={{
                  color: "#cbd5e1",
                  fontSize: 17,
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                Antes de desenvolver, entendemos seu objetivo, seu público e o
                que precisa gerar resultado. Assim, cada projeto nasce com foco
                em conversão, organização e crescimento.
              </p>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              {[
                "Diagnóstico da necessidade e objetivo do projeto",
                "Planejamento da estrutura, funcionalidades e conteúdo",
                "Design profissional com foco em credibilidade e conversão",
                "Desenvolvimento responsivo, rápido e otimizado",
                "Publicação, ajustes finais e acompanhamento",
              ].map((item, index) => (
                <div
                  key={item}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: 14,
                    alignItems: "center",
                    padding: 18,
                    borderRadius: 20,
                    background: "rgba(15,23,42,.72)",
                    border: "1px solid rgba(56,189,248,.16)",
                  }}
                >
                  <strong
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 12,
                      display: "grid",
                      placeItems: "center",
                      color: "#fff",
                      background: "linear-gradient(135deg,#2563eb,#38bdf8)",
                    }}
                  >
                    {index + 1}
                  </strong>

                  <span
                    style={{
                      color: "#e0f2fe",
                      fontWeight: 850,
                      lineHeight: 1.45,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 0", background: "#020617" }}>
        <div className="container">
          <div
            style={{
              textAlign: "center",
              maxWidth: 760,
              margin: "0 auto 34px",
            }}
          >
            <span
              style={{
                color: "#38bdf8",
                fontWeight: 900,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                fontSize: 12,
              }}
            >
              Tecnologias
            </span>

            <h2
              style={{
                margin: "12px 0 0",
                color: "#f8fafc",
                fontSize: "clamp(30px, 4vw, 52px)",
                lineHeight: 1.08,
                letterSpacing: "-0.045em",
              }}
            >
              Estrutura moderna para projetos rápidos, seguros e escaláveis
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 12,
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            {technologies.map((tech) => (
              <span
                key={tech}
                style={{
                  padding: "12px 16px",
                  borderRadius: 999,
                  color: "#dbeafe",
                  background: "rgba(14,165,233,.11)",
                  border: "1px solid rgba(56,189,248,.2)",
                  fontSize: 14,
                  fontWeight: 900,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "82px 0",
          background:
            "linear-gradient(135deg, rgba(37,99,235,.28), rgba(56,189,248,.16)), #020617",
          borderTop: "1px solid rgba(56,189,248,.16)",
        }}
      >
        <div className="container">
          <div
            style={{
              maxWidth: 920,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <Layers3
              size={42}
              color="#38bdf8"
              style={{ marginBottom: 18 }}
            />

            <h2
              style={{
                margin: "0 0 18px",
                color: "#f8fafc",
                fontSize: "clamp(32px, 4.5vw, 58px)",
                lineHeight: 1.05,
                letterSpacing: "-0.05em",
              }}
            >
              Vamos desenvolver a solução ideal para sua empresa?
            </h2>

            <p
              style={{
                maxWidth: 720,
                margin: "0 auto 30px",
                color: "#dbeafe",
                fontSize: 18,
                lineHeight: 1.75,
              }}
            >
              Seja um site, uma landing page, um sistema ou uma automação, a
              Defan pode criar uma solução profissional para o seu momento.
            </p>

            <a
              className="btn btn-primary"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              Falar no WhatsApp <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}