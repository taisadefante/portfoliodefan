import type { Project } from "./types";

export function getProjectImages(project: Project) {
  const images = Array.isArray(project.images)
    ? project.images.filter(Boolean)
    : [];
  if (images.length) return images;
  return project.imageUrl ? [project.imageUrl] : [];
}

export function getProjectKey(project: Project, index: number) {
  return project.id || `${project.name}-${index}`;
}

export function projectWhatsAppMessage(project: Project) {
  return `Olá, tenho interesse no projeto: ${project.name}`;
}
