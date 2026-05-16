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
  blueDark: "#0ea5e9",
};

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    overflow: "hidden",
    background:
      "radial-gradient(circle at 18% 0%, rgba(14,165,233,0.22), transparent 31%), radial-gradient(circle at 82% 12%, rgba(56,189,248,0.12), transparent 28%), linear-gradient(180deg, #020617 0%, #071426 45%, #020617 100%)",
    color: colors.text,
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  container: {
    width: "min(1440px, calc(100% - 56px))",
    margin: "0 auto",
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "rgba(2, 6, 23, 0.86)",
    backdropFilter: "blur(22px)",
    borderBottom: "1px solid rgba(125, 211, 252, 0.12)",
  },
  headerInner: {
    minHeight: 86,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
  },
  logo: {
    width: "auto",
    height: 74,
    objectFit: "contain",
    filter: "drop-shadow(0 0 22px rgba(125,211,252,0.18))",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 24,
    color: colors.muted,
    fontSize: 14,
    fontWeight: 800,
  },
  button: {
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
  },
  outlineButton: {
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
  },
  hero: {
    padding: "74px 0 64px",
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 0.95fr) minmax(420px, 0.78fr)",
    gap: 58,
    alignItems: "center",
  },
  badge: {
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
  },
  heroTitle: {
    margin: 0,
    maxWidth: 940,
    fontSize: "clamp(34px, 4.35vw, 64px)",
    lineHeight: 1.04,
    letterSpacing: "-0.055em",
  },
  heroText: {
    maxWidth: 720,
    margin: "28px 0 0",
    color: colors.muted,
    fontSize: "clamp(16px, 1.15vw, 20px)",
    lineHeight: 1.7,
  },
  heroActions: {
    display: "flex",
    gap: 14,
    flexWrap: "wrap",
    marginTop: 34,
  },
  heroCard: {
    position: "relative",
    minHeight: 500,
    borderRadius: 38,
    padding: 32,
    overflow: "hidden",
    background:
      "radial-gradient(circle at 50% 0%, rgba(56,189,248,0.25), transparent 35%), linear-gradient(145deg, rgba(15,23,42,0.96), rgba(8,47,73,0.72))",
    border: "1px solid rgba(125, 211, 252, 0.26)",
    boxShadow: "0 44px 120px rgba(0,0,0,0.36)",
  },
  brandLogoBox: {
    position: "relative",
    zIndex: 1,
    minHeight: 220,
    display: "grid",
    placeItems: "center",
    borderRadius: 34,
    background:
      "radial-gradient(circle at 50% 50%, rgba(125,211,252,0.18), transparent 58%), rgba(2,6,23,0.34)",
    border: "1px solid rgba(125, 211, 252, 0.14)",
  },
  heroLogo: {
    width: "min(540px, 96%)",
    height: "auto",
    objectFit: "contain",
    filter: "drop-shadow(0 0 34px rgba(255,255,255,0.24))",
  },
  brandPanel: {
    position: "relative",
    zIndex: 2,
    marginTop: 24,
    padding: 26,
    borderRadius: 30,
    background: "rgba(2, 6, 23, 0.32)",
    border: "1px solid rgba(125, 211, 252, 0.14)",
  },
  brandStrip: {
    width: "80%",
    maxWidth: 1240,
    margin: "0 auto 8px",
    padding: "18px 0",
    overflow: "hidden",
    background: "rgba(15, 23, 42, 0.56)",
    border: "1px solid rgba(125, 211, 252, 0.16)",
    borderRadius: 999,
  },
  stripItem: {
    flex: "0 0 auto",
    padding: "10px 18px",
    borderRadius: 999,
    color: "#bae6fd",
    fontWeight: 900,
    background: "rgba(14, 165, 233, 0.1)",
    border: "1px solid rgba(125, 211, 252, 0.13)",
    fontSize: 14,
  },
  section: {
    padding: "104px 0",
  },
  sectionTitle: {
    maxWidth: 900,
    margin: "0 auto 54px",
    textAlign: "center",
  },
  eyebrow: {
    display: "inline-flex",
    color: colors.blue,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: 950,
    marginBottom: 14,
  },
  h2: {
    margin: 0,
    color: colors.text,
    fontSize: "clamp(28px, 3.35vw, 52px)",
    lineHeight: 1.04,
    letterSpacing: "-0.052em",
  },
  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 22,
  },
  card: {
    background: colors.panel,
    border: `1px solid ${colors.border}`,
    borderRadius: 32,
    padding: 26,
  },
  iconBox: {
    width: 60,
    height: 60,
    display: "grid",
    placeItems: "center",
    color: colors.blue,
    borderRadius: 22,
    background: "rgba(14, 165, 233, 0.12)",
    border: "1px solid rgba(125, 211, 252, 0.14)",
  },
  projectsHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: 26,
    marginBottom: 28,
  },
  projectsViewport: {
    width: "100%",
    overflow: "hidden",
  },
  projectsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 24,
  },
  projectCard: {
    overflow: "hidden",
    cursor: "pointer",
    borderRadius: 32,
    background: colors.panel,
    border: `1px solid ${colors.border}`,
    minHeight: 560,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  projectImage: {
    width: "100%",
    height: 230,
    objectFit: "cover",
    objectPosition: "top center",
    background: "#020617",
  },
  projectPlaceholder: {
    width: "100%",
    height: 230,
    display: "grid",
    placeItems: "center",
    background:
      "radial-gradient(circle at 30% 20%, rgba(56,189,248,0.22), transparent 40%), rgba(8,47,73,0.35)",
  },
  projectBody: {
    padding: 26,
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    padding: "8px 11px",
    borderRadius: 999,
    color: "#bae6fd",
    background: "rgba(14, 165, 233, 0.1)",
    border: "1px solid rgba(125, 211, 252, 0.13)",
    fontSize: 12,
    fontWeight: 900,
  },
  priceRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    margin: "18px 0",
  },
  priceCard: {
    padding: 14,
    borderRadius: 18,
    background: "rgba(2, 6, 23, 0.34)",
    border: "1px solid rgba(125, 211, 252, 0.12)",
  },
  modelGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 26,
  },
  footer: {
    padding: "58px 0",
    borderTop: "1px solid rgba(125, 211, 252, 0.12)",
    background: "rgba(2, 6, 23, 0.48)",
  },
  footerGrid: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 28,
    alignItems: "center",
  },
  floatingWhatsapp: {
    position: "fixed",
    right: 22,
    bottom: 22,
    zIndex: 90,
    borderRadius: 999,
    padding: "16px 22px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    fontWeight: 950,
    color: "#fff",
    textDecoration: "none",
    background: "linear-gradient(135deg, #16a34a, #22c55e)",
    boxShadow: "0 18px 54px rgba(34,197,94,0.34)",
    border: "1px solid rgba(187,247,208,0.32)",
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 120,
    background: "rgba(2, 6, 23, 0.82)",
    backdropFilter: "blur(12px)",
    display: "grid",
    placeItems: "center",
    padding: 18,
  },
  modalBox: {
    width: "min(1180px, 100%)",
    maxHeight: "92vh",
    overflow: "auto",
    borderRadius: 34,
    background:
      "radial-gradient(circle at 20% 0%, rgba(56,189,248,0.16), transparent 34%), linear-gradient(145deg, rgba(15,23,42,0.98), rgba(8,47,73,0.92))",
    border: "1px solid rgba(125, 211, 252, 0.28)",
    boxShadow: "0 44px 120px rgba(0,0,0,0.55)",
  },
  modalHeader: {
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
  },
  closeButton: {
    width: 44,
    height: 44,
    border: "1px solid rgba(125, 211, 252, 0.2)",
    borderRadius: 14,
    background: "rgba(2, 6, 23, 0.45)",
    color: colors.text,
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  modalContent: {
    display: "grid",
    gridTemplateColumns: "1.03fr 0.97fr",
    gap: 24,
    padding: 24,
  },
  modalImage: {
    width: "100%",
    height: 420,
    objectFit: "cover",
    objectPosition: "top center",
    borderRadius: 26,
    border: "1px solid rgba(125, 211, 252, 0.16)",
    background: "rgba(2, 6, 23, 0.5)",
  },
  modalPanel: {
    padding: 22,
    borderRadius: 26,
    background: "rgba(2, 6, 23, 0.34)",
    border: "1px solid rgba(125, 211, 252, 0.14)",
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
    marginTop: 16,
  },
  detailCard: {
    padding: 15,
    borderRadius: 18,
    background: "rgba(15, 23, 42, 0.62)",
    border: "1px solid rgba(125, 211, 252, 0.12)",
  },
};

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
        ...styles.sectionTitle,
        marginInline: center ? "auto" : 0,
        textAlign: center ? "center" : "left",
      }}
    >
      <span style={styles.eyebrow}>{eyebrow}</span>
      <h2 style={styles.h2}>{title}</h2>
    </div>
  );
}

