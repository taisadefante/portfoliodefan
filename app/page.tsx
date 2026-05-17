"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  CheckCircle2,
  Code2,
  Gem,
  Globe2,
  LayoutDashboard,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Workflow,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { getProjects } from "@/lib/firestore";
import { Project } from "@/lib/types";

const services = [
  {
    icon: Rocket,
    title: "Landing Pages",
    description:
      "Páginas de alta conversão para apresentar serviços, campanhas e captação de clientes.",
  },
  {
    icon: Globe2,
    title: "Websites",
    description:
      "Sites institucionais profissionais, responsivos e alinhados à identidade da sua marca.",
  },
  {
    icon: LayoutDashboard,
    title: "Sistemas",
    description:
      "Painéis, cadastros, relatórios, dashboards, CRM, financeiro e áreas administrativas.",
  },
  {
    icon: Workflow,
    title: "Automações",
    description:
      "Soluções para reduzir tarefas manuais, organizar processos e ganhar produtividade.",
  },
  {
    icon: Bot,
    title: "Integrações",
    description:
      "Conexão com APIs, Firebase, WhatsApp, e-mail, pagamentos e bancos de dados.",
  },
  {
    icon: Code2,
    title: "Assinatura mensal",
    description:
      "Projetos prontos para empresas que querem começar com menor investimento inicial.",
  },
];

const carouselItems = [
  "Landing Pages",
  "Websites",
  "Sistemas Web",
  "Automações",
  "Dashboards",
  "CRM",
  "Painel Admin",
  "Next.js",
  "React",
  "TypeScript",
  "Firebase",
  "Firestore",
  "Storage",
  "APIs",
  "WhatsApp",
  "E-mail",
  "Pagamentos",
  "Relatórios",
];

const values = [
  {
    icon: ShieldCheck,
    title: "Responsabilidade",
    text: "Cada entrega é conduzida com cuidado, clareza e atenção aos detalhes.",
  },
  {
    icon: BadgeCheck,
    title: "Comprometimento",
    text: "O projeto é pensado para funcionar de verdade no dia a dia da empresa.",
  },
  {
    icon: Gem,
    title: "Projeto único",
    text: "Mesmo usando boas bases, cada solução recebe identidade, propósito e adaptação.",
  },
];

const testimonials = [
  {
    name: "Mariana Alves",
    company: "Consultoria Empresarial",
    text: "A página transmitiu muito mais confiança. Ficou moderna, clara e fácil de apresentar aos clientes.",
  },
  {
    name: "Rafael Martins",
    company: "Serviços e Manutenção",
    text: "O sistema deixou meus cadastros e controles muito mais organizados. O atendimento ficou mais profissional.",
  },
  {
    name: "Camila Ferreira",
    company: "Clínica de Estética",
    text: "A entrega ficou bonita, rápida e objetiva. Consegui divulgar meus serviços com muito mais segurança.",
  },
];

const faqs = [
  {
    question: "A Defan cria projetos por assinatura mensal?",
    answer:
      "Sim. Essa opção é indicada para empresas que querem começar com menor investimento inicial e ter uma solução profissional em funcionamento.",
  },
  {
    question: "Também é possível criar algo totalmente personalizado?",
    answer:
      "Sim. Projetos personalizados são indicados quando a empresa precisa de regras próprias, módulos específicos, integrações ou fluxos exclusivos.",
  },
  {
    question: "Os projetos funcionam no celular?",
    answer:
      "Sim. As páginas e sistemas são pensadas para funcionar bem em computador, tablet e celular.",
  },
  {
    question: "Posso evoluir meu projeto depois?",
    answer:
      "Sim. O projeto pode começar simples e evoluir com novas páginas, módulos, integrações e automações.",
  },
];

const colors = {
  bg: "#020617",
  panel: "rgba(15, 23, 42, 0.74)",
  panelStrong: "rgba(15, 23, 42, 0.92)",
  border: "rgba(125, 211, 252, 0.13)",
  borderStrong: "rgba(125, 211, 252, 0.28)",
  text: "#f8fafc",
  muted: "#cbd5e1",
  soft: "#94a3b8",
  blue: "#38bdf8",
};

function useScreen() {
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    function update() {
      setWidth(window.innerWidth);
    }

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  return {
    width,
    isMobile: width <= 560,
    isTablet: width <= 860,
    isNotebook: width <= 1180,
  };
}

function getProjectImages(project: Project) {
  const images = Array.isArray(project.images)
    ? project.images.filter(Boolean)
    : [];

  if (images.length) return images;

  return project.imageUrl ? [project.imageUrl] : [];
}

function getProjectKey(project: Project, index: number) {
  return project.id || `${project.name}-${index}`;
}

function SectionTitle({
  eyebrow,
  title,
  center = true,
}: {
  eyebrow: string;
  title: string;
  center?: boolean;
}) {
  return (
    <div
      style={{
        maxWidth: 900,
        margin: center ? "0 auto 54px" : "0 0 28px",
        textAlign: center ? "center" : "left",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          color: colors.blue,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontSize: 12,
          fontWeight: 950,
          marginBottom: 14,
        }}
      >
        {eyebrow}
      </span>

      {title && (
        <h2
          style={{
            margin: 0,
            color: colors.text,
            fontSize: "clamp(28px, 3.35vw, 52px)",
            lineHeight: 1.04,
            letterSpacing: "-0.052em",
          }}
        >
          {title}
        </h2>
      )}
    </div>
  );
}

