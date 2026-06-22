"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  MessageCircle,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import Header from "@/components/home/Header";
import { getProjectOptions, getProjects } from "@/lib/firestore";

type OptionCategory = "types" | "niches" | "technologies" | "commercialModels";

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
};

type Filters = {
  search: string;
  type: string;
  niche: string;
  technology: string;
  commercialModel: string;
};

const initialFilters: Filters = {
  search: "",
  type: "Todos",
  niche: "Todos",
  technology: "Todos",
  commercialModel: "Todos",
};

const colors = {
  bg: "#020617",
  panel: "rgba(15, 23, 42, 0.74)",
  panelStrong: "rgba(15, 23, 42, 0.94)",
  border: "rgba(56, 189, 248, 0.18)",
  borderStrong: "rgba(56, 189, 248, 0.34)",
  text: "#f8fafc",
  muted: "#cbd5e1",
  soft: "#94a3b8",
  blue: "#38bdf8",
  blue2: "#0ea5e9",
  blue3: "#60a5fa",
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
    padding: "130px 0 38px",
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
    maxWidth: 1080,
    margin: "26px auto 0",
    fontSize: "clamp(42px, 6vw, 86px)",
    lineHeight: 0.98,
    letterSpacing: "-0.075em",
  },
  gradientText: {
    background: "linear-gradient(135deg, #38bdf8, #60a5fa, #ffffff)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },
  heroText: {
    maxWidth: 800,
    margin: "26px auto 0",
    color: colors.muted,
    fontSize: "clamp(16px, 1.3vw, 21px)",
    lineHeight: 1.75,
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
    gridTemplateColumns: "1.4fr repeat(2, minmax(150px, 1fr))",
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
  tagGreen: {
    color: "#bfdbfe",
    background: "rgba(37,99,235,0.18)",
    border: "1px solid rgba(96,165,250,0.26)",
  },
  tagPurple: {
    color: "#dbeafe",
    background: "rgba(14,165,233,0.14)",
    border: "1px solid rgba(56,189,248,0.22)",
  },
  cardTitle: {
    margin: 0,
    fontSize: 26,
    lineHeight: 1.08,
    letterSpacing: "-0.045em",
  },
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
    cursor: "zoom-in",
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
  lightboxBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 160,
    background: "rgba(0, 0, 0, 0.92)",
    display: "grid",
    gridTemplateRows: "auto 1fr",
    padding: 18,
  },
  lightboxTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: "0 0 14px",
  },
  lightboxImageWrap: {
    position: "relative",
    display: "grid",
    placeItems: "center",
    minHeight: 0,
  },
  lightboxImage: {
    maxWidth: "min(1180px, 94vw)",
    maxHeight: "calc(100vh - 120px)",
    objectFit: "contain",
    borderRadius: 22,
    border: "1px solid rgba(125,211,252,0.2)",
    boxShadow: "0 34px 100px rgba(0,0,0,0.55)",
  },
  lightboxArrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 52,
    height: 52,
    borderRadius: 999,
    border: "1px solid rgba(125,211,252,0.24)",
    background: "rgba(15,23,42,0.78)",
    color: "#fff",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
};

function safeLower(value?: string) {
  return String(value || "").toLowerCase();
}

function safeArray(value?: string[]) {
  return Array.isArray(value) ? value : [];
}

