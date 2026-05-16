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

import { getProjectOptions, getProjects } from "@/lib/firestore";
import { OptionCategory, Project } from "@/lib/types";

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
  panel: "rgba(15, 23, 42, 0.76)",
  panelStrong: "rgba(15, 23, 42, 0.92)",
  border: "rgba(125, 211, 252, 0.16)",
  borderStrong: "rgba(125, 211, 252, 0.32)",
  text: "#f8fafc",
  muted: "#cbd5e1",
  soft: "#94a3b8",
  blue: "#38bdf8",
  lightBlue: "#bae6fd",
};

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    color: colors.text,
    fontFamily: "Arial, Helvetica, sans-serif",
    background:
      "radial-gradient(circle at 16% 0%, rgba(14,165,233,0.26), transparent 30%), radial-gradient(circle at 84% 12%, rgba(56,189,248,0.16), transparent 28%), linear-gradient(180deg, #020617 0%, #071426 48%, #020617 100%)",
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
    minHeight: 96,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
  },
  logo: {
    width: "auto",
    height: 76,
    objectFit: "contain",
    filter: "drop-shadow(0 0 22px rgba(125,211,252,0.18))",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    flexWrap: "wrap",
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
    padding: "74px 0 38px",
    textAlign: "center",
  },
  heroLogoBox: {
    width: "min(360px, 76vw)",
    margin: "0 auto 26px",
    display: "grid",
    placeItems: "center",
    padding: 18,
    borderRadius: 30,
    background:
      "radial-gradient(circle at 50% 30%, rgba(56,189,248,0.18), transparent 60%), rgba(15,23,42,0.36)",
    border: `1px solid ${colors.border}`,
  },
  heroLogo: {
    width: "min(290px, 100%)",
    height: "auto",
    objectFit: "contain",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 15px",
    borderRadius: 999,
    color: colors.lightBlue,
    fontWeight: 950,
    background: "rgba(14,165,233,0.12)",
    border: `1px solid ${colors.borderStrong}`,
  },
  h1: {
    maxWidth: 1040,
    margin: "26px auto 0",
    fontSize: "clamp(38px, 6vw, 82px)",
    lineHeight: 0.98,
    letterSpacing: "-0.075em",
  },
  gradientText: {
    background: "linear-gradient(135deg, #7dd3fc, #ffffff)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },
  heroText: {
    maxWidth: 820,
    margin: "24px auto 0",
    color: colors.muted,
    fontSize: "clamp(17px, 1.5vw, 22px)",
    lineHeight: 1.7,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16,
    marginTop: 34,
  },
  statCard: {
    padding: 22,
    borderRadius: 26,
    background: colors.panel,
    border: `1px solid ${colors.border}`,
    boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
  },
  statNumber: {
    display: "block",
    fontSize: 34,
    letterSpacing: "-0.05em",
  },
  statLabel: {
    display: "block",
    marginTop: 4,
    color: colors.soft,
    fontWeight: 800,
  },
  filtersTop: {
    marginTop: 34,
    padding: 22,
    borderRadius: 30,
    background: colors.panelStrong,
    border: `1px solid ${colors.border}`,
    boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
  },
  filtersGrid: {
    display: "grid",
    gridTemplateColumns: "1.4fr repeat(4, minmax(155px, 1fr)) auto",
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
  select: {
    width: "100%",
    border: `1px solid ${colors.border}`,
    background: "rgba(2, 6, 23, 0.88)",
    color: colors.text,
    outline: "none",
    borderRadius: 16,
    padding: "13px 14px",
  },
  content: {
    padding: "34px 0 86px",
  },
  topResult: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 20,
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
    borderRadius: 32,
    background: colors.panel,
    border: `1px solid ${colors.border}`,
    boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
    display: "flex",
    flexDirection: "column",
    minHeight: 530,
  },
  image: {
    width: "100%",
    height: 220,
    objectFit: "cover",
    objectPosition: "top center",
    background: "rgba(8,47,73,0.42)",
  },
  imageEmpty: {
    height: 220,
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
    minHeight: 310,
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    minHeight: 34,
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    padding: "8px 11px",
    borderRadius: 999,
    color: colors.lightBlue,
    background: "rgba(14,165,233,0.1)",
    border: `1px solid ${colors.border}`,
    fontSize: 12,
    fontWeight: 950,
  },
  tagGreen: {
    color: "#bbf7d0",
    background: "rgba(34,197,94,0.12)",
    border: "1px solid rgba(74,222,128,0.22)",
  },
  tagPurple: {
    color: "#ddd6fe",
    background: "rgba(124,58,237,0.16)",
    border: "1px solid rgba(167,139,250,0.22)",
  },
  cardTitle: {
    margin: 0,
    fontSize: 27,
    lineHeight: 1.05,
    letterSpacing: "-0.045em",
    minHeight: 58,
  },
  cardText: {
    margin: 0,
    color: colors.muted,
    lineHeight: 1.62,
    minHeight: 76,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  priceRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    minHeight: 58,
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
  footer: {
    padding: "58px 0",
    borderTop: `1px solid ${colors.border}`,
    background: "rgba(2, 6, 23, 0.52)",
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
                    <strong style={{ color: colors.lightBlue }}>
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
        setProjects(projectList);
        setOptions(optionList);
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
        safeLower(project.cardSummary).includes(search) ||
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
      <header style={styles.header}>
        <div
          style={{ ...styles.container, ...styles.nav }}
          className="container-inline"
        >
          <a href="/" aria-label="Voltar para a home">
            <Image
              src="/logo-white.png"
              alt="Defan Soluções Digitais"
              width={330}
              height={110}
              priority
              style={styles.logo}
              className="header-logo-inline"
            />
          </a>

          <nav style={styles.navLinks} className="nav-links-inline">
            <a href="/" style={styles.navLink}>
              Início
            </a>
            <a href="/projetos" style={styles.navLink}>
              Projetos
            </a>
            <a
              href="https://wa.me/5521988359825"
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
          Catálogo completo de soluções digitais
        </span>

        <h1 style={styles.h1}>
          Encontre o projeto ideal para sua empresa.
          <span style={styles.gradientText}>
            {" "}
            Por assinatura ou personalizado.
          </span>
        </h1>

        <p style={styles.heroText}>
          Projetos por assinatura são ideais para clientes que querem começar
          gastando menos. Projetos personalizados são indicados quando a empresa
          precisa de algo exclusivo.
        </p>

        <div style={styles.statsGrid} className="projetos-stats-grid">
          <div style={styles.statCard}>
            <strong style={styles.statNumber}>{projects.length}</strong>
            <span style={styles.statLabel}>projetos cadastrados</span>
          </div>
          <div style={styles.statCard}>
            <strong style={styles.statNumber}>{subscriptionCount}</strong>
            <span style={styles.statLabel}>opções por assinatura</span>
          </div>
          <div style={styles.statCard}>
            <strong style={styles.statNumber}>{customCount}</strong>
            <span style={styles.statLabel}>opções personalizadas</span>
          </div>
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
              <span style={styles.kicker}>Filtros</span>
              <h2
                style={{ ...styles.h2, fontSize: "clamp(22px, 2.2vw, 32px)" }}
              >
                Filtrar projetos
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
              Modelo comercial
              <select
                value={filters.commercialModel}
                onChange={(event) =>
                  updateFilter("commercialModel", event.target.value)
                }
                style={styles.select}
              >
                <option>Todos</option>
                {options.commercialModels.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
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

            <label style={styles.field}>
              Tecnologia
              <select
                value={filters.technology}
                onChange={(event) =>
                  updateFilter("technology", event.target.value)
                }
                style={styles.select}
              >
                <option>Todos</option>
                {options.technologies.map((item) => (
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
          {filteredProjects.map((project) => {
            const isSubscription = safeLower(project.commercialModel).includes(
              "assinatura",
            );
            const technologies = safeArray(project.technologies);
            const images = getProjectImages(project);
            const firstImage = images[0];

            return (
              <article style={styles.card} key={project.id || project.name}>
                {firstImage ? (
                  <img
                    src={firstImage}
                    alt={project.name}
                    style={styles.image}
                  />
                ) : (
                  <div style={styles.imageEmpty}>Defan Soluções Digitais</div>
                )}

                <div style={styles.cardBody}>
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
                  </div>

                  <h3 style={styles.cardTitle}>{project.name}</h3>
                  <p style={styles.cardText}>{project.cardSummary}</p>

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

                  <div style={styles.tags}>
                    {project.niche && (
                      <span style={styles.tag}>{project.niche}</span>
                    )}
                    {technologies.slice(0, 3).map((tech) => (
                      <span style={styles.tag} key={tech}>
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    style={{
                      ...styles.ghost,
                      width: "100%",
                      marginTop: "auto",
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

          .nav-links-inline {
            display: none !important;
          }

          .header-logo-inline {
            height: 64px !important;
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