function DetailList({ title, items }: { title: string; items?: string[] }) {
  const cleanItems = Array.isArray(items) ? items.filter(Boolean) : [];

  if (!cleanItems.length) return null;

  return (
    <section
      style={{
        padding: 22,
        borderRadius: 26,
        background: "rgba(2, 6, 23, 0.34)",
        border: "1px solid rgba(125, 211, 252, 0.14)",
      }}
    >
      <h3
        style={{
          margin: "0 0 14px",
          fontSize: 20,
          letterSpacing: "-0.03em",
        }}
      >
        {title}
      </h3>

      <div style={{ display: "grid", gap: 10 }}>
        {cleanItems.map((item, index) => (
          <div
            key={`${title}-${item}-${index}`}
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: 10,
              alignItems: "flex-start",
              color: colors.muted,
              lineHeight: 1.55,
            }}
          >
            <CheckCircle2
              size={17}
              color={colors.blue}
              style={{ marginTop: 2 }}
            />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectDetailsModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const { isTablet, isMobile } = useScreen();

  const images = getProjectImages(project);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);

  const selectedImage = images[selectedImageIndex] || images[0] || "";
  const isSubscription = project.commercialModel
    ?.toLowerCase()
    .includes("assinatura");

  function previousImage(event?: React.MouseEvent<HTMLButtonElement>) {
    event?.stopPropagation();

    if (!images.length) return;

    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }

  function nextImage(event?: React.MouseEvent<HTMLButtonElement>) {
    event?.stopPropagation();

    if (!images.length) return;

    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  }

  const buttonStyle: CSSProperties = {
    borderRadius: 999,
    padding: "14px 22px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap",
    border: 0,
    color: "#fff",
    background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
    boxShadow: "0 18px 44px rgba(14,165,233,0.25)",
    textDecoration: "none",
  };

  const outlineButtonStyle: CSSProperties = {
    borderRadius: 999,
    padding: "14px 22px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap",
    color: "#e0f2fe",
    background: "rgba(15, 23, 42, 0.68)",
    border: "1px solid rgba(125, 211, 252, 0.24)",
    textDecoration: "none",
  };

  const tagStyle: CSSProperties = {
    padding: "8px 11px",
    borderRadius: 999,
    color: "#bae6fd",
    background: "rgba(14, 165, 233, 0.1)",
    border: "1px solid rgba(125, 211, 252, 0.13)",
    fontSize: 12,
    fontWeight: 900,
  };

  const closeButtonStyle: CSSProperties = {
    width: 44,
    height: 44,
    border: "1px solid rgba(125, 211, 252, 0.2)",
    borderRadius: 14,
    background: "rgba(2, 6, 23, 0.45)",
    color: colors.text,
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 120,
        background: "rgba(2, 6, 23, 0.82)",
        backdropFilter: "blur(12px)",
        display: "grid",
        placeItems: "center",
        padding: 18,
      }}
      onClick={onClose}
    >
      <section
        style={{
          width: "min(1180px, 100%)",
          maxHeight: "92vh",
          overflow: "auto",
          borderRadius: 34,
          background:
            "radial-gradient(circle at 20% 0%, rgba(56,189,248,0.16), transparent 34%), linear-gradient(145deg, rgba(15,23,42,0.98), rgba(8,47,73,0.92))",
          border: "1px solid rgba(125, 211, 252, 0.28)",
          boxShadow: "0 44px 120px rgba(0,0,0,0.55)",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 18,
            padding: 24,
            background: "rgba(15, 23, 42, 0.92)",
            borderBottom: "1px solid rgba(125, 211, 252, 0.14)",
            backdropFilter: "blur(18px)",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 16,
              }}
            >
              {project.type && <span style={tagStyle}>{project.type}</span>}

              {project.commercialModel && (
                <span
                  style={{
                    ...tagStyle,
                    color: isSubscription ? "#bbf7d0" : "#bfdbfe",
                    background: isSubscription
                      ? "rgba(34,197,94,0.12)"
                      : "rgba(59,130,246,0.14)",
                    borderColor: isSubscription
                      ? "rgba(74,222,128,0.21)"
                      : "rgba(96,165,250,0.2)",
                  }}
                >
                  {project.commercialModel}
                </span>
              )}

              {project.niche && <span style={tagStyle}>{project.niche}</span>}
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: isMobile ? 30 : "clamp(30px, 4vw, 54px)",
                lineHeight: 1,
                letterSpacing: "-0.06em",
              }}
            >
              {project.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={closeButtonStyle}
            aria-label="Fechar detalhes do projeto"
          >
            <X size={22} />
          </button>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isTablet ? "1fr" : "1.03fr 0.97fr",
            gap: 24,
            padding: 24,
          }}
        >
          <div style={{ display: "grid", gap: 14 }}>
            {selectedImage ? (
              <button
                type="button"
                onClick={() => setImageViewerOpen(true)}
                style={{
                  border: 0,
                  padding: 0,
                  background: "transparent",
                  cursor: "zoom-in",
                  textAlign: "left",
                }}
              >
                <img
                  src={selectedImage}
                  alt={project.name}
                  style={{
                    width: "100%",
                    height: isMobile ? 260 : 420,
                    objectFit: "cover",
                    objectPosition: "top center",
                    borderRadius: 26,
                    border: "1px solid rgba(125, 211, 252, 0.16)",
                    background: "rgba(2, 6, 23, 0.5)",
                  }}
                />
              </button>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: isMobile ? 260 : 420,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 26,
                  border: "1px solid rgba(125, 211, 252, 0.16)",
                  background: "rgba(2, 6, 23, 0.5)",
                }}
              >
                <Image
                  src="/logo-white.png"
                  alt="Defan Soluções Digitais"
                  width={260}
                  height={90}
                  style={{ width: "auto", height: 86, objectFit: "contain" }}
                />
              </div>
            )}

            {images.length > 1 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "repeat(2, minmax(0, 1fr))"
                    : "repeat(4, minmax(0, 1fr))",
                  gap: 10,
                }}
              >
                {images.slice(0, 8).map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    onDoubleClick={() => setImageViewerOpen(true)}
                    style={{
                      border: 0,
                      padding: 0,
                      background: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={image}
                      alt={`${project.name} ${index + 1}`}
                      style={{
                        width: "100%",
                        height: 84,
                        objectFit: "cover",
                        borderRadius: 16,
                        border:
                          selectedImageIndex === index
                            ? "2px solid #38bdf8"
                            : "1px solid rgba(125, 211, 252, 0.16)",
                        opacity: selectedImageIndex === index ? 1 : 0.72,
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <aside style={{ display: "grid", gap: 16, alignContent: "start" }}>
            <section
              style={{
                padding: 22,
                borderRadius: 26,
                background: "rgba(2, 6, 23, 0.34)",
                border: "1px solid rgba(125, 211, 252, 0.14)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 10px",
                  fontSize: 22,
                  letterSpacing: "-0.035em",
                }}
              >
                Resumo do projeto
              </h3>

              <p style={{ color: colors.muted, lineHeight: 1.7, margin: 0 }}>
                {project.fullDescription ||
                  project.cardSummary ||
                  "Projeto cadastrado no portfólio Defan."}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "1fr"
                    : "repeat(2, minmax(0, 1fr))",
                  gap: 12,
                  marginTop: 16,
                }}
              >
                {project.startingPrice && (
                  <div
                    style={{
                      padding: 15,
                      borderRadius: 18,
                      background: "rgba(15, 23, 42, 0.62)",
                      border: "1px solid rgba(125, 211, 252, 0.12)",
                    }}
                  >
                    <small style={{ color: colors.soft, fontWeight: 900 }}>
                      Investimento inicial
                    </small>
                    <strong
                      style={{ display: "block", marginTop: 6, fontSize: 18 }}
                    >
                      {project.startingPrice}
                    </strong>
                  </div>
                )}

                {project.monthlyPrice && (
                  <div
                    style={{
                      padding: 15,
                      borderRadius: 18,
                      background: "rgba(15, 23, 42, 0.62)",
                      border: "1px solid rgba(125, 211, 252, 0.12)",
                    }}
                  >
                    <small style={{ color: colors.soft, fontWeight: 900 }}>
                      Mensalidade
                    </small>
                    <strong
                      style={{ display: "block", marginTop: 6, fontSize: 18 }}
                    >
                      {project.monthlyPrice}
                    </strong>
                  </div>
                )}
              </div>
            </section>

            {!!project.technologies?.length && (
              <section
                style={{
                  padding: 22,
                  borderRadius: 26,
                  background: "rgba(2, 6, 23, 0.34)",
                  border: "1px solid rgba(125, 211, 252, 0.14)",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 14px",
                    fontSize: 22,
                    letterSpacing: "-0.035em",
                  }}
                >
                  Tecnologias
                </h3>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {project.technologies.map((tech) => (
                    <span key={tech} style={tagStyle}>
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isTablet ? "1fr" : "repeat(2, minmax(0, 1fr))",
            gap: 16,
            padding: "0 24px 24px",
          }}
        >
          <DetailList title="Módulos disponíveis" items={project.modules} />
          <DetailList title="Integrações" items={project.integrations} />
          <DetailList
            title="Indicado para"
            items={project.indicatedBusinesses}
          />
          <DetailList title="Fluxo básico de uso" items={project.basicFlow} />
        </div>

        <footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            padding: 24,
            borderTop: "1px solid rgba(125, 211, 252, 0.14)",
          }}
        >
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              style={outlineButtonStyle}
            >
              Abrir projeto <ExternalLink size={17} />
            </a>
          ) : (
            <span />
          )}

          <a
            href={`https://wa.me/5521988359825?text=${encodeURIComponent(
              `Olá, tenho interesse no projeto: ${project.name}`,
            )}`}
            target="_blank"
            rel="noreferrer"
            style={buttonStyle}
          >
            Quero orçamento deste projeto <MessageCircle size={18} />
          </a>
        </footer>
      </section>

      {imageViewerOpen && selectedImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 180,
            background: "rgba(0, 0, 0, 0.9)",
            display: "grid",
            gridTemplateRows: "auto 1fr",
            padding: 18,
          }}
          onClick={(event) => {
            event.stopPropagation();
            setImageViewerOpen(false);
          }}
        >
          <div
            style={{
              width: "min(1200px, 100%)",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "0 0 14px",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={previousImage}
              style={{
                ...outlineButtonStyle,
                padding: "12px 16px",
                borderRadius: 16,
              }}
            >
              <ChevronLeft size={20} />
              Anterior
            </button>

            <strong
              style={{
                color: "#e0f2fe",
                fontSize: 15,
                background: "rgba(15, 23, 42, 0.78)",
                border: "1px solid rgba(125, 211, 252, 0.18)",
                borderRadius: 999,
                padding: "10px 16px",
              }}
            >
              {selectedImageIndex + 1} / {images.length}
            </strong>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={nextImage}
                style={{
                  ...outlineButtonStyle,
                  padding: "12px 16px",
                  borderRadius: 16,
                }}
              >
                Próxima
                <ChevronRight size={20} />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setImageViewerOpen(false);
                }}
                style={closeButtonStyle}
                aria-label="Fechar imagem ampliada"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          <div
            style={{
              width: "min(1200px, 100%)",
              minHeight: 0,
              margin: "0 auto",
              display: "grid",
              placeItems: "center",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt={`${project.name} ampliado`}
              style={{
                maxWidth: "100%",
                maxHeight: "calc(100vh - 120px)",
                objectFit: "contain",
                borderRadius: 24,
                border: "1px solid rgba(125, 211, 252, 0.2)",
                boxShadow: "0 30px 90px rgba(0,0,0,0.65)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const { isMobile, isTablet, isNotebook } = useScreen();

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectPage, setProjectPage] = useState(0);
  const [marqueeOffset, setMarqueeOffset] = useState(0);

  useEffect(() => {
    getProjects()
      .then((list) => {
        const highlighted = list.filter((item) => item.highlight !== false);
        setProjects(highlighted.length ? highlighted : list);
      })
      .catch(() => setProjects([]));
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMarqueeOffset((prev) => (prev + 1) % 1400);
    }, 30);

    return () => window.clearInterval(interval);
  }, []);

  const projectSlides = useMemo(() => {
    const slides: Project[][] = [];

    for (let index = 0; index < projects.length; index += 3) {
      slides.push(projects.slice(index, index + 3));
    }

    return slides;
  }, [projects]);

  useEffect(() => {
    if (projectSlides.length <= 1) return;

    const interval = window.setInterval(() => {
      setProjectPage((prev) => (prev + 1) % projectSlides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [projectSlides.length]);

  const visibleProjects = projectSlides[projectPage] || [];

  const whatsappUrl = `https://wa.me/5521988359825?text=${encodeURIComponent(
    "Olá, Tais! Vi seu portfólio da Defan e quero um orçamento para site, sistema ou automação.",
  )}`;

  const containerStyle: CSSProperties = {
    width: isMobile
      ? "min(100% - 28px, 1440px)"
      : "min(1440px, calc(100% - 56px))",
    margin: "0 auto",
  };

  const buttonStyle: CSSProperties = {
    borderRadius: 999,
    padding: "14px 22px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap",
    border: 0,
    color: "#fff",
    background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
    boxShadow: "0 18px 44px rgba(14,165,233,0.25)",
    textDecoration: "none",
  };

  const outlineButtonStyle: CSSProperties = {
    borderRadius: 999,
    padding: "14px 22px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap",
    color: "#e0f2fe",
    background: "rgba(15, 23, 42, 0.68)",
    border: "1px solid rgba(125, 211, 252, 0.24)",
    textDecoration: "none",
  };

  const cardStyle: CSSProperties = {
    background: colors.panel,
    border: `1px solid ${colors.border}`,
    borderRadius: 32,
    padding: 26,
  };

  const tagStyle: CSSProperties = {
    padding: "8px 11px",
    borderRadius: 999,
    color: "#bae6fd",
    background: "rgba(14, 165, 233, 0.1)",
    border: "1px solid rgba(125, 211, 252, 0.13)",
    fontSize: 12,
    fontWeight: 900,
  };

  const sectionStyle: CSSProperties = {
    padding: isMobile ? "70px 0" : "104px 0",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 18% 0%, rgba(14,165,233,0.22), transparent 31%), radial-gradient(circle at 82% 12%, rgba(56,189,248,0.12), transparent 28%), linear-gradient(180deg, #020617 0%, #071426 45%, #020617 100%)",
        color: colors.text,
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(2, 6, 23, 0.86)",
          backdropFilter: "blur(22px)",
          borderBottom: "1px solid rgba(125, 211, 252, 0.12)",
        }}
      >
        <div
          style={{
            ...containerStyle,
            minHeight: isTablet ? 82 : 86,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <a href="/" style={{ textDecoration: "none" }}>
            <Image
              src="/logo-white.png"
              alt="Defan Soluções Digitais"
              width={420}
              height={140}
              priority
              style={{
                width: "auto",
                height: isTablet ? 68 : 74,
                objectFit: "contain",
                filter: "drop-shadow(0 0 22px rgba(125,211,252,0.18))",
              }}
            />
          </a>

          {!isTablet && (
            <nav
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                color: colors.muted,
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              <a
                href="#servicos"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Serviços
              </a>
              <a
                href="#sobre"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Sobre
              </a>
              <a
                href="/projetos"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Projetos
              </a>
              <a
                href="#depoimentos"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Depoimentos
              </a>
              <a
                href="#faq"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                FAQ
              </a>
            </nav>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              ...buttonStyle,
              padding: isMobile ? "12px 14px" : "14px 22px",
              fontSize: isMobile ? 13 : 15,
            }}
          >
            Orçamento agora <ArrowRight size={17} />
          </a>
        </div>
      </header>

      <section
        style={{
          padding: isMobile ? "56px 0 42px" : "74px 0 64px",
        }}
      >
        <div
          style={{
            ...containerStyle,
            display: "grid",
            gridTemplateColumns: isNotebook
              ? "1fr"
              : "minmax(0, 0.95fr) minmax(420px, 0.78fr)",
            gap: isNotebook ? 38 : 58,
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: isNotebook ? "center" : "left" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                padding: "10px 15px",
                borderRadius: 999,
                background: "rgba(14, 165, 233, 0.12)",
                border: "1px solid rgba(125, 211, 252, 0.28)",
                marginBottom: 26,
                color: "#bae6fd",
                fontSize: 14,
                fontWeight: 950,
              }}
            >
              <Sparkles size={16} /> Defan Soluções Digitais
            </span>

            <h1
              style={{
                margin: 0,
                maxWidth: 940,
                fontSize: isMobile ? 42 : "clamp(34px, 4.35vw, 64px)",
                lineHeight: 1.04,
                letterSpacing: "-0.055em",
              }}
            >
              Presença digital, sistemas e automações criados para sua empresa
              transmitir confiança.
            </h1>

            <p
              style={{
                maxWidth: 720,
                margin: "28px 0 0",
                color: colors.muted,
                fontSize: "clamp(16px, 1.15vw, 20px)",
                lineHeight: 1.7,
              }}
            >
              Projetos profissionais para empresas que precisam vender melhor,
              organizar processos e se apresentar com mais credibilidade no
              digital.
            </p>

            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                marginTop: 34,
                justifyContent: isNotebook ? "center" : "flex-start",
              }}
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  ...buttonStyle,
                  padding: "15px 22px",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Pedir orçamento no WhatsApp <MessageCircle size={19} />
              </a>

              <a
                href="/projetos"
                style={{
                  ...outlineButtonStyle,
                  padding: "16px 24px",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Ver soluções disponíveis <ArrowRight size={18} />
              </a>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              minHeight: isMobile ? "auto" : 500,
              borderRadius: isMobile ? 30 : 38,
              padding: isMobile ? 22 : 32,
              overflow: "hidden",
              background:
                "radial-gradient(circle at 50% 0%, rgba(56,189,248,0.25), transparent 35%), linear-gradient(145deg, rgba(15,23,42,0.96), rgba(8,47,73,0.72))",
              border: "1px solid rgba(125, 211, 252, 0.26)",
              boxShadow: "0 44px 120px rgba(0,0,0,0.36)",
              width: isNotebook ? "min(720px, 100%)" : "auto",
              margin: isNotebook ? "0 auto" : 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 360,
                height: 360,
                borderRadius: 999,
                top: -120,
                right: -100,
                background: "rgba(56,189,248,0.22)",
                filter: "blur(60px)",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 1,
                minHeight: isMobile ? 170 : 220,
                display: "grid",
                placeItems: "center",
                borderRadius: 34,
                background:
                  "radial-gradient(circle at 50% 50%, rgba(125,211,252,0.18), transparent 58%), rgba(2,6,23,0.34)",
                border: "1px solid rgba(125, 211, 252, 0.14)",
              }}
            >
              <Image
                src="/logo-white.png"
                alt="Defan Soluções Digitais"
                width={560}
                height={190}
                style={{
                  width: "min(540px, 96%)",
                  height: "auto",
                  objectFit: "contain",
                  filter: "drop-shadow(0 0 34px rgba(255,255,255,0.24))",
                }}
              />
            </div>

            <div
              style={{
                position: "relative",
                zIndex: 2,
                marginTop: 24,
                padding: isMobile ? 18 : 26,
                borderRadius: 30,
                background: "rgba(2, 6, 23, 0.32)",
                border: "1px solid rgba(125, 211, 252, 0.14)",
              }}
            >
              <span style={{ color: "#93c5fd", fontSize: 13 }}>
                Criação estratégica
              </span>

              <strong
                style={{
                  display: "block",
                  marginTop: 6,
                  fontSize: 22,
                  letterSpacing: "-0.035em",
                }}
              >
                Landing pages, websites, sistemas e automações
              </strong>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: 14,
                  marginTop: 24,
                }}
              >
                {[
                  ["Assinatura mensal", "comece com menor investimento"],
                  ["Projeto sob medida", "solução única para sua empresa"],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    style={{
                      padding: 18,
                      borderRadius: 22,
                      background: "rgba(15,23,42,0.58)",
                      border: "1px solid rgba(125,211,252,0.12)",
                    }}
                  >
                    <strong>{title}</strong>
                    <span
                      style={{
                        display: "block",
                        color: "#93c5fd",
                        fontSize: 13,
                      }}
                    >
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          width: isTablet ? "min(92%, 760px)" : "80%",
          maxWidth: 1240,
          margin: "0 auto 8px",
          padding: "18px 0",
          overflow: "hidden",
          background: "rgba(15, 23, 42, 0.56)",
          border: "1px solid rgba(125, 211, 252, 0.16)",
          borderRadius: isTablet ? 28 : 999,
        }}
        aria-label="Serviços e tecnologias"
      >
        <div
          style={{
            width: "max-content",
            display: "flex",
            gap: 14,
            paddingInline: 14,
            transform: `translateX(-${marqueeOffset}px)`,
          }}
        >
          {[...carouselItems, ...carouselItems, ...carouselItems].map(
            (item, index) => (
              <span
                key={`${item}-${index}`}
                style={{
                  flex: "0 0 auto",
                  padding: "10px 18px",
                  borderRadius: 999,
                  color: "#bae6fd",
                  fontWeight: 900,
                  background: "rgba(14, 165, 233, 0.1)",
                  border: "1px solid rgba(125, 211, 252, 0.13)",
                  fontSize: 14,
                }}
              >
                {item}
              </span>
            ),
          )}
        </div>
      </section>

      <section id="servicos" style={sectionStyle}>
        <div style={containerStyle}>
          <SectionTitle
            eyebrow="Serviços"
            title="Soluções digitais para empresas que querem se destacar"
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isTablet
                ? "1fr"
                : isNotebook
                  ? "repeat(2, 1fr)"
                  : "repeat(3, 1fr)",
              gap: 22,
            }}
          >
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.title}
                  style={{
                    ...cardStyle,
                    minHeight: 280,
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      display: "grid",
                      placeItems: "center",
                      color: colors.blue,
                      borderRadius: 22,
                      background: "rgba(14, 165, 233, 0.12)",
                      border: "1px solid rgba(125, 211, 252, 0.14)",
                    }}
                  >
                    <Icon size={24} />
                  </div>

                  <h3
                    style={{
                      margin: "26px 0 12px",
                      fontSize: 22,
                      letterSpacing: "-0.035em",
                    }}
                  >
                    {service.title}
                  </h3>

                  <p style={{ color: colors.muted, lineHeight: 1.68 }}>
                    {service.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="sobre"
        style={{ ...sectionStyle, background: "rgba(15, 23, 42, 0.2)" }}
      >
        <div
          style={{
            ...containerStyle,
            display: "grid",
            gridTemplateColumns: isTablet ? "1fr" : "1.1fr 0.9fr",
            gap: 26,
          }}
        >
          <article style={{ ...cardStyle, padding: isMobile ? 28 : 38 }}>
            <span
              style={{
                display: "inline-flex",
                color: colors.blue,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontSize: 12,
                fontWeight: 950,
                marginBottom: 14,
              }}
            >
              Sobre a Defan
            </span>

            <h2
              style={{
                margin: "18px 0",
                color: colors.text,
                fontSize: "clamp(28px, 3.35vw, 52px)",
                lineHeight: 1.04,
                letterSpacing: "-0.052em",
              }}
            >
              Cada projeto é tratado como único.
            </h2>

            <p style={{ color: colors.muted, lineHeight: 1.68 }}>
              A Defan Soluções Digitais nasceu para criar experiências digitais
              com aparência profissional, funcionamento prático e estratégia
              comercial.
            </p>

            <p style={{ color: colors.muted, lineHeight: 1.68 }}>
              O objetivo não é apenas entregar uma tela bonita. É construir uma
              solução que ajude a empresa a se posicionar melhor, vender com
              segurança e organizar sua operação.
            </p>
          </article>

          <article style={{ ...cardStyle, padding: isMobile ? 28 : 38 }}>
            <Image
              src="/logo-white.png"
              alt="Defan Soluções Digitais"
              width={290}
              height={100}
              style={{
                width: "auto",
                height: 92,
                objectFit: "contain",
                marginBottom: 18,
              }}
            />

            <span
              style={{
                display: "inline-flex",
                color: colors.blue,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontSize: 12,
                fontWeight: 950,
                marginBottom: 14,
              }}
            >
              Criado por
            </span>

            <h3
              style={{
                margin: "16px 0",
                fontSize: 30,
                letterSpacing: "-0.045em",
              }}
            >
              Tais Defante
            </h3>

            <p style={{ color: colors.muted, lineHeight: 1.68 }}>
              A Defan é conduzida por Tais Defante, com foco em desenvolvimento,
              design, automação, organização de processos e soluções digitais
              para negócios reais.
            </p>
          </article>
        </div>

        <div
          style={{
            ...containerStyle,
            display: "grid",
            gridTemplateColumns: isTablet
              ? "1fr"
              : isNotebook
                ? "repeat(2, 1fr)"
                : "repeat(3, 1fr)",
            gap: 22,
            marginTop: 26,
          }}
        >
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <article key={value.title} style={{ ...cardStyle, padding: 28 }}>
                <Icon size={25} color={colors.blue} />

                <h3 style={{ margin: "26px 0 12px", fontSize: 22 }}>
                  {value.title}
                </h3>

                <p style={{ color: colors.muted, lineHeight: 1.68 }}>
                  {value.text}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="projetos" style={sectionStyle}>
        <div style={containerStyle}>
          <div
            style={{
              display: isTablet ? "grid" : "flex",
              justifyContent: "space-between",
              alignItems: isTablet ? "start" : "end",
              gap: 26,
              marginBottom: 28,
            }}
          >
            <SectionTitle
              eyebrow="Projetos"
              title="Projetos em destaque"
              center={false}
            />

            <a href="/projetos" style={outlineButtonStyle}>
              Ver catálogo completo <ArrowRight size={18} />
            </a>
          </div>

          {visibleProjects.length > 0 ? (
            <div style={{ width: "100%", overflow: "hidden" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isTablet
                    ? "1fr"
                    : isNotebook
                      ? "repeat(2, minmax(0, 1fr))"
                      : "repeat(3, minmax(0, 1fr))",
                  gap: 24,
                }}
              >
                {visibleProjects.map((project, index) => {
                  const images = getProjectImages(project);
                  const image = images[0];
                  const isSubscription = project.commercialModel
                    ?.toLowerCase()
                    .includes("assinatura");

                  return (
                    <article
                      key={getProjectKey(project, index)}
                      style={{
                        overflow: "hidden",
                        cursor: "pointer",
                        borderRadius: 32,
                        background: colors.panel,
                        border: `1px solid ${colors.border}`,
                        minHeight: 560,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                      onClick={() => setSelectedProject(project)}
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={project.name}
                          style={{
                            width: "100%",
                            height: 230,
                            objectFit: "cover",
                            objectPosition: "top center",
                            background: "#020617",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: 230,
                            display: "grid",
                            placeItems: "center",
                            background:
                              "radial-gradient(circle at 30% 20%, rgba(56,189,248,0.22), transparent 40%), rgba(8,47,73,0.35)",
                          }}
                        >
                          <Image
                            src="/logo-white.png"
                            alt="Defan Soluções Digitais"
                            width={210}
                            height={76}
                            style={{ width: "auto", height: 76 }}
                          />
                        </div>
                      )}

                      <div
                        style={{
                          padding: 26,
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 8,
                            marginBottom: 16,
                          }}
                        >
                          {project.type && (
                            <span style={tagStyle}>{project.type}</span>
                          )}

                          {project.commercialModel && (
                            <span
                              style={{
                                ...tagStyle,
                                color: isSubscription ? "#bbf7d0" : "#bfdbfe",
                                background: isSubscription
                                  ? "rgba(34,197,94,0.12)"
                                  : "rgba(59,130,246,0.14)",
                              }}
                            >
                              {project.commercialModel}
                            </span>
                          )}
                        </div>

                        <h3
                          style={{
                            margin: "0 0 12px",
                            fontSize: 24,
                            letterSpacing: "-0.04em",
                            minHeight: 68,
                            display: "flex",
                            alignItems: "flex-start",
                          }}
                        >
                          {project.name}
                        </h3>

                        <p
                          style={{
                            color: colors.muted,
                            lineHeight: 1.68,
                            minHeight: 84,
                            margin: 0,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {project.cardSummary ||
                            "Projeto cadastrado no portfólio Defan."}
                        </p>

                        {(project.startingPrice || project.monthlyPrice) && (
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: 10,
                              margin: "18px 0",
                            }}
                          >
                            {project.startingPrice && (
                              <div
                                style={{
                                  padding: 14,
                                  borderRadius: 18,
                                  background: "rgba(2, 6, 23, 0.34)",
                                  border: "1px solid rgba(125, 211, 252, 0.12)",
                                }}
                              >
                                <small style={{ color: colors.soft }}>
                                  Inicial
                                </small>

                                <strong
                                  style={{ display: "block", marginTop: 4 }}
                                >
                                  {project.startingPrice}
                                </strong>
                              </div>
                            )}

                            {project.monthlyPrice && (
                              <div
                                style={{
                                  padding: 14,
                                  borderRadius: 18,
                                  background: "rgba(2, 6, 23, 0.34)",
                                  border: "1px solid rgba(125, 211, 252, 0.12)",
                                }}
                              >
                                <small style={{ color: colors.soft }}>
                                  Mensal
                                </small>

                                <strong
                                  style={{ display: "block", marginTop: 4 }}
                                >
                                  {project.monthlyPrice}
                                </strong>
                              </div>
                            )}
                          </div>
                        )}

                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 8,
                            marginBottom: 16,
                            minHeight: 74,
                            alignContent: "flex-start",
                          }}
                        >
                          {project.niche && (
                            <span style={tagStyle}>{project.niche}</span>
                          )}

                          {project.technologies?.slice(0, 2).map((tech) => (
                            <span style={tagStyle} key={tech}>
                              {tech}
                            </span>
                          ))}
                        </div>

                        <button
                          type="button"
                          style={{
                            ...outlineButtonStyle,
                            marginTop: "auto",
                            padding: "12px 16px",
                            width: "fit-content",
                          }}
                        >
                          Ver detalhes <ArrowRight size={16} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ ...cardStyle, width: "min(900px, 100%)" }}></div>
          )}
        </div>
      </section>

      <section style={{ ...sectionStyle, paddingTop: 40 }}>
        <div
          style={{
            ...containerStyle,
            display: "grid",
            gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr",
            gap: 26,
          }}
        >
          <article
            style={{
              ...cardStyle,
              padding: isMobile ? 28 : 42,
              minHeight: 420,
              background:
                "radial-gradient(circle at 20% 12%, rgba(56,189,248,0.2), transparent 36%), rgba(15,23,42,0.76)",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                color: colors.blue,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontSize: 12,
                fontWeight: 950,
              }}
            >
              Mais acessível
            </span>

            <h2
              style={{
                margin: "24px 0 16px",
                color: colors.text,
                fontSize: "clamp(28px, 3.35vw, 52px)",
                lineHeight: 1.04,
                letterSpacing: "-0.052em",
              }}
            >
              Projetos por assinatura mensal
            </h2>

            <p style={{ color: colors.muted, lineHeight: 1.68 }}>
              Uma alternativa para empresas que desejam começar com uma solução
              profissional pagando mensalmente.
            </p>

            <ul
              style={{
                padding: 0,
                margin: "30px 0",
                listStyle: "none",
                display: "grid",
                gap: 14,
              }}
            >
              {[
                "Começo mais acessível",
                "Ideal para validar uma ideia",
                "Manutenção mensal",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    fontWeight: 800,
                  }}
                >
                  <CheckCircle2 size={18} color={colors.blue} />
                  {item}
                </li>
              ))}
            </ul>

            <a href="/projetos" style={buttonStyle}>
              Ver opções por assinatura
            </a>
          </article>

          <article
            style={{
              ...cardStyle,
              padding: isMobile ? 28 : 42,
              minHeight: 420,
              background:
                "radial-gradient(circle at 20% 12%, rgba(14,165,233,0.18), transparent 36%), rgba(8,47,73,0.62)",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                color: colors.blue,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontSize: 12,
                fontWeight: 950,
              }}
            >
              Sob medida
            </span>

            <h2
              style={{
                margin: "24px 0 16px",
                color: colors.text,
                fontSize: "clamp(28px, 3.35vw, 52px)",
                lineHeight: 1.04,
                letterSpacing: "-0.052em",
              }}
            >
              Projetos personalizados
            </h2>

            <p style={{ color: colors.muted, lineHeight: 1.68 }}>
              Solução indicada para empresas que precisam de regras próprias,
              módulos específicos e integrações exclusivas.
            </p>

            <ul
              style={{
                padding: 0,
                margin: "30px 0",
                listStyle: "none",
                display: "grid",
                gap: 14,
              }}
            >
              {[
                "Fluxos exclusivos",
                "Integrações específicas",
                "Identidade própria",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    fontWeight: 800,
                  }}
                >
                  <CheckCircle2 size={18} color={colors.blue} />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              style={buttonStyle}
            >
              Quero uma proposta
            </a>
          </article>
        </div>
      </section>

      <section
        id="depoimentos"
        style={{ ...sectionStyle, background: "rgba(15, 23, 42, 0.24)" }}
      >
        <div style={containerStyle}>
          <SectionTitle
            eyebrow="Depoimentos"
            title="Clientes que valorizam uma presença digital mais profissional"
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isTablet
                ? "1fr"
                : isNotebook
                  ? "repeat(2, 1fr)"
                  : "repeat(3, 1fr)",
              gap: 22,
            }}
          >
            {testimonials.map((item) => (
              <article key={item.name} style={cardStyle}>
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    color: "#facc15",
                    marginBottom: 22,
                  }}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={17} fill="currentColor" />
                  ))}
                </div>

                <p style={{ color: colors.muted, lineHeight: 1.68 }}>
                  {item.text}
                </p>

                <strong style={{ display: "block", marginTop: 24 }}>
                  {item.name}
                </strong>

                <span style={{ color: "#93c5fd", fontSize: 14 }}>
                  {item.company}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" style={sectionStyle}>
        <div style={containerStyle}>
          <SectionTitle eyebrow="FAQ" title="Dúvidas frequentes" />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr",
              gap: 26,
              alignItems: "start",
            }}
          >
            {faqs.map((item) => (
              <article
                key={item.question}
                style={{ ...cardStyle, padding: 28 }}
              >
                <h3 style={{ margin: "0 0 12px", fontSize: 20 }}>
                  {item.question}
                </h3>

                <p style={{ color: colors.muted, lineHeight: 1.68 }}>
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer
        style={{
          padding: "58px 0",
          borderTop: "1px solid rgba(125, 211, 252, 0.12)",
          background: "rgba(2, 6, 23, 0.48)",
        }}
      >
        <div
          style={{
            ...containerStyle,
            display: "grid",
            gridTemplateColumns: isTablet ? "1fr" : "1fr auto",
            gap: 28,
            alignItems: "center",
          }}
        >
          <div>
            <Image
              src="/logo-white.png"
              alt="Defan Soluções Digitais"
              width={260}
              height={90}
              style={{
                width: "auto",
                height: 76,
                objectFit: "contain",
                marginBottom: 16,
              }}
            />

            <p style={{ color: colors.muted, lineHeight: 1.68, margin: 0 }}>
              Defan Soluções Digitais — Landing pages, websites, sistemas e
              automações para empresas.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: isTablet ? "flex-start" : "flex-end",
            }}
          >
            <a href="/projetos" style={outlineButtonStyle}>
              Ver projetos
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              style={buttonStyle}
            >
              Pedir orçamento
            </a>
          </div>
        </div>
      </footer>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        style={{
          position: "fixed",
          right: isMobile ? 14 : 22,
          bottom: isMobile ? 14 : 22,
          zIndex: 90,
          borderRadius: 999,
          padding: isMobile ? "14px 16px" : "16px 22px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          fontWeight: 950,
          fontSize: isMobile ? 14 : 16,
          color: "#fff",
          textDecoration: "none",
          background: "linear-gradient(135deg, #16a34a, #22c55e)",
          boxShadow: "0 18px 54px rgba(34,197,94,0.34)",
          border: "1px solid rgba(187,247,208,0.32)",
        }}
        aria-label="Pedir orçamento pelo WhatsApp"
      >
        <MessageCircle size={20} />
      </a>

      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </main>
  );
}
