"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
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

type Filters = {
  search: string;
  niche: string;
};

const WHATSAPP_NUMBER = "5521988359825";

const initialFilters: Filters = {
  search: "",
  niche: "Todos",
};

const colors = {
  bg: "#020617",
  panel: "rgba(15, 23, 42, 0.76)",
  panelStrong: "rgba(15, 23, 42, 0.92)",
  border: "rgba(56, 189, 248, 0.18)",
  borderStrong: "rgba(56, 189, 248, 0.34)",
  text: "#f8fafc",
  muted: "#cbd5e1",
  soft: "#94a3b8",
  blue: "#38bdf8",
  blue2: "#0ea5e9",
  blue3: "#60a5fa",
  lightBlue: "#dbeafe",
};

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    color: colors.text,
    fontFamily: "Arial, Helvetica, sans-serif",
    background:
      "radial-gradient(circle at 15% 0%, rgba(37,99,235,0.32), transparent 34%), radial-gradient(circle at 88% 12%, rgba(14,165,233,0.24), transparent 30%), linear-gradient(180deg, #020617 0%, #061a33 42%, #020617 100%)",
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
    background: "rgba(2, 6, 23, 0.82)",
    backdropFilter: "blur(22px)",
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
    filter: "drop-shadow(0 0 20px rgba(56,189,248,0.2))",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: 16,
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
    padding: "13px 20px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    color: "#fff",
    textDecoration: "none",
    fontWeight: 950,
    cursor: "pointer",
    background: "linear-gradient(135deg, #2563eb, #0ea5e9, #38bdf8)",
    boxShadow: "0 18px 50px rgba(14,165,233,0.28)",
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
    background: "rgba(15, 23, 42, 0.62)",
    border: `1px solid ${colors.borderStrong}`,
  },
  hero: {
    padding: "74px 0 38px",
    textAlign: "center",
    position: "relative",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 16px",
    borderRadius: 999,
    color: "#dbeafe",
    fontWeight: 950,
    background: "rgba(37, 99, 235, 0.22)",
    border: `1px solid ${colors.borderStrong}`,
    boxShadow: "0 0 34px rgba(14,165,233,0.14)",
  },
  h1: {
    maxWidth: 980,
    margin: "26px auto 0",
    fontSize: "clamp(34px, 4.6vw, 64px)",
    lineHeight: 1.08,
    letterSpacing: "-0.065em",
  },
  gradientText: {
    background: "linear-gradient(135deg, #38bdf8, #60a5fa, #ffffff)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },
  heroText: {
    maxWidth: 800,
    margin: "24px auto 0",
    color: colors.muted,
    fontSize: "clamp(16px, 1.3vw, 20px)",
    lineHeight: 1.75,
  },
  trustRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginTop: 28,
  },
  trustPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    color: "#dbeafe",
    fontSize: 13,
    fontWeight: 900,
    padding: "10px 13px",
    borderRadius: 999,
    background: "rgba(15, 23, 42, 0.58)",
    border: `1px solid ${colors.border}`,
  },
  statsGrid: {
    width: "min(980px, 100%)",
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16,
    margin: "36px auto 0",
  },
  statCard: {
    padding: 22,
    borderRadius: 26,
    background:
      "linear-gradient(180deg, rgba(15,23,42,0.82), rgba(8,47,73,0.48))",
    border: `1px solid ${colors.border}`,
    boxShadow: "0 24px 70px rgba(0,0,0,0.2)",
  },
  statNumber: {
    display: "block",
    fontSize: 36,
    letterSpacing: "-0.05em",
    background: "linear-gradient(135deg, #38bdf8, #ffffff)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },
  statLabel: {
    display: "block",
    marginTop: 4,
    color: colors.soft,
    fontWeight: 850,
  },
  filtersTop: {
    width: "min(1180px, 100%)",
    margin: "36px auto 0",
    padding: 22,
    borderRadius: 30,
    background:
      "linear-gradient(180deg, rgba(15,23,42,0.82), rgba(8,47,73,0.46))",
    border: `1px solid ${colors.border}`,
    boxShadow: "0 24px 80px rgba(0,0,0,0.24)",
  },
  filtersGrid: {
    display: "grid",
    gridTemplateColumns: "1.5fr minmax(220px, 0.7fr)",
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
    background: "rgba(2, 6, 23, 0.52)",
    border: `1px solid ${colors.border}`,
  },
  input: {
    width: "100%",
    border: 0,
    outline: "none",
    color: colors.text,
    background: "transparent",
    padding: "14px 0",
  },
  select: {
    width: "100%",
    border: `1px solid ${colors.border}`,
    background: "rgba(2, 6, 23, 0.9)",
    color: colors.text,
    outline: "none",
    borderRadius: 16,
    padding: "14px",
  },
  content: {
    padding: "34px 0 90px",
  },
  topResult: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 26,
  },
  kicker: {
    display: "block",
    color: colors.blue,
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    fontSize: 12,
    fontWeight: 950,
    marginBottom: 8,
  },
  h2: {
    margin: 0,
    fontSize: "clamp(28px, 3.4vw, 50px)",
    letterSpacing: "-0.06em",
    lineHeight: 1.03,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 24,
  },
  card: {
    overflow: "hidden",
    position: "relative",
    borderRadius: 34,
    background:
      "linear-gradient(180deg, rgba(15,23,42,0.86), rgba(8,47,73,0.56))",
    border: `1px solid ${colors.border}`,
    boxShadow: "0 24px 76px rgba(0,0,0,0.24)",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    cursor: "pointer",
  },
  imageWrap: {
    position: "relative",
    height: 350,
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
      "linear-gradient(180deg, rgba(2,6,23,0.02) 35%, rgba(2,6,23,0.88) 100%)",
    pointerEvents: "none",
  },
  imageEmpty: {
    height: "100%",
    display: "grid",
    placeItems: "center",
    color: "#dbeafe",
    fontWeight: 950,
    background:
      "radial-gradient(circle at 30% 20%, rgba(56,189,248,0.22), transparent 40%), rgba(8,47,73,0.42)",
  },
  cardBody: {
    padding: 25,
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
    color: "#dbeafe",
    background: "rgba(14,165,233,0.11)",
    border: `1px solid ${colors.border}`,
    fontSize: 11,
    letterSpacing: "0.02em",
    fontWeight: 950,
  },
  tagBlue: {
    color: "#bfdbfe",
    background: "rgba(37,99,235,0.18)",
    border: "1px solid rgba(96,165,250,0.26)",
  },
  cardTitle: {
    margin: 0,
    fontSize: 26,
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
      "linear-gradient(90deg, rgba(56,189,248,0.55), rgba(125,211,252,0.04))",
  },
  priceRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  priceCard: {
    padding: 14,
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
  footer: {
    position: "relative",
    overflow: "hidden",
    padding: "74px 0 42px",
    borderTop: `1px solid ${colors.border}`,
    background:
      "radial-gradient(circle at 50% 0%, rgba(14,165,233,0.18), transparent 35%), rgba(2, 6, 23, 0.78)",
  },
  footerGrid: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 28,
    alignItems: "center",
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
    background: "linear-gradient(135deg, #2563eb, #0ea5e9, #38bdf8)",
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

function getUniqueOptions(
  projects: Project[],
  getter: (project: Project) => string | string[] | undefined,
) {
  const values = projects.flatMap((project) => {
    const value = getter(project);
    if (Array.isArray(value)) return value;
    return value ? [value] : [];
  });

  return Array.from(
    new Set(values.map((item) => String(item).trim()).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function projectMatchesGlobalSearch(project: Project, search: string) {
  const normalizedSearch = search.trim().toLowerCase();
  if (!normalizedSearch) return true;

  const searchableText = [
    project.name,
    project.type,
    project.niche,
    project.commercialModel,
    project.cardSummary,
    project.fullDescription,
    project.startingPrice,
    project.monthlyPrice,
    ...safeArray(project.technologies),
    ...safeArray(project.modules),
    ...safeArray(project.integrations),
    ...safeArray(project.indicatedBusinesses),
    ...safeArray(project.basicFlow),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedSearch);
}

function projectMatchesFilters(project: Project, filters: Filters) {
  const matchSearch = projectMatchesGlobalSearch(project, filters.search);
  const matchNiche =
    filters.niche === "Todos" || project.niche === filters.niche;

  return matchSearch && matchNiche;
}

function TextParagraphs({
  text,
  fallback,
}: {
  text?: string;
  fallback: string;
}) {
  const paragraphs = String(text || fallback)
    .split(/\n\s*\n|\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="project-description-paragraphs">
      {paragraphs.map((paragraph, index) => (
        <p key={`${paragraph}-${index}`}>{paragraph}</p>
      ))}
    </div>
  );
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
        className="project-modal-box-inline modal-reveal"
        onClick={(event) => event.stopPropagation()}
      >
        <header style={styles.modalHeader}>
          <div>
            <div style={styles.tags}>
              {project.type && <span style={styles.tag}>{project.type}</span>}
              {project.commercialModel && (
                <span style={{ ...styles.tag, ...styles.tagBlue }}>
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
            {project.cardSummary && (
              <p className="project-modal-summary-inline">
                {project.cardSummary}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            style={styles.closeButton}
            aria-label="Fechar modal"
          >
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
                style={{ ...styles.modalImage, height: isMobile ? 260 : 420 }}
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
              <TextParagraphs
                text={project.fullDescription || project.cardSummary}
                fallback="Sistema por assinatura cadastrado no portfólio Defan."
              />

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
  index,
}: {
  project: Project;
  onOpen: () => void;
  index: number;
}) {
  const images = getProjectImages(project);
  const firstImage = images[0];

  return (
    <article
      style={{ ...styles.card, animationDelay: `${index * 0.06}s` }}
      className="project-card-inline project-card-reveal"
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
            <span style={{ ...styles.tag, ...styles.tagBlue }}>
              {project.commercialModel}
            </span>
          )}
          {project.niche && <span style={styles.tag}>{project.niche}</span>}
        </div>

        <div style={styles.priceRow} className="projetos-price-row">
          <div style={styles.priceCard}>
            <small style={styles.priceSmall}>Inicial</small>
            <strong style={styles.priceStrong}>
              {project.startingPrice || "Sob consulta"}
            </strong>
          </div>
          <div style={styles.priceCard}>
            <small style={styles.priceSmall}>Mensal</small>
            <strong style={styles.priceStrong}>
              {project.monthlyPrice || "Sob consulta"}
            </strong>
          </div>
        </div>

        {!!project.technologies?.length && (
          <div style={styles.tags}>
            {project.technologies.slice(0, 3).map((tech) => (
              <span style={styles.tag} key={tech}>
                {tech}
              </span>
            ))}
          </div>
        )}

        <button
          type="button"
          style={{
            ...styles.ghost,
            width: "100%",
            marginTop: "auto",
            background:
              "linear-gradient(135deg, rgba(37,99,235,0.28), rgba(14,165,233,0.16))",
            borderColor: "rgba(56, 189, 248, 0.38)",
          }}
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
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then((list) => {
        const subscriptions = (list as Project[]).filter((project) =>
          isSubscriptionProject(project),
        );
        setProjects(subscriptions);
      })
      .catch((error) => {
        console.error("Erro ao carregar sistemas por assinatura:", error);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const availableFilters = useMemo(
    () => ({
      niches: getUniqueOptions(projects, (project) => project.niche),
      technologies: getUniqueOptions(
        projects,
        (project) => project.technologies,
      ),
    }),
    [projects],
  );

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      projectMatchesFilters(project, filters),
    );
  }, [projects, filters]);

  const customNichesCount = availableFilters.niches.length;
  const technologiesCount = availableFilters.technologies.length;

  const whatsappUrl = makeWhatsappUrl(
    "Olá, Tais! Vi a página de sistemas por assinatura e quero saber qual solução combina com meu negócio.",
  );

  function updateFilter<K extends keyof Filters>(field: K, value: Filters[K]) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  function clearFilters() {
    setFilters(initialFilters);
  }

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "search") return String(value).trim() !== "";
    return value !== "Todos";
  });

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
              style={{ ...styles.logo, height: isMobile ? 54 : 64 }}
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
        className="container-inline hero-reveal"
      >
        <span style={styles.badge}>
          <Sparkles size={16} />
          Sistemas por assinatura mensal
        </span>

        <h1 style={styles.h1}>
          Sistemas prontos para empresas que querem{" "}
          <span style={styles.gradientText}>
            começar com estrutura profissional.
          </span>
        </h1>

        <p style={styles.heroText}>
          Soluções por assinatura para empresas que querem iniciar com menor
          investimento, manutenção contínua e possibilidade de evolução mensal.
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

        <div style={styles.statsGrid} className="assinaturas-stats-grid">
          <div style={styles.statCard} className="stat-reveal delay-1">
            <strong style={styles.statNumber}>{projects.length}</strong>
            <span style={styles.statLabel}>sistemas disponíveis</span>
          </div>
          <div style={styles.statCard} className="stat-reveal delay-2">
            <strong style={styles.statNumber}>{customNichesCount}</strong>
            <span style={styles.statLabel}>nichos atendidos</span>
          </div>
          <div style={styles.statCard} className="stat-reveal delay-3">
            <strong style={styles.statNumber}>{technologiesCount}</strong>
            <span style={styles.statLabel}>tecnologias usadas</span>
          </div>
        </div>

        <section style={styles.filtersTop} className="filters-reveal">
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
              <span style={styles.kicker}>Filtros</span>
              <h2
                style={{ ...styles.h2, fontSize: "clamp(22px, 2.2vw, 32px)" }}
              >
                Buscar por nome e nicho
              </h2>
            </div>
            <button
              type="button"
              style={styles.ghost}
              onClick={clearFilters}
              disabled={!hasActiveFilters}
            >
              Limpar filtros
            </button>
          </div>

          <div style={styles.filtersGrid} className="filters-grid-inline">
            <label style={styles.field}>
              Buscar
              <div style={styles.inputWrap}>
                <Search size={18} color={colors.soft} />
                <input
                  value={filters.search}
                  onChange={(event) =>
                    updateFilter("search", event.target.value)
                  }
                  placeholder="Nome, nicho, módulo ou descrição..."
                  style={styles.input}
                />
              </div>
            </label>

            {availableFilters.niches.length > 0 && (
              <label style={styles.field}>
                Nicho
                <select
                  value={filters.niche}
                  onChange={(event) =>
                    updateFilter("niche", event.target.value)
                  }
                  style={styles.select}
                >
                  <option>Todos</option>
                  {availableFilters.niches.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            )}
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
          <a
            style={styles.cta}
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            Quero uma indicação
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
              Limpe os filtros ou fale no WhatsApp para receber uma indicação.
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
                index={index}
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

      <footer style={styles.footer}>
        <div
          style={{ ...styles.container, ...styles.footerGrid }}
          className="container-inline footer-grid-inline"
        >
          <div>
            <a href="/" aria-label="Voltar para a home">
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
            </a>
            <p style={{ color: colors.muted, lineHeight: 1.68, margin: 0 }}>
              Defan Soluções Digitais — landing pages, websites, sistemas e
              automações para empresas que querem vender melhor no digital.
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
            <a href="/projetos" style={styles.ghost}>
              Ver todos os projetos
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              style={styles.cta}
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </footer>

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

        button:disabled {
          opacity: 0.45;
          cursor: not-allowed !important;
        }

        input::placeholder {
          color: rgba(203, 213, 225, 0.58);
        }

        select option {
          background: #020617;
          color: #f8fafc;
        }

        .hero-reveal {
          animation: heroReveal 0.9s ease both;
        }

        .filters-reveal {
          animation: fadeUp 0.9s ease both;
          animation-delay: 0.18s;
        }

        .stat-reveal {
          animation: fadeUp 0.8s ease both;
        }

        .delay-1 {
          animation-delay: 0.08s;
        }

        .delay-2 {
          animation-delay: 0.16s;
        }

        .delay-3 {
          animation-delay: 0.24s;
        }

        .project-card-reveal {
          animation: cardReveal 0.75s ease both;
        }

        .modal-reveal {
          animation: modalReveal 0.24s ease both;
        }

        .project-card-inline {
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .project-card-inline:hover {
          transform: translateY(-9px) scale(1.01);
          border-color: rgba(56, 189, 248, 0.42) !important;
          box-shadow: 0 34px 96px rgba(14, 165, 233, 0.2) !important;
        }

        .project-card-inline:hover img {
          transform: scale(1.055) !important;
          transition: transform 0.4s ease;
        }

        .spin-local {
          animation: spinLocal 0.8s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
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

        .project-modal-summary-inline {
          max-width: 920px;
          margin: 14px 0 0;
          color: #cbd5e1;
          font-size: clamp(15px, 1.15vw, 18px);
          line-height: 1.65;
        }

        .project-description-paragraphs {
          display: grid;
          gap: 14px;
          color: ${colors.muted};
          line-height: 1.75;
        }

        .project-description-paragraphs p {
          margin: 0;
        }

        @keyframes spinLocal {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes heroReveal {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.98);
            filter: blur(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardReveal {
          from {
            opacity: 0;
            transform: translateY(34px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes modalReveal {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 1180px) {
          .filters-grid-inline {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 860px) {
          .assinaturas-stats-grid,
          .filters-grid-inline,
          .project-modal-content-inline,
          .project-modal-lists-inline,
          .project-detail-grid-inline,
          .footer-grid-inline {
            grid-template-columns: 1fr !important;
          }

          .projetos-top-result {
            align-items: flex-start !important;
            flex-direction: column !important;
          }

          .projetos-price-row {
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
