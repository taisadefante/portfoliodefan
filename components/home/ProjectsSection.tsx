"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Project } from "./types";
import ProjectCard from "./ProjectCard";

function getPerPage() {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth <= 760) return 1;
  if (window.innerWidth <= 1050) return 2;
  return 3;
}

type ProjectsSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  projects: Project[];
  ctaHref: string;
  ctaLabel: string;
  onOpen: (project: Project) => void;
};

export default function ProjectsSection({
  id,
  eyebrow,
  title,
  description,
  projects,
  ctaHref,
  ctaLabel,
  onOpen,
}: ProjectsSectionProps) {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(3);

  useEffect(() => {
    function update() {
      setPerPage(getPerPage());
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const pages = useMemo(() => {
    const chunks: Project[][] = [];

    for (let index = 0; index < projects.length; index += perPage) {
      chunks.push(projects.slice(index, index + perPage));
    }

    return chunks;
  }, [projects, perPage]);

  useEffect(() => {
    if (page > pages.length - 1) setPage(0);
  }, [page, pages.length]);

  useEffect(() => {
    if (pages.length <= 1) return;

    const interval = window.setInterval(() => {
      setPage((prev) => (prev + 1) % pages.length);
    }, 6200);

    return () => window.clearInterval(interval);
  }, [pages.length]);

  if (!projects.length) return null;

  const visible = pages[page] || [];

  return (
    <section id={id} className="section-block projects-section">
      <style jsx>{`
        .projects-final-cta:hover {
          transform: translateY(-4px);
          box-shadow: 0 22px 60px rgba(37, 99, 235, 0.32);
        }

        @media (max-width: 640px) {
          .projects-final-cta-wrap {
            margin-top: 30px !important;
          }

          .projects-final-cta {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="container section-head-row">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        <a className="btn btn-ghost" href={ctaHref}>
          {ctaLabel} <ArrowRight size={17} />
        </a>
      </div>

      <div className="container project-shell">
        {pages.length > 1 && (
          <button
            className="slider-btn slider-left"
            type="button"
            onClick={() =>
              setPage((prev) => (prev - 1 + pages.length) % pages.length)
            }
            aria-label="Projetos anteriores"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div className="projects-grid">
          {visible.map((project, index) => (
            <ProjectCard
              key={project.id || `${project.name}-${index}`}
              project={project}
              index={index}
              onOpen={onOpen}
            />
          ))}
        </div>

        {pages.length > 1 && (
          <button
            className="slider-btn slider-right"
            type="button"
            onClick={() => setPage((prev) => (prev + 1) % pages.length)}
            aria-label="Próximos projetos"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {pages.length > 1 && (
        <div className="slider-dots">
          {pages.map((_, index) => (
            <button
              key={index}
              type="button"
              className={index === page ? "active" : ""}
              onClick={() => setPage(index)}
              aria-label={`Ir para página ${index + 1}`}
            />
          ))}
        </div>
      )}

      <div
        className="container projects-final-cta-wrap"
        style={{
          marginTop: 42,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <a
          href={ctaHref}
          className="btn btn-primary projects-final-cta"
          style={{
            minHeight: 54,
            padding: "0 28px",
            borderRadius: 999,
            fontWeight: 900,
            transition: "all .3s ease",
          }}
        >
          Ver todos os projetos <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
}
