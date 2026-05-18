"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";
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
  Building2,
  Edit3,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MessageCircle,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { auth } from "@/lib/firebase";
import {
  getLeadContacts,
  getLeadOptions,
  getLeads,
  removeLead,
  removeLeadContact,
  saveLead,
  saveLeadContact,
  saveLeadOptions,
} from "@/lib/leadsFirestore";
import {
  defaultLeadOptions,
  emptyLead,
  emptyLeadContact,
  Lead,
  LeadContact,
  LeadOptionCategory,
  LeadOptionItem,
  leadOptionCategoryLabels,
} from "@/lib/leadsTypes";
import AdminMenu from "../../../components/admin/AdminMenu.tsx";

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
    width: "min(1500px, calc(100% - 40px))",
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
  headerLogo: { width: "auto", height: 72, objectFit: "contain" },
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
  },
  cardTitle: { margin: "0 0 6px", fontSize: 26, letterSpacing: "-0.04em" },
  cardSub: { margin: "0 0 22px", color: colors.soft, lineHeight: 1.55 },
  input: {
    width: "100%",
    border: `1px solid ${colors.border}`,
    background: "rgba(2,6,23,0.45)",
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
    background: "rgba(2,6,23,0.45)",
    color: colors.text,
    outline: "none",
    borderRadius: 16,
    padding: "13px 14px",
  },
  select: {
    width: "100%",
    border: `1px solid ${colors.border}`,
    background: "rgba(2,6,23,0.9)",
    color: colors.text,
    outline: "none",
    borderRadius: 16,
    padding: "13px 14px",
  },
  label: { color: "#dbeafe", fontSize: 13, fontWeight: 900 },
  field: { display: "grid", gap: 8 },
  optionRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 8,
    alignItems: "center",
  },
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
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 90,
    background: "rgba(2,6,23,0.78)",
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
    width: "min(820px, 100%)",
    maxHeight: "90vh",
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
  actions: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 },
};