function DetailList({ title, items }: { title: string; items?: string[] }) {
  const cleanItems = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!cleanItems.length) return null;

  return (
    <section style={styles.modalPanel}>
      <h3
        style={{ margin: "0 0 14px", fontSize: 20, letterSpacing: "-0.03em" }}
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
  const images = getProjectImages(project);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);

  const selectedImage = images[selectedImageIndex] || images[0] || "";
  const isSubscription = project.commercialModel
    ?.toLowerCase()
    .includes("assinatura");

  function openImageViewer(index: number) {
    setSelectedImageIndex(index);
    setImageViewerOpen(true);
  }

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

  return (
    <div style={styles.modalBackdrop} onClick={onClose}>
      <section
        style={styles.modalBox}
        className="project-modal-box-inline"
        onClick={(event) => event.stopPropagation()}
      >
        <header style={styles.modalHeader}>
          <div>
            <div style={styles.tags}>
              {project.type && <span style={styles.tag}>{project.type}</span>}
              {project.commercialModel && (
                <span
                  style={{
                    ...styles.tag,
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
              {project.niche && <span style={styles.tag}>{project.niche}</span>}
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(30px, 4vw, 54px)",
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
            style={styles.closeButton}
            aria-label="Fechar detalhes do projeto"
          >
            <X size={22} />
          </button>
        </header>

        <div
          style={styles.modalContent}
          className="project-modal-content-inline"
        >
          <div style={{ display: "grid", gap: 14 }}>
            {selectedImage ? (
              <button
                type="button"
                onClick={() => openImageViewer(selectedImageIndex)}
                style={{
                  border: 0,
                  padding: 0,
                  background: "transparent",
                  cursor: "zoom-in",
                  textAlign: "left",
                }}
                title="Clique para ampliar a imagem"
              >
                <img
                  src={selectedImage}
                  alt={project.name}
                  style={styles.modalImage}
                  className="project-modal-image-inline"
                />
              </button>
            ) : (
              <div
                style={{
                  ...styles.modalImage,
                  display: "grid",
                  placeItems: "center",
                }}
                className="project-modal-image-inline"
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
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: 10,
                }}
              >
                {images.slice(0, 8).map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    onDoubleClick={() => openImageViewer(index)}
                    style={{
                      border: "0",
                      padding: 0,
                      background: "transparent",
                      cursor: "pointer",
                    }}
                    title="Clique para trocar. Clique duas vezes para ampliar."
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
            <section style={styles.modalPanel}>
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
                style={styles.detailGrid}
                className="project-detail-grid-inline"
              >
                {project.startingPrice && (
                  <div style={styles.detailCard}>
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
                  <div style={styles.detailCard}>
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
              <section style={styles.modalPanel}>
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
                    <span key={tech} style={styles.tag}>
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
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 16,
            padding: "0 24px 24px",
          }}
          className="project-modal-lists-inline"
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
              style={styles.outlineButton}
            >
              Abrir projeto <ExternalLink size={17} />
            </a>
          ) : (
            <span />
          )}
          <a
            href={`https://wa.me/5521988359825?text=${encodeURIComponent(`Olá, tenho interesse no projeto: ${project.name}`)}`}
            target="_blank"
            rel="noreferrer"
            style={styles.button}
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
                ...styles.outlineButton,
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
                  ...styles.outlineButton,
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
                style={styles.closeButton}
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectPage, setProjectPage] = useState(0);

  useEffect(() => {
    getProjects()
      .then((list) => {
        const highlighted = list.filter((item) => item.highlight !== false);
        setProjects(highlighted.length ? highlighted : list);
      })
      .catch(() => setProjects([]));
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

  return (
    <main style={styles.page}>
      <style jsx>{`
        a {
          color: inherit;
          text-decoration: none;
        }
        .hover-up {
          transition:
            transform 0.28s ease,
            border-color 0.28s ease,
            box-shadow 0.28s ease;
        }
        .hover-up:hover {
          transform: translateY(-6px);
          border-color: rgba(125, 211, 252, 0.36) !important;
          box-shadow: 0 24px 70px rgba(14, 165, 233, 0.12);
        }
        .animate-fade-up {
          animation: fadeUpInline 0.8s ease both;
        }
        .animate-float {
          animation: floatInline 6s ease-in-out infinite;
        }
        .glow-button {
          animation: softPulseInline 2.8s ease-in-out infinite;
        }
        .floating-whatsapp-inline {
          animation: whatsappPulseInline 2.2s ease-in-out infinite;
        }
        .hero-card-inline::after {
          content: "";
          position: absolute;
          inset: 18px;
          border-radius: 32px;
          pointer-events: none;
          border: 1px solid rgba(125, 211, 252, 0.08);
        }
        @keyframes fadeUpInline {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes floatInline {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes softPulseInline {
          0%,
          100% {
            box-shadow: 0 18px 44px rgba(14, 165, 233, 0.24);
          }
          50% {
            box-shadow: 0 18px 60px rgba(14, 165, 233, 0.44);
          }
        }
        @keyframes whatsappPulseInline {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-3px) scale(1.025);
          }
        }
        .strip-track-inline {
          width: max-content;
          display: flex;
          gap: 14px;
          animation: marqueeServices 28s linear infinite;
          padding-inline: 14px;
        }
        .strip-track-inline:hover {
          animation-play-state: paused;
        }
        @keyframes marqueeServices {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .project-modal-box-inline::-webkit-scrollbar {
          width: 10px;
        }
        .project-modal-box-inline::-webkit-scrollbar-track {
          background: rgba(2, 6, 23, 0.5);
        }
        .project-modal-box-inline::-webkit-scrollbar-thumb {
          background: rgba(56, 189, 248, 0.75);
          border-radius: 999px;
        }
        @media (max-width: 1180px) {
          .hero-grid-inline {
            grid-template-columns: 1fr !important;
            gap: 38px !important;
          }
          .hero-copy-inline {
            text-align: center !important;
          }
          .hero-actions-inline {
            justify-content: center !important;
          }
          .hero-card-inline {
            width: min(720px, 100%) !important;
            margin: 0 auto !important;
          }
          .services-grid-inline,
          .projects-grid-inline {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .project-modal-content-inline {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 860px) {
          .main-menu-inline {
            display: none !important;
          }
          .header-inner-inline {
            min-height: 82px !important;
          }
          .header-logo-inline {
            height: 68px !important;
          }
          .brand-strip-inline {
            width: min(92%, 760px) !important;
            border-radius: 28px !important;
          }
          .projects-head-inline,
          .footer-grid-inline {
            grid-template-columns: 1fr !important;
            display: grid !important;
            align-items: start !important;
          }
          .services-grid-inline,
          .projects-grid-inline,
          .model-grid-inline,
          .project-modal-lists-inline {
            grid-template-columns: 1fr !important;
          }
          .project-detail-grid-inline {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 560px) {
          .container-inline {
            width: min(100% - 28px, 1440px) !important;
          }
          .hero-inline {
            padding: 56px 0 42px !important;
          }
          .hero-title-inline {
            font-size: 42px !important;
          }
          .hero-card-inline {
            min-height: auto !important;
            padding: 22px !important;
            border-radius: 30px !important;
          }
          .brand-logo-box-inline {
            min-height: 170px !important;
          }
          .brand-panel-inline {
            padding: 18px !important;
          }
          .hero-actions-inline a {
            width: 100% !important;
          }
          .floating-whatsapp-inline {
            right: 14px !important;
            bottom: 14px !important;
            padding: 14px 16px !important;
            font-size: 14px !important;
          }
          .section-inline {
            padding: 70px 0 !important;
          }
          .project-modal-image-inline {
            height: 260px !important;
          }
        }
      `}</style>

      <header style={styles.header}>
        <div
          style={{ ...styles.container, ...styles.headerInner }}
          className="container-inline header-inner-inline"
        >
          <a href="/">
            <Image
              src="/logo-white.png"
              alt="Defan Soluções Digitais"
              width={420}
              height={140}
              priority
              style={styles.logo}
              className="header-logo-inline"
            />
          </a>

          <nav style={styles.nav} className="main-menu-inline">
            <a href="#servicos">Serviços</a>
            <a href="#sobre">Sobre</a>
            <a href="/projetos">Projetos</a>
            <a href="#depoimentos">Depoimentos</a>
            <a href="#faq">FAQ</a>
          </nav>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            style={styles.button}
            className="glow-button"
          >
            Orçamento agora <ArrowRight size={17} />
          </a>
        </div>
      </header>

      <section style={styles.hero} className="hero-inline">
        <div
          style={{ ...styles.container, ...styles.heroGrid }}
          className="container-inline hero-grid-inline"
        >
          <div className="hero-copy-inline animate-fade-up">
            <span style={styles.badge}>
              <Sparkles size={16} /> Defan Soluções Digitais
            </span>
            <h1 style={styles.heroTitle} className="hero-title-inline">
              Presença digital, sistemas e automações criados para sua empresa
              transmitir confiança.
            </h1>
            <p style={styles.heroText}>
              Projetos profissionais para empresas que precisam vender melhor,
              organizar processos e se apresentar com mais credibilidade no
              digital.
            </p>
            <div style={styles.heroActions} className="hero-actions-inline">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                style={{ ...styles.button, padding: "15px 22px" }}
                className="glow-button"
              >
                Pedir orçamento no WhatsApp <MessageCircle size={19} />
              </a>
              <a
                href="/projetos"
                style={{ ...styles.outlineButton, padding: "16px 24px" }}
              >
                Ver soluções disponíveis <ArrowRight size={18} />
              </a>
            </div>
          </div>

          <div
            style={styles.heroCard}
            className="hero-card-inline animate-float"
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
            <div style={styles.brandLogoBox} className="brand-logo-box-inline">
              <Image
                src="/logo-white.png"
                alt="Defan Soluções Digitais"
                width={560}
                height={190}
                style={styles.heroLogo}
              />
            </div>
            <div style={styles.brandPanel} className="brand-panel-inline">
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
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                  marginTop: 24,
                }}
              >
                <div
                  style={{
                    padding: 18,
                    borderRadius: 22,
                    background: "rgba(15,23,42,0.58)",
                    border: "1px solid rgba(125,211,252,0.12)",
                  }}
                >
                  <strong>Assinatura mensal</strong>
                  <span
                    style={{ display: "block", color: "#93c5fd", fontSize: 13 }}
                  >
                    comece com menor investimento
                  </span>
                </div>
                <div
                  style={{
                    padding: 18,
                    borderRadius: 22,
                    background: "rgba(15,23,42,0.58)",
                    border: "1px solid rgba(125,211,252,0.12)",
                  }}
                >
                  <strong>Projeto sob medida</strong>
                  <span
                    style={{ display: "block", color: "#93c5fd", fontSize: 13 }}
                  >
                    solução única para sua empresa
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        style={styles.brandStrip}
        className="brand-strip-inline"
        aria-label="Serviços e tecnologias"
      >
        <div style={{ width: "100%", overflow: "hidden" }}>
          <div className="strip-track-inline">
            {[...carouselItems, ...carouselItems].map((item, index) => (
              <span key={`${item}-${index}`} style={styles.stripItem}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="servicos" style={styles.section} className="section-inline">
        <div style={styles.container} className="container-inline">
          <SectionTitle
            eyebrow="Serviços"
            title="Soluções digitais para empresas que querem se destacar"
          />
          <div style={styles.servicesGrid} className="services-grid-inline">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.title}
                  style={{ ...styles.card, minHeight: 280 }}
                  className="hover-up"
                >
                  <div style={styles.iconBox}>
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
        style={{ ...styles.section, background: "rgba(15, 23, 42, 0.2)" }}
        className="section-inline"
      >
        <div
          style={{
            ...styles.container,
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 26,
          }}
          className="container-inline model-grid-inline"
        >
          <article style={{ ...styles.card, padding: 38 }}>
            <span style={styles.eyebrow}>Sobre a Defan</span>
            <h2 style={{ ...styles.h2, margin: "18px 0" }}>
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
          <article style={{ ...styles.card, padding: 38 }}>
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
            <span style={styles.eyebrow}>Criado por</span>
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
          style={{ ...styles.container, ...styles.servicesGrid, marginTop: 26 }}
          className="container-inline services-grid-inline"
        >
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <article
                key={value.title}
                style={{ ...styles.card, padding: 28 }}
              >
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

      <section id="projetos" style={styles.section} className="section-inline">
        <div style={styles.container} className="container-inline">
          <div style={styles.projectsHead} className="projects-head-inline">
            <SectionTitle eyebrow="Projetos" title="" center={false} />
            <a href="/projetos" style={styles.outlineButton}>
              Ver catálogo completo <ArrowRight size={18} />
            </a>
          </div>

          {visibleProjects.length > 0 ? (
            <div style={styles.projectsViewport}>
              <div style={styles.projectsGrid} className="projects-grid-inline">
                {visibleProjects.map((project, index) => {
                  const images = getProjectImages(project);
                  const image = images[0];
                  const isSubscription = project.commercialModel
                    ?.toLowerCase()
                    .includes("assinatura");
                  return (
                    <article
                      key={getProjectKey(project, index)}
                      style={styles.projectCard}
                      className="hover-up"
                      onClick={() => setSelectedProject(project)}
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={project.name}
                          style={styles.projectImage}
                        />
                      ) : (
                        <div style={styles.projectPlaceholder}>
                          <Image
                            src="/logo-white.png"
                            alt="Defan Soluções Digitais"
                            width={210}
                            height={76}
                            style={{ width: "auto", height: 76 }}
                          />
                        </div>
                      )}
                      <div style={styles.projectBody}>
                        <div style={styles.tags}>
                          <span style={styles.tag}>{project.type}</span>
                          <span
                            style={{
                              ...styles.tag,
                              color: isSubscription ? "#bbf7d0" : "#bfdbfe",
                              background: isSubscription
                                ? "rgba(34,197,94,0.12)"
                                : "rgba(59,130,246,0.14)",
                            }}
                          >
                            {project.commercialModel}
                          </span>
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
                          <div style={styles.priceRow}>
                            {project.startingPrice && (
                              <div style={styles.priceCard}>
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
                              <div style={styles.priceCard}>
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
                            ...styles.tags,
                            minHeight: 74,
                            alignContent: "flex-start",
                          }}
                        >
                          {project.niche && (
                            <span style={styles.tag}>{project.niche}</span>
                          )}
                          {project.technologies?.slice(0, 2).map((tech) => (
                            <span style={styles.tag} key={tech}>
                              {tech}
                            </span>
                          ))}
                        </div>
                        <button
                          style={{
                            ...styles.outlineButton,
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
            <div style={{ ...styles.card, width: "min(900px, 100%)" }}>
              Cadastre seus projetos no painel admin para exibir automaticamente
              nesta seção.
            </div>
          )}
        </div>
      </section>

      <section
        style={{ ...styles.section, paddingTop: 40 }}
        className="section-inline"
      >
        <div
          style={{ ...styles.container, ...styles.modelGrid }}
          className="container-inline model-grid-inline"
        >
          <article
            style={{
              ...styles.card,
              padding: 42,
              minHeight: 420,
              background:
                "radial-gradient(circle at 20% 12%, rgba(56,189,248,0.2), transparent 36%), rgba(15,23,42,0.76)",
            }}
          >
            <span style={styles.eyebrow}>Mais acessível</span>
            <h2 style={{ ...styles.h2, margin: "24px 0 16px" }}>
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
            <a href="/projetos" style={styles.button}>
              Ver opções por assinatura
            </a>
          </article>
          <article
            style={{
              ...styles.card,
              padding: 42,
              minHeight: 420,
              background:
                "radial-gradient(circle at 20% 12%, rgba(14,165,233,0.18), transparent 36%), rgba(8,47,73,0.62)",
            }}
          >
            <span style={styles.eyebrow}>Sob medida</span>
            <h2 style={{ ...styles.h2, margin: "24px 0 16px" }}>
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
              style={styles.button}
              className="glow-button"
            >
              Quero uma proposta
            </a>
          </article>
        </div>
      </section>

      <section
        id="depoimentos"
        style={{ ...styles.section, background: "rgba(15, 23, 42, 0.24)" }}
        className="section-inline"
      >
        <div style={styles.container} className="container-inline">
          <SectionTitle
            eyebrow="Depoimentos"
            title="Clientes que valorizam uma presença digital mais profissional"
          />
          <div style={styles.servicesGrid} className="services-grid-inline">
            {testimonials.map((item) => (
              <article key={item.name} style={styles.card}>
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

      <section id="faq" style={styles.section} className="section-inline">
        <div style={styles.container} className="container-inline">
          <SectionTitle eyebrow="FAQ" title="Dúvidas frequentes" />
          <div
            style={{ ...styles.modelGrid, alignItems: "start" }}
            className="model-grid-inline"
          >
            {faqs.map((item) => (
              <article
                key={item.question}
                style={{ ...styles.card, padding: 28 }}
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

      <footer style={styles.footer}>
        <div
          style={{ ...styles.container, ...styles.footerGrid }}
          className="container-inline footer-grid-inline"
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
              justifyContent: "flex-end",
            }}
          >
            <a href="/projetos" style={styles.outlineButton}>
              Ver projetos
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              style={styles.button}
              className="glow-button"
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
        style={styles.floatingWhatsapp}
        className="floating-whatsapp-inline"
        aria-label="Pedir orçamento pelo WhatsApp"
      >
        <MessageCircle size={20} />
        Pedir orçamento
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
