"use client";

import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  EyeOff,
  FolderKanban,
  ImagePlus,
  Loader2,
  Lock,
  LogOut,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { auth, storage } from "@/lib/firebase";
import {
  getProjectOptions,
  getProjects,
  removeProject,
  saveProject,
  saveProjectOptions,
} from "@/lib/firestore";
import { OptionCategory, Project } from "@/lib/types";
import AdminMenu from "../../../components/admin/AdminMenu";

type SeoFaqItem = {
  question: string;
  answer: string;
};

type FilterOption = {
  value: string;
  label: string;
};

type AdminProject = Omit<
  Project,
  | "name"
  | "type"
  | "niche"
  | "commercialModel"
  | "startingPrice"
  | "monthlyPrice"
  | "technologies"
  | "link"
  | "imageUrl"
  | "images"
  | "cardSummary"
  | "fullDescription"
  | "modules"
  | "integrations"
  | "indicatedBusinesses"
  | "basicFlow"
  | "highlight"
  | "seoFaqs"
> & {
  name: string;
  type: string;
  niche: string;
  commercialModel: string;
  startingPrice: string;
  monthlyPrice: string;
  technologies: string[];
  link: string;
  imageUrl: string;
  images: string[];
  cardSummary: string;
  fullDescription: string;
  modules: string[];
  integrations: string[];
  indicatedBusinesses: string[];
  basicFlow: string[];
  highlight: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  seoLocation?: string;
  seoText?: string;
  seoFaqs?: SeoFaqItem[];
};

const emptyProject: AdminProject = {
  name: "",
  type: "Sistema",
  niche: "Tecnologia",
  commercialModel: "Assinatura mensal",
  startingPrice: "",
  monthlyPrice: "",
  technologies: [],
  link: "",
  imageUrl: "",
  images: [],
  cardSummary: "",
  fullDescription: "",
  modules: [],
  integrations: [],
  indicatedBusinesses: [],
  basicFlow: [],
  highlight: true,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: [],
  seoLocation: "Campo Grande - MS",
  seoText: "",
  seoFaqs: [],
};

const optionLabels: Record<OptionCategory, string> = {
  types: "Tipos de projeto",
  niches: "Nichos",
  technologies: "Tecnologias",
  commercialModels: "Modelos comerciais",
};

const colors = {
  panel: "rgba(15, 23, 42, 0.78)",
  panelStrong: "rgba(15, 23, 42, 0.94)",
  border: "rgba(125, 211, 252, 0.18)",
  borderStrong: "rgba(125, 211, 252, 0.34)",
  text: "#f8fafc",
  muted: "#cbd5e1",
  soft: "#94a3b8",
};

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 15% 0%, rgba(14,165,233,0.24), transparent 32%), radial-gradient(circle at 90% 8%, rgba(56,189,248,0.12), transparent 30%), linear-gradient(180deg, #020617 0%, #071426 50%, #020617 100%)",
    color: colors.text,
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  shell: {
    width: "calc(100vw - 32px)",
    maxWidth: "none",
    margin: "0 auto",
    padding: "28px 0 70px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 22,
    padding: 22,
    borderRadius: 30,
    background: "rgba(15, 23, 42, 0.72)",
    border: `1px solid ${colors.border}`,
    boxShadow: "0 24px 80px rgba(0,0,0,0.24)",
    marginBottom: 22,
  },
  headerLogo: {
    width: "auto",
    height: 72,
    objectFit: "contain",
    filter: "drop-shadow(0 0 20px rgba(125,211,252,0.18))",
  },
  title: {
    margin: 0,
    fontSize: "clamp(26px, 3vw, 42px)",
    letterSpacing: "-0.055em",
  },
  subText: { color: colors.muted, margin: "8px 0 0", lineHeight: 1.55 },
  button: {
    border: 0,
    borderRadius: 16,
    padding: "13px 16px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontWeight: 900,
    cursor: "pointer",
    color: "#fff",
    background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
    boxShadow: "0 16px 38px rgba(14,165,233,0.22)",
  },
  secondaryButton: {
    borderRadius: 16,
    padding: "13px 16px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontWeight: 900,
    cursor: "pointer",
    color: "#e0f2fe",
    background: "rgba(15,23,42,0.7)",
    border: `1px solid ${colors.border}`,
  },
  dangerButton: {
    border: 0,
    borderRadius: 16,
    padding: "13px 16px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontWeight: 900,
    cursor: "pointer",
    color: "#fff",
    background: "rgba(239,68,68,0.92)",
  },
  card: {
    borderRadius: 30,
    padding: 24,
    background: colors.panel,
    border: `1px solid ${colors.border}`,
    boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
    overflow: "hidden",
  },
  cardTitle: { margin: "0 0 6px", fontSize: 26, letterSpacing: "-0.04em" },
  cardSub: { margin: "0 0 22px", color: colors.soft, lineHeight: 1.55 },
  input: {
    width: "100%",
    border: `1px solid ${colors.border}`,
    background: "rgba(2, 6, 23, 0.45)",
    color: colors.text,
    outline: "none",
    borderRadius: 16,
    padding: "13px 14px",
  },
  textarea: {
    width: "100%",
    minHeight: 110,
    resize: "vertical",
    border: `1px solid ${colors.border}`,
    background: "rgba(2, 6, 23, 0.45)",
    color: colors.text,
    outline: "none",
    borderRadius: 16,
    padding: "13px 14px",
  },
  select: {
    width: "100%",
    border: `1px solid ${colors.border}`,
    background: "rgba(2, 6, 23, 0.9)",
    color: colors.text,
    outline: "none",
    borderRadius: 16,
    padding: "13px 14px",
  },
  label: { color: "#dbeafe", fontSize: 13, fontWeight: 900 },
  field: { display: "grid", gap: 8 },
  notice: {
    borderRadius: 18,
    padding: "14px 16px",
    margin: "0 0 18px",
    color: "#e0f2fe",
    background: "rgba(14,165,233,0.12)",
    border: `1px solid ${colors.borderStrong}`,
  },
  loginWrap: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 22,
  },
  loginCard: {
    width: "min(1060px, 100%)",
    display: "grid",
    gridTemplateColumns: "1fr 0.9fr",
    overflow: "hidden",
    borderRadius: 36,
    background: colors.panelStrong,
    border: `1px solid ${colors.borderStrong}`,
    boxShadow: "0 40px 120px rgba(0,0,0,0.38)",
  },
  loginBrand: {
    padding: 46,
    background:
      "radial-gradient(circle at 30% 20%, rgba(56,189,248,0.26), transparent 38%), linear-gradient(145deg, rgba(8,47,73,0.92), rgba(15,23,42,0.82))",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 620,
  },
  loginForm: {
    padding: 46,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  passwordWrap: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    border: `1px solid ${colors.border}`,
    background: "rgba(2, 6, 23, 0.45)",
    borderRadius: 16,
    overflow: "hidden",
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 90,
    background: "rgba(2, 6, 23, 0.78)",
    display: "grid",
    placeItems: "center",
    padding: 18,
  },
  modal: {
    width: "min(1180px, 100%)",
    maxHeight: "92vh",
    overflow: "auto",
    borderRadius: 32,
    padding: 24,
    background: "#0f172a",
    border: `1px solid ${colors.borderStrong}`,
    boxShadow: "0 40px 120px rgba(0,0,0,0.5)",
  },
  smallModal: {
    width: "min(720px, 100%)",
    maxHeight: "88vh",
    overflow: "auto",
    borderRadius: 32,
    padding: 24,
    background: "#0f172a",
    border: `1px solid ${colors.borderStrong}`,
    boxShadow: "0 40px 120px rgba(0,0,0,0.5)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 20,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
  },
  optionRow: { display: "grid", gridTemplateColumns: "1fr auto", gap: 8 },
  actions: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 },
};