function getProjectImages(project: Project) {
  const images = Array.isArray(project.images)
    ? project.images.filter(Boolean)
    : [];

  if (images.length) return images;

  return project.imageUrl ? [project.imageUrl] : [];
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
  const images = getProjectImages(project);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const activeImage = images[activeImageIndex] || images[0] || "";
  const isSubscription = safeLower(project.commercialModel).includes(
    "assinatura",
  );

  function previousImage() {
    if (!images.length) return;
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }

  function nextImage() {
    if (!images.length) return;
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  }

  return (
    <>
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
                      ...(isSubscription ? styles.tagGreen : styles.tagPurple),
                    }}
                  >
                    {project.commercialModel}
                  </span>
                )}

                {project.niche && (
                  <span style={styles.tag}>{project.niche}</span>
                )}
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

            <button type="button" onClick={onClose} style={styles.closeButton}>
              <X size={22} />
            </button>
          </header>

          <div
            style={styles.modalContent}
            className="project-modal-content-inline"
          >
            <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={project.name}
                  style={styles.modalImage}
                  className="project-modal-image-inline"
                  onClick={() => setLightboxOpen(true)}
                />
              ) : (
                <div
                  style={{
                    ...styles.modalImage,
                    cursor: "default",
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
                <>
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

                    <strong style={{ color: "#dbeafe" }}>
                      {activeImageIndex + 1} / {images.length}
                    </strong>

                    <button
                      type="button"
                      style={styles.ghost}
                      onClick={nextImage}
                    >
                      Próxima
                      <ChevronRight size={17} />
                    </button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                      gap: 10,
                    }}
                    className="project-thumbs-inline"
                  >
                    {images.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        onDoubleClick={() => {
                          setActiveImageIndex(index);
                          setLightboxOpen(true);
                        }}
                        style={{
                          border:
                            index === activeImageIndex
                              ? "2px solid #38bdf8"
                              : "1px solid rgba(125, 211, 252, 0.16)",
                          padding: 0,
                          overflow: "hidden",
                          cursor: "pointer",
                          borderRadius: 16,
                          background: "transparent",
                        }}
                      >
                        <img
                          src={image}
                          alt={`${project.name} ${index + 1}`}
                          style={{
                            width: "100%",
                            height: 84,
                            objectFit: "cover",
                            objectPosition: "top center",
                            display: "block",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <aside style={{ display: "grid", gap: 16, alignContent: "start" }}>
              <section style={styles.modalPanel}>
                <h3 style={{ margin: "0 0 10px", fontSize: 24 }}>
                  Descrição completa
                </h3>

                <TextParagraphs
                  text={project.fullDescription}
                  fallback="Projeto cadastrado no portfólio Defan."
                />

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
                style={styles.ghost}
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
              style={styles.cta}
            >
              Quero este projeto <MessageCircle size={18} />
            </a>
          </footer>
        </section>
      </div>

      {lightboxOpen && activeImage && (
        <div
          style={styles.lightboxBackdrop}
          onClick={() => setLightboxOpen(false)}
        >
          <div
            style={styles.lightboxTop}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" style={styles.ghost} onClick={previousImage}>
              <ChevronLeft size={18} />
              Anterior
            </button>

            <strong>
              {activeImageIndex + 1} / {images.length}
            </strong>

            <button
              type="button"
              style={styles.closeButton}
              onClick={() => setLightboxOpen(false)}
            >
              <X size={22} />
            </button>
          </div>

          <div
            style={styles.lightboxImageWrap}
            onClick={(event) => event.stopPropagation()}
          >
            {images.length > 1 && (
              <button
                type="button"
                style={{ ...styles.lightboxArrow, left: 18 }}
                onClick={previousImage}
              >
                <ChevronLeft size={28} />
              </button>
            )}

            <img
              src={activeImage}
              alt={project.name}
              style={styles.lightboxImage}
            />

            {images.length > 1 && (
              <button
                type="button"
                style={{ ...styles.lightboxArrow, right: 18 }}
                onClick={nextImage}
              >
                <ChevronRight size={28} />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function ProjetosPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [options, setOptions] = useState<Record<OptionCategory, string[]>>({
    types: [],
    niches: [],
    technologies: [],
    commercialModels: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [projectList, optionList] = await Promise.all([
          getProjects(),
          getProjectOptions(),
        ]);

        setProjects(projectList as Project[]);
        setOptions(optionList as Record<OptionCategory, string[]>);
      } catch (error) {
        console.error("Erro ao carregar projetos:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filteredProjects = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return projects.filter((project) => {
      const technologies = safeArray(project.technologies);

      const matchSearch =
        !search ||
        safeLower(project.name).includes(search) ||
        safeLower(project.fullDescription).includes(search) ||
        safeLower(project.niche).includes(search) ||
        safeLower(project.type).includes(search) ||
        technologies.some((tech) => safeLower(tech).includes(search));

      const matchType =
        filters.type === "Todos" || project.type === filters.type;

      const matchNiche =
        filters.niche === "Todos" || project.niche === filters.niche;

      const matchTechnology =
        filters.technology === "Todos" ||
        technologies.includes(filters.technology);

      const matchCommercialModel =
        filters.commercialModel === "Todos" ||
        project.commercialModel === filters.commercialModel;

      return (
        matchSearch &&
        matchType &&
        matchNiche &&
        matchTechnology &&
        matchCommercialModel
      );
    });
  }, [projects, filters]);

  const subscriptionCount = projects.filter((project) =>
    safeLower(project.commercialModel).includes("assinatura"),
  ).length;

  const customCount = projects.filter((project) =>
    safeLower(project.commercialModel).includes("personalizado"),
  ).length;

  function updateFilter<K extends keyof Filters>(field: K, value: Filters[K]) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  function clearFilters() {
    setFilters(initialFilters);
  }

  return (
    <main style={styles.page}>
      <Header />

      <section
        style={{ ...styles.container, ...styles.hero }}
        className="container-inline hero-reveal"
      >
        <span style={styles.badge}>
          <Sparkles size={16} />
          Catálogo completo de soluções digitais
        </span>

        <h1 style={styles.h1}>
          Projetos digitais para empresas que querem{" "}
          <span style={styles.gradientText}>vender mais</span> e parecer mais
          profissionais.
        </h1>

        <p style={styles.heroText}>
          Conheça sistemas, landing pages, automações e soluções por assinatura
          ou personalizadas para melhorar sua presença digital, organizar sua
          operação e aumentar a credibilidade do seu negócio.
        </p>

        <div style={styles.statsGrid} className="projetos-stats-grid">
          <div style={styles.statCard} className="stat-reveal delay-1">
            <strong style={styles.statNumber}>{projects.length}</strong>
            <span style={styles.statLabel}>projetos cadastrados</span>
          </div>

          <div style={styles.statCard} className="stat-reveal delay-2">
            <strong style={styles.statNumber}>{subscriptionCount}</strong>
            <span style={styles.statLabel}>opções por assinatura</span>
          </div>

          <div style={styles.statCard} className="stat-reveal delay-3">
            <strong style={styles.statNumber}>{customCount}</strong>
            <span style={styles.statLabel}>opções personalizadas</span>
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
                Encontre a solução ideal
              </h2>
            </div>

            <button type="button" style={styles.ghost} onClick={clearFilters}>
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
                  placeholder="Nome, nicho, tecnologia..."
                  style={styles.input}
                />
              </div>
            </label>

            <label style={styles.field}>
              Tipo
              <select
                value={filters.type}
                onChange={(event) => updateFilter("type", event.target.value)}
                style={styles.select}
              >
                <option>Todos</option>
                {options.types.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label style={styles.field}>
              Nicho
              <select
                value={filters.niche}
                onChange={(event) => updateFilter("niche", event.target.value)}
                style={styles.select}
              >
                <option>Todos</option>
                {options.niches.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
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
              {filteredProjects.length} projetos encontrados
            </h2>
          </div>

          <a
            style={styles.cta}
            href="https://wa.me/5521988359825"
            target="_blank"
            rel="noreferrer"
          >
            Quero uma indicação
            <ArrowRight size={17} />
          </a>
        </div>

        {loading && (
          <div style={styles.empty}>
            <Loader2 size={18} className="spin-local" /> Carregando projetos...
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div style={styles.empty}>
            <h3 style={{ margin: "0 0 8px", color: colors.text }}>
              Nenhum projeto encontrado
            </h3>
            <p style={{ margin: 0 }}>
              Limpe os filtros ou fale no WhatsApp para receber uma indicação.
            </p>
          </div>
        )}

        <div style={styles.grid} className="projetos-grid">
          {filteredProjects.map((project, index) => {
            const isSubscription = safeLower(project.commercialModel).includes(
              "assinatura",
            );
            const technologies = safeArray(project.technologies);
            const images = getProjectImages(project);
            const firstImage = images[0];

            return (
              <article
                style={{
                  ...styles.card,
                  animationDelay: `${index * 0.06}s`,
                }}
                key={project.id || project.name}
                className="project-card-reveal"
              >
                <div style={styles.imageWrap}>
                  {firstImage ? (
                    <img
                      src={firstImage}
                      alt={project.name}
                      style={styles.image}
                    />
                  ) : (
                    <div style={styles.imageEmpty}>Defan Soluções Digitais</div>
                  )}

                  <div style={styles.imageOverlay} />
                </div>

                <div style={styles.cardBody}>
                  <h3 style={styles.cardTitle}>{project.name}</h3>
                  <div style={styles.cardDivider} />

                  <div style={styles.tags}>
                    {project.type && (
                      <span style={styles.tag}>{project.type}</span>
                    )}

                    {project.commercialModel && (
                      <span
                        style={{
                          ...styles.tag,
                          ...(isSubscription
                            ? styles.tagGreen
                            : styles.tagPurple),
                        }}
                      >
                        {project.commercialModel}
                      </span>
                    )}

                    {project.niche && (
                      <span style={styles.tag}>{project.niche}</span>
                    )}
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
                      <div style={{ visibility: "hidden" }} />
                    )}

                    {project.monthlyPrice ? (
                      <div style={styles.priceCard}>
                        <small style={styles.priceSmall}>Mensal</small>
                        <strong style={styles.priceStrong}>
                          {project.monthlyPrice}
                        </strong>
                      </div>
                    ) : (
                      <div style={{ visibility: "hidden" }} />
                    )}
                  </div>

                  {technologies.length > 0 && (
                    <div style={styles.tags}>
                      {technologies.slice(0, 3).map((tech) => (
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
                    onClick={() => setSelectedProject(project)}
                  >
                    Ver detalhes
                    <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            );
          })}
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
            <a href="/" style={styles.ghost}>
              Voltar para home
            </a>

            <a
              href="https://wa.me/5521988359825"
              target="_blank"
              rel="noreferrer"
              style={styles.cta}
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </footer>

      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <style jsx>{`
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

        .spin-local {
          animation: spinLocal 1s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
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

        .projetos-grid article {
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .projetos-grid article:hover {
          transform: translateY(-9px) scale(1.01);
          border-color: rgba(56, 189, 248, 0.42) !important;
          box-shadow: 0 34px 96px rgba(14, 165, 233, 0.2) !important;
        }

        .projetos-grid article:hover img {
          transform: scale(1.055) !important;
          transition: transform 0.4s ease;
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

        input::placeholder {
          color: rgba(203, 213, 225, 0.58);
        }

        select option {
          background: #020617;
          color: #f8fafc;
        }

        @media (max-width: 1180px) {
          .filters-grid-inline {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .projetos-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .project-modal-content-inline {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 760px) {
          .container-inline {
            width: min(100% - 28px, 1440px) !important;
          }

          .projetos-stats-grid,
          .projetos-grid,
          .filters-grid-inline,
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

          .project-modal-image-inline {
            height: 260px !important;
          }

          .project-thumbs-inline {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </main>
  );
}