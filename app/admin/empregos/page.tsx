"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Edit3,
  FileText,
  Loader2,
  Mail,
  Plus,
  Save,
  Search,
  Send,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import AdminMenu from "../../../components/admin/AdminMenu";
import {
  defaultJobEmailTemplates,
  emptyJobCompany,
  jobStatusLabels,
  jobWorkModeLabels,
  JobCompany,
  JobCompanyStatus,
  JobEmailTemplate,
  JobWorkMode,
} from "@/lib/empregosTypes";
import {
  getJobCompanies,
  getJobEmailLogs,
  saveJobCompany,
  saveJobEmailLog,
  removeJobCompany,
} from "@/lib/empregosFirestore";

const colors = {
  panel: "rgba(15, 23, 42, 0.78)",
  border: "rgba(125, 211, 252, 0.18)",
  borderStrong: "rgba(125, 211, 252, 0.34)",
  text: "#f8fafc",
  muted: "#cbd5e1",
  soft: "#94a3b8",
};

const DEFAULT_EMAIL_SUBJECT = "Currículo - Taís Defante";

const DEFAULT_EMAIL_TEXT = `Olá, equipe {empresa}, tudo bem?

Meu nome é Taís Defante e estou em busca de novas oportunidades nas áreas administrativa, tecnologia, processos, gestão de projetos e operações.

Possuo experiência nas áreas administrativa e financeira, além de atuação com desenvolvimento de sistemas, automações, dashboards e soluções digitais.

Tenho perfil analítico, organizado, proativo e facilidade em aprender novas ferramentas e processos.

Segue meu currículo em anexo para avaliação.

Fico à disposição para conversar e apresentar melhor minha experiência profissional.

Atenciosamente,
Taís Defante
(21) 98835-9825
taisadefante@hotmail.com
LinkedIn: linkedin.com/in/taisadefante/
Portfólio: taisdefante.defan.com.br`;

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 15% 0%, rgba(14,165,233,0.24), transparent 32%), radial-gradient(circle at 90% 8%, rgba(56,189,248,0.12), transparent 30%), linear-gradient(180deg, #020617 0%, #071426 50%, #020617 100%)",
    color: colors.text,
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  shell: {
    width: "100%",
    maxWidth: "100%",
    margin: "0 auto",
    padding: "22px 18px 70px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    padding: 24,
    borderRadius: 30,
    background: "rgba(15, 23, 42, 0.72)",
    border: `1px solid ${colors.border}`,
    boxShadow: "0 24px 80px rgba(0,0,0,0.24)",
    marginBottom: 22,
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: "clamp(28px, 3vw, 44px)",
    letterSpacing: "-0.055em",
  },
  subText: {
    color: colors.muted,
    margin: "8px 0 0",
    lineHeight: 1.55,
  },
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
  cardTitle: {
    margin: "0 0 6px",
    fontSize: 26,
    letterSpacing: "-0.04em",
  },
  cardSub: {
    margin: "0 0 22px",
    color: colors.soft,
    lineHeight: 1.55,
  },
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
  label: {
    color: "#dbeafe",
    fontSize: 13,
    fontWeight: 900,
  },
  field: {
    display: "grid",
    gap: 8,
  },
  notice: {
    borderRadius: 18,
    padding: "14px 16px",
    margin: "0 0 18px",
    color: "#e0f2fe",
    background: "rgba(14,165,233,0.12)",
    border: `1px solid ${colors.borderStrong}`,
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
    width: "min(980px, 100%)",
    maxHeight: "92vh",
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
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(date: string, days: number) {
  const base = date ? new Date(`${date}T00:00:00`) : new Date();
  base.setDate(base.getDate() + days);
  return base.toISOString().slice(0, 10);
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function emailList(company: JobCompany) {
  return (company.emails || [])
    .map((item) => item.email.trim())
    .filter(Boolean);
}

function extractEmailsFromText(text: string) {
  const matches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);

  if (!matches) return [];

  return Array.from(
    new Set(matches.map((email) => email.trim().toLowerCase())),
  );
}

function normalizeUrl(url: string) {
  const value = url.trim();

  if (!value) return "";

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `https://${value}`;
}

function getCompanyNameFromEmail(email: string) {
  const domain = email.split("@")[1] || "";
  const cleanDomain = domain
    .replace(/^www\./, "")
    .split(".")[0]
    .replace(/[-_]/g, " ")
    .trim();

  if (!cleanDomain) return "Empresa";

  return cleanDomain
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getDisplayCompanyName(company: JobCompany) {
  const fromName = company.companyName?.trim();

  if (fromName) return fromName;

  const firstEmail = emailList(company)[0];

  if (firstEmail) return getCompanyNameFromEmail(firstEmail);

  return "empresa";
}

function personalizeEmailText(text: string, company: JobCompany) {
  const companyName = getDisplayCompanyName(company);

  return text
    .replaceAll("{empresa}", companyName)
    .replaceAll("[empresa]", companyName)
    .replaceAll("{{empresa}}", companyName);
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

export default function AdminEmpregosPage() {
  const [companies, setCompanies] = useState<JobCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [companyForm, setCompanyForm] = useState<JobCompany>(emptyJobCompany);
  const [savingCompany, setSavingCompany] = useState(false);

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<JobCompany | null>(
    null,
  );
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState(DEFAULT_EMAIL_SUBJECT);
  const [emailText, setEmailText] = useState(DEFAULT_EMAIL_TEXT);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);
  const [bulkEmailModalOpen, setBulkEmailModalOpen] = useState(false);
  const [bulkSubject, setBulkSubject] = useState(DEFAULT_EMAIL_SUBJECT);
  const [bulkText, setBulkText] = useState(DEFAULT_EMAIL_TEXT);
  const [bulkResumeFile, setBulkResumeFile] = useState<File | null>(null);
  const [bulkSending, setBulkSending] = useState(false);

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importEmailsText, setImportEmailsText] = useState("");
  const [importCompanyPrefix, setImportCompanyPrefix] = useState("Empresa");
  const [importDesiredRole, setImportDesiredRole] = useState("");
  const [importDescription, setImportDescription] = useState("");
  const [importNotes, setImportNotes] = useState("");
  const [importingCompanies, setImportingCompanies] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobCompanyStatus | "todos">(
    "todos",
  );
  const [modeFilter, setModeFilter] = useState<JobWorkMode | "todos">("todos");
  const [sentFilter, setSentFilter] = useState<
    | "todos"
    | "enviado_hoje"
    | "nao_enviado_hoje"
    | "sem_envio"
    | "retorno_pendente"
  >("todos");
  const [cityFilter, setCityFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  async function loadCompanies() {
    setLoading(true);

    try {
      const [companyList] = await Promise.all([
        getJobCompanies(),
        getJobEmailLogs(),
      ]);
      setCompanies(companyList);
    } catch (error) {
      console.error(error);
      setMessage("Erro ao carregar empresas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCompanies();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    modeFilter,
    sentFilter,
    cityFilter,
    roleFilter,
    emailFilter,
  ]);

  const filteredCompanies = useMemo(() => {
    const term = normalizeText(search.trim());
    const cityTerm = normalizeText(cityFilter.trim());
    const roleTerm = normalizeText(roleFilter.trim());
    const emailTerm = normalizeText(emailFilter.trim());
    const todayValue = today();

    return companies
      .filter((company) => {
        const matchesStatus =
          statusFilter === "todos" || company.status === statusFilter;
        const matchesMode =
          modeFilter === "todos" || company.workMode === modeFilter;

        const companyEmails = emailList(company);

        const matchesEmail =
          !emailTerm ||
          normalizeText(companyEmails.join(" ")).includes(emailTerm);

        const matchesCity =
          !cityTerm ||
          normalizeText([company.city, company.state].join(" ")).includes(
            cityTerm,
          );

        const matchesRole =
          !roleTerm || normalizeText(company.desiredRole).includes(roleTerm);

        const matchesSent =
          sentFilter === "todos" ||
          (sentFilter === "enviado_hoje" &&
            company.lastSentDate === todayValue) ||
          (sentFilter === "nao_enviado_hoje" &&
            company.lastSentDate !== todayValue) ||
          (sentFilter === "sem_envio" && !company.lastSentDate) ||
          (sentFilter === "retorno_pendente" &&
            Boolean(company.nextFollowUpDate) &&
            company.nextFollowUpDate <= todayValue &&
            company.status !== "contratada" &&
            company.status !== "recusado");

        const text = normalizeText(
          [
            company.companyName,
            getDisplayCompanyName(company),
            company.contactName,
            company.phone,
            company.linkedin,
            company.instagram,
            company.facebook,
            company.description,
            company.jobsPageLink,
            company.desiredRole,
            company.city,
            company.state,
            company.notes,
            companyEmails.join(" "),
          ].join(" "),
        );

        return (
          matchesStatus &&
          matchesMode &&
          matchesEmail &&
          matchesCity &&
          matchesRole &&
          matchesSent &&
          (!term || text.includes(term))
        );
      })
      .sort((a, b) => {
        const aDate = a.lastSentDate || "";
        const bDate = b.lastSentDate || "";
        return aDate.localeCompare(bDate);
      });
  }, [
    companies,
    search,
    statusFilter,
    modeFilter,
    sentFilter,
    cityFilter,
    roleFilter,
    emailFilter,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredCompanies.length / 100));

  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * 100;
    return filteredCompanies.slice(start, start + 100);
  }, [filteredCompanies, currentPage]);

  const kpis = useMemo(() => {
    const todayValue = today();

    return {
      total: companies.length,
      sentToday: companies.filter((item) => item.lastSentDate === todayValue)
        .length,
      notSent: companies.filter((item) => item.status === "nao_enviado").length,
      interviews: companies.filter((item) => item.status === "entrevista")
        .length,
    };
  }, [companies]);

  function openNewCompany() {
    setCompanyForm({
      ...emptyJobCompany,
      emails: [{ id: crypto.randomUUID(), email: "" }],
    });
    setCompanyModalOpen(true);
  }

  function openEditCompany(company: JobCompany) {
    setCompanyForm({
      ...emptyJobCompany,
      ...company,
      emails:
        company.emails && company.emails.length > 0
          ? company.emails
          : [{ id: crypto.randomUUID(), email: "" }],
    });
    setCompanyModalOpen(true);
  }

  async function handleSaveCompany() {
    const validEmails = companyForm.emails.filter((item) => item.email.trim());

    if (validEmails.length === 0) {
      setMessage("Informe ao menos um e-mail da empresa.");
      return;
    }

    try {
      setSavingCompany(true);

      await saveJobCompany({
        ...companyForm,
        emails: validEmails,
      });

      await loadCompanies();
      setCompanyModalOpen(false);
      setCompanyForm(emptyJobCompany);
      setMessage("Empresa salva com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao salvar empresa.");
    } finally {
      setSavingCompany(false);
    }
  }

  async function handleDeleteCompany(company: JobCompany) {
    if (!company.id) return;

    const confirmed = window.confirm(
      `Deseja excluir a empresa ${company.companyName}?`,
    );

    if (!confirmed) return;

    try {
      await removeJobCompany(company.id);
      await loadCompanies();
      setMessage("Empresa excluída com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao excluir empresa.");
    }
  }

  function toggleCompanySelection(companyId?: string) {
    if (!companyId) return;

    setSelectedCompanyIds((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId],
    );
  }

  function toggleAllVisibleCompanies(checked: boolean) {
    if (!checked) {
      setSelectedCompanyIds([]);
      return;
    }

    setSelectedCompanyIds(
      paginatedCompanies.map((company) => company.id || "").filter(Boolean),
    );
  }

  function openBulkEmailModal() {
    if (selectedCompanyIds.length === 0) {
      setMessage("Selecione ao menos uma empresa.");
      return;
    }

    setBulkSubject(DEFAULT_EMAIL_SUBJECT);
    setBulkText(DEFAULT_EMAIL_TEXT);
    setBulkResumeFile(null);
    setBulkEmailModalOpen(true);
  }

  function openEmailModal(company: JobCompany) {
    const emails = emailList(company);

    setSelectedCompany(company);
    setSelectedEmails(emails);
    setEmailSubject(DEFAULT_EMAIL_SUBJECT);
    setEmailText(DEFAULT_EMAIL_TEXT);
    setResumeFile(null);
    setEmailModalOpen(true);
  }

  function applyTemplate(template: JobEmailTemplate) {
    setEmailSubject(template.subject);
    setEmailText(template.message);
  }

  async function handleSendEmail() {
    if (!selectedCompany) return;

    if (selectedEmails.length === 0) {
      setMessage("Selecione ao menos um e-mail.");
      return;
    }

    if (!emailSubject.trim() || !emailText.trim()) {
      setMessage("Informe assunto e texto do e-mail.");
      return;
    }

    try {
      setSendingEmail(true);

      const formData = new FormData();
      formData.append("to", selectedEmails.join(","));
      formData.append("subject", emailSubject);
      const personalizedText = personalizeEmailText(emailText, selectedCompany);
      formData.append("message", personalizedText);

      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const response = await fetch("/api/empregos/email", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Erro ao enviar currículo.");
      }

      const sentDate = today();

      await saveJobEmailLog({
        companyId: selectedCompany.id || "",
        companyName: selectedCompany.companyName,
        toEmails: selectedEmails,
        subject: emailSubject,
        message: personalizedText,
        resumeFileName: resumeFile?.name || "",
        sentAt: new Date().toISOString(),
      });

      await saveJobCompany({
        ...selectedCompany,
        status: "curriculo_enviado",
        lastSentDate: sentDate,
        nextFollowUpDate: addDays(sentDate, 7),
      });

      await loadCompanies();
      setEmailModalOpen(false);
      setSelectedCompany(null);
      setMessage("Currículo enviado e histórico salvo com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error ? error.message : "Erro ao enviar currículo.",
      );
    } finally {
      setSendingEmail(false);
    }
  }

  async function handleImportCompanies() {
    const extractedEmails = extractEmailsFromText(importEmailsText);

    if (extractedEmails.length === 0) {
      setMessage("Cole ao menos um e-mail válido para importar.");
      return;
    }

    const existingEmails = new Set(
      companies.flatMap((company) =>
        emailList(company).map((email) => email.toLowerCase()),
      ),
    );

    const emailsToCreate = extractedEmails.filter(
      (email) => !existingEmails.has(email),
    );

    if (emailsToCreate.length === 0) {
      setMessage("Todos os e-mails informados já estavam cadastrados.");
      return;
    }

    try {
      setImportingCompanies(true);

      for (const email of emailsToCreate) {
        const companyNameByEmail = getCompanyNameFromEmail(email);

        await saveJobCompany({
          ...emptyJobCompany,
          companyName:
            importCompanyPrefix.trim() &&
            importCompanyPrefix.trim() !== "Empresa"
              ? `${importCompanyPrefix.trim()} - ${companyNameByEmail}`
              : companyNameByEmail,
          emails: [{ id: crypto.randomUUID(), email }],
          desiredRole: importDesiredRole,
          description: importDescription,
          notes: importNotes,
          status: "nao_enviado",
          workMode: "nao_informado",
        });
      }

      await loadCompanies();

      setImportEmailsText("");
      setImportCompanyPrefix("Empresa");
      setImportDesiredRole("");
      setImportDescription("");
      setImportNotes("");
      setImportModalOpen(false);

      setMessage(
        `${emailsToCreate.length} empresa(s) importada(s). ${
          extractedEmails.length - emailsToCreate.length
        } e-mail(s) repetido(s) foram ignorados.`,
      );
    } catch (error) {
      console.error(error);
      setMessage("Erro ao importar empresas.");
    } finally {
      setImportingCompanies(false);
    }
  }

  async function handleBulkSendEmail() {
    const selectedCompanies = companies.filter(
      (company) => company.id && selectedCompanyIds.includes(company.id),
    );

    if (selectedCompanies.length === 0) {
      setMessage("Selecione ao menos uma empresa.");
      return;
    }

    if (!bulkSubject.trim() || !bulkText.trim()) {
      setMessage("Informe assunto e texto do e-mail.");
      return;
    }

    try {
      setBulkSending(true);

      let sentCount = 0;
      const sentDate = today();

      for (const company of selectedCompanies) {
        const emails = emailList(company);

        if (emails.length === 0) {
          continue;
        }

        const formData = new FormData();
        const personalizedText = personalizeEmailText(bulkText, company);

        formData.append("to", emails.join(","));
        formData.append("subject", bulkSubject);
        formData.append("message", personalizedText);

        if (bulkResumeFile) {
          formData.append("resume", bulkResumeFile);
        }

        const response = await fetch("/api/empregos/email", {
          method: "POST",
          body: formData,
        });

        const result = (await response.json()) as {
          ok?: boolean;
          error?: string;
        };

        if (!response.ok || !result.ok) {
          throw new Error(
            result.error || `Erro ao enviar para ${company.companyName}.`,
          );
        }

        await saveJobEmailLog({
          companyId: company.id || "",
          companyName: company.companyName,
          toEmails: emails,
          subject: bulkSubject,
          message: personalizedText,
          resumeFileName: bulkResumeFile?.name || "",
          sentAt: new Date().toISOString(),
        });

        await saveJobCompany({
          ...company,
          status: "curriculo_enviado",
          lastSentDate: sentDate,
          nextFollowUpDate: addDays(sentDate, 7),
        });

        sentCount += 1;
      }

      await loadCompanies();
      setSelectedCompanyIds([]);
      setBulkEmailModalOpen(false);
      setMessage(`Currículo enviado para ${sentCount} empresa(s).`);
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Erro ao enviar currículos selecionados.",
      );
    } finally {
      setBulkSending(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Empregos</h1>
            <p style={styles.subText}>
              Cadastre empresas, acompanhe vagas e envie seu currículo com
              histórico de contatos.
            </p>
          </div>

          <div className="header-actions">
            <button
              style={styles.secondaryButton}
              onClick={() => setImportModalOpen(true)}
            >
              <Upload size={18} />
              Importar e-mails
            </button>

            <button
              style={styles.secondaryButton}
              onClick={openBulkEmailModal}
              disabled={selectedCompanyIds.length === 0}
            >
              <Send size={18} />
              Enviar para selecionados ({selectedCompanyIds.length})
            </button>

            <button style={styles.button} onClick={openNewCompany}>
              <Plus size={18} /> Nova empresa
            </button>
          </div>
        </header>

        <AdminMenu />

        {message && <div style={styles.notice}>{message}</div>}

        <section className="kpi-grid">
          <div>
            <BriefcaseBusiness size={22} />
            <strong>{kpis.total}</strong>
            <span>Empresas cadastradas</span>
          </div>
          <div>
            <Send size={22} />
            <strong>{kpis.sentToday}</strong>
            <span>Currículos enviados hoje</span>
          </div>
          <div>
            <Mail size={22} />
            <strong>{kpis.notSent}</strong>
            <span>Ainda não enviados</span>
          </div>
          <div>
            <CalendarClock size={22} />
            <strong>{kpis.interviews}</strong>
            <span>Entrevistas</span>
          </div>
        </section>

        <section style={styles.card}>
          <div className="toolbar">
            <div>
              <h2 style={styles.cardTitle}>Empresas e candidaturas</h2>
              <p style={styles.cardSub}>
                Use esta lista todos os dias para enviar currículo e controlar
                retorno.
              </p>
            </div>
          </div>

          <div className="filters-top">
            <div className="filters-grid">
              <label style={styles.field}>
                <span style={styles.label}>Buscar</span>
                <div className="search-box">
                  <Search size={18} color={colors.soft} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Empresa, e-mail, vaga, cidade..."
                  />
                </div>
              </label>

              <label style={styles.field}>
                <span style={styles.label}>Status</span>
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as JobCompanyStatus | "todos",
                    )
                  }
                  style={styles.select}
                >
                  <option value="todos">Todos</option>
                  {Object.entries(jobStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label style={styles.field}>
                <span style={styles.label}>Modalidade</span>
                <select
                  value={modeFilter}
                  onChange={(event) =>
                    setModeFilter(event.target.value as JobWorkMode | "todos")
                  }
                  style={styles.select}
                >
                  <option value="todos">Todas</option>
                  {Object.entries(jobWorkModeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => setShowAdvancedFilters((prev) => !prev)}
            >
              {showAdvancedFilters
                ? "Ocultar filtros avançados"
                : "Filtros avançados"}
            </button>
          </div>

          {showAdvancedFilters && (
            <div className="advanced-filters-grid">
              <label style={styles.field}>
                <span style={styles.label}>Envio</span>
                <select
                  value={sentFilter}
                  onChange={(event) =>
                    setSentFilter(
                      event.target.value as
                        | "todos"
                        | "enviado_hoje"
                        | "nao_enviado_hoje"
                        | "sem_envio"
                        | "retorno_pendente",
                    )
                  }
                  style={styles.select}
                >
                  <option value="todos">Todos</option>
                  <option value="enviado_hoje">Enviado hoje</option>
                  <option value="nao_enviado_hoje">Não enviado hoje</option>
                  <option value="sem_envio">Nunca enviado</option>
                  <option value="retorno_pendente">Retorno pendente</option>
                </select>
              </label>

              <Field
                label="Cidade/Estado"
                value={cityFilter}
                onChange={setCityFilter}
                placeholder="Ex: Barra, Recreio, RJ..."
              />

              <Field
                label="Cargo/Vaga"
                value={roleFilter}
                onChange={setRoleFilter}
                placeholder="Ex: administrativo, remoto..."
              />

              <Field
                label="E-mail/domínio"
                value={emailFilter}
                onChange={setEmailFilter}
                placeholder="Ex: rh@, gmail, empresa.com.br..."
              />

              <button
                type="button"
                style={styles.secondaryButton}
                onClick={() => {
                  setSearch("");
                  setStatusFilter("todos");
                  setModeFilter("todos");
                  setSentFilter("todos");
                  setCityFilter("");
                  setRoleFilter("");
                  setEmailFilter("");
                }}
              >
                Limpar filtros
              </button>
            </div>
          )}

          <div className="pagination-info">
            <span>
              Exibindo {paginatedCompanies.length} de {filteredCompanies.length}{" "}
              cadastro(s). Máximo de 100 por página.
            </span>

            <div className="pagination-actions">
              <button
                type="button"
                className="small-action"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Anterior
              </button>

              <strong>
                Página {currentPage} de {totalPages}
              </strong>

              <button
                type="button"
                className="small-action"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Próxima
              </button>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <Loader2 className="spin" size={22} /> Carregando empresas...
            </div>
          ) : (
            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={
                          paginatedCompanies.length > 0 &&
                          paginatedCompanies.every((company) =>
                            selectedCompanyIds.includes(company.id || ""),
                          )
                        }
                        onChange={(event) =>
                          toggleAllVisibleCompanies(event.target.checked)
                        }
                      />
                    </th>
                    <th>Empresa</th>
                    <th>Contato</th>
                    <th>E-mails</th>
                    <th>Vaga / Modalidade</th>
                    <th>Status</th>
                    <th>Último envio</th>
                    <th>Retorno</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedCompanies.map((company) => (
                    <tr key={company.id || company.companyName}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedCompanyIds.includes(
                            company.id || "",
                          )}
                          onChange={() => toggleCompanySelection(company.id)}
                        />
                      </td>
                      <td>
                        <strong>
                          {company.companyName ||
                            getDisplayCompanyName(company)}
                        </strong>
                        <span>{company.description || "Sem descrição"}</span>
                        {company.jobsPageLink && (
                          <a
                            href={company.jobsPageLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Página de vagas
                          </a>
                        )}
                      </td>
                      <td>
                        <strong>{company.contactName || "-"}</strong>
                        <span>{company.phone || "-"}</span>
                        <div className="social-links">
                          {company.linkedin && (
                            <a
                              href={normalizeUrl(company.linkedin)}
                              target="_blank"
                              rel="noreferrer"
                            >
                              LinkedIn
                            </a>
                          )}

                          {company.instagram && (
                            <a
                              href={normalizeUrl(company.instagram)}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Instagram
                            </a>
                          )}

                          {company.facebook && (
                            <a
                              href={normalizeUrl(company.facebook)}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Facebook
                            </a>
                          )}

                          {!company.linkedin &&
                            !company.instagram &&
                            !company.facebook && <small>Sem redes</small>}
                        </div>
                      </td>
                      <td>
                        {emailList(company).map((email) => (
                          <span key={email} className="email-pill">
                            {email}
                          </span>
                        ))}
                      </td>
                      <td>
                        <strong>{company.desiredRole || "-"}</strong>
                        <span>{jobWorkModeLabels[company.workMode]}</span>
                        <small>
                          {[company.city, company.state]
                            .filter(Boolean)
                            .join(" - ") || "-"}
                        </small>
                      </td>
                      <td>
                        <span
                          className={`status-badge status-${company.status}`}
                        >
                          {jobStatusLabels[company.status]}
                        </span>
                      </td>
                      <td>{company.lastSentDate || "-"}</td>
                      <td>{company.nextFollowUpDate || "-"}</td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="small-action success"
                            onClick={() => openEmailModal(company)}
                          >
                            <Send size={16} /> Enviar
                          </button>
                          <button
                            className="small-action"
                            onClick={() => openEditCompany(company)}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            className="small-action danger"
                            onClick={() => handleDeleteCompany(company)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!paginatedCompanies.length && (
                    <tr>
                      <td colSpan={9}>Nenhuma empresa encontrada.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {importModalOpen && (
        <ImportCompaniesModal
          emailsText={importEmailsText}
          setEmailsText={setImportEmailsText}
          companyPrefix={importCompanyPrefix}
          setCompanyPrefix={setImportCompanyPrefix}
          desiredRole={importDesiredRole}
          setDesiredRole={setImportDesiredRole}
          description={importDescription}
          setDescription={setImportDescription}
          notes={importNotes}
          setNotes={setImportNotes}
          importing={importingCompanies}
          save={handleImportCompanies}
          close={() => setImportModalOpen(false)}
        />
      )}

      {companyModalOpen && (
        <CompanyModal
          company={companyForm}
          setCompany={setCompanyForm}
          close={() => setCompanyModalOpen(false)}
          save={handleSaveCompany}
          saving={savingCompany}
        />
      )}

      {emailModalOpen && selectedCompany && (
        <EmailModal
          company={selectedCompany}
          selectedEmails={selectedEmails}
          setSelectedEmails={setSelectedEmails}
          subject={emailSubject}
          setSubject={setEmailSubject}
          text={emailText}
          setText={setEmailText}
          resumeFile={resumeFile}
          setResumeFile={setResumeFile}
          applyTemplate={applyTemplate}
          send={handleSendEmail}
          saving={sendingEmail}
          close={() => setEmailModalOpen(false)}
        />
      )}

      {bulkEmailModalOpen && (
        <BulkEmailModal
          selectedCount={selectedCompanyIds.length}
          subject={bulkSubject}
          setSubject={setBulkSubject}
          text={bulkText}
          setText={setBulkText}
          resumeFile={bulkResumeFile}
          setResumeFile={setBulkResumeFile}
          send={handleBulkSendEmail}
          saving={bulkSending}
          close={() => setBulkEmailModalOpen(false)}
        />
      )}

      <GlobalStyle />
    </main>
  );
}

function ImportCompaniesModal({
  emailsText,
  setEmailsText,
  companyPrefix,
  setCompanyPrefix,
  desiredRole,
  setDesiredRole,
  description,
  setDescription,
  notes,
  setNotes,
  importing,
  save,
  close,
}: {
  emailsText: string;
  setEmailsText: (value: string) => void;
  companyPrefix: string;
  setCompanyPrefix: (value: string) => void;
  desiredRole: string;
  setDesiredRole: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  importing: boolean;
  save: () => void;
  close: () => void;
}) {
  const previewEmails = extractEmailsFromText(emailsText);

  return (
    <div style={styles.modalBackdrop}>
      <section style={styles.modal}>
        <header style={styles.modalHeader}>
          <div>
            <h2 style={styles.cardTitle}>Importar lista de e-mails</h2>
            <p style={styles.cardSub}>
              Cole todos os e-mails. O sistema cria uma empresa separada para
              cada e-mail e ignora os repetidos automaticamente.
            </p>
          </div>
          <button type="button" style={styles.secondaryButton} onClick={close}>
            <X size={18} /> Fechar
          </button>
        </header>

        <div className="form-grid">
          <Field
            label="Prefixo opcional para nome da empresa"
            value={companyPrefix}
            onChange={setCompanyPrefix}
            placeholder="Ex: Empresa, Escritório, Fábrica..."
          />

          <Field
            label="Cargo/vaga desejada para todos"
            value={desiredRole}
            onChange={setDesiredRole}
            placeholder="Ex: Administrativo, Programadora, Home office..."
          />

          <label style={{ ...styles.field, gridColumn: "1 / -1" }}>
            <span style={styles.label}>Lista de e-mails *</span>
            <textarea
              style={{ ...styles.textarea, minHeight: 180 }}
              value={emailsText}
              onChange={(event) => setEmailsText(event.target.value)}
              placeholder="Cole aqui: email1@empresa.com, email2@empresa.com.br..."
            />
            <small>
              Encontrados: {previewEmails.length} e-mail(s) único(s) na lista
              colada.
            </small>
          </label>

          <label style={{ ...styles.field, gridColumn: "1 / -1" }}>
            <span style={styles.label}>Detalhe / descrição para todos</span>
            <textarea
              style={styles.textarea}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Ex: Empresa encontrada no LinkedIn, possível vaga administrativa, enviar currículo..."
            />
          </label>

          <label style={{ ...styles.field, gridColumn: "1 / -1" }}>
            <span style={styles.label}>Observações internas</span>
            <textarea
              style={styles.textarea}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Ex: Prioridade, tentar contato pelo telefone depois..."
            />
          </label>
        </div>

        <div className="modal-actions">
          <button style={styles.button} onClick={save} disabled={importing}>
            {importing ? (
              <>
                <Loader2 className="spin" size={16} /> Importando...
              </>
            ) : (
              <>
                <Upload size={16} /> Importar empresas
              </>
            )}
          </button>

          <button style={styles.secondaryButton} onClick={close}>
            Cancelar
          </button>
        </div>
      </section>
    </div>
  );
}

function CompanyModal({
  company,
  setCompany,
  close,
  save,
  saving,
}: {
  company: JobCompany;
  setCompany: React.Dispatch<React.SetStateAction<JobCompany>>;
  close: () => void;
  save: () => void;
  saving: boolean;
}) {
  function addEmail() {
    setCompany((prev) => ({
      ...prev,
      emails: [...prev.emails, { id: crypto.randomUUID(), email: "" }],
    }));
  }

  function removeEmail(id: string) {
    setCompany((prev) => ({
      ...prev,
      emails:
        prev.emails.length === 1
          ? prev.emails
          : prev.emails.filter((item) => item.id !== id),
    }));
  }

  return (
    <div style={styles.modalBackdrop}>
      <section style={styles.modal}>
        <header style={styles.modalHeader}>
          <div>
            <h2 style={styles.cardTitle}>
              {company.id ? "Editar empresa" : "Nova empresa"}
            </h2>
            <p style={styles.cardSub}>
              Cadastre dados da empresa e todos os e-mails possíveis.
            </p>
          </div>
          <button type="button" style={styles.secondaryButton} onClick={close}>
            <X size={18} /> Fechar
          </button>
        </header>

        <div className="form-grid">
          <Field
            label="Nome da empresa"
            value={company.companyName}
            onChange={(value) =>
              setCompany((prev) => ({ ...prev, companyName: value }))
            }
          />

          <Field
            label="Contato / responsável"
            value={company.contactName}
            onChange={(value) =>
              setCompany((prev) => ({ ...prev, contactName: value }))
            }
          />

          <div className="emails-box">
            <div className="emails-title">
              <strong>E-mails *</strong>
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={addEmail}
              >
                <Plus size={15} /> Adicionar e-mail
              </button>
            </div>

            {company.emails.map((item, index) => (
              <div className="email-line" key={item.id}>
                <input
                  value={item.email}
                  type="email"
                  placeholder={`email-${index + 1}@empresa.com.br`}
                  onChange={(event) =>
                    setCompany((prev) => ({
                      ...prev,
                      emails: prev.emails.map((emailItem) =>
                        emailItem.id === item.id
                          ? { ...emailItem, email: event.target.value }
                          : emailItem,
                      ),
                    }))
                  }
                />
                <button
                  type="button"
                  className="small-action danger"
                  onClick={() => removeEmail(item.id)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          <Field
            label="Telefone"
            value={company.phone}
            onChange={(value) =>
              setCompany((prev) => ({ ...prev, phone: value }))
            }
          />

          <Field
            label="LinkedIn"
            value={company.linkedin}
            onChange={(value) =>
              setCompany((prev) => ({ ...prev, linkedin: value }))
            }
          />

          <Field
            label="Instagram"
            value={company.instagram}
            onChange={(value) =>
              setCompany((prev) => ({ ...prev, instagram: value }))
            }
          />

          <Field
            label="Facebook"
            value={company.facebook}
            onChange={(value) =>
              setCompany((prev) => ({ ...prev, facebook: value }))
            }
          />

          <Field
            label="Link da página de vagas"
            value={company.jobsPageLink}
            onChange={(value) =>
              setCompany((prev) => ({ ...prev, jobsPageLink: value }))
            }
          />

          <Field
            label="Cargo/vaga desejada"
            value={company.desiredRole}
            onChange={(value) =>
              setCompany((prev) => ({ ...prev, desiredRole: value }))
            }
          />

          <Field
            label="Cidade"
            value={company.city}
            onChange={(value) =>
              setCompany((prev) => ({ ...prev, city: value }))
            }
          />

          <Field
            label="Estado"
            value={company.state}
            onChange={(value) =>
              setCompany((prev) => ({ ...prev, state: value }))
            }
          />

          <label style={styles.field}>
            <span style={styles.label}>Modalidade</span>
            <select
              value={company.workMode}
              onChange={(event) =>
                setCompany((prev) => ({
                  ...prev,
                  workMode: event.target.value as JobWorkMode,
                }))
              }
              style={styles.select}
            >
              {Object.entries(jobWorkModeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Status</span>
            <select
              value={company.status}
              onChange={(event) =>
                setCompany((prev) => ({
                  ...prev,
                  status: event.target.value as JobCompanyStatus,
                }))
              }
              style={styles.select}
            >
              {Object.entries(jobStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <Field
            type="date"
            label="Último envio"
            value={company.lastSentDate}
            onChange={(value) =>
              setCompany((prev) => ({ ...prev, lastSentDate: value }))
            }
          />

          <Field
            type="date"
            label="Próximo retorno"
            value={company.nextFollowUpDate}
            onChange={(value) =>
              setCompany((prev) => ({ ...prev, nextFollowUpDate: value }))
            }
          />

          <label style={{ ...styles.field, gridColumn: "1 / -1" }}>
            <span style={styles.label}>Descrição</span>
            <textarea
              style={styles.textarea}
              value={company.description}
              onChange={(event) =>
                setCompany((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
            />
          </label>

          <label style={{ ...styles.field, gridColumn: "1 / -1" }}>
            <span style={styles.label}>Observações</span>
            <textarea
              style={styles.textarea}
              value={company.notes}
              onChange={(event) =>
                setCompany((prev) => ({ ...prev, notes: event.target.value }))
              }
            />
          </label>
        </div>

        <div className="modal-actions">
          <button style={styles.button} onClick={save} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="spin" size={16} /> Salvando...
              </>
            ) : (
              <>
                <Save size={16} /> Salvar empresa
              </>
            )}
          </button>

          <button style={styles.secondaryButton} onClick={close}>
            Cancelar
          </button>
        </div>
      </section>
    </div>
  );
}

function EmailModal({
  company,
  selectedEmails,
  setSelectedEmails,
  subject,
  setSubject,
  text,
  setText,
  resumeFile,
  setResumeFile,
  applyTemplate,
  send,
  saving,
  close,
}: {
  company: JobCompany;
  selectedEmails: string[];
  setSelectedEmails: React.Dispatch<React.SetStateAction<string[]>>;
  subject: string;
  setSubject: (value: string) => void;
  text: string;
  setText: (value: string) => void;
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
  applyTemplate: (template: JobEmailTemplate) => void;
  send: () => void;
  saving: boolean;
  close: () => void;
}) {
  const emails = emailList(company);

  function toggleEmail(email: string) {
    setSelectedEmails((prev) =>
      prev.includes(email)
        ? prev.filter((item) => item !== email)
        : [...prev, email],
    );
  }

  return (
    <div style={styles.modalBackdrop}>
      <section style={styles.modal}>
        <header style={styles.modalHeader}>
          <div>
            <h2 style={styles.cardTitle}>Enviar currículo</h2>
            <p style={styles.cardSub}>
              {company.companyName} • selecione os e-mails e anexe seu
              currículo.
            </p>
          </div>
          <button type="button" style={styles.secondaryButton} onClick={close}>
            <X size={18} /> Fechar
          </button>
        </header>

        <div className="template-grid">
          {defaultJobEmailTemplates.map((template) => (
            <button
              type="button"
              key={template.id}
              className="template-button"
              onClick={() => applyTemplate(template)}
            >
              <FileText size={16} />
              {template.name}
            </button>
          ))}
        </div>

        <div className="email-select-box">
          <strong>E-mails da empresa</strong>
          {emails.map((email) => (
            <label key={email} className="check-line">
              <input
                type="checkbox"
                checked={selectedEmails.includes(email)}
                onChange={() => toggleEmail(email)}
              />
              <span>{email}</span>
            </label>
          ))}
        </div>

        <div className="form-grid one">
          <Field label="Assunto" value={subject} onChange={setSubject} />

          <label style={styles.field}>
            <span style={styles.label}>Texto do e-mail</span>
            <textarea
              style={{ ...styles.textarea, minHeight: 220 }}
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Anexar currículo</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              style={styles.input}
              onChange={(event) =>
                setResumeFile(event.target.files?.[0] || null)
              }
            />
            {resumeFile && (
              <small>Arquivo selecionado: {resumeFile.name}</small>
            )}
          </label>
        </div>

        <div className="modal-actions">
          <button style={styles.button} onClick={send} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="spin" size={16} /> Enviando...
              </>
            ) : (
              <>
                <Send size={16} /> Enviar currículo
              </>
            )}
          </button>

          <button style={styles.secondaryButton} onClick={close}>
            Cancelar
          </button>
        </div>
      </section>
    </div>
  );
}

function BulkEmailModal({
  selectedCount,
  subject,
  setSubject,
  text,
  setText,
  resumeFile,
  setResumeFile,
  send,
  saving,
  close,
}: {
  selectedCount: number;
  subject: string;
  setSubject: (value: string) => void;
  text: string;
  setText: (value: string) => void;
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
  send: () => void;
  saving: boolean;
  close: () => void;
}) {
  return (
    <div style={styles.modalBackdrop}>
      <section style={styles.modal}>
        <header style={styles.modalHeader}>
          <div>
            <h2 style={styles.cardTitle}>Enviar currículo para selecionados</h2>
            <p style={styles.cardSub}>
              Você selecionou {selectedCount} empresa(s). O e-mail será enviado
              individualmente para os e-mails cadastrados de cada empresa.
            </p>
          </div>
          <button type="button" style={styles.secondaryButton} onClick={close}>
            <X size={18} /> Fechar
          </button>
        </header>

        <div className="form-grid one">
          <Field label="Assunto" value={subject} onChange={setSubject} />

          <label style={styles.field}>
            <span style={styles.label}>Texto do e-mail</span>
            <textarea
              style={{ ...styles.textarea, minHeight: 260 }}
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Anexar currículo</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              style={styles.input}
              onChange={(event) =>
                setResumeFile(event.target.files?.[0] || null)
              }
            />
            {resumeFile && (
              <small>Arquivo selecionado: {resumeFile.name}</small>
            )}
          </label>
        </div>

        <div className="modal-actions">
          <button style={styles.button} onClick={send} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="spin" size={16} /> Enviando...
              </>
            ) : (
              <>
                <Send size={16} /> Enviar para selecionados
              </>
            )}
          </button>

          <button style={styles.secondaryButton} onClick={close}>
            Cancelar
          </button>
        </div>
      </section>
    </div>
  );
}

function GlobalStyle() {
  return (
    <style jsx global>{`
      * {
        box-sizing: border-box;
      }

      button,
      input,
      textarea,
      select {
        font-family: inherit;
      }

      button:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }

      .spin {
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 14px;
        margin: 0 0 22px;
      }

      .kpi-grid > div {
        display: grid;
        gap: 8px;
        padding: 18px;
        border-radius: 24px;
        background: rgba(15, 23, 42, 0.74);
        border: 1px solid rgba(125, 211, 252, 0.18);
      }

      .kpi-grid strong {
        font-size: 28px;
      }

      .kpi-grid span {
        color: #94a3b8;
        font-weight: 800;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      .toolbar {
        display: flex;
        justify-content: space-between;
        gap: 14px;
        align-items: flex-start;
        flex-wrap: wrap;
      }

      .filters-top {
        display: grid;
        gap: 12px;
        margin: 0 0 16px;
      }

      .filters-grid {
        display: grid;
        grid-template-columns: 1.5fr 0.7fr 0.7fr;
        gap: 14px;
      }

      .advanced-filters-grid {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 14px;
        align-items: end;
        margin: 0 0 16px;
        padding: 14px;
        border-radius: 20px;
        background: rgba(2, 6, 23, 0.3);
        border: 1px solid rgba(125, 211, 252, 0.14);
      }

      .pagination-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
        margin: 0 0 16px;
        color: #cbd5e1;
        font-weight: 800;
      }

      .pagination-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      .search-box {
        display: flex;
        align-items: center;
        gap: 10px;
        border: 1px solid rgba(125, 211, 252, 0.18);
        background: rgba(2, 6, 23, 0.45);
        border-radius: 16px;
        padding: 0 12px;
      }

      .search-box input {
        width: 100%;
        border: 0;
        outline: none;
        color: #f8fafc;
        background: transparent;
        padding: 13px 0;
      }

      .table-wrap {
        width: 100%;
        overflow-x: auto;
      }

      .admin-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 1100px;
      }

      .admin-table th {
        text-align: left;
        color: #bae6fd;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        padding: 14px;
        border-bottom: 1px solid rgba(125, 211, 252, 0.16);
      }

      .admin-table td {
        padding: 14px;
        border-bottom: 1px solid rgba(125, 211, 252, 0.1);
        vertical-align: top;
      }

      .admin-table td strong {
        display: block;
      }

      .admin-table td span,
      .admin-table td small,
      .admin-table td a {
        display: block;
        margin-top: 5px;
        color: #94a3b8;
        font-size: 13px;
      }

      .admin-table td a {
        color: #7dd3fc;
        text-decoration: none;
        font-weight: 900;
      }

      .social-links {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
        margin-top: 6px;
      }

      .social-links a {
        display: inline-flex !important;
        width: fit-content;
        margin: 0 !important;
        padding: 5px 9px;
        border-radius: 999px;
        color: #7dd3fc !important;
        background: rgba(14, 165, 233, 0.12);
        border: 1px solid rgba(125, 211, 252, 0.16);
        font-size: 12px !important;
        font-weight: 900;
      }

      .email-pill {
        display: inline-flex !important;
        width: fit-content;
        margin: 3px 4px 3px 0 !important;
        padding: 5px 9px;
        border-radius: 999px;
        background: rgba(14, 165, 233, 0.12);
        color: #e0f2fe !important;
        border: 1px solid rgba(125, 211, 252, 0.16);
      }

      .status-badge {
        width: fit-content;
        padding: 7px 10px;
        border-radius: 999px;
        background: rgba(148, 163, 184, 0.16);
        color: #e2e8f0 !important;
        font-size: 12px !important;
        font-weight: 900;
      }

      .status-curriculo_enviado,
      .status-respondeu,
      .status-entrevista,
      .status-contratada {
        background: rgba(34, 197, 94, 0.16);
        color: #bbf7d0 !important;
      }

      .status-nao_enviado,
      .status-sem_retorno {
        background: rgba(245, 158, 11, 0.16);
        color: #fde68a !important;
      }

      .status-recusado {
        background: rgba(239, 68, 68, 0.16);
        color: #fecaca !important;
      }

      .row-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .small-action {
        border: 1px solid rgba(125, 211, 252, 0.16);
        border-radius: 12px;
        padding: 9px 11px;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        cursor: pointer;
        color: #e0f2fe;
        background: rgba(15, 23, 42, 0.72);
        font-weight: 900;
      }

      .small-action.success {
        background: rgba(34, 197, 94, 0.16);
        border-color: rgba(34, 197, 94, 0.28);
        color: #bbf7d0;
      }

      .small-action.danger {
        background: rgba(239, 68, 68, 0.16);
        border-color: rgba(239, 68, 68, 0.28);
        color: #fecaca;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .form-grid.one {
        grid-template-columns: 1fr;
      }

      .emails-box {
        grid-column: 1 / -1;
        display: grid;
        gap: 10px;
        padding: 14px;
        border-radius: 18px;
        background: rgba(2, 6, 23, 0.3);
        border: 1px solid rgba(125, 211, 252, 0.14);
      }

      .emails-title,
      .email-line {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .email-line input {
        flex: 1;
        border: 1px solid rgba(125, 211, 252, 0.18);
        background: rgba(2, 6, 23, 0.45);
        color: #f8fafc;
        outline: none;
        border-radius: 14px;
        padding: 12px 13px;
      }

      .modal-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 20px;
      }

      .template-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 16px;
      }

      .template-button {
        border: 1px solid rgba(125, 211, 252, 0.16);
        border-radius: 14px;
        padding: 11px 13px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(2, 6, 23, 0.48);
        color: #e0f2fe;
        font-weight: 900;
        cursor: pointer;
      }

      .email-select-box {
        display: grid;
        gap: 10px;
        padding: 14px;
        margin-bottom: 16px;
        border-radius: 18px;
        background: rgba(2, 6, 23, 0.3);
        border: 1px solid rgba(125, 211, 252, 0.14);
      }

      .check-line {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #dbeafe;
        font-weight: 800;
      }

      .empty-state {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #cbd5e1;
        padding: 18px;
      }

      @media (max-width: 900px) {
        .kpi-grid,
        .filters-grid,
        .advanced-filters-grid,
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}
