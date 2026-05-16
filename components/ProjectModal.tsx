"use client";

import { ExternalLink, X } from "lucide-react";
import { Project } from "@/lib/types";

type Props = {
  project: Project;
  onClose: () => void;
};

function ListBox({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;

  return (
    <div className="detail-box">
      <h3>{title}</h3>
      <ul>
        {items.map((item, index) => (
          <li key={`${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ProjectModal({ project, onClose }: Props) {
  const isSubscription = project.commercialModel
    .toLowerCase()
    .includes("assinatura");

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="tags">
              <span className="tag">{project.type}</span>
              <span
                className={
                  isSubscription ? "tag tag-success" : "tag tag-purple"
                }
              >
                {project.commercialModel}
              </span>
            </div>

            <h2>{project.name}</h2>
            <p>{project.fullDescription || project.cardSummary}</p>
          </div>

          <button className="close" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        {project.imageUrl && (
          <img
            className="project-image modal-project-image"
            src={project.imageUrl}
            alt={project.name}
          />
        )}

        <div className="price-row">
          {project.startingPrice && (
            <div className="price-card">
              <small>Investimento inicial</small>
              <strong>{project.startingPrice}</strong>
            </div>
          )}

          {project.monthlyPrice && (
            <div className="price-card">
              <small>Mensalidade</small>
              <strong>{project.monthlyPrice}</strong>
            </div>
          )}
        </div>

        <div className="tags">
          {project.niche && <span className="tag">{project.niche}</span>}
          {project.technologies.map((tech) => (
            <span className="tag" key={tech}>
              {tech}
            </span>
          ))}
        </div>

        {project.link && (
          <a
            className="cta inline-cta"
            href={project.link}
            target="_blank"
            rel="noreferrer"
          >
            Ver projeto <ExternalLink size={18} />
          </a>
        )}

        <div className="detail-grid">
          <ListBox title="Módulos disponíveis" items={project.modules} />
          <ListBox
            title="Integrações disponíveis"
            items={project.integrations}
          />
          <ListBox
            title="Negócios indicados"
            items={project.indicatedBusinesses}
          />
          <ListBox title="Fluxo básico de uso" items={project.basicFlow} />
        </div>
      </div>
    </div>
  );
}
