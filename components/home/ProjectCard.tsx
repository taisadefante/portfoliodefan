import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Project } from "./types";
import { getProjectImages, getProjectKey } from "./utils";

type ProjectCardProps = {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
};

export default function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const images = getProjectImages(project);
  const image = images[0];
  const tags = [project.type, project.niche, project.commercialModel].filter(Boolean).slice(0, 3);

  return (
    <article
      className="project-card"
      style={{ animationDelay: `${index * 90}ms` }}
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") onOpen(project);
      }}
    >
      <div className="project-image">
        {image ? (
          <img src={image} alt={project.name} />
        ) : (
          <div className="project-placeholder">
            <Image src="/logo-white.png" alt="Defan Soluções Digitais" width={210} height={70} />
          </div>
        )}
        <div className="project-overlay" />
      </div>
      <div className="project-content">
        <h3>{project.name}</h3>
        <p>{project.cardSummary || project.fullDescription || "Projeto digital criado para apresentar valor, gerar confiança e organizar processos."}</p>
        <div className="tag-row">
          {tags.map((tag) => <span key={`${getProjectKey(project, index)}-${tag}`}>{tag}</span>)}
        </div>
        <button type="button">Ver detalhes <ArrowRight size={16} /></button>
      </div>
    </article>
  );
}