function formatDate(value?: string) {
  if (!value) return "-";
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function createWhatsAppLink(phone?: string, message?: string) {
  const cleanPhone = String(phone || "").replace(/\D/g, "");
  if (!cleanPhone) return "";
  const phoneWithCountry = cleanPhone.startsWith("55")
    ? cleanPhone
    : `55${cleanPhone}`;
  return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message || "")}`;
}

function optionLabel(options: LeadOptionItem[], value?: string) {
  if (!value) return "-";
  return options.find((item) => item.value === value)?.label || value;
}

function makeOptionFromText(text: string): LeadOptionItem {
  const clean = text.trim();
  return { value: clean, label: clean };
}

function applyTemplate(text: string, lead: Lead) {
  return (text || "")
    .replaceAll("{empresa}", lead.companyName || "sua empresa")
    .replaceAll("{site}", lead.website || "site da empresa")
    .replaceAll("{nicho}", lead.niche || "segmento da empresa");
}

function getSuggestedMessage(
  lead: Lead,
  options: Record<LeadOptionCategory, LeadOptionItem[]>,
) {
  const selected = options.siteStatuses.find(
    (item) => item.value === lead.siteStatus,
  );
  return applyTemplate(selected?.messageText || "", lead);
}

async function fileToDataUrl(file?: File | null) {
  if (!file) return "";
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const salesStatusOptions: LeadOptionItem[] = [
  { value: "nenhum", label: "Nenhum" },
  { value: "interessado", label: "Interessado" },
  { value: "sem_interesse", label: "Sem interesse" },
  { value: "cliente", label: "Cliente" },
];

const salesStatusTabs = salesStatusOptions;

function getLeadStatusValue(status?: string) {
  const clean = String(status || "").trim();

  if (["interessado"].includes(clean)) return "interessado";
  if (
    ["sem_interesse", "sem interesse", "perdido", "sem_interesse_"].includes(
      clean,
    )
  )
    return "sem_interesse";
  if (["cliente", "fechado", "finalizado"].includes(clean)) return "cliente";

  return "nenhum";
}

function getLeadStatusLabel(status?: string) {
  const value = getLeadStatusValue(status);
  return (
    salesStatusOptions.find((item) => item.value === value)?.label || "Nenhum"
  );
}

export default function AdminLeadsPage() {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [lead, setLead] = useState<Lead>(emptyLead);
  const [modalOpen, setModalOpen] = useState(false);
  const [savingLead, setSavingLead] = useState(false);

  const [contacts, setContacts] = useState<LeadContact[]>([]);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contact, setContact] = useState<LeadContact>(emptyLeadContact);

  const [options, setOptions] =
    useState<Record<LeadOptionCategory, LeadOptionItem[]>>(defaultLeadOptions);
  const [optionModalOpen, setOptionModalOpen] = useState(false);
  const [activeOptionCategory, setActiveOptionCategory] =
    useState<LeadOptionCategory>("niches");
  const [newOptionValue, setNewOptionValue] = useState("");
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(
    null,
  );
  const [editingOptionValue, setEditingOptionValue] = useState("");
  const [editingOptionMessage, setEditingOptionMessage] = useState("");
  const [editingOptionImage, setEditingOptionImage] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("nenhum");
  const [siteFilter, setSiteFilter] = useState("todos");
  const [nicheFilter, setNicheFilter] = useState("todos");
  const [message, setMessage] = useState("");

  const isAllowed = useMemo(() => {
    if (!user?.email || !adminEmail) return false;
    return user.email.toLowerCase() === adminEmail.toLowerCase();
  }, [user, adminEmail]);

  const filteredLeads = useMemo(() => {
    const term = normalizeText(search.trim());
    return leads.filter((item) => {
      const leadStatus = getLeadStatusValue(item.status);
      const matchesStatus = leadStatus === statusFilter;
      const matchesSite =
        siteFilter === "todos" || item.siteStatus === siteFilter;
      const matchesNiche =
        nicheFilter === "todos" || item.niche === nicheFilter;
      const text = normalizeText(
        [
          item.companyName,
          item.contactName,
          item.phone,
          item.whatsapp,
          item.email,
          item.niche,
          item.website,
          item.linkedin,
          item.facebook,
          item.instagram,
          item.observation,
        ].join(" "),
      );
      return (
        matchesStatus &&
        matchesSite &&
        matchesNiche &&
        (!term || text.includes(term))
      );
    });
  }, [leads, search, statusFilter, siteFilter, nicheFilter]);

  async function loadData() {
    const [leadList, optionList] = await Promise.all([
      getLeads(),
      getLeadOptions(),
    ]);
    setLeads(leadList);
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
    if (!loginEmail.trim() || !loginPassword.trim())
      return setMessage("Informe o e-mail e a senha.");
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

  function updateField<K extends keyof Lead>(field: K, value: Lead[K]) {
    setLead((prev) => ({ ...prev, [field]: value }));
  }

  function openNewLead() {
    setLead({
      ...emptyLead,
      niche: options.niches[0]?.value || "Outro",
      status: "nenhum",
      siteStatus: options.siteStatuses[0]?.value || "nao_sei",
    });
    setModalOpen(true);
    setMessage("");
  }

  function openEditLead(item: Lead) {
    setLead({
      ...emptyLead,
      ...item,
      contactHistory: Array.isArray(item.contactHistory)
        ? item.contactHistory
        : [],
    });
    setModalOpen(true);
    setMessage("");
  }

  function closeModal() {
    if (savingLead) return;
    setLead(emptyLead);
    setModalOpen(false);
  }

  async function handleSave() {
    if (!lead.companyName.trim())
      return setMessage("Informe o nome da empresa.");
    try {
      setSavingLead(true);
      await saveLead({ ...lead, status: getLeadStatusValue(lead.status) });
      await loadData();
      setLead(emptyLead);
      setModalOpen(false);
      setMessage("Lead salvo com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao salvar lead.");
    } finally {
      setSavingLead(false);
    }
  }

  async function updateLeadStatus(item: Lead, status: string) {
    if (!item.id) return;

    const normalizedStatus = getLeadStatusValue(status);
    const updatedLead = { ...item, status: normalizedStatus };

    try {
      setLeads((prev) =>
        prev.map((leadItem) =>
          leadItem.id === item.id ? updatedLead : leadItem,
        ),
      );
      await saveLead(updatedLead);
      setMessage(`Lead movido para ${getLeadStatusLabel(normalizedStatus)}.`);
    } catch (error) {
      console.error(error);
      await loadData();
      setMessage("Erro ao alterar status do lead.");
    }
  }

  async function handleDelete(id?: string) {
    if (!id || !window.confirm("Deseja realmente excluir este lead?")) return;
    try {
      await removeLead(id);
      await loadData();
      setMessage("Lead excluído com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao excluir lead.");
    }
  }

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text);
    setMessage("Mensagem copiada com sucesso.");
  }

  function openOptionModal(category: LeadOptionCategory) {
    setActiveOptionCategory(category);
    setNewOptionValue("");
    setEditingOptionIndex(null);
    setEditingOptionValue("");
    setEditingOptionMessage("");
    setEditingOptionImage("");
    setOptionModalOpen(true);
  }

  async function persistOptions(
    category: LeadOptionCategory,
    values: LeadOptionItem[],
  ) {
    const sorted = values
      .filter((item) => item.value.trim() && item.label.trim())
      .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
    await saveLeadOptions(category, sorted);
    setOptions((prev) => ({ ...prev, [category]: sorted }));
  }

  async function handleAddOption() {
    const clean = newOptionValue.trim();
    if (!clean) return;
    const current = options[activeOptionCategory] || [];
    const newOption = makeOptionFromText(clean);
    const exists = current.some(
      (item) => normalizeText(item.value) === normalizeText(newOption.value),
    );
    if (exists) return setMessage("Essa opção já existe.");
    await persistOptions(activeOptionCategory, [...current, newOption]);
    setNewOptionValue("");
    setMessage("Opção adicionada com sucesso.");
  }

  async function confirmEditOption() {
    if (editingOptionIndex === null) return;
    const clean = editingOptionValue.trim();
    if (!clean) return;
    const current = [...(options[activeOptionCategory] || [])];
    const oldValue = current[editingOptionIndex]?.value;
    current[editingOptionIndex] = {
      value: clean,
      label: clean,
      messageText:
        activeOptionCategory === "siteStatuses"
          ? editingOptionMessage
          : current[editingOptionIndex]?.messageText,
      messageImage:
        activeOptionCategory === "siteStatuses"
          ? editingOptionImage
          : current[editingOptionIndex]?.messageImage,
    };
    await persistOptions(activeOptionCategory, current);
    if (
      oldValue &&
      activeOptionCategory === "niches" &&
      lead.niche === oldValue
    )
      updateField("niche", clean);
    if (
      oldValue &&
      activeOptionCategory === "statuses" &&
      lead.status === oldValue
    )
      updateField("status", clean);
    if (
      oldValue &&
      activeOptionCategory === "siteStatuses" &&
      lead.siteStatus === oldValue
    )
      updateField("siteStatus", clean);
    setEditingOptionIndex(null);
    setMessage("Opção editada com sucesso.");
  }

  async function deleteOption(index: number) {
    const item = options[activeOptionCategory][index];
    if (!item || !window.confirm(`Deseja excluir "${item.label}"?`)) return;
    const current = options[activeOptionCategory].filter(
      (_, itemIndex) => itemIndex !== index,
    );
    if (!current.length)
      return setMessage("Mantenha pelo menos uma opção cadastrada.");
    await persistOptions(activeOptionCategory, current);
    setMessage("Opção excluída com sucesso.");
  }

  async function openContactModal(item: Lead) {
    if (!item.id) return setMessage("Salve o lead antes de cadastrar contato.");
    setLead(item);
    setContacts(await getLeadContacts(item.id));
    setContact({
      ...emptyLeadContact,
      leadId: item.id,
      companyName: item.companyName,
      contactDate: new Date().toISOString().slice(0, 10),
    });
    setContactModalOpen(true);
  }

  async function saveContact() {
    if (!contact.leadId) return;
    if (!contact.contactDate || !contact.observation.trim())
      return setMessage("Informe a data e a observação do contato.");
    await saveLeadContact(contact);
    setContacts(await getLeadContacts(contact.leadId));
    setContact({
      ...emptyLeadContact,
      leadId: contact.leadId,
      companyName: contact.companyName,
      contactDate: new Date().toISOString().slice(0, 10),
    });
    setMessage("Contato salvo com sucesso.");
  }

  async function deleteContact(id?: string) {
    if (!id || !contact.leadId || !window.confirm("Excluir este contato?"))
      return;
    await removeLeadContact(id);
    setContacts(await getLeadContacts(contact.leadId));
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
        <AdminLeadsGlobalStyle />
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
                  Acesse para gerenciar leads, contatos e mensagens por
                  situação.
                </p>
              </div>
              <div style={{ display: "grid", gap: 12, marginTop: 34 }}>
                <span className="admin-badge">
                  <Sparkles size={15} /> Gestão comercial
                </span>
                <span className="admin-badge">
                  <Building2 size={15} /> Leads de empresas
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
                  <div className="password-wrap">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                      placeholder="Digite sua senha"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
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
                      <Loader2 className="spin" size={18} /> Entrando...
                    </>
                  ) : (
                    <>
                      Entrar <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
        <AdminLeadsGlobalStyle />
      </main>
    );
  }

  if (!isAllowed) {
    return (
      <main style={styles.page}>
        <div style={styles.loginWrap}>
          <section style={{ ...styles.card, width: "min(560px, 100%)" }}>
            <h1 style={styles.cardTitle}>Acesso não autorizado</h1>
            <p style={styles.cardSub}>
              Você entrou com <strong>{user.email}</strong>, mas o e-mail
              permitido é definido em <strong>NEXT_PUBLIC_ADMIN_EMAIL</strong>.
            </p>
            <button style={styles.secondaryButton} onClick={logout}>
              <LogOut size={17} /> Sair
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
                Gerencie leads por status, contatos separados e mensagens por
                situação.
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
              <ArrowLeft size={17} /> Ver site
            </a>
            <button style={styles.secondaryButton} onClick={logout}>
              <LogOut size={17} /> Sair
            </button>
          </div>
        </header>

        <AdminMenu />
        {message && <div style={styles.notice}>{message}</div>}

        <section style={styles.card}>
          <div className="list-toolbar">
            <div>
              <h2 style={styles.cardTitle}>Leads cadastrados</h2>
              <p style={styles.cardSub}>
                {leads.length} empresa(s) cadastrada(s) para prospecção.
              </p>
            </div>
            <button style={styles.button} onClick={openNewLead}>
              <Plus size={18} /> Novo lead
            </button>
          </div>

          <div
            className="status-tabs"
            role="tablist"
            aria-label="Status da venda"
          >
            {salesStatusTabs.map((item) => (
              <button
                key={item.value}
                type="button"
                className={statusFilter === item.value ? "active" : ""}
                onClick={() => setStatusFilter(item.value)}
              >
                <span>{item.label}</span>
                <strong>
                  {
                    leads.filter(
                      (leadItem) =>
                        getLeadStatusValue(leadItem.status) === item.value,
                    ).length
                  }
                </strong>
              </button>
            ))}
          </div>

          <div className="filters-grid">
            <label style={styles.field}>
              <span style={styles.label}>Buscar lead</span>
              <div className="search-box">
                <Search size={18} color={colors.soft} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Empresa, nicho, site, observação..."
                />
              </div>
            </label>
            <FilterSelect
              label="Nicho"
              value={nicheFilter}
              setValue={setNicheFilter}
              items={options.niches}
              onAdd={() => openOptionModal("niches")}
            />
            <FilterSelect
              label="Situação do site"
              value={siteFilter}
              setValue={setSiteFilter}
              items={options.siteStatuses}
              onAdd={() => openOptionModal("siteStatuses")}
            />
          </div>

          <div className="kpi-grid">
            <div>
              <strong>
                {
                  leads.filter(
                    (item) => getLeadStatusValue(item.status) === "nenhum",
                  ).length
                }
              </strong>
              <span>Nenhum</span>
            </div>
            <div>
              <strong>
                {
                  leads.filter(
                    (item) => getLeadStatusValue(item.status) === "interessado",
                  ).length
                }
              </strong>
              <span>Interessados</span>
            </div>
            <div>
              <strong>
                {
                  leads.filter(
                    (item) =>
                      getLeadStatusValue(item.status) === "sem_interesse",
                  ).length
                }
              </strong>
              <span>Sem interesse</span>
            </div>
            <div>
              <strong>
                {
                  leads.filter(
                    (item) => getLeadStatusValue(item.status) === "cliente",
                  ).length
                }
              </strong>
              <span>Clientes</span>
            </div>
          </div>

          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Empresa / Pessoa</th>
                  <th>Contato</th>
                  <th>Nicho</th>
                  <th>Site</th>
                  <th>Status</th>
                  <th>Observação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((item) => {
                  const suggested = getSuggestedMessage(item, options);
                  return (
                    <tr key={item.id || item.companyName}>
                      <td>
                        <button
                          type="button"
                          className="table-link-button"
                          onClick={() => openEditLead(item)}
                        >
                          <strong>{item.companyName || "-"}</strong>
                        </button>
                        {item.website && (
                          <a
                            href={item.website}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Globe size={13} /> Abrir site
                          </a>
                        )}
                      </td>
                      <td>
                        <strong>{item.contactName || "-"}</strong>
                        {item.phone && <span>{item.phone}</span>}
                        {item.email && (
                          <a href={`mailto:${item.email}`}>
                            <Mail size={13} /> {item.email}
                          </a>
                        )}
                      </td>
                      <td>{optionLabel(options.niches, item.niche)}</td>
                      <td>
                        <span
                          className={`status-badge site-${item.siteStatus}`}
                        >
                          {optionLabel(options.siteStatuses, item.siteStatus)}
                        </span>
                      </td>
                      <td>
                        <select
                          className={`status-select-inline lead-${getLeadStatusValue(item.status)}`}
                          value={getLeadStatusValue(item.status)}
                          onChange={(event) =>
                            updateLeadStatus(item, event.target.value)
                          }
                        >
                          {salesStatusOptions.map((statusItem) => (
                            <option
                              key={statusItem.value}
                              value={statusItem.value}
                            >
                              {statusItem.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="text-cell">
                        <div className="clamped-text">
                          {item.observation || "-"}
                        </div>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="small-action"
                            onClick={() => openEditLead(item)}
                          >
                            <Edit3 size={15} /> Editar
                          </button>
                          <button
                            type="button"
                            className="small-action"
                            onClick={() => openContactModal(item)}
                          >
                            <UserRound size={15} /> Contato
                          </button>
                          <a
                            className="small-action whatsapp"
                            href={createWhatsAppLink(
                              item.whatsapp || item.phone,
                              suggested,
                            )}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(event) => {
                              if (!item.whatsapp && !item.phone) {
                                event.preventDefault();
                                setMessage(
                                  "Cadastre um telefone ou WhatsApp para enviar mensagem.",
                                );
                              }
                            }}
                          >
                            <MessageCircle size={15} /> WhatsApp
                          </a>

                          <button
                            type="button"
                            className="small-action danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 size={15} /> Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!filteredLeads.length && (
                  <tr>
                    <td colSpan={7}>Nenhum lead encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {modalOpen && (
        <LeadModal
          lead={lead}
          options={options}
          savingLead={savingLead}
          updateField={updateField}
          closeModal={closeModal}
          handleSave={handleSave}
          handleDelete={handleDelete}
          openOptionModal={openOptionModal}
          copyText={copyText}
        />
      )}
      {contactModalOpen && (
        <ContactModal
          lead={lead}
          contact={contact}
          contacts={contacts}
          setContact={setContact}
          close={() => setContactModalOpen(false)}
          saveContact={saveContact}
          deleteContact={deleteContact}
        />
      )}
      {optionModalOpen && (
        <OptionModal
          activeOptionCategory={activeOptionCategory}
          options={options}
          setOptionModalOpen={setOptionModalOpen}
          newOptionValue={newOptionValue}
          setNewOptionValue={setNewOptionValue}
          handleAddOption={handleAddOption}
          editingOptionIndex={editingOptionIndex}
          setEditingOptionIndex={setEditingOptionIndex}
          editingOptionValue={editingOptionValue}
          setEditingOptionValue={setEditingOptionValue}
          editingOptionMessage={editingOptionMessage}
          setEditingOptionMessage={setEditingOptionMessage}
          editingOptionImage={editingOptionImage}
          setEditingOptionImage={setEditingOptionImage}
          confirmEditOption={confirmEditOption}
          deleteOption={deleteOption}
        />
      )}
      <AdminLeadsGlobalStyle />
    </main>
  );
}

function FilterSelect({
  label,
  value,
  setValue,
  items,
  onAdd,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  items: LeadOptionItem[];
  onAdd: () => void;
}) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      <div style={styles.optionRow}>
        <select
          value={value}
          onChange={(event) => setValue(event.target.value)}
          style={styles.select}
        >
          <option value="todos">Todos</option>
          {items.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <button style={styles.button} type="button" onClick={onAdd}>
          <Plus size={16} />
        </button>
      </div>
    </label>
  );
}

function LeadModal({
  lead,
  options,
  savingLead,
  updateField,
  closeModal,
  handleSave,
  handleDelete,
  openOptionModal,
}: {
  lead: Lead;
  options: Record<LeadOptionCategory, LeadOptionItem[]>;
  savingLead: boolean;
  updateField: <K extends keyof Lead>(field: K, value: Lead[K]) => void;
  closeModal: () => void;
  handleSave: () => void;
  handleDelete: (id?: string) => void;
  openOptionModal: (category: LeadOptionCategory) => void;
  copyText: (text: string) => void;
}) {
  return (
    <div style={styles.modalBackdrop}>
      <section style={styles.modal}>
        <header style={styles.modalHeader}>
          <div>
            <h2 style={styles.cardTitle}>
              {lead.id ? "Editar lead" : "Novo lead"}
            </h2>
            <p style={styles.cardSub}>
              Cadastre somente os dados da empresa ou pessoa. O histórico de
              contatos e as vendas ficam nos botões de ações.
            </p>
          </div>
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={closeModal}
          >
            <X size={18} /> Fechar
          </button>
        </header>

        <div style={styles.formGrid} className="admin-form-grid">
          <Field
            label="Nome da empresa ou pessoa *"
            value={lead.companyName}
            onChange={(v) => updateField("companyName", v)}
            placeholder="Ex: Clínica Vida ou Maria Silva"
          />
          <Field
            label="Nome do responsável"
            value={lead.contactName}
            onChange={(v) => updateField("contactName", v)}
            placeholder="Ex: Ana Paula"
          />
          <Field
            label="Telefone"
            value={lead.phone}
            onChange={(v) => updateField("phone", v)}
            placeholder="(21) 99999-9999"
          />
          <Field
            label="WhatsApp"
            value={lead.whatsapp}
            onChange={(v) => updateField("whatsapp", v)}
            placeholder="(21) 99999-9999"
          />
          <Field
            label="E-mail"
            value={lead.email}
            onChange={(v) => updateField("email", v)}
            placeholder="contato@empresa.com.br"
          />

          <label style={styles.field}>
            <span style={styles.label}>Nicho</span>
            <div style={styles.optionRow}>
              <select
                value={lead.niche}
                onChange={(event) => updateField("niche", event.target.value)}
                style={styles.select}
              >
                {options.niches.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <button
                style={styles.button}
                type="button"
                onClick={() => openOptionModal("niches")}
              >
                <Plus size={16} />
              </button>
            </div>
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Status da venda</span>
            <select
              value={getLeadStatusValue(lead.status)}
              onChange={(event) => updateField("status", event.target.value)}
              style={styles.select}
            >
              {salesStatusOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Situação do site</span>
            <div style={styles.optionRow}>
              <select
                value={lead.siteStatus}
                onChange={(event) =>
                  updateField("siteStatus", event.target.value)
                }
                style={styles.select}
              >
                {options.siteStatuses.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <button
                style={styles.button}
                type="button"
                onClick={() => openOptionModal("siteStatuses")}
              >
                <Plus size={16} />
              </button>
            </div>
          </label>

          <Field
            label="Site atual"
            value={lead.website}
            onChange={(v) => updateField("website", v)}
            placeholder="https://..."
          />
          <Field
            label="LinkedIn"
            value={lead.linkedin}
            onChange={(v) => updateField("linkedin", v)}
            placeholder="https://linkedin.com/..."
          />
          <Field
            label="Facebook"
            value={lead.facebook}
            onChange={(v) => updateField("facebook", v)}
            placeholder="https://facebook.com/..."
          />
          <Field
            label="Instagram"
            value={lead.instagram}
            onChange={(v) => updateField("instagram", v)}
            placeholder="https://instagram.com/..."
          />

          <label style={{ ...styles.field, gridColumn: "1 / -1" }}>
            <span style={styles.label}>Observação geral</span>
            <textarea
              value={lead.observation}
              onChange={(event) =>
                updateField("observation", event.target.value)
              }
              placeholder="Ex: empresa sem site, Instagram ativo, melhor horário para chamar..."
              style={styles.textarea}
            />
          </label>
        </div>

        <div style={styles.actions}>
          <button
            style={styles.button}
            onClick={handleSave}
            disabled={savingLead}
          >
            {savingLead ? (
              <>
                <Loader2 className="spin" size={16} /> Salvando...
              </>
            ) : (
              <>
                <Save size={16} /> Salvar lead
              </>
            )}
          </button>
          <button style={styles.secondaryButton} onClick={closeModal}>
            Cancelar
          </button>
          {lead.id && (
            <button
              style={styles.dangerButton}
              onClick={() => handleDelete(lead.id)}
            >
              <Trash2 size={16} /> Excluir lead
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

function ContactModal({
  lead,
  contact,
  contacts,
  setContact,
  close,
  saveContact,
  deleteContact,
}: {
  lead: Lead;
  contact: LeadContact;
  contacts: LeadContact[];
  setContact: React.Dispatch<React.SetStateAction<LeadContact>>;
  close: () => void;
  saveContact: () => void;
  deleteContact: (id?: string) => void;
}) {
  return (
    <div style={styles.modalBackdrop}>
      <section style={styles.smallModal}>
        <header style={styles.modalHeader}>
          <div>
            <h2 style={styles.cardTitle}>Contatos realizados</h2>
            <p style={styles.cardSub}>{lead.companyName}</p>
          </div>
          <button type="button" style={styles.secondaryButton} onClick={close}>
            <X size={18} /> Fechar
          </button>
        </header>

        <div style={styles.formGrid} className="admin-form-grid">
          <Field
            type="date"
            label="Data do contato"
            value={contact.contactDate}
            onChange={(v) => setContact((p) => ({ ...p, contactDate: v }))}
          />
          <label style={{ ...styles.field, gridColumn: "1 / -1" }}>
            <span style={styles.label}>Observação do contato</span>
            <textarea
              style={styles.textarea}
              value={contact.observation}
              onChange={(event) =>
                setContact((p) => ({ ...p, observation: event.target.value }))
              }
              placeholder="Ex: Enviei apresentação pelo WhatsApp, pediu orçamento, pediu retorno na próxima semana..."
            />
          </label>
        </div>

        <div style={styles.actions}>
          <button style={styles.button} onClick={saveContact}>
            <Save size={16} /> Salvar contato
          </button>
        </div>

        <div className="mini-list">
          {contacts.map((item) => (
            <div key={item.id} className="mini-card">
              <strong>{formatDate(item.contactDate)}</strong>
              <p>{item.observation || "-"}</p>
              <div>
                <button onClick={() => setContact(item)}>Editar</button>
                <button
                  className="danger"
                  onClick={() => deleteContact(item.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
          {!contacts.length && (
            <p className="empty-option-list">Nenhum contato cadastrado.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function OptionModal(props: {
  activeOptionCategory: LeadOptionCategory;
  options: Record<LeadOptionCategory, LeadOptionItem[]>;
  setOptionModalOpen: (value: boolean) => void;
  newOptionValue: string;
  setNewOptionValue: (value: string) => void;
  handleAddOption: () => void;
  editingOptionIndex: number | null;
  setEditingOptionIndex: (value: number | null) => void;
  editingOptionValue: string;
  setEditingOptionValue: (value: string) => void;
  editingOptionMessage: string;
  setEditingOptionMessage: (value: string) => void;
  editingOptionImage: string;
  setEditingOptionImage: (value: string) => void;
  confirmEditOption: () => void;
  deleteOption: (index: number) => void;
}) {
  const p = props;
  const isSite = p.activeOptionCategory === "siteStatuses";
  return (
    <div style={styles.modalBackdrop}>
      <section style={styles.smallModal}>
        <header style={styles.modalHeader}>
          <div>
            <h2 style={styles.cardTitle}>
              {leadOptionCategoryLabels[p.activeOptionCategory]}
            </h2>
            <p style={styles.cardSub}>
              {isSite
                ? "Aqui você edita a situação do site, o texto profissional e a imagem/anexo da mensagem."
                : "Cadastre, edite ou exclua as opções exibidas neste select."}
            </p>
          </div>
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={() => p.setOptionModalOpen(false)}
          >
            <X size={18} /> Fechar
          </button>
        </header>
        <div className="option-add-box">
          <input
            value={p.newOptionValue}
            onChange={(event) => p.setNewOptionValue(event.target.value)}
            placeholder="Nova opção"
          />
          <button type="button" onClick={p.handleAddOption}>
            <Plus size={16} /> Adicionar
          </button>
        </div>
        <div className="option-list-box">
          {(p.options[p.activeOptionCategory] || []).map((item, index) => (
            <div className="option-list-item" key={`${item.value}-${index}`}>
              {p.editingOptionIndex === index ? (
                <div className="edit-option-form">
                  <input
                    value={p.editingOptionValue}
                    onChange={(event) =>
                      p.setEditingOptionValue(event.target.value)
                    }
                  />
                  {isSite && (
                    <>
                      <textarea
                        value={p.editingOptionMessage}
                        onChange={(event) =>
                          p.setEditingOptionMessage(event.target.value)
                        }
                        placeholder="Texto da mensagem. Use {empresa}, {site} e {nicho}."
                      />
                      <input
                        value={p.editingOptionImage}
                        onChange={(event) =>
                          p.setEditingOptionImage(event.target.value)
                        }
                        placeholder="URL/base64 da imagem da mensagem"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;

                          const image = await fileToDataUrl(file);

                          p.setEditingOptionImage(image);
                        }}
                      />
                    </>
                  )}
                </div>
              ) : (
                <strong>{item.label}</strong>
              )}
              <div>
                {p.editingOptionIndex === index ? (
                  <button type="button" onClick={p.confirmEditOption}>
                    <Save size={15} /> Salvar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      p.setEditingOptionIndex(index);
                      p.setEditingOptionValue(item.label);
                      p.setEditingOptionMessage(item.messageText || "");
                      p.setEditingOptionImage(item.messageImage || "");
                    }}
                  >
                    <Edit3 size={15} /> Editar
                  </button>
                )}
                <button
                  type="button"
                  className="danger"
                  onClick={() => p.deleteOption(index)}
                >
                  <Trash2 size={15} /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={styles.input}
      />
    </label>
  );
}

function AdminLeadsGlobalStyle() {
  return (
    <style jsx global>{`
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
      .password-wrap {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        border: 1px solid rgba(125, 211, 252, 0.18);
        background: rgba(2, 6, 23, 0.45);
        border-radius: 16px;
        overflow: hidden;
      }
      .password-wrap input {
        border: 0;
        background: transparent;
        color: #f8fafc;
        outline: none;
        padding: 13px 14px;
        width: 100%;
      }
      .password-wrap button {
        border: 0;
        background: transparent;
        color: #94a3b8;
        cursor: pointer;
        padding: 0 14px;
        height: 100%;
        display: grid;
        place-items: center;
      }
      .list-toolbar,
      .history-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 18px;
      }
      .filters-grid {
        display: grid;
        grid-template-columns: 1fr 250px 290px;
        gap: 14px;
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
      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-bottom: 18px;
      }
      .kpi-grid > div {
        border-radius: 20px;
        padding: 18px;
        background: rgba(2, 6, 23, 0.35);
        border: 1px solid rgba(125, 211, 252, 0.14);
      }
      .kpi-grid strong {
        display: block;
        font-size: 28px;
        color: #f8fafc;
        line-height: 1;
      }
      .kpi-grid span {
        display: block;
        margin-top: 8px;
        color: #94a3b8;
        font-size: 13px;
        font-weight: 900;
      }
      .table-wrap {
        overflow: auto;
        border-radius: 22px;
        border: 1px solid rgba(125, 211, 252, 0.16);
      }
      .admin-table {
        width: 100%;
        min-width: 1240px;
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
      .admin-table td strong {
        color: #f8fafc;
      }
      .admin-table td a {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        color: #7dd3fc;
        margin-top: 6px;
        font-size: 13px;
      }
      .table-link-button {
        border: 0;
        background: transparent;
        padding: 0;
        color: inherit;
        cursor: pointer;
        text-align: left;
      }
      .table-link-button strong {
        color: #f8fafc;
        text-decoration: underline;
        text-decoration-color: rgba(125, 211, 252, 0.35);
        text-underline-offset: 4px;
      }
      .text-cell {
        max-width: 280px;
        line-height: 1.55;
      }
      .clamped-text {
        color: #cbd5e1;
        line-height: 1.55;
        white-space: pre-wrap;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
      }

      .status-tabs {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 10px;
        margin-bottom: 18px;
      }
      .status-tabs button {
        border: 1px solid rgba(125, 211, 252, 0.16);
        border-radius: 18px;
        padding: 14px;
        background: rgba(2, 6, 23, 0.35);
        color: #cbd5e1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        cursor: pointer;
        font-weight: 900;
      }
      .status-tabs button.active {
        color: #f8fafc;
        border-color: rgba(56, 189, 248, 0.55);
        background: linear-gradient(
          135deg,
          rgba(14, 165, 233, 0.28),
          rgba(56, 189, 248, 0.12)
        );
        box-shadow: 0 18px 38px rgba(14, 165, 233, 0.14);
      }
      .status-tabs strong {
        display: inline-flex;
        min-width: 34px;
        min-height: 34px;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.78);
        color: #e0f2fe;
      }
      .status-select-inline {
        width: 100%;
        max-width: 190px;
        border: 1px solid rgba(125, 211, 252, 0.28);
        outline: none;
        border-radius: 999px;
        padding: 10px 12px;
        font-size: 12px;
        font-weight: 900;
        cursor: pointer;
        background: #0f172a;
        color: #ffffff;
        color-scheme: dark;
      }
      .status-select-inline option {
        background: #0f172a;
        color: #ffffff;
      }

      .status-select-inline.lead-nenhum {
        background: rgba(15, 23, 42, 0.96);
        color: #e0f2fe;
      }
      .status-select-inline.lead-interessado {
        background: rgba(34, 197, 94, 0.22);
        color: #dcfce7;
      }
      .status-select-inline.lead-sem_interesse {
        background: rgba(239, 68, 68, 0.22);
        color: #fee2e2;
      }
      .status-select-inline.lead-cliente {
        background: rgba(14, 165, 233, 0.24);
        color: #e0f2fe;
      }
      .status-badge {
        display: inline-flex;
        width: fit-content;
        padding: 7px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 900;
        border: 1px solid rgba(125, 211, 252, 0.16);
      }
      .lead-novo,
      .site-nao_sei {
        color: #e0f2fe;
        background: rgba(14, 165, 233, 0.13);
      }
      .lead-contatado,
      .site-tem_desatualizado,
      .lead-proposta_enviada {
        color: #fef3c7;
        background: rgba(245, 158, 11, 0.15);
      }
      .lead-respondeu {
        color: #ddd6fe;
        background: rgba(139, 92, 246, 0.15);
      }
      .lead-interessado,
      .site-nao_tem {
        color: #bbf7d0;
        background: rgba(34, 197, 94, 0.14);
      }
      .lead-sem_interesse {
        color: #fecaca;
        background: rgba(239, 68, 68, 0.15);
      }
      .lead-fechado,
      .site-tem_atualizado {
        color: #bae6fd;
        background: rgba(14, 165, 233, 0.2);
      }

      .lead-nenhum {
        color: #e0f2fe;
        background: rgba(14, 165, 233, 0.13);
      }
      .lead-interessado {
        color: #bbf7d0;
        background: rgba(34, 197, 94, 0.14);
      }
      .lead-sem_interesse {
        color: #fecaca;
        background: rgba(239, 68, 68, 0.15);
      }
      .lead-cliente {
        color: #bae6fd;
        background: rgba(14, 165, 233, 0.2);
      }
      .client-sale-banner {
        display: grid;
        gap: 4px;
        margin-bottom: 18px;
        border-radius: 18px;
        padding: 14px 16px;
        background: rgba(14, 165, 233, 0.12);
        border: 1px solid rgba(125, 211, 252, 0.18);
      }
      .client-sale-banner span {
        color: #94a3b8;
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
      }
      .client-sale-banner strong {
        color: #f8fafc;
        font-size: 20px;
      }
      .row-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .small-action {
        border: 0;
        border-radius: 12px;
        padding: 10px 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        color: #e0f2fe;
        background: rgba(14, 165, 233, 0.16);
        cursor: pointer;
        font-weight: 900;
      }
      .small-action.whatsapp {
        color: #dcfce7;
        background: rgba(34, 197, 94, 0.13);
      }
      .small-action.sale {
        color: #dcfce7;
        background: rgba(34, 197, 94, 0.16);
      }
      .small-action.danger {
        color: #fff;
        background: rgba(239, 68, 68, 0.82);
      }
      .message-box {
        border-radius: 24px;
        padding: 20px;
        background: rgba(2, 6, 23, 0.35);
        border: 1px solid rgba(125, 211, 252, 0.14);
      }
      .message-box h3 {
        margin: 0 0 6px;
        color: #f8fafc;
        font-size: 20px;
      }
      .message-box p {
        margin: 0 0 14px;
        color: #94a3b8;
        line-height: 1.55;
      }
      .message-box textarea {
        width: 100%;
        min-height: 220px;
        resize: vertical;
        border: 1px solid rgba(125, 211, 252, 0.18);
        background: rgba(2, 6, 23, 0.45);
        color: #f8fafc;
        outline: none;
        border-radius: 16px;
        padding: 13px 14px;
        line-height: 1.55;
      }
      .message-preview-image {
        max-width: 100%;
        border-radius: 18px;
        margin: 0 0 12px;
        border: 1px solid rgba(125, 211, 252, 0.18);
      }
      .message-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 12px;
      }
      .option-add-box {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 10px;
        margin-bottom: 18px;
      }
      .option-add-box input,
      .option-list-item input,
      .option-list-item textarea {
        width: 100%;
        border: 1px solid rgba(125, 211, 252, 0.18);
        background: rgba(2, 6, 23, 0.45);
        color: #f8fafc;
        outline: none;
        border-radius: 16px;
        padding: 13px 14px;
      }
      .option-list-item textarea {
        min-height: 170px;
        resize: vertical;
      }
      .option-add-box button,
      .option-list-item button,
      .mini-card button,
      .sale-card button {
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
      .option-list-box,
      .mini-list,
      .sales-grid {
        display: grid;
        gap: 10px;
        margin-top: 18px;
      }
      .option-list-item {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 10px;
        align-items: start;
        padding: 12px;
        border-radius: 18px;
        background: rgba(2, 6, 23, 0.35);
        border: 1px solid rgba(125, 211, 252, 0.12);
      }
      .option-list-item > div:not(.edit-option-form),
      .mini-card > div,
      .sale-card > div {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .edit-option-form {
        display: grid;
        gap: 10px;
      }
      .danger {
        background: rgba(239, 68, 68, 0.9) !important;
      }
      .empty-option-list {
        color: #94a3b8;
      }
      .check-field {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #dbeafe;
        font-size: 13px;
        font-weight: 900;
      }
      .mini-card,
      .sale-card {
        display: grid;
        gap: 8px;
        padding: 14px;
        border-radius: 18px;
        background: rgba(2, 6, 23, 0.35);
        border: 1px solid rgba(125, 211, 252, 0.12);
        color: #cbd5e1;
      }
      .mini-card strong,
      .sale-card strong {
        color: #f8fafc;
      }
      .mini-card a,
      .sale-card a {
        color: #7dd3fc;
        display: inline-flex;
        align-items: center;
        gap: 5px;
      }
      .sales-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .sale-card img {
        width: 100%;
        max-height: 220px;
        object-fit: cover;
        border-radius: 14px;
      }
      @media (max-width: 1180px) {
        .filters-grid,
        .status-tabs {
          grid-template-columns: 1fr 1fr !important;
        }
      }
      @media (max-width: 1080px) {
        .admin-top-header,
        .list-toolbar {
          align-items: flex-start !important;
          flex-direction: column !important;
        }
        .kpi-grid,
        .sales-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
      }
      @media (max-width: 900px) {
        .admin-login-card {
          grid-template-columns: 1fr !important;
        }
      }
      @media (max-width: 760px) {
        .admin-form-grid,
        .filters-grid,
        .status-tabs,
        .kpi-grid,
        .option-add-box,
        .option-list-item,
        .sales-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `}</style>
  );
}
