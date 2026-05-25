"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  MessageCircle,
  Phone,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { getProjects } from "@/lib/firestore";

type SeoFaqItem = {
  question: string;
  answer: string;
};

type Project = {
  id?: string;
  name: string;
  type: string;
  niche: string;
  commercialModel: string;
  startingPrice?: string;
  monthlyPrice?: string;
  technologies: string[];
  link?: string;
  imageUrl?: string;
  images?: string[];
  cardSummary?: string;
  fullDescription?: string;
  modules?: string[];
  integrations?: string[];
  indicatedBusinesses?: string[];
  basicFlow?: string[];
  highlight?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  seoLocation?: string;
  seoText?: string;
  seoFaqs?: SeoFaqItem[];
};

const WHATSAPP_NUMBER = "5521988359825";

const colors = {
  bg: "#020617",
  panel: "rgba(15, 23, 42, 0.76)",
  panelStrong: "rgba(15, 23, 42, 0.92)",
  border: "rgba(125, 211, 252, 0.16)",
  borderStrong: "rgba(125, 211, 252, 0.32)",
  text: "#f8fafc",
  muted: "#cbd5e1",
  soft: "#94a3b8",
  blue: "#38bdf8",
  lightBlue: "#bae6fd",
  green: "#22c55e",
};

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    color: colors.text,
    fontFamily: "Arial, Helvetica, sans-serif",
    background:
      "radial-gradient(circle at 18% 0%, rgba(14,165,233,0.16), transparent 30%), radial-gradient(circle at 84% 10%, rgba(56,189,248,0.1), transparent 26%), linear-gradient(180deg, #020617 0%, #061120 48%, #020617 100%)",
    overflowX: "hidden",
  },
  container: {
    width: "min(1440px, calc(100% - 44px))",
    margin: "0 auto",
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 40,
    background: "rgba(2, 6, 23, 0.86)",
    backdropFilter: "blur(20px)",
    borderBottom: `1px solid ${colors.border}`,
  },
  nav: {
    minHeight: 82,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
  },
  logo: {
    width: "auto",
    height: 64,
    objectFit: "contain",
    filter: "drop-shadow(0 0 16px rgba(125,211,252,0.14))",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  navLink: {
    color: colors.muted,
    textDecoration: "none",
    fontWeight: 850,
    fontSize: 14,
  },
  cta: {
    border: 0,
    borderRadius: 999,
    padding: "13px 18px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    color: "#fff",
    textDecoration: "none",
    fontWeight: 950,
    cursor: "pointer",
    background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
    boxShadow: "0 16px 40px rgba(14,165,233,0.22)",
  },
  ghost: {
    borderRadius: 999,
    padding: "13px 18px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    color: "#e0f2fe",
    textDecoration: "none",
    fontWeight: 950,
    cursor: "pointer",
    background: "rgba(15, 23, 42, 0.72)",
    border: `1px solid ${colors.borderStrong}`,
  },
  hero: {
    padding: "64px 0 36px",
    textAlign: "center",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 14px",
    borderRadius: 999,
    color: colors.lightBlue,
    fontWeight: 900,
    background: "rgba(14,165,233,0.1)",
    border: `1px solid ${colors.border}`,
  },
  h1: {
    maxWidth: 1000,
    margin: "22px auto 0",
    fontSize: "clamp(34px, 5vw, 64px)",
    lineHeight: 1.04,
    letterSpacing: "-0.055em",
  },
  gradientText: {
    background: "linear-gradient(135deg, #7dd3fc, #ffffff)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },
  heroText: {
    maxWidth: 780,
    margin: "20px auto 0",
    color: colors.muted,
    fontSize: "clamp(16px, 1.25vw, 19px)",
    lineHeight: 1.7,
  },
  trustRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginTop: 26,
  },
  trustPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    color: "#dbeafe",
    fontSize: 13,
    fontWeight: 900,
    padding: "9px 11px",
    borderRadius: 999,
    background: "rgba(15, 23, 42, 0.58)",
    border: "1px solid rgba(125, 211, 252, 0.13)",
  },
  filtersTop: {
    marginTop: 30,
    padding: 20,
    borderRadius: 26,
    background: "rgba(15, 23, 42, 0.68)",
    border: `1px solid ${colors.border}`,
    boxShadow: "0 18px 58px rgba(0,0,0,0.16)",
  },
  filtersGridGlobal: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 12,
    alignItems: "end",
  },
  field: {
    display: "grid",
    gap: 8,
    color: "#dbeafe",
    fontSize: 13,
    fontWeight: 950,
    textAlign: "left",
  },
  inputWrap: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    alignItems: "center",
    gap: 9,
    borderRadius: 16,
    padding: "0 13px",
    background: "rgba(2, 6, 23, 0.46)",
    border: `1px solid ${colors.border}`,
  },
  input: {
    width: "100%",
    border: 0,
    outline: "none",
    color: colors.text,
    background: "transparent",
    padding: "13px 0",
  },
  content: {
    padding: "42px 0 88px",
  },
  topResult: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 24,
  },
  kicker: {
    display: "block",
    color: colors.blue,
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    fontSize: 12,
    fontWeight: 950,
    marginBottom: 8,
  },
  h2: {
    margin: 0,
    fontSize: "clamp(26px, 3.2vw, 44px)",
    letterSpacing: "-0.055em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 22,
  },
  card: {
    overflow: "hidden",
    position: "relative",
    borderRadius: 32,
    background:
      "linear-gradient(180deg, rgba(15,23,42,0.82), rgba(8,47,73,0.52))",
    border: `1px solid ${colors.border}`,
    boxShadow: "0 22px 70px rgba(0,0,0,0.22)",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    cursor: "pointer",
    transition:
      "transform .22s ease, border-color .22s ease, box-shadow .22s ease",
  },
  imageWrap: {
    position: "relative",
    height: 320,
    overflow: "hidden",
    background: "rgba(8,47,73,0.42)",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "top center",
    display: "block",
    transform: "scale(1.01)",
  },
  imageOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(2,6,23,0.04) 35%, rgba(2,6,23,0.84) 100%)",
    pointerEvents: "none",
  },
  imageEmpty: {
    height: "100%",
    display: "grid",
    placeItems: "center",
    color: colors.lightBlue,
    fontWeight: 950,
    background:
      "radial-gradient(circle at 30% 20%, rgba(56,189,248,0.22), transparent 40%), rgba(8,47,73,0.42)",
  },
  cardBody: {
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    flex: 1,
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignContent: "flex-start",
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    padding: "7px 10px",
    borderRadius: 999,
    color: colors.lightBlue,
    background: "rgba(14,165,233,0.1)",
    border: `1px solid ${colors.border}`,
    fontSize: 11,
    letterSpacing: "0.02em",
    fontWeight: 950,
  },
  tagGreen: {
    color: "#bbf7d0",
    background: "rgba(34,197,94,0.12)",
    border: "1px solid rgba(74,222,128,0.22)",
  },
  cardTitle: {
    margin: 0,
    fontSize: 25,
    lineHeight: 1.08,
    letterSpacing: "-0.045em",
  },
  cardText: {
    color: colors.muted,
    lineHeight: 1.65,
    margin: 0,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  } as CSSProperties,
  cardDivider: {
    width: "100%",
    height: 1,
    background:
      "linear-gradient(90deg, rgba(56,189,248,0.5), rgba(125,211,252,0.04))",
  },
  priceRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  priceCard: {
    padding: 13,
    borderRadius: 18,
    background: "rgba(2, 6, 23, 0.35)",
    border: `1px solid ${colors.border}`,
  },
  priceSmall: {
    display: "block",
    color: colors.soft,
    fontSize: 12,
    fontWeight: 900,
  },
  priceStrong: {
    display: "block",
    marginTop: 3,
    color: "#e0f2fe",
    fontSize: 16,
  },
  empty: {
    padding: 28,
    borderRadius: 28,
    background: colors.panel,
    border: `1px solid ${colors.border}`,
    color: colors.muted,
    lineHeight: 1.65,
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
  finalCta: {
    padding: "90px 0",
    borderTop: `1px solid ${colors.border}`,
    background:
      "radial-gradient(circle at 50% 0%, rgba(14,165,233,0.18), transparent 34%), rgba(2,6,23,0.52)",
    textAlign: "center",
  },
  floatingPhone: {
    position: "fixed",
    right: 22,
    bottom: 22,
    zIndex: 60,
    width: 54,
    height: 54,
    borderRadius: 999,
    background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
    color: "#fff",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 18px 50px rgba(14,165,233,0.34)",
  },
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
    isMobile: width <= 560,
    isTablet: width <= 860,
    isNotebook: width <= 1180,
  };
}

