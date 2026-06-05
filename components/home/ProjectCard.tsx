import Image from "next/image";
import type { CSSProperties, KeyboardEvent } from "react";
import { ArrowRight } from "lucide-react";
import type { Project } from "./types";
import { getProjectImages, getProjectKey } from "./utils";

type ProjectCardProps = {
  project: Project;
  index: number;
  isMobile?: boolean;
  outlineButtonStyle?: CSSProperties;
  tagStyle?: CSSProperties;
  variant?: "default" | "subscription";
  onOpen: (project: Project) => void;
};

export default function ProjectCard({
  project,
  index,
  isMobile = false,
  tagStyle,
  variant = "default",
  onOpen,
}: ProjectCardProps) {
  const images = getProjectImages(project);
  const image = images[0];

  const tags = [project.type, project.niche, project.commercialModel]
    .filter((tag): tag is string => Boolean(tag))
    .slice(0, 3);

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen(project);
    }
  }

  return (
    <article
      className={`project-card ${
        variant === "subscription" ? "project-card-subscription" : ""
      }`}
      style={{
        animationDelay: `${index * 90}ms`,
        cursor: "pointer",
      }}
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="project-image">
        {image ? (
          <img src={image} alt={project.name} />
        ) : (
          <div className="project-placeholder">
            <Image
              src="/logo-white.png"
              alt="Defan Soluções Digitais"
              width={210}
              height={70}
            />
          </div>
        )}

        <div className="project-overlay" />
      </div>

      <div className="project-content">
        <h3>{project.name}</h3>

        <p>
          {project.cardSummary ||
            project.fullDescription ||
            "Projeto digital criado para apresentar valor, gerar confiança e organizar processos."}
        </p>

        {tags.length > 0 && (
          <div className="tag-row">
            {tags.map((tag) => (
              <span
                key={`${getProjectKey(project, index)}-${tag}`}
                style={tagStyle}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpen(project);
          }}
          style={{
            width: isMobile ? "100%" : "fit-content",
          }}
        >
          Ver detalhes <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}
