"use client";

import { ExternalLink, X } from "lucide-react";

type Project = {
  id?: string;
  name: string;
  type?: string;
  niche?: string;
  commercialModel?: string;
  startingPrice?: string;
  monthlyPrice?: string;
  technologies?: string[];
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
  seoFaqs?: {
    question: string;
    answer: string;
  }[];
};

type Props = {
  project: Project;
  onClose: () => void;
};

function safeArray(value?: string[]) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function getProjectImages(project: Project) {
  const images = Array.isArray(project.images)
    ? project.images.filter(Boolean)
    : [];

  if (images.length) return images;

  return project.imageUrl ? [project.imageUrl] : [];
}

function InfoList({ title, items }: { title: string; items?: string[] }) {
  const cleanItems = safeArray(items);

  if (!cleanItems.length) return null;

  return (
    <section className="project-modal-section">
      <h3>{title}</h3>

      <ul>
        {cleanItems.map((item, index) => (
          <li key={`${title}-${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default function ProjectModal({ project, onClose }: Props) {
  const images = getProjectImages(project);
  const mainImage = images[0] || "";

  return (
    <div className="project-modal-backdrop" onClick={onClose}>
      <section
        className="project-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="project-modal-header">
          <div>
            <div className="project-modal-tags">
              {project.type && <span>{project.type}</span>}
              {project.niche && <span>{project.niche}</span>}
              {project.commercialModel && (
                <span>{project.commercialModel}</span>
              )}
            </div>

            <h2>{project.name}</h2>
          </div>

          <button
            type="button"
            className="project-modal-close"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <X size={22} />
          </button>
        </header>

        <div className="project-modal-content">
          <div className="project-modal-image-area">
            {mainImage ? (
              <img src={mainImage} alt={project.name} />
            ) : (
              <div className="project-modal-image-empty">
                Defan Soluções Digitais
              </div>
            )}

            {images.length > 1 && (
              <div className="project-modal-thumbs">
                {images.slice(0, 6).map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt={`${project.name} ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <aside className="project-modal-info">
            <section className="project-modal-section">
              <h3>Resumo do projeto</h3>

              <p>
                {project.fullDescription ||
                  project.cardSummary ||
                  "Projeto cadastrado no portfólio Defan."}
              </p>

              {(project.startingPrice || project.monthlyPrice) && (
                <div className="project-modal-prices">
                  {project.startingPrice && (
                    <div>
                      <small>Investimento inicial</small>
                      <strong>{project.startingPrice}</strong>
                    </div>
                  )}

                  {project.monthlyPrice && (
                    <div>
                      <small>Mensalidade</small>
                      <strong>{project.monthlyPrice}</strong>
                    </div>
                  )}
                </div>
              )}
            </section>

            {!!project.technologies?.length && (
              <section className="project-modal-section">
                <h3>Tecnologias</h3>

                <div className="project-modal-tags">
                  {project.technologies.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>

        <div className="project-modal-lists">
          <InfoList title="Módulos disponíveis" items={project.modules} />
          <InfoList title="Integrações" items={project.integrations} />
          <InfoList title="Indicado para" items={project.indicatedBusinesses} />
          <InfoList title="Fluxo básico de uso" items={project.basicFlow} />
        </div>

        <footer className="project-modal-footer">
          {project.link ? (
            <a href={project.link} target="_blank" rel="noreferrer">
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
            className="project-modal-whatsapp"
          >
            Quero este projeto
          </a>
        </footer>
      </section>

      <style jsx>{`
        .project-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 120;
          background: rgba(2, 6, 23, 0.82);
          backdrop-filter: blur(12px);
          display: grid;
          place-items: center;
          padding: 18px;
        }

        .project-modal {
          width: min(1180px, 100%);
          max-height: 92vh;
          overflow: auto;
          border-radius: 34px;
          background:
            radial-gradient(
              circle at 20% 0%,
              rgba(56, 189, 248, 0.16),
              transparent 34%
            ),
            linear-gradient(
              145deg,
              rgba(15, 23, 42, 0.98),
              rgba(8, 47, 73, 0.92)
            );
          border: 1px solid rgba(125, 211, 252, 0.28);
          box-shadow: 0 44px 120px rgba(0, 0, 0, 0.55);
          color: #f8fafc;
          font-family: Arial, Helvetica, sans-serif;
        }

        .project-modal-header {
          position: sticky;
          top: 0;
          z-index: 3;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
          padding: 24px;
          background: rgba(15, 23, 42, 0.92);
          border-bottom: 1px solid rgba(125, 211, 252, 0.14);
          backdrop-filter: blur(18px);
        }

        .project-modal-header h2 {
          margin: 12px 0 0;
          font-size: clamp(30px, 4vw, 54px);
          line-height: 1;
          letter-spacing: -0.06em;
        }

        .project-modal-close {
          width: 44px;
          height: 44px;
          border: 1px solid rgba(125, 211, 252, 0.2);
          border-radius: 14px;
          background: rgba(2, 6, 23, 0.45);
          color: #f8fafc;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .project-modal-content {
          display: grid;
          grid-template-columns: 1.03fr 0.97fr;
          gap: 24px;
          padding: 24px;
        }

        .project-modal-image-area {
          display: grid;
          gap: 14px;
          align-content: start;
        }

        .project-modal-image-area > img,
        .project-modal-image-empty {
          width: 100%;
          height: 420px;
          object-fit: cover;
          object-position: top center;
          border-radius: 26px;
          border: 1px solid rgba(125, 211, 252, 0.16);
          background: rgba(2, 6, 23, 0.5);
        }

        .project-modal-image-empty {
          display: grid;
          place-items: center;
          color: #bae6fd;
          font-weight: 950;
        }

        .project-modal-thumbs {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        .project-modal-thumbs img {
          width: 100%;
          height: 84px;
          object-fit: cover;
          object-position: top center;
          border-radius: 16px;
          border: 1px solid rgba(125, 211, 252, 0.16);
        }

        .project-modal-info {
          display: grid;
          gap: 16px;
          align-content: start;
        }

        .project-modal-section {
          padding: 22px;
          border-radius: 26px;
          background: rgba(2, 6, 23, 0.34);
          border: 1px solid rgba(125, 211, 252, 0.14);
        }

        .project-modal-section h3 {
          margin: 0 0 14px;
          font-size: 22px;
          letter-spacing: -0.035em;
        }

        .project-modal-section p {
          margin: 0;
          color: #cbd5e1;
          line-height: 1.7;
        }

        .project-modal-section ul {
          margin: 0;
          padding-left: 18px;
          color: #cbd5e1;
          line-height: 1.65;
        }

        .project-modal-section li + li {
          margin-top: 8px;
        }

        .project-modal-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .project-modal-tags span {
          display: inline-flex;
          width: fit-content;
          padding: 8px 11px;
          border-radius: 999px;
          color: #bae6fd;
          background: rgba(14, 165, 233, 0.1);
          border: 1px solid rgba(125, 211, 252, 0.13);
          font-size: 12px;
          font-weight: 950;
        }

        .project-modal-prices {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 16px;
        }

        .project-modal-prices div {
          padding: 15px;
          border-radius: 18px;
          background: rgba(15, 23, 42, 0.62);
          border: 1px solid rgba(125, 211, 252, 0.12);
        }

        .project-modal-prices small {
          color: #94a3b8;
          font-weight: 900;
        }

        .project-modal-prices strong {
          display: block;
          margin-top: 6px;
          font-size: 18px;
        }

        .project-modal-lists {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          padding: 0 24px 24px;
        }

        .project-modal-footer {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          padding: 24px;
          border-top: 1px solid rgba(125, 211, 252, 0.14);
        }

        .project-modal-footer a {
          border-radius: 999px;
          padding: 14px 22px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          font-weight: 900;
          cursor: pointer;
          white-space: nowrap;
          color: #e0f2fe;
          background: rgba(15, 23, 42, 0.68);
          border: 1px solid rgba(125, 211, 252, 0.24);
          text-decoration: none;
        }

        .project-modal-footer .project-modal-whatsapp {
          color: #fff;
          background: linear-gradient(135deg, #0ea5e9, #38bdf8);
          border: 0;
          box-shadow: 0 18px 44px rgba(14, 165, 233, 0.25);
        }

        @media (max-width: 900px) {
          .project-modal-content,
          .project-modal-lists,
          .project-modal-prices {
            grid-template-columns: 1fr;
          }

          .project-modal-image-area > img,
          .project-modal-image-empty {
            height: 260px;
          }

          .project-modal-thumbs {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
}
