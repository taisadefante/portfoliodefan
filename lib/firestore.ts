import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { OptionCategory, Project } from "./types";

const defaultOptions: Record<OptionCategory, string[]> = {
  types: ["Sistema", "Landing Page", "Automação", "Website", "App"],
  commercialModels: [
    "Assinatura mensal",
    "Projeto personalizado",
    "Assinatura + personalização",
  ],
  niches: [
    "Saúde",
    "Eventos",
    "Serviços",
    "Educação",
    "Finanças",
    "Comércio",
    "Tecnologia",
    "Imobiliário",
    "Beleza",
    "Jurídico",
    "Restaurante",
    "Consultoria",
  ],
  technologies: [
    "Next.js",
    "React",
    "Firebase",
    "Node.js",
    "TypeScript",
    "API",
    "Automação",
    "WhatsApp",
    "Pagamento",
    "Dashboard",
  ],
};

function cleanArray(value?: unknown): string[] {
  return Array.isArray(value)
    ? value
        .map(String)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function normalizeProject(id: string, data: Record<string, unknown>): Project {
  const rawImages = cleanArray(data.images);
  const imageUrl = String(data.imageUrl || rawImages[0] || "");
  const images = rawImages.length ? rawImages : imageUrl ? [imageUrl] : [];

  return {
    id,
    name: String(data.name || ""),
    type: String(data.type || ""),
    niche: String(data.niche || ""),
    commercialModel: String(data.commercialModel || "Projeto personalizado"),
    startingPrice: String(data.startingPrice || ""),
    monthlyPrice: String(data.monthlyPrice || ""),
    technologies: cleanArray(data.technologies),
    link: String(data.link || ""),
    imageUrl,
    images,
    cardSummary: String(data.cardSummary || ""),
    fullDescription: String(data.fullDescription || ""),
    modules: cleanArray(data.modules),
    integrations: cleanArray(data.integrations),
    indicatedBusinesses: cleanArray(data.indicatedBusinesses),
    basicFlow: cleanArray(data.basicFlow),
    highlight: Boolean(data.highlight),
    createdAt: data.createdAt as Date | undefined,
  };
}

export async function getProjects(): Promise<Project[]> {
  const ref = collection(db, "projects");
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((item) => normalizeProject(item.id, item.data()));
}

export async function getHighlightedProjects(max = 6): Promise<Project[]> {
  const ref = collection(db, "projects");
  const q = query(
    ref,
    where("highlight", "==", true),
    orderBy("createdAt", "desc"),
    limit(max),
  );

  const snap = await getDocs(q);

  return snap.docs.map((item) => normalizeProject(item.id, item.data()));
}

export async function saveProject(project: Project) {
  const images = cleanArray(project.images);
  const imageUrl = images[0] || project.imageUrl || "";

  const payload = {
    name: project.name ?? "",
    type: project.type ?? "",
    niche: project.niche ?? "",
    commercialModel: project.commercialModel ?? "",
    startingPrice: project.startingPrice ?? "",
    monthlyPrice: project.monthlyPrice ?? "",
    technologies: cleanArray(project.technologies),
    link: project.link ?? "",
    imageUrl,
    images,

    // Correção principal do erro
    cardSummary: project.cardSummary ?? "",

    fullDescription: project.fullDescription ?? "",
    modules: cleanArray(project.modules),
    integrations: cleanArray(project.integrations),
    indicatedBusinesses: cleanArray(project.indicatedBusinesses),
    basicFlow: cleanArray(project.basicFlow),
    highlight: project.highlight ?? false,
    createdAt: project.createdAt || serverTimestamp(),
  };

  if (project.id) {
    await updateDoc(doc(db, "projects", project.id), payload);
    return project.id;
  }

  const ref = await addDoc(collection(db, "projects"), payload);
  return ref.id;
}

export async function removeProject(id: string) {
  await deleteDoc(doc(db, "projects", id));
}

export async function getProjectOptions(): Promise<
  Record<OptionCategory, string[]>
> {
  const snap = await getDocs(collection(db, "projectOptions"));

  const options: Record<OptionCategory, string[]> = {
    types: [...defaultOptions.types],
    niches: [...defaultOptions.niches],
    technologies: [...defaultOptions.technologies],
    commercialModels: [...defaultOptions.commercialModels],
  };

  snap.docs.forEach((item) => {
    const data = item.data() as { values?: string[] };
    const key = item.id as OptionCategory;

    if (key in options && Array.isArray(data.values)) {
      options[key] = Array.from(
        new Set([...options[key], ...cleanArray(data.values)]),
      ).sort();
    }
  });

  return options;
}

export async function saveProjectOptions(
  category: OptionCategory,
  values: string[],
) {
  const cleanValues = Array.from(new Set(cleanArray(values))).sort();

  await setDoc(doc(db, "projectOptions", category), {
    values: cleanValues,
  });
}

export async function addOption(category: OptionCategory, value: string) {
  const cleanValue = value.trim();

  if (!cleanValue) return;

  const current = await getProjectOptions();

  const values = Array.from(
    new Set([...(current[category] || []), cleanValue]),
  ).sort();

  await saveProjectOptions(category, values);
}
