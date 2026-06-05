"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import ProjectCard from "./ProjectCard";
import type { Project } from "./types";
import { SectionTitle } from "./shared";

type Shared = {
  isMobile: boolean;
  isTablet: boolean;
  isNotebook: boolean;
  containerStyle: CSSProperties;
  outlineButtonStyle: CSSProperties;
  tagStyle: CSSProperties;
  onOpen: (project: Project) => void;
};

export function FeaturedProjectsSection({
  projects,
  projectPage,
  isMobile,
  isTablet,
  isNotebook,
  containerStyle,
  outlineButtonStyle,
  tagStyle,
  onOpen,
}: Shared & { projects: Project[]; projectPage: number }) {
  const slides = useMemo(() => {
    const chunks: Project[][] = [];
    const perPage = isTablet ? 1 : isNotebook ? 2 : 3;

    for (let index = 0; index < projects.length; index += perPage) {
      chunks.push(projects.slice(index, index + perPage));
    }

    return chunks;
  }, [projects, isTablet, isNotebook]);

  const visibleProjects = slides[projectPage] || [];

  return (
    <section id="projetos" style={{ padding: isMobile ? "82px 0" : "118px 0" }}>
      <div style={containerStyle}>
        <div
          style={{
            display: isTablet ? "grid" : "flex",
            justifyContent: "space-between",
            alignItems: isTablet ? "start" : "end",
            gap: 26,
            marginBottom: 32,
          }}
        >
          <SectionTitle
            eyebrow="Projetos reais"
            title="Portfólios, sistemas e soluções que mostram valor antes da proposta"
            center={false}
          />

          <a href="/projetos" style={outlineButtonStyle}>
            Ver catálogo completo <ArrowRight size={18} />
          </a>
        </div>

        {visibleProjects.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isTablet
                ? "1fr"
                : isNotebook
                  ? "repeat(2, minmax(0, 1fr))"
                  : "repeat(3, minmax(0, 1fr))",
              gap: 28,
            }}
          >
            {visibleProjects.map((project, index) => (
              <ProjectCard
                key={`${project.id || project.name}-${index}`}
                project={project}
                index={index}
                isMobile={isMobile}
                outlineButtonStyle={outlineButtonStyle}
                tagStyle={tagStyle}
                onOpen={onOpen}
              />
            ))}
          </div>
        ) : (
          <div style={{ minHeight: 180 }} />
        )}

        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 42 }}
        >
          <a
            href="/projetos"
            style={{
              borderRadius: 999,
              padding: isMobile ? "16px 22px" : "18px 34px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              fontWeight: 950,
              cursor: "pointer",
              whiteSpace: isMobile ? "normal" : "nowrap",
              border: 0,
              color: "#020617",
              fontSize: isMobile ? 15 : 17,
              background: "linear-gradient(135deg, #facc15, #38bdf8)",
              boxShadow: "0 24px 64px rgba(250,204,21,0.25)",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Ver todos os projetos <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}

export function SubscriptionProjectsSection({
  projects,
  isMobile,
  isTablet,
  isNotebook,
  containerStyle,
  outlineButtonStyle,
  tagStyle,
  onOpen,
}: Shared & { projects: Project[] }) {
  const [activePage, setActivePage] = useState(0);
  const perPage = isTablet ? 1 : isNotebook ? 2 : 3;

  const pages = useMemo(() => {
    const chunks: Project[][] = [];

    for (let index = 0; index < projects.length; index += perPage) {
      chunks.push(projects.slice(index, index + perPage));
    }

    return chunks;
  }, [projects, perPage]);

  useEffect(() => {
    if (pages.length <= 1) return;

    const interval = window.setInterval(() => {
      setActivePage((prev) => (prev + 1) % pages.length);
    }, 4300);

    return () => window.clearInterval(interval);
  }, [pages.length]);

  useEffect(() => {
    if (!pages.length || activePage > pages.length - 1) {
      setActivePage(0);
    }
  }, [activePage, pages.length]);

  if (!projects.length || !pages.length) return null;

  return (
    <section
      id="assinaturas-home"
      style={{
        padding: isMobile ? "70px 0" : "104px 0",
        background: "rgba(15,23,42,.18)",
      }}
    >
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
            eyebrow="Assinaturas"
            title="Sistemas por assinatura para começar com estrutura profissional"
            center={false}
          />

          <a href="/assinaturas" style={outlineButtonStyle}>
            Ver todos <ArrowRight size={18} />
          </a>
        </div>

        <div style={{ width: "100%", overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              transform: `translateX(-${activePage * 100}%)`,
              transition: "transform 700ms ease",
            }}
          >
            {pages.map((page, pageIndex) => (
              <div
                key={`assinaturas-page-${pageIndex}`}
                style={{
                  minWidth: "100%",
                  display: "grid",
                  gridTemplateColumns: isTablet
                    ? "1fr"
                    : isNotebook
                      ? "repeat(2, minmax(0, 1fr))"
                      : "repeat(3, minmax(0, 1fr))",
                  gap: 28,
                }}
              >
                {page.map((project, index) => (
                  <ProjectCard
                    key={`${project.id || project.name}-${pageIndex}-${index}`}
                    project={project}
                    index={index}
                    isMobile={isMobile}
                    outlineButtonStyle={outlineButtonStyle}
                    tagStyle={tagStyle}
                    onOpen={onOpen}
                    variant="subscription"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {pages.length > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginTop: 24,
            }}
          >
            {pages.map((_, index) => (
              <button
                key={`assinaturas-dot-${index}`}
                type="button"
                onClick={() => setActivePage(index)}
                aria-label={`Ver página ${index + 1} dos sistemas por assinatura`}
                style={{
                  width: activePage === index ? 26 : 10,
                  height: 10,
                  borderRadius: 999,
                  border: 0,
                  cursor: "pointer",
                  background:
                    activePage === index
                      ? "#facc15"
                      : "rgba(125, 211, 252, 0.24)",
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