function safeLower(value?: string) {
  return String(value || "").toLowerCase();
}

function safeArray(value?: string[]) {
  return Array.isArray(value) ? value : [];
}

function makeWhatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function isSubscriptionProject(project: Project) {
  const model = safeLower(project.commercialModel);
  return (
    model.includes("assinatura") ||
    model.includes("mensal") ||
    model.includes("recorrente")
  );
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

function projectMatchesGlobalSearch(project: Project, search: string) {
  const normalizedSearch = search.trim().toLowerCase();
  if (!normalizedSearch) return true;

  const technologies = safeArray(project.technologies);
  const modules = safeArray(project.modules);
  const integrations = safeArray(project.integrations);
  const indicatedBusinesses = safeArray(project.indicatedBusinesses);
  const basicFlow = safeArray(project.basicFlow);

  const searchableText = [
    project.name,
    project.type,
    project.niche,
    project.commercialModel,
    project.cardSummary,
    project.fullDescription,
    project.startingPrice,
    project.monthlyPrice,
    ...technologies,
    ...modules,
    ...integrations,
    ...indicatedBusinesses,
    ...basicFlow,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedSearch);
}

function DetailList({ title, items }: { title: string; items?: string[] }) {
  const cleanItems = safeArray(items).filter(Boolean);
  if (!cleanItems.length) return null;

  return (
    <section style={styles.modalPanel}>
      <h3 style={{ margin: "0 0 14px", fontSize: 22 }}>{title}</h3>
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
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = images[activeImageIndex] || images[0] || "";

  function previousImage(event?: React.MouseEvent<HTMLButtonElement>) {
    event?.stopPropagation();
    if (!images.length) return;
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }

  function nextImage(event?: React.MouseEvent<HTMLButtonElement>) {
    event?.stopPropagation();
    if (!images.length) return;
    setActiveImageIndex((prev) => (prev + 1) % images.length);
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
                <span style={{ ...styles.tag, ...styles.tagGreen }}>
                  {project.commercialModel}
                </span>
              )}
              {project.niche && <span style={styles.tag}>{project.niche}</span>}
            </div>
            <h2
              style={{
                margin: "12px 0 0",
                fontSize: "clamp(30px, 4vw, 54px)",
                lineHeight: 1,
                letterSpacing: "-0.06em",
              }}
            >
              {project.name}
            </h2>
          </div>

          <button type="button" onClick={onClose} style={styles.closeButton}>
            <X size={22} />
          </button>
        </header>

        <div
          style={{
            ...styles.modalContent,
            gridTemplateColumns: isTablet ? "1fr" : "1.03fr 0.97fr",
          }}
          className="project-modal-content-inline"
        >
          <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
            {activeImage ? (
              <img
                src={activeImage}
                alt={project.name}
                style={{
                  ...styles.modalImage,
                  height: isMobile ? 260 : 420,
                }}
                className="project-modal-image-inline"
              />
            ) : (
              <div
                style={{
                  ...styles.modalImage,
                  height: isMobile ? 260 : 420,
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <button
                  type="button"
                  style={styles.ghost}
                  onClick={previousImage}
                >
                  <ChevronLeft size={17} />
                  Anterior
                </button>
                <strong style={{ color: colors.lightBlue }}>
                  {activeImageIndex + 1} / {images.length}
                </strong>
                <button type="button" style={styles.ghost} onClick={nextImage}>
                  Próxima
                  <ChevronRight size={17} />
                </button>
              </div>
            )}
          </div>

          <aside style={{ display: "grid", gap: 16, alignContent: "start" }}>
            <section style={styles.modalPanel}>
              <h3 style={{ margin: "0 0 10px", fontSize: 24 }}>
                Resumo do sistema
              </h3>
              <p style={{ color: colors.muted, lineHeight: 1.7, margin: 0 }}>
                {project.fullDescription ||
                  project.cardSummary ||
                  "Sistema por assinatura cadastrado no portfólio Defan."}
              </p>

              <div
                style={{
                  ...styles.detailGrid,
                  gridTemplateColumns: isMobile
                    ? "1fr"
                    : "repeat(2, minmax(0, 1fr))",
                }}
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
                <h3 style={{ margin: "0 0 14px", fontSize: 22 }}>
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
            gridTemplateColumns: isTablet ? "1fr" : "repeat(2, minmax(0, 1fr))",
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
              style={styles.ghost}
            >
              Abrir projeto <ExternalLink size={17} />
            </a>
          ) : (
            <span />
          )}
          <a
            href={makeWhatsappUrl(
              `Olá, Tais! Quero contratar ou conhecer melhor o sistema por assinatura: ${project.name}`,
            )}
            target="_blank"
            rel="noreferrer"
            style={styles.cta}
          >
            Quero este sistema <MessageCircle size={18} />
          </a>
        </footer>
      </section>
    </div>
  );
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  const images = getProjectImages(project);
  const firstImage = images[0];

  return (
    <article
      style={styles.card}
      className="project-card-inline"
      onClick={onOpen}
    >
      <div style={styles.imageWrap}>
        {firstImage ? (
          <img src={firstImage} alt={project.name} style={styles.image} />
        ) : (
          <div style={styles.imageEmpty}>Defan Soluções Digitais</div>
        )}
        <div style={styles.imageOverlay} />
      </div>

      <div style={styles.cardBody}>
        <h3 style={styles.cardTitle}>{project.name}</h3>
        <div style={styles.cardDivider} />

        <p style={styles.cardText}>
          {project.cardSummary ||
            project.fullDescription ||
            "Sistema por assinatura para empresas que querem começar com menor investimento."}
        </p>

        <div style={styles.tags}>
          {project.type && <span style={styles.tag}>{project.type}</span>}
          {project.commercialModel && (
            <span style={{ ...styles.tag, ...styles.tagGreen }}>
              {project.commercialModel}
            </span>
          )}
          {project.niche && <span style={styles.tag}>{project.niche}</span>}
        </div>

        <div style={styles.priceRow} className="projetos-price-row">
          {project.startingPrice ? (
            <div style={styles.priceCard}>
              <small style={styles.priceSmall}>Inicial</small>
              <strong style={styles.priceStrong}>
                {project.startingPrice}
              </strong>
            </div>
          ) : (
            <div style={styles.priceCard}>
              <small style={styles.priceSmall}>Inicial</small>
              <strong style={styles.priceStrong}>Sob consulta</strong>
            </div>
          )}

          {project.monthlyPrice ? (
            <div style={styles.priceCard}>
              <small style={styles.priceSmall}>Mensal</small>
              <strong style={styles.priceStrong}>{project.monthlyPrice}</strong>
            </div>
          ) : (
            <div style={styles.priceCard}>
              <small style={styles.priceSmall}>Mensal</small>
              <strong style={styles.priceStrong}>Sob consulta</strong>
            </div>
          )}
        </div>

        <button
          type="button"
          style={{ ...styles.ghost, width: "100%", marginTop: "auto" }}
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
        >
          Ver detalhes
          <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}

export default function AssinaturasPage() {
  const { isMobile, isTablet, isNotebook } = useScreen();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then((list) =>
        setProjects(
          (list as Project[]).filter((project) =>
            isSubscriptionProject(project),
          ),
        ),
      )
      .catch((error) => {
        console.error("Erro ao carregar sistemas por assinatura:", error);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      projectMatchesGlobalSearch(project, search),
    );
  }, [projects, search]);

  const whatsappUrl = makeWhatsappUrl(
    "Olá, Tais! Vi a página de sistemas por assinatura e quero saber qual solução combina com meu negócio.",
  );

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div
          style={{
            ...styles.container,
            ...styles.nav,
            flexDirection: isMobile ? "column" : "row",
            padding: isMobile ? "14px 0" : 0,
          }}
          className="container-inline"
        >
          <a href="/" aria-label="Voltar para a home">
            <Image
              src="/logo-white.png"
              alt="Defan Soluções Digitais"
              width={330}
              height={110}
              priority
              style={{
                ...styles.logo,
                height: isMobile ? 54 : 64,
              }}
              className="header-logo-inline"
            />
          </a>

          <nav
            style={{
              ...styles.navLinks,
              width: isMobile ? "100%" : "auto",
              justifyContent: isMobile ? "center" : "flex-end",
            }}
            className="nav-links-inline"
          >
            <a href="/" style={styles.navLink}>
              Início
            </a>
            <a href="/projetos" style={styles.navLink}>
              Todos os projetos
            </a>
            <a href={`tel:+${WHATSAPP_NUMBER}`} style={styles.ghost}>
              <Phone size={17} />
              Telefone
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              style={styles.cta}
            >
              <MessageCircle size={17} />
              WhatsApp
            </a>
          </nav>
        </div>
      </header>

      <section
        style={{ ...styles.container, ...styles.hero }}
        className="container-inline"
      >
        <span style={styles.badge}>
          <Sparkles size={16} />
          Sistemas por assinatura mensal
        </span>

        <h1 style={styles.h1}>
          Sistemas prontos para empresas que querem começar
          <span style={styles.gradientText}> com menor investimento.</span>
        </h1>

        <p style={styles.heroText}>
          Soluções cadastradas no portfólio Defan com modelo de assinatura,
          manutenção e evolução mensal. Use a busca global para encontrar por
          nome, nicho, tecnologia, módulo ou descrição.
        </p>

        <div style={styles.trustRow}>
          <span style={styles.trustPill}>
            <BadgeCheck size={17} /> Menor investimento inicial
          </span>
          <span style={styles.trustPill}>
            <BadgeCheck size={17} /> Evolução mensal
          </span>
          <span style={styles.trustPill}>
            <BadgeCheck size={17} /> Suporte e manutenção
          </span>
        </div>

        <section style={styles.filtersTop}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <span style={styles.kicker}>Filtro global</span>
              <h2
                style={{ ...styles.h2, fontSize: "clamp(22px, 2.2vw, 32px)" }}
              >
                Buscar sistema por assinatura
              </h2>
            </div>
            {search.trim() && (
              <button
                type="button"
                style={styles.ghost}
                onClick={() => setSearch("")}
              >
                Limpar busca
              </button>
            )}
          </div>

          <div
            style={{
              ...styles.filtersGridGlobal,
              gridTemplateColumns: isTablet ? "1fr" : "1fr auto",
            }}
            className="filters-grid-inline"
          >
            <label style={styles.field}>
              Buscar
              <div style={styles.inputWrap}>
                <Search size={18} color={colors.soft} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Digite nome, nicho, tecnologia, módulo..."
                  style={styles.input}
                />
              </div>
            </label>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              style={{ ...styles.cta, width: isTablet ? "100%" : "auto" }}
            >
              Quero uma indicação
              <ArrowRight size={17} />
            </a>
          </div>
        </section>
      </section>

      <section
        style={{ ...styles.container, ...styles.content }}
        className="container-inline"
      >
        <div style={styles.topResult} className="projetos-top-result">
          <div>
            <span style={styles.kicker}>Resultado</span>
            <h2 style={styles.h2}>
              {filteredProjects.length} sistemas encontrados
            </h2>
          </div>
          <a style={styles.ghost} href="/projetos">
            Ver todos os projetos
            <ArrowRight size={17} />
          </a>
        </div>

        {loading && (
          <div style={styles.empty}>
            <Loader2 size={18} className="spin-local" /> Carregando sistemas.
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div style={styles.empty}>
            <h3 style={{ margin: "0 0 8px", color: colors.text }}>
              Nenhum sistema encontrado
            </h3>
            <p style={{ margin: 0 }}>
              Limpe a busca ou fale no WhatsApp para receber uma indicação.
            </p>
          </div>
        )}

        {!loading && filteredProjects.length > 0 && (
          <div
            style={{
              ...styles.grid,
              gridTemplateColumns: isTablet
                ? "1fr"
                : isNotebook
                  ? "repeat(2, minmax(0, 1fr))"
                  : "repeat(3, minmax(0, 1fr))",
            }}
            className="projetos-grid"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={getProjectKey(project, index)}
                project={project}
                onOpen={() => setSelectedProject(project)}
              />
            ))}
          </div>
        )}
      </section>

      <section style={styles.finalCta}>
        <div style={styles.container}>
          <span style={styles.kicker}>Ainda não sabe qual escolher?</span>
          <h2
            style={{
              maxWidth: 920,
              margin: "14px auto 0",
              fontSize: "clamp(30px, 4vw, 62px)",
              lineHeight: 1.04,
              letterSpacing: "-0.06em",
            }}
          >
            Me chame no WhatsApp e eu te ajudo a escolher o sistema ideal.
          </h2>
          <p
            style={{
              maxWidth: 740,
              margin: "22px auto 30px",
              color: colors.muted,
              lineHeight: 1.75,
              fontSize: 18,
            }}
          >
            Você explica seu negócio e eu indico se faz mais sentido assinatura
            mensal, landing page, site institucional ou sistema sob medida.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            style={styles.cta}
          >
            Falar com a Tais agora <MessageCircle size={18} />
          </a>
        </div>
      </section>

      <a
        href={`tel:+${WHATSAPP_NUMBER}`}
        style={styles.floatingPhone}
        aria-label="Ligar para Defan"
      >
        <Phone size={21} />
      </a>

      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        a {
          text-decoration: none;
        }

        .project-card-inline:hover {
          transform: translateY(-7px);
          border-color: rgba(125, 211, 252, 0.38) !important;
          box-shadow: 0 30px 88px rgba(14, 165, 233, 0.16) !important;
        }

        .project-card-inline:hover img {
          transform: scale(1.045) !important;
          transition: transform 0.35s ease;
        }

        .spin-local {
          animation: spinLocal 0.8s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spinLocal {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 860px) {
          .projetos-top-result {
            align-items: flex-start !important;
            flex-direction: column !important;
          }

          .projetos-price-row {
            grid-template-columns: 1fr !important;
          }

          .project-modal-content-inline,
          .project-modal-lists-inline {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 560px) {
          .container-inline {
            width: min(100% - 28px, 1440px) !important;
          }

          .nav-links-inline {
            gap: 8px !important;
          }

          .nav-links-inline a {
            font-size: 12px !important;
            padding: 11px 13px !important;
          }

          .projetos-grid {
            gap: 18px !important;
          }

          .project-modal-box-inline {
            border-radius: 24px !important;
          }

          .project-modal-image-inline {
            height: 260px !important;
          }
        }
      `}</style>
    </main>
  );
}