function textToList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function listToText(value?: string[]) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function listToDisplay(value?: string[]) {
  const items = Array.isArray(value) ? value.filter(Boolean) : [];
  return items.length ? items.join(", ") : "-";
}

function faqListToText(value?: SeoFaqItem[]) {
  if (!Array.isArray(value)) return "";
  return value
    .map((item) => `${item.question || ""} | ${item.answer || ""}`.trim())
    .filter((item) => item !== "|")
    .join("\n");
}

function textToFaqList(value: string): SeoFaqItem[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [question, ...answerParts] = line.split("|");
      return {
        question: (question || "").trim(),
        answer: answerParts.join("|").trim(),
      };
    })
    .filter((item) => item.question && item.answer);
}

function getProjectImages(project: Project) {
  const list = Array.isArray(project.images)
    ? project.images.filter(Boolean)
    : [];
  if (list.length) return list;
  return project.imageUrl ? [project.imageUrl] : [];
}

function removeUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined)
      .map((item) => removeUndefinedDeep(item)) as T;
  }

  if (value && typeof value === "object") {
    const cleanObject = Object.entries(value as Record<string, unknown>).reduce(
      (acc, [key, item]) => {
        if (item !== undefined) {
          acc[key] = removeUndefinedDeep(item);
        }
        return acc;
      },
      {} as Record<string, unknown>,
    );

    return cleanObject as T;
  }

  return value;
}

