import { useState } from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, ExternalLink, MessageCircle, X } from "lucide-react";
import type { Project } from "./types";
import { getProjectImages, projectWhatsAppMessage } from "./utils";
import { whatsappNumber } from "./data";

type ProjectDetailsModalProps = {
  project: Project;
  onClose: () => void;
};

function DetailList({ title, items }: { title: string; items?: string[] }) {
  const cleanItems = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!cleanItems.length) return null;

  return (
    <section className="modal-detail-box">
      <h3>{title}</h3>
      <div>
        {cleanItems.map((item, index) => (
          <span key={`${title}-${index}`}><CheckCircle2 size={17} /> {item}</span>
        ))}
      </div>
    </section>
  );
}

export default function ProjectDetailsModal({ project, onClose }: ProjectDetailsModalProps) {
  const images = getProjectImages(project);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedImage = images[selectedImageIndex] || images[0] || "";
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(projectWhatsAppMessage(project))}`;

  function previousImage() {
    if (!images.length) return;
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }

  function nextImage() {
    if (!images.length) return;
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="project-modal" onClick={(event) => event.stopPropagation()}>
        <header className="modal-header">
          <div>
            <div className="tag-row modal-tags">
              {[project.type, project.niche, project.commercialModel].filter(Boolean).map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <h2>{project.name}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar"><X size={22} /></button>
        </header>

        <div className="modal-body">
          <div className="modal-gallery">
            <div className="modal-main-image">
              {selectedImage ? <img src={selectedImage} alt={project.name} /> : <Image src="/logo-white.png" alt="Defan" width={260} height={90} />}
              {images.length > 1 && (
                <>
                  <button type="button" onClick={previousImage} className="gallery-nav gallery-prev"><ChevronLeft size={22} /></button>
                  <button type="button" onClick={nextImage} className="gallery-nav gallery-next"><ChevronRight size={22} /></button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="modal-thumbs">
                {images.slice(0, 8).map((image, index) => (
                  <button key={`${image}-${index}`} className={index === selectedImageIndex ? "active" : ""} type="button" onClick={() => setSelectedImageIndex(index)}>
                    <img src={image} alt={`${project.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <aside className="modal-info">
            <section className="modal-summary">
              <h3>Resumo do projeto</h3>
              <p>{project.fullDescription || project.cardSummary || "Projeto cadastrado no portfólio Defan."}</p>
              <div className="price-grid">
                {project.startingPrice && <div><small>Investimento inicial</small><strong>{project.startingPrice}</strong></div>}
                {project.monthlyPrice && <div><small>Mensalidade</small><strong>{project.monthlyPrice}</strong></div>}
              </div>
            </section>
            {!!project.technologies?.length && (
              <section className="modal-summary">
                <h3>Tecnologias</h3>
                <div className="tag-row">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
              </section>
            )}
          </aside>
        </div>

        <div className="modal-detail-grid">
          <DetailList title="Módulos disponíveis" items={project.modules} />
          <DetailList title="Integrações" items={project.integrations} />
          <DetailList title="Indicado para" items={project.indicatedBusinesses} />
          <DetailList title="Fluxo básico de uso" items={project.basicFlow} />
        </div>

        <footer className="modal-footer">
          {project.link ? <a className="btn btn-ghost" href={project.link} target="_blank" rel="noreferrer">Abrir projeto <ExternalLink size={17} /></a> : <span />}
          <a className="btn btn-primary" href={whatsappHref} target="_blank" rel="noreferrer">Quero orçamento deste projeto <MessageCircle size={18} /><ArrowRight size={17} /></a>
        </footer>
      </section>
    </div>
  );
}