function ProjectImageCell({
  project,
  index,
  onPrev,
  onNext,
}: {
  project: Project;
  index: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const images = getProjectImages(project);
  const image = images[index] || images[0] || "";

  return (
    <div className="image-cell">
      {image ? (
        <img src={image} alt={project.name} />
      ) : (
        <div className="image-empty">
          <ImagePlus size={24} />
        </div>
      )}
      {images.length > 1 && (
        <div className="image-arrows">
          <button type="button" onClick={onPrev}>
            <ChevronLeft size={16} />
          </button>
          <span>
            {(index || 0) + 1}/{images.length}
          </span>
          <button type="button" onClick={onNext}>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function CollapsibleCell({
  text,
  emptyText = "-",
}: {
  text?: string;
  emptyText?: string;
}) {
  const [open, setOpen] = useState(false);
  const cleanText = String(text || "").trim();

  if (!cleanText) {
    return <span className="collapsed-text-empty">{emptyText}</span>;
  }

  return (
    <div className={open ? "collapsed-text open" : "collapsed-text"}>
      <div className="collapsed-text-content">{cleanText}</div>
      {cleanText.length > 120 && (
        <button
          type="button"
          className="collapsed-text-button"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? "Recolher" : "Ler mais"}
        </button>
      )}
    </div>
  );
}

function AdvancedSelect({
  options,
  value,
  onChange,
  placeholder,
  emptyMessage,
}: {
  options: FilterOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder: string;
  emptyMessage: string;
}) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const selectedOption = options.find((item) => item.value === value) || null;

  const filteredOptions = useMemo(() => {
    const cleanTerm = term.trim().toLowerCase();
    if (!cleanTerm) return options;
    return options.filter((item) =>
      item.label.toLowerCase().includes(cleanTerm),
    );
  }, [options, term]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
        setTerm("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="custom-advanced-select" ref={wrapRef}>
      <button
        type="button"
        className={
          open ? "custom-select-control open" : "custom-select-control"
        }
        onClick={() => setOpen((prev) => !prev)}
      >
        <span
          className={
            selectedOption ? "custom-select-value" : "custom-select-placeholder"
          }
        >
          {selectedOption?.label || placeholder}
        </span>
        <span className="custom-select-icons">
          {selectedOption && (
            <span
              role="button"
              tabIndex={0}
              className="custom-select-clear"
              onClick={(event) => {
                event.stopPropagation();
                onChange(null);
                setTerm("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.stopPropagation();
                  onChange(null);
                  setTerm("");
                }
              }}
              aria-label="Limpar filtro"
            >
              ×
            </span>
          )}
          <span
            className={
              open ? "custom-select-arrow open" : "custom-select-arrow"
            }
          >
            ⌄
          </span>
        </span>
      </button>

      {open && (
        <div className="custom-select-menu">
          <div className="custom-select-search-row">
            <Search size={15} />
            <input
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Pesquisar..."
              autoFocus
            />
          </div>

          <button
            type="button"
            className={
              !value ? "custom-select-option selected" : "custom-select-option"
            }
            onClick={() => {
              onChange(null);
              setOpen(false);
              setTerm("");
            }}
          >
            Todos
          </button>

          {filteredOptions.map((item) => (
            <button
              type="button"
              key={item.value}
              className={
                item.value === value
                  ? "custom-select-option selected"
                  : "custom-select-option"
              }
              onClick={() => {
                onChange(item.value);
                setOpen(false);
                setTerm("");
              }}
            >
              {item.label}
            </button>
          ))}

          {!filteredOptions.length && (
            <div className="custom-select-empty">{emptyMessage}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminProjetosPage() {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [optionModalOpen, setOptionModalOpen] = useState(false);
  const [activeOptionCategory, setActiveOptionCategory] =
    useState<OptionCategory>("types");
  const [newOptionValue, setNewOptionValue] = useState("");
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(
    null,
  );
  const [editingOptionValue, setEditingOptionValue] = useState("");

  const [project, setProject] = useState<AdminProject>(emptyProject);
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterNiche, setFilterNiche] = useState<string | null>(null);
  const [filterModel, setFilterModel] = useState<string | null>(null);
  const [imageIndexes, setImageIndexes] = useState<Record<string, number>>({});
  const [options, setOptions] = useState<Record<OptionCategory, string[]>>({
    types: [],
    niches: [],
    technologies: [],
    commercialModels: [],
  });
  const [message, setMessage] = useState("");

  const isAllowed = useMemo(() => {
    if (!user?.email || !adminEmail) return false;
    return user.email.toLowerCase() === adminEmail.toLowerCase();
  }, [user, adminEmail]);

  const typeFilterOptions = useMemo<FilterOption[]>(
    () => options.types.map((item) => ({ value: item, label: item })),
    [options.types],
  );

  const nicheFilterOptions = useMemo<FilterOption[]>(
    () => options.niches.map((item) => ({ value: item, label: item })),
    [options.niches],
  );

  const modelFilterOptions = useMemo<FilterOption[]>(
    () =>
      options.commercialModels.map((item) => ({
        value: item,
        label: item,
      })),
    [options.commercialModels],
  );

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();

    return projects.filter((item) => {
      const editableItem = item as AdminProject;
      const matchesSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term) ||
        item.niche.toLowerCase().includes(term) ||
        item.commercialModel.toLowerCase().includes(term) ||
        String(editableItem.seoTitle || "")
          .toLowerCase()
          .includes(term) ||
        String(editableItem.seoDescription || "")
          .toLowerCase()
          .includes(term);

      const matchesType = !filterType || item.type === filterType;
      const matchesNiche = !filterNiche || item.niche === filterNiche;
      const matchesModel = !filterModel || item.commercialModel === filterModel;

      return matchesSearch && matchesType && matchesNiche && matchesModel;
    });
  }, [projects, search, filterType, filterNiche, filterModel]);

  const hasAdvancedFilters = Boolean(filterType || filterNiche || filterModel);

  function clearAdvancedFilters() {
    setFilterType(null);
    setFilterNiche(null);
    setFilterModel(null);
  }

  async function loadData() {
    const [projectList, optionList] = await Promise.all([
      getProjects(),
      getProjectOptions(),
    ]);
    setProjects(projectList);
    setOptions(optionList);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
      if (currentUser) await loadData();
    });
    return () => unsubscribe();
  }, []);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setMessage("Informe o e-mail e a senha.");
      return;
    }
    try {
      setLoggingIn(true);
      await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
    } catch (error) {
      console.error(error);
      setMessage(
        "E-mail ou senha inválidos. Verifique os dados cadastrados no Firebase.",
      );
    } finally {
      setLoggingIn(false);
    }
  }

  async function logout() {
    await signOut(auth);
  }

  function updateField<K extends keyof AdminProject>(
    field: K,
    value: AdminProject[K],
  ) {
    setProject((prev) => ({ ...prev, [field]: value }));
  }

  function openNewProject() {
    setProject(emptyProject);
    setMessage("");
    setModalOpen(true);
  }

  function openEditProject(item: Project) {
    const editableItem = item as AdminProject;
    setProject({
      ...editableItem,
      images: getProjectImages(editableItem),
      imageUrl: getProjectImages(editableItem)[0] || "",
      cardSummary: editableItem.cardSummary || "",
      seoTitle: editableItem.seoTitle || "",
      seoDescription: editableItem.seoDescription || "",
      seoKeywords: editableItem.seoKeywords || [],
      seoLocation: editableItem.seoLocation || "Campo Grande - MS",
      seoText: editableItem.seoText || "",
      seoFaqs: editableItem.seoFaqs || [],
    });
    setMessage("");
    setModalOpen(true);
  }

  function closeModal() {
    if (savingProject || uploading) return;
    setModalOpen(false);
    setProject(emptyProject);
  }

  function openOptionModal(category: OptionCategory) {
    setActiveOptionCategory(category);
    setNewOptionValue("");
    setEditingOptionIndex(null);
    setEditingOptionValue("");
    setOptionModalOpen(true);
  }

  async function persistOptions(category: OptionCategory, values: string[]) {
    await saveProjectOptions(category, values);
    setOptions((prev) => ({ ...prev, [category]: values }));
  }

  async function handleAddOption() {
    const clean = newOptionValue.trim();
    if (!clean) return;
    const current = options[activeOptionCategory] || [];
    const values = Array.from(new Set([...current, clean])).sort();
    await persistOptions(activeOptionCategory, values);
    setNewOptionValue("");
    setMessage("Opção adicionada com sucesso.");
  }

  async function confirmEditOption() {
    if (editingOptionIndex === null) return;
    const clean = editingOptionValue.trim();
    if (!clean) return;
    const values = [...(options[activeOptionCategory] || [])];
    values[editingOptionIndex] = clean;
    await persistOptions(
      activeOptionCategory,
      Array.from(new Set(values)).sort(),
    );
    setEditingOptionIndex(null);
    setEditingOptionValue("");
    setMessage("Opção editada com sucesso.");
  }

  async function deleteOption(index: number) {
    const value = options[activeOptionCategory][index];
    const confirmed = window.confirm(`Deseja excluir "${value}"?`);
    if (!confirmed) return;
    const values = options[activeOptionCategory].filter(
      (_, itemIndex) => itemIndex !== index,
    );
    await persistOptions(activeOptionCategory, values);
    setMessage("Opção excluída com sucesso.");
  }

  async function handleUploadImages(files: FileList | null) {
    if (!files?.length) return;
    try {
      setUploading(true);
      setMessage("");
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const extension = file.name.split(".").pop() || "png";
        const safeName = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${extension}`;
        const storageRef = ref(storage, `portfolio-projects/${safeName}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        uploadedUrls.push(url);
      }
      if (uploadedUrls.length) {
        setProject((prev) => {
          const images = [...(prev.images || []), ...uploadedUrls];
          return { ...prev, images, imageUrl: images[0] || "" };
        });
        setMessage("Imagem anexada com sucesso.");
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "Erro ao anexar imagem. Verifique as permissões do Firebase Storage.",
      );
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url: string) {
    setProject((prev) => {
      const images = (prev.images || []).filter((item) => item !== url);
      return { ...prev, images, imageUrl: images[0] || "" };
    });
  }

  async function handleSave() {
    try {
      setSavingProject(true);
      const images = project.images || [];

      const cleanProject = removeUndefinedDeep({
        ...project,
        name: project.name ?? "",
        type: project.type ?? "",
        niche: project.niche ?? "",
        commercialModel: project.commercialModel ?? "",
        startingPrice: project.startingPrice ?? "",
        monthlyPrice: project.monthlyPrice ?? "",
        technologies: Array.isArray(project.technologies)
          ? project.technologies.filter(Boolean)
          : [],
        link: project.link ?? "",
        images,
        imageUrl: images[0] ?? project.imageUrl ?? "",
        cardSummary: project.cardSummary ?? "",
        fullDescription: project.fullDescription ?? "",
        modules: Array.isArray(project.modules)
          ? project.modules.filter(Boolean)
          : [],
        integrations: Array.isArray(project.integrations)
          ? project.integrations.filter(Boolean)
          : [],
        indicatedBusinesses: Array.isArray(project.indicatedBusinesses)
          ? project.indicatedBusinesses.filter(Boolean)
          : [],
        basicFlow: Array.isArray(project.basicFlow)
          ? project.basicFlow.filter(Boolean)
          : [],
        highlight: project.highlight ?? false,
        seoTitle: project.seoTitle?.trim() ?? "",
        seoDescription: project.seoDescription?.trim() ?? "",
        seoKeywords: Array.isArray(project.seoKeywords)
          ? project.seoKeywords.filter(Boolean)
          : [],
        seoLocation: project.seoLocation?.trim() ?? "",
        seoText: project.seoText?.trim() ?? "",
        seoFaqs: Array.isArray(project.seoFaqs)
          ? project.seoFaqs
              .map((faq) => ({
                question: faq?.question ?? "",
                answer: faq?.answer ?? "",
              }))
              .filter((faq) => faq.question || faq.answer)
          : [],
      } as AdminProject);

      await saveProject(cleanProject);

      setProject(emptyProject);
      setModalOpen(false);
      await loadData();
      setMessage("Projeto salvo com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao salvar projeto.");
    } finally {
      setSavingProject(false);
    }
  }

  async function handleDelete(id?: string) {
    if (!id) return;
    const confirmed = window.confirm("Deseja realmente excluir este projeto?");
    if (!confirmed) return;
    await removeProject(id);
    await loadData();
    setMessage("Projeto excluído com sucesso.");
  }

  function changeImageIndex(projectId: string, direction: "prev" | "next") {
    const item = projects.find((projectItem) => projectItem.id === projectId);
    if (!item) return;
    const images = getProjectImages(item);
    if (!images.length) return;
    setImageIndexes((prev) => {
      const current = prev[projectId] || 0;
      const next =
        direction === "next"
          ? (current + 1) % images.length
          : (current - 1 + images.length) % images.length;
      return { ...prev, [projectId]: next };
    });
  }

  if (checkingAuth) {
    return (
      <main style={styles.page}>
        <div style={styles.loginWrap}>
          <div
            style={{
              ...styles.card,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Loader2 className="spin" size={20} /> Carregando painel...
          </div>
        </div>
        <AdminGlobalStyle />
      </main>
    );
  }

  if (!user) {
    return (
      <main style={styles.page}>
        <div style={styles.loginWrap}>
          <section style={styles.loginCard} className="admin-login-card">
            <div style={styles.loginBrand}>
              <div>
                <Image
                  src="/logo-white.png"
                  alt="Defan Soluções Digitais"
                  width={380}
                  height={130}
                  priority
                  style={{ width: "auto", height: 104, objectFit: "contain" }}
                />
                <h1
                  style={{
                    margin: "28px 0 14px",
                    fontSize: "clamp(34px, 4vw, 58px)",
                    lineHeight: 1,
                    letterSpacing: "-0.07em",
                  }}
                >
                  Painel administrativo Defan
                </h1>
                <p
                  style={{
                    color: colors.muted,
                    lineHeight: 1.7,
                    fontSize: 17,
                    margin: 0,
                  }}
                >
                  Acesse com o e-mail e senha cadastrados no Firebase para
                  gerenciar projetos, imagens, tecnologias, nichos e destaques
                  do portfólio.
                </p>
              </div>
              <div style={{ display: "grid", gap: 12, marginTop: 34 }}>
                <span className="admin-badge">
                  <Sparkles size={15} /> Portfólio profissional
                </span>
                <span className="admin-badge">
                  <FolderKanban size={15} /> Gestão de projetos
                </span>
                <span className="admin-badge">
                  <Lock size={15} /> Acesso protegido
                </span>
              </div>
            </div>
            <form style={styles.loginForm} onSubmit={login}>
              <a
                href="/"
                style={{
                  ...styles.secondaryButton,
                  width: "fit-content",
                  marginBottom: 24,
                }}
              >
                <ArrowLeft size={17} /> Voltar ao site
              </a>
              <h2 style={{ ...styles.cardTitle, fontSize: 34 }}>
                Entrar no painel
              </h2>
              <p style={styles.cardSub}>
                Use o e-mail autorizado em{" "}
                <strong>NEXT_PUBLIC_ADMIN_EMAIL</strong>.
              </p>
              {message && <div style={styles.notice}>{message}</div>}
              <div style={{ display: "grid", gap: 16 }}>
                <label style={styles.field}>
                  <span style={styles.label}>E-mail</span>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                    placeholder="seuemail@gmail.com"
                    style={styles.input}
                    autoComplete="email"
                  />
                </label>
                <label style={styles.field}>
                  <span style={styles.label}>Senha</span>
                  <div style={styles.passwordWrap}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                      placeholder="Digite sua senha"
                      style={{
                        border: 0,
                        background: "transparent",
                        color: colors.text,
                        outline: "none",
                        padding: "13px 14px",
                        width: "100%",
                      }}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="icon-password-button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </label>
                <button
                  type="submit"
                  style={styles.button}
                  disabled={loggingIn}
                >
                  {loggingIn ? (
                    <>
                      <Loader2 className="spin" size={18} />
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar com e-mail e senha
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
        <AdminGlobalStyle />
      </main>
    );
  }

  if (!isAllowed) {
    return (
      <main style={styles.page}>
        <div style={styles.loginWrap}>
          <section style={{ ...styles.card, width: "min(560px, 100%)" }}>
            <Image
              src="/logo-white.png"
              alt="Defan Soluções Digitais"
              width={260}
              height={90}
              style={{
                width: "auto",
                height: 80,
                objectFit: "contain",
                marginBottom: 18,
              }}
            />
            <h1 style={styles.cardTitle}>Acesso não autorizado</h1>
            <p style={styles.cardSub}>
              Você entrou com <strong>{user.email}</strong>, mas o e-mail
              permitido é definido em <strong>NEXT_PUBLIC_ADMIN_EMAIL</strong>.
            </p>
            <button style={styles.secondaryButton} onClick={logout}>
              <LogOut size={17} />
              Sair
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header} className="admin-top-header">
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Image
              src="/logo-white.png"
              alt="Defan Soluções Digitais"
              width={300}
              height={100}
              style={styles.headerLogo}
            />
            <div>
              <h1 style={styles.title}>Painel Admin</h1>
              <p style={styles.subText}>
                Cadastre projetos em uma modal e gerencie a lista completa do
                portfólio.
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <a href="/" style={styles.secondaryButton}>
              <ArrowLeft size={17} />
              Ver site
            </a>
            <button style={styles.secondaryButton} onClick={logout}>
              <LogOut size={17} />
              Sair
            </button>
          </div>
        </header>

        <AdminMenu />

        {message && <div style={styles.notice}>{message}</div>}

        <section style={styles.card}>
          <div className="list-toolbar">
            <div>
              <h2 style={styles.cardTitle}>Projetos cadastrados</h2>
              <p style={styles.cardSub}>
                {projects.length} projeto(s) no portfólio.
              </p>
            </div>
            <button style={styles.button} onClick={openNewProject}>
              <Plus size={18} />
              Novo cadastro
            </button>
          </div>
          <label style={{ ...styles.field, marginBottom: 18 }}>
            <span style={styles.label}>Buscar projeto</span>
            <div className="search-box">
              <Search size={18} color={colors.soft} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nome, tipo, nicho ou modelo comercial..."
              />
            </div>
          </label>

          <div className="advanced-filter-panel">
            <div className="advanced-filter-heading">
              <div>
                <strong>Filtros avançados</strong>
                <span>Refine a lista por tipo, nicho e modelo comercial.</span>
              </div>
              {hasAdvancedFilters && (
                <button type="button" onClick={clearAdvancedFilters}>
                  <X size={15} />
                  Limpar filtros
                </button>
              )}
            </div>

            <div className="advanced-filter-grid">
              <label>
                <span>Tipo</span>
                <AdvancedSelect
                  options={typeFilterOptions}
                  value={filterType}
                  onChange={setFilterType}
                  placeholder="Todos os tipos"
                  emptyMessage="Nenhum tipo cadastrado"
                />
              </label>

              <label>
                <span>Nicho</span>
                <AdvancedSelect
                  options={nicheFilterOptions}
                  value={filterNiche}
                  onChange={setFilterNiche}
                  placeholder="Todos os nichos"
                  emptyMessage="Nenhum nicho cadastrado"
                />
              </label>

              <label>
                <span>Modelo comercial</span>
                <AdvancedSelect
                  options={modelFilterOptions}
                  value={filterModel}
                  onChange={setFilterModel}
                  placeholder="Todos os modelos"
                  emptyMessage="Nenhum modelo cadastrado"
                />
              </label>
            </div>

            <div className="advanced-filter-result">
              Exibindo <strong>{filteredProjects.length}</strong> de{" "}
              <strong>{projects.length}</strong> projeto(s).
            </div>
          </div>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Imagem</th>
                  <th>Projeto</th>
                  <th>Tipo</th>
                  <th>Nicho</th>
                  <th>Modelo</th>
                  <th>Valores</th>
                  <th>Tecnologias</th>
                  <th>Detalhes</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((item) => {
                  const projectId = item.id || item.name;
                  const imageIndex = imageIndexes[projectId] || 0;
                  return (
                    <tr key={projectId}>
                      <td>
                        <ProjectImageCell
                          project={item}
                          index={imageIndex}
                          onPrev={() => changeImageIndex(projectId, "prev")}
                          onNext={() => changeImageIndex(projectId, "next")}
                        />
                      </td>
                      <td>
                        <strong>{item.name}</strong>
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noreferrer">
                            Abrir projeto
                          </a>
                        )}
                        {item.highlight && (
                          <span className="mini-badge">Destaque</span>
                        )}
                      </td>
                      <td>{item.type}</td>
                      <td>{item.niche}</td>
                      <td>{item.commercialModel}</td>
                      <td>
                        {item.startingPrice && (
                          <span>{item.startingPrice}</span>
                        )}
                        {item.monthlyPrice && <span>{item.monthlyPrice}</span>}
                        {!item.startingPrice && !item.monthlyPrice && (
                          <span>-</span>
                        )}
                      </td>
                      <td>
                        <div className="chip-list">
                          {item.technologies.map((tech) => (
                            <span key={tech}>{tech}</span>
                          ))}
                        </div>
                      </td>
                      <td className="text-cell">
                        <CollapsibleCell
                          text={`Módulos: ${listToDisplay(
                            item.modules,
                          )}\nIntegrações: ${listToDisplay(
                            item.integrations,
                          )}\nIndicado: ${listToDisplay(
                            item.indicatedBusinesses,
                          )}`}
                        />
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="small-action"
                            onClick={() => openEditProject(item)}
                            title="Editar"
                            aria-label="Editar projeto"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            className="small-action danger"
                            onClick={() => handleDelete(item.id)}
                            title="Excluir"
                            aria-label="Excluir projeto"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!filteredProjects.length && (
                  <tr>
                    <td colSpan={9}>Nenhum projeto encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {modalOpen && (
        <div style={styles.modalBackdrop}>
          <section style={styles.modal}>
            <header style={styles.modalHeader}>
              <div>
                <h2 style={styles.cardTitle}>
                  {project.id ? "Editar projeto" : "Novo cadastro de projeto"}
                </h2>
                <p style={styles.cardSub}>
                  Preencha os dados, anexe imagens e salve para exibir no
                  portfólio.
                </p>
              </div>
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={closeModal}
              >
                <X size={18} />
                Fechar
              </button>
            </header>
            <div style={styles.formGrid} className="admin-form-grid">
              <div style={styles.field}>
                <label style={styles.label}>Nome do projeto</label>
                <input
                  value={project.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Ex: Sistema de cobrança"
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Link do projeto</label>
                <input
                  value={project.link}
                  onChange={(event) => updateField("link", event.target.value)}
                  placeholder="https://..."
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Tipo</label>
                <div style={styles.optionRow}>
                  <select
                    value={project.type}
                    onChange={(event) =>
                      updateField("type", event.target.value)
                    }
                    style={styles.select}
                  >
                    {options.types.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <button
                    style={styles.button}
                    type="button"
                    onClick={() => openOptionModal("types")}
                    title="Gerenciar tipos"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Modelo comercial</label>
                <div style={styles.optionRow}>
                  <select
                    value={project.commercialModel}
                    onChange={(event) =>
                      updateField("commercialModel", event.target.value)
                    }
                    style={styles.select}
                  >
                    {options.commercialModels.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <button
                    style={styles.button}
                    type="button"
                    onClick={() => openOptionModal("commercialModels")}
                    title="Gerenciar modelos"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Nicho</label>
                <div style={styles.optionRow}>
                  <select
                    value={project.niche}
                    onChange={(event) =>
                      updateField("niche", event.target.value)
                    }
                    style={styles.select}
                  >
                    {options.niches.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <button
                    style={styles.button}
                    type="button"
                    onClick={() => openOptionModal("niches")}
                    title="Gerenciar nichos"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Investimento inicial</label>
                <input
                  value={project.startingPrice}
                  onChange={(event) =>
                    updateField("startingPrice", event.target.value)
                  }
                  placeholder="Ex: A partir de R$ 399,00"
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Mensalidade</label>
                <input
                  value={project.monthlyPrice}
                  onChange={(event) =>
                    updateField("monthlyPrice", event.target.value)
                  }
                  placeholder="Ex: R$ 99,00/mês"
                  style={styles.input}
                />
              </div>
              <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
                <label style={styles.label}>Imagens do projeto</label>
                <label className="upload-box">
                  <UploadCloud size={24} />
                  <strong>
                    {uploading
                      ? "Enviando imagem..."
                      : "Clique para anexar imagem"}
                  </strong>
                  <span>
                    Você pode selecionar uma ou várias imagens do computador.
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => handleUploadImages(event.target.files)}
                    disabled={uploading}
                  />
                </label>
                {!!project.images.length && (
                  <div className="preview-images">
                    {project.images.map((url) => (
                      <div key={url} className="preview-image-card">
                        <img src={url} alt="Imagem do projeto" />
                        <button type="button" onClick={() => removeImage(url)}>
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
                <label style={styles.label}>Tecnologias utilizadas</label>
                <div style={styles.optionRow}>
                  <select
                    multiple
                    value={project.technologies}
                    onChange={(event) => {
                      const values = Array.from(
                        event.target.selectedOptions,
                      ).map((item) => item.value);
                      updateField("technologies", values);
                    }}
                    style={{ ...styles.select, minHeight: 132 }}
                  >
                    {options.technologies.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <button
                    style={styles.button}
                    type="button"
                    onClick={() => openOptionModal("technologies")}
                    title="Gerenciar tecnologias"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
                <label style={styles.label}>Resumo do card</label>
                <textarea
                  value={project.cardSummary}
                  onChange={(event) =>
                    updateField("cardSummary", event.target.value)
                  }
                  placeholder="Resumo curto para aparecer no card do projeto. Campo opcional."
                  style={{ ...styles.textarea, minHeight: 86 }}
                />
              </div>
              <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
                <label style={styles.label}>Descrição completa</label>
                <textarea
                  value={project.fullDescription}
                  onChange={(event) =>
                    updateField("fullDescription", event.target.value)
                  }
                  placeholder="Descrição completa para o modal de detalhes."
                  style={styles.textarea}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>
                  Módulos disponíveis, um por linha
                </label>
                <textarea
                  value={listToText(project.modules)}
                  onChange={(event) =>
                    updateField("modules", textToList(event.target.value))
                  }
                  style={styles.textarea}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>
                  Integrações disponíveis, uma por linha
                </label>
                <textarea
                  value={listToText(project.integrations)}
                  onChange={(event) =>
                    updateField("integrations", textToList(event.target.value))
                  }
                  style={styles.textarea}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>
                  Negócios indicados, um por linha
                </label>
                <textarea
                  value={listToText(project.indicatedBusinesses)}
                  onChange={(event) =>
                    updateField(
                      "indicatedBusinesses",
                      textToList(event.target.value),
                    )
                  }
                  style={styles.textarea}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>
                  Fluxo básico de uso, um passo por linha
                </label>
                <textarea
                  value={listToText(project.basicFlow)}
                  onChange={(event) =>
                    updateField("basicFlow", textToList(event.target.value))
                  }
                  style={styles.textarea}
                />
              </div>
              <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
                <label style={styles.label}>SEO Title</label>
                <input
                  value={project.seoTitle || ""}
                  onChange={(event) =>
                    updateField("seoTitle", event.target.value)
                  }
                  placeholder="Ex: Sistema de cobrança para empresas | Defan Soluções Digitais"
                  style={styles.input}
                />
              </div>

              <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
                <label style={styles.label}>SEO Description</label>
                <textarea
                  value={project.seoDescription || ""}
                  onChange={(event) =>
                    updateField("seoDescription", event.target.value)
                  }
                  placeholder="Descrição curta para o Google. Ex: Sistema de cobrança online com clientes, parcelas, juros, relatórios e automações."
                  style={{ ...styles.textarea, minHeight: 86 }}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>SEO Keywords, uma por linha</label>
                <textarea
                  value={listToText(project.seoKeywords)}
                  onChange={(event) =>
                    updateField("seoKeywords", textToList(event.target.value))
                  }
                  placeholder={
                    "sistema de cobrança\nsistema financeiro\nautomação de cobranças\nsoftware para empresas"
                  }
                  style={styles.textarea}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Cidade/Localização SEO</label>
                <input
                  value={project.seoLocation || ""}
                  onChange={(event) =>
                    updateField("seoLocation", event.target.value)
                  }
                  placeholder="Ex: Campo Grande - MS"
                  style={styles.input}
                />
              </div>

              <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
                <label style={styles.label}>Texto SEO completo</label>
                <textarea
                  value={project.seoText || ""}
                  onChange={(event) =>
                    updateField("seoText", event.target.value)
                  }
                  placeholder="Texto mais completo usando palavras-chave reais. Ex: Este projeto é indicado para empresas que precisam organizar cobranças, clientes, pagamentos e relatórios em um painel profissional."
                  style={{ ...styles.textarea, minHeight: 150 }}
                />
              </div>

              <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
                <label style={styles.label}>
                  FAQ SEO, uma pergunta por linha no formato: Pergunta |
                  Resposta
                </label>
                <textarea
                  value={faqListToText(project.seoFaqs)}
                  onChange={(event) =>
                    updateField("seoFaqs", textToFaqList(event.target.value))
                  }
                  placeholder={
                    "Esse projeto funciona no celular? | Sim, o projeto é responsivo e funciona em celular, tablet e computador.\nPosso personalizar esse sistema? | Sim, os módulos podem ser adaptados conforme a necessidade da empresa."
                  }
                  style={{ ...styles.textarea, minHeight: 130 }}
                />
              </div>

              <label className="highlight-check">
                <input
                  type="checkbox"
                  checked={project.highlight}
                  onChange={(event) =>
                    updateField("highlight", event.target.checked)
                  }
                />
                Destacar na página inicial
              </label>
            </div>
            <div style={styles.actions}>
              <button
                style={styles.button}
                onClick={handleSave}
                disabled={savingProject}
              >
                {savingProject ? (
                  <>
                    <Loader2 className="spin" size={16} />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Salvar projeto
                  </>
                )}
              </button>
              <button style={styles.secondaryButton} onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </section>
        </div>
      )}

      {optionModalOpen && (
        <div style={styles.modalBackdrop}>
          <section style={styles.smallModal}>
            <header style={styles.modalHeader}>
              <div>
                <h2 style={styles.cardTitle}>
                  {optionLabels[activeOptionCategory]}
                </h2>
                <p style={styles.cardSub}>
                  Cadastre, edite ou exclua as opções exibidas nos selects.
                </p>
              </div>
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={() => setOptionModalOpen(false)}
              >
                <X size={18} />
                Fechar
              </button>
            </header>
            <div className="option-add-box">
              <input
                value={newOptionValue}
                onChange={(event) => setNewOptionValue(event.target.value)}
                placeholder="Nova opção"
              />
              <button type="button" onClick={handleAddOption}>
                <Plus size={16} />
                Adicionar
              </button>
            </div>
            <div className="option-list-box">
              {(options[activeOptionCategory] || []).map((item, index) => (
                <div className="option-list-item" key={`${item}-${index}`}>
                  {editingOptionIndex === index ? (
                    <input
                      value={editingOptionValue}
                      onChange={(event) =>
                        setEditingOptionValue(event.target.value)
                      }
                    />
                  ) : (
                    <strong>{item}</strong>
                  )}
                  <div>
                    {editingOptionIndex === index ? (
                      <button type="button" onClick={confirmEditOption}>
                        <Save size={15} />
                        Salvar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingOptionIndex(index);
                          setEditingOptionValue(item);
                        }}
                      >
                        <Edit3 size={15} />
                      </button>
                    )}
                    <button
                      type="button"
                      className="danger"
                      onClick={() => deleteOption(index)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
              {!options[activeOptionCategory]?.length && (
                <p className="empty-option-list">Nenhuma opção cadastrada.</p>
              )}
            </div>
          </section>
        </div>
      )}

      <AdminGlobalStyle />
    </main>
  );
}

function AdminGlobalStyle() {
  return (
    <style jsx global>{`
      * {
        box-sizing: border-box;
      }

      a {
        text-decoration: none;
      }
      .spin {
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      .admin-badge {
        display: inline-flex;
        width: fit-content;
        align-items: center;
        gap: 7px;
        padding: 8px 11px;
        border-radius: 999px;
        background: rgba(14, 165, 233, 0.12);
        border: 1px solid rgba(125, 211, 252, 0.18);
        color: #bae6fd;
        font-size: 12px;
        font-weight: 900;
      }
      .icon-password-button {
        border: 0;
        background: transparent;
        color: #94a3b8;
        cursor: pointer;
        padding: 0 14px;
        height: 100%;
        display: grid;
        place-items: center;
      }
      .list-toolbar {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 18px;
      }
      .search-box {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: 8px;
        border: 1px solid rgba(125, 211, 252, 0.18);
        background: rgba(2, 6, 23, 0.45);
        border-radius: 16px;
        padding: 0 13px;
      }
      .search-box input {
        border: 0;
        outline: 0;
        color: #f8fafc;
        background: transparent;
        padding: 13px 0;
      }

      .advanced-filter-panel {
        margin: 0 0 22px;
        padding: 16px;
        border-radius: 22px;
        background: rgba(2, 6, 23, 0.32);
        border: 1px solid rgba(125, 211, 252, 0.16);
      }
      .advanced-filter-heading {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 14px;
        margin-bottom: 14px;
      }
      .advanced-filter-heading div {
        display: grid;
        gap: 4px;
      }
      .advanced-filter-heading strong {
        color: #f8fafc;
        font-size: 16px;
      }
      .advanced-filter-heading span,
      .advanced-filter-grid label > span,
      .advanced-filter-result {
        color: #94a3b8;
        font-size: 13px;
      }
      .advanced-filter-heading button {
        border: 1px solid rgba(125, 211, 252, 0.18);
        border-radius: 14px;
        padding: 10px 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        color: #e0f2fe;
        background: rgba(15, 23, 42, 0.72);
        cursor: pointer;
        font-weight: 900;
        white-space: nowrap;
      }
      .advanced-filter-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
      }
      .advanced-filter-grid label {
        display: grid;
        gap: 8px;
      }
      .advanced-filter-grid label > span {
        color: #dbeafe;
        font-weight: 900;
      }
      .advanced-filter-result {
        margin-top: 14px;
      }
      .advanced-filter-result strong {
        color: #7dd3fc;
      }

      .custom-advanced-select {
        position: relative;
        width: 100%;
      }
      .custom-select-control {
        width: 100%;
        min-height: 52px;
        border: 1px solid rgba(125, 211, 252, 0.18);
        border-radius: 16px;
        background: rgba(2, 6, 23, 0.9);
        color: #f8fafc;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 0 13px;
        cursor: pointer;
        text-align: left;
        transition: 0.2s ease;
      }
      .custom-select-control:hover,
      .custom-select-control.open {
        border-color: rgba(125, 211, 252, 0.5);
        box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.12);
      }
      .custom-select-value {
        color: #f8fafc;
        font-weight: 900;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .custom-select-placeholder {
        color: #94a3b8;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .custom-select-icons {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #94a3b8;
        flex: 0 0 auto;
      }
      .custom-select-clear {
        width: 22px;
        height: 22px;
        border-radius: 999px;
        display: grid;
        place-items: center;
        color: #e0f2fe;
        background: rgba(148, 163, 184, 0.16);
        font-size: 18px;
        line-height: 1;
      }
      .custom-select-arrow {
        font-size: 18px;
        line-height: 1;
        transition: 0.2s ease;
      }
      .custom-select-arrow.open {
        transform: rotate(180deg);
      }
      .custom-select-menu {
        position: absolute;
        z-index: 80;
        top: calc(100% + 8px);
        left: 0;
        right: 0;
        max-height: 310px;
        overflow: auto;
        padding: 8px;
        border-radius: 18px;
        background: #0f172a;
        border: 1px solid rgba(125, 211, 252, 0.18);
        box-shadow: 0 22px 60px rgba(0, 0, 0, 0.42);
      }
      .custom-select-search-row {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: 8px;
        border: 1px solid rgba(125, 211, 252, 0.16);
        border-radius: 14px;
        padding: 0 11px;
        margin-bottom: 8px;
        color: #7dd3fc;
        background: rgba(2, 6, 23, 0.46);
      }
      .custom-select-search-row input {
        border: 0;
        outline: 0;
        background: transparent;
        color: #f8fafc;
        padding: 11px 0;
        min-width: 0;
      }
      .custom-select-search-row input::placeholder {
        color: #64748b;
      }
      .custom-select-option {
        width: 100%;
        border: 0;
        border-radius: 13px;
        padding: 11px 12px;
        color: #e2e8f0;
        background: transparent;
        text-align: left;
        cursor: pointer;
        font-weight: 800;
      }
      .custom-select-option:hover {
        background: rgba(14, 165, 233, 0.16);
        color: #f8fafc;
      }
      .custom-select-option.selected {
        background: rgba(14, 165, 233, 0.34);
        color: #f8fafc;
      }
      .custom-select-empty {
        padding: 12px;
        color: #94a3b8;
        font-size: 13px;
      }
      .table-wrap {
        width: 100%;
        max-width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        border-radius: 22px;
        border: 1px solid rgba(125, 211, 252, 0.16);
        padding-bottom: 8px;
      }

      .table-wrap::-webkit-scrollbar {
        height: 10px;
      }

      .table-wrap::-webkit-scrollbar-track {
        background: rgba(2, 6, 23, 0.45);
        border-radius: 999px;
      }

      .table-wrap::-webkit-scrollbar-thumb {
        background: #0ea5e9;
        border-radius: 999px;
      }

      .admin-table {
        width: 100%;
        min-width: 1420px;
        table-layout: fixed;
        border-collapse: collapse;
        background: rgba(2, 6, 23, 0.32);
      }
      .admin-table th,
      .admin-table td {
        padding: 14px;
        border-bottom: 1px solid rgba(125, 211, 252, 0.1);
        text-align: left;
        vertical-align: top;
        color: #cbd5e1;
        font-size: 14px;
      }
      .admin-table th {
        position: sticky;
        top: 0;
        z-index: 2;
        background: #0f172a;
        color: #e0f2fe;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .admin-table th:nth-child(1),
      .admin-table td:nth-child(1) {
        width: 135px;
      }

      .admin-table th:nth-child(2),
      .admin-table td:nth-child(2) {
        width: 210px;
      }

      .admin-table th:nth-child(3),
      .admin-table td:nth-child(3) {
        width: 145px;
      }

      .admin-table th:nth-child(4),
      .admin-table td:nth-child(4) {
        width: 165px;
      }

      .admin-table th:nth-child(5),
      .admin-table td:nth-child(5) {
        width: 190px;
      }

      .admin-table th:nth-child(6),
      .admin-table td:nth-child(6) {
        width: 150px;
      }

      .admin-table th:nth-child(7),
      .admin-table td:nth-child(7) {
        width: 220px;
      }

      .admin-table th:nth-child(8),
      .admin-table td:nth-child(8) {
        width: 300px;
      }

      .admin-table th:nth-child(9),
      .admin-table td:nth-child(9) {
        width: 115px;
        max-width: 115px;
        min-width: 115px;
      }

      .admin-table td strong {
        color: #f8fafc;
      }
      .admin-table td a {
        display: block;
        color: #7dd3fc;
        margin-top: 6px;
        font-size: 13px;
      }
      .admin-table td > span {
        display: block;
        margin-bottom: 4px;
      }
      .text-cell {
        max-width: 300px;
        line-height: 1.55;
      }
      .collapsed-text {
        max-width: 300px;
      }
      .collapsed-text-content {
        color: #cbd5e1;
        line-height: 1.55;
        white-space: pre-wrap;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
      }
      .collapsed-text.open .collapsed-text-content {
        display: block;
        overflow: visible;
        -webkit-line-clamp: unset;
      }
      .collapsed-text-button {
        margin-top: 8px;
        border: 0;
        border-radius: 999px;
        padding: 7px 11px;
        background: rgba(14, 165, 233, 0.16);
        color: #bae6fd;
        cursor: pointer;
        font-size: 12px;
        font-weight: 900;
      }
      .collapsed-text-empty {
        color: #94a3b8;
      }
      .chip-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        max-width: 210px;
      }
      .chip-list span,
      .mini-badge {
        display: inline-flex;
        width: fit-content;
        padding: 6px 8px;
        border-radius: 999px;
        color: #bae6fd;
        background: rgba(14, 165, 233, 0.12);
        border: 1px solid rgba(125, 211, 252, 0.16);
        font-size: 12px;
        font-weight: 900;
      }
      .mini-badge {
        margin-top: 8px;
        color: #bbf7d0;
        background: rgba(34, 197, 94, 0.12);
      }
      .image-cell {
        width: 112px;
      }
      .image-cell img,
      .image-empty {
        width: 100px;
        height: 68px;
        border-radius: 14px;
        object-fit: cover;
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(125, 211, 252, 0.16);
      }
      .image-empty {
        display: grid;
        place-items: center;
        color: #7dd3fc;
      }
      .image-arrows {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        margin-top: 8px;
        width: 100px;
      }
      .image-arrows button {
        width: 26px;
        height: 26px;
        border: 0;
        border-radius: 8px;
        color: #e0f2fe;
        background: rgba(14, 165, 233, 0.18);
        cursor: pointer;
        display: grid;
        place-items: center;
      }
      .image-arrows span {
        color: #94a3b8;
        font-size: 12px;
        font-weight: 900;
      }
      .row-actions {
        width: 86px;
        min-width: 86px;
        max-width: 86px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .small-action {
        width: 86px;
        min-width: 86px;
        max-width: 86px;
        height: 34px;
        border: 0;
        border-radius: 12px;
        padding: 8px 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        color: #e0f2fe;
        background: rgba(14, 165, 233, 0.16);
        cursor: pointer;
        font-weight: 900;
      }
      .small-action.danger {
        color: #fff;
        background: rgba(239, 68, 68, 0.82);
      }
      .upload-box {
        border: 1px dashed rgba(125, 211, 252, 0.36);
        border-radius: 22px;
        padding: 24px;
        background: rgba(2, 6, 23, 0.36);
        display: grid;
        place-items: center;
        gap: 8px;
        color: #cbd5e1;
        cursor: pointer;
        text-align: center;
      }
      .upload-box svg {
        color: #7dd3fc;
      }
      .upload-box strong {
        color: #f8fafc;
      }
      .upload-box span {
        color: #94a3b8;
        font-size: 13px;
      }
      .upload-box input {
        display: none;
      }
      .preview-images {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 12px;
      }
      .preview-image-card {
        position: relative;
        width: 130px;
        height: 92px;
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid rgba(125, 211, 252, 0.18);
      }
      .preview-image-card img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .preview-image-card button {
        position: absolute;
        top: 6px;
        right: 6px;
        width: 28px;
        height: 28px;
        border: 0;
        border-radius: 50%;
        background: rgba(239, 68, 68, 0.94);
        color: white;
        display: grid;
        place-items: center;
        cursor: pointer;
      }
      .highlight-check {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #cbd5e1;
        font-weight: 900;
      }
      .option-add-box {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 10px;
        margin-bottom: 18px;
      }
      .option-add-box input,
      .option-list-item input {
        width: 100%;
        border: 1px solid rgba(125, 211, 252, 0.18);
        background: rgba(2, 6, 23, 0.45);
        color: #f8fafc;
        outline: none;
        border-radius: 16px;
        padding: 13px 14px;
      }
      .option-add-box button,
      .option-list-item button {
        border: 0;
        border-radius: 14px;
        padding: 11px 13px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        color: white;
        background: linear-gradient(135deg, #0ea5e9, #38bdf8);
        cursor: pointer;
        font-weight: 900;
      }
      .option-list-box {
        display: grid;
        gap: 10px;
      }
      .option-list-item {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 10px;
        align-items: center;
        padding: 12px;
        border-radius: 18px;
        background: rgba(2, 6, 23, 0.35);
        border: 1px solid rgba(125, 211, 252, 0.12);
      }
      .option-list-item > div {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .option-list-item .danger {
        background: rgba(239, 68, 68, 0.9);
      }
      .empty-option-list {
        color: #94a3b8;
      }
      @media (max-width: 1080px) {
        .advanced-filter-grid {
          grid-template-columns: 1fr 1fr;
        }
        .admin-top-header,
        .list-toolbar {
          align-items: flex-start !important;
          flex-direction: column !important;
        }
      }
      @media (max-width: 900px) {
        .admin-login-card {
          grid-template-columns: 1fr !important;
        }
      }
      @media (max-width: 760px) {
        .advanced-filter-heading {
          flex-direction: column;
        }
        .advanced-filter-heading button {
          width: 100%;
        }
        .advanced-filter-grid {
          grid-template-columns: 1fr;
        }
        .admin-form-grid {
          grid-template-columns: 1fr !important;
        }
        .option-add-box,
        .option-list-item {
          grid-template-columns: 1fr !important;
        }
      }
    `}</style>
  );
}
