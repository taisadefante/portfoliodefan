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
  History,
  Eye,
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
  JobEmailLog,
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

type TargetedJobArea =
  | "tecnologia_fullstack"
  | "backend_dados"
  | "administrativo"
  | "financeiro"
  | "gestao_projetos"
  | "customer_success"
  | "operacoes_processos"
  | "comercial_atendimento"
  | "geral_hibrida";

const targetedJobAreaLabels: Record<TargetedJobArea, string> = {
  tecnologia_fullstack: "Tecnologia / Full Stack",
  backend_dados: "Backend / Dados / Banco de Dados",
  administrativo: "Administrativo",
  financeiro: "Financeiro",
  gestao_projetos: "Gestão de Projetos",
  customer_success: "Customer Success / Suporte",
  operacoes_processos: "Operações / Processos",
  comercial_atendimento: "Comercial / Atendimento",
  geral_hibrida: "Geral / Híbrida",
};

type TargetedJobEmailForm = {
  companyName: string;
  toEmail: string;
  jobTitle: string;
  jobArea: TargetedJobArea;
  jobLink: string;
  subject: string;
  message: string;
  resumeFile: File | null;
};

function createTargetedEmailSubject(jobTitle: string, companyName = "") {
  const cleanJobTitle = jobTitle.trim();
  const cleanCompany = companyName.trim();

  if (cleanJobTitle && cleanCompany) {
    return `Candidatura para ${cleanJobTitle} - ${cleanCompany} | Taís Defante`;
  }

  return cleanJobTitle
    ? `Candidatura para ${cleanJobTitle} - Taís Defante`
    : DEFAULT_EMAIL_SUBJECT;
}

function inferTargetedJobArea(jobTitle: string): TargetedJobArea {
  const content = normalizeText(jobTitle);

  if (
    content.includes("backend") ||
    content.includes("back-end") ||
    content.includes("node") ||
    content.includes("python") ||
    content.includes("api") ||
    content.includes("banco") ||
    content.includes("dados") ||
    content.includes("sql") ||
    content.includes("postgres") ||
    content.includes("mysql") ||
    content.includes("supabase") ||
    content.includes("firebase")
  ) {
    return "backend_dados";
  }

  if (
    content.includes("tecnologia") ||
    content.includes("desenvolvedor") ||
    content.includes("programador") ||
    content.includes("frontend") ||
    content.includes("front-end") ||
    content.includes("full stack") ||
    content.includes("fullstack") ||
    content.includes("react") ||
    content.includes("next") ||
    content.includes("sistema") ||
    content.includes("automacao") ||
    content.includes("dashboard")
  ) {
    return "tecnologia_fullstack";
  }

  if (
    content.includes("projeto") ||
    content.includes("scrum") ||
    content.includes("agil") ||
    content.includes("ágil") ||
    content.includes("product") ||
    content.includes("pmo") ||
    content.includes("processos")
  ) {
    return "gestao_projetos";
  }

  if (
    content.includes("financeiro") ||
    content.includes("contas") ||
    content.includes("faturamento") ||
    content.includes("cobranca") ||
    content.includes("cobrança") ||
    content.includes("controladoria") ||
    content.includes("auditoria")
  ) {
    return "financeiro";
  }

  if (
    content.includes("customer success") ||
    content.includes("sucesso do cliente") ||
    content.includes("suporte") ||
    content.includes("relacionamento") ||
    content.includes("implantacao") ||
    content.includes("implantação")
  ) {
    return "customer_success";
  }

  if (
    content.includes("operacoes") ||
    content.includes("operações") ||
    content.includes("operacional") ||
    content.includes("processo") ||
    content.includes("qualidade")
  ) {
    return "operacoes_processos";
  }

  if (
    content.includes("comercial") ||
    content.includes("vendas") ||
    content.includes("sdr") ||
    content.includes("bdr") ||
    content.includes("atendimento") ||
    content.includes("cliente")
  ) {
    return "comercial_atendimento";
  }

  if (
    content.includes("administrativo") ||
    content.includes("assistente") ||
    content.includes("auxiliar") ||
    content.includes("administração") ||
    content.includes("administracao")
  ) {
    return "administrativo";
  }

  return "geral_hibrida";
}

function getStrategicProfileForArea(jobArea: TargetedJobArea) {
  const technologyBase =
    "Atuo com tecnologia aplicada ao negócio, desenvolvimento de sistemas web, automações, dashboards, integração de APIs, organização de dados e criação de soluções digitais para melhorar processos e produtividade.";

  const backendBase =
    "Tenho conhecimento em backend com Node.js e Python, integração de APIs, estruturação de banco de dados, Firebase, PostgreSQL, MySQL e Supabase, além de noções de organização, segurança e fluxo de informações em sistemas.";

  const businessBase =
    "Também possuo experiência administrativa e financeira, controle de processos, atendimento, organização operacional, análise de informações, relatórios gerenciais, Power BI, CRM/ERP e apoio à tomada de decisão.";

  const projectBase =
    "Tenho formação e experiência voltadas à gestão de projetos, metodologias ágeis, Scrum, planejamento, acompanhamento de prazos, organização de demandas, comunicação entre áreas e melhoria contínua de processos.";

  if (jobArea === "tecnologia_fullstack") {
    return `${technologyBase}

Tenho prática com React.js, Next.js, JavaScript, Node.js, Python, Firebase, PostgreSQL, MySQL, Supabase, Git/GitHub, APIs, dashboards e sistemas administrativos. Minha atuação une desenvolvimento, automação e visão de processos para criar soluções funcionais, organizadas e úteis para a operação.`;
  }

  if (jobArea === "backend_dados") {
    return `${backendBase}

Além da parte técnica, tenho visão administrativa e financeira, o que facilita entender regras de negócio, estruturar dados, criar automações, relatórios e soluções que apoiem a operação com mais controle, produtividade e clareza.`;
  }

  if (jobArea === "administrativo") {
    return `${businessBase}

Tenho vivência em rotinas administrativas, controle de documentos e informações, organização de demandas, atendimento, suporte operacional, planilhas, processos internos e uso de tecnologia para reduzir retrabalho, melhorar controles e aumentar a eficiência da rotina.`;
  }

  if (jobArea === "financeiro") {
    return `Tenho experiência em rotinas financeiras, controle de informações, organização de processos, negociação, acompanhamento de dados, relatórios, planilhas, análise financeira, auditoria/controladoria e apoio à gestão.

Também aplico tecnologia para automatizar tarefas, estruturar dados, criar dashboards, melhorar controles e tornar a rotina financeira mais eficiente e segura.`;
  }

  if (jobArea === "gestao_projetos") {
    return `${projectBase}

Minha experiência combina gestão administrativa, financeira, processos e tecnologia. Consigo apoiar projetos desde a organização das demandas até o acompanhamento da execução, alinhando pessoas, prazos, dados, ferramentas e resultados.`;
  }

  if (jobArea === "customer_success") {
    return `Tenho experiência com atendimento, relacionamento com clientes, suporte operacional, organização de demandas, análise de processos e comunicação clara entre áreas.

Também possuo conhecimento em tecnologia, sistemas web, automações, dashboards, APIs e dados, o que me permite entender necessidades do cliente, orientar o uso de soluções, identificar melhorias e apoiar a adoção de ferramentas digitais.`;
  }

  if (jobArea === "operacoes_processos") {
    return `Tenho experiência em organização operacional, controle de processos, atendimento, rotinas administrativas e financeiras, análise de informações e melhoria de fluxos internos.

Também atuo com tecnologia, automações, dashboards, sistemas web, bancos de dados e integrações, contribuindo para reduzir retrabalho, melhorar produtividade e dar mais clareza à operação.`;
  }

  if (jobArea === "comercial_atendimento") {
    return `Tenho experiência em atendimento, relacionamento com clientes, rotinas comerciais/operacionais, organização de contatos, controle de informações, negociação e comunicação clara.

Também possuo conhecimento em tecnologia, CRM, automações, dashboards e sistemas, o que ajuda a acompanhar oportunidades, organizar processos e melhorar a experiência do cliente.`;
  }

  return `${technologyBase}

${backendBase}

${businessBase}

${projectBase}

Minha trajetória une tecnologia, administração, finanças, processos e projetos, permitindo contribuir com visão ampla, organização, análise e soluções práticas para diferentes áreas da empresa.`;
}

function createTargetedEmailText({
  companyName,
  jobTitle,
  jobArea,
  jobLink,
}: {
  companyName: string;
  jobTitle: string;
  jobArea: TargetedJobArea;
  jobLink: string;
}) {
  const company = companyName.trim() || "empresa";
  const role = jobTitle.trim() || "vaga anunciada";
  const strategicText = getStrategicProfileForArea(jobArea);
  const cleanJobLink = jobLink.trim();
  const linkText = cleanJobLink
    ? `

Link da vaga: ${cleanJobLink}`
    : "";

  return `Olá, equipe ${company}, tudo bem?

Encaminho meu currículo para a vaga de ${role}.

${strategicText}

Tenho perfil profissional, organizado, proativo e facilidade para aprender novas ferramentas, entender demandas e transformar necessidades em soluções práticas.${linkText}

Segue meu currículo em anexo para avaliação.

Atenciosamente,
Taís Defante
(21) 98835-9825
taisadefante@hotmail.com
LinkedIn: linkedin.com/in/taisadefante/
Portfólio: taisdefante.defan.com.br`;
}

type JobType =
  | "tudo"
  | "administrativo"
  | "tecnologia"
  | "financeiro"
  | "comercial"
  | "atendimento"
  | "operacoes"
  | "gestao_projetos"
  | "rh"
  | "estagio"
  | "outros";

type JobCompanyWithType = JobCompany & {
  jobType?: JobType;
  followUpClosedReason?: string;
  followUpClosedAt?: string;
};

type FollowUpDateFilter =
  | "todos"
  | "vencidos"
  | "hoje"
  | "proximos7"
  | "sem_data"
  | "com_data"
  | "personalizado";

const followUpDateFilterLabels: Record<FollowUpDateFilter, string> = {
  todos: "Todas as datas",
  vencidos: "Retornos vencidos",
  hoje: "Retorno hoje",
  proximos7: "Próximos 7 dias",
  sem_data: "Sem data de retorno",
  com_data: "Com data de retorno",
  personalizado: "Período personalizado",
};

const jobTypeLabels: Record<JobType, string> = {
  tudo: "Tudo",
  administrativo: "Administrativo",
  tecnologia: "Tecnologia",
  financeiro: "Financeiro",
  comercial: "Comercial / Vendas",
  atendimento: "Atendimento / Suporte",
  operacoes: "Operações",
  gestao_projetos: "Gestão de projetos",
  rh: "Recursos humanos",
  estagio: "Estágio / Júnior",
  outros: "Outros",
};

const ITEMS_PER_PAGE = 50;

type ListView = "ativos" | "separados" | "todos";

const closedFollowUpStatuses: JobCompanyStatus[] = [
  "respondeu",
  "entrevista",
  "sem_retorno",
  "recusado",
  "contratada",
];

function isClosedFollowUpStatus(status: JobCompanyStatus) {
  return closedFollowUpStatuses.includes(status);
}

function getFollowUpClosedReason(company: JobCompany) {
  return (company as JobCompanyWithType).followUpClosedReason || "";
}

function getFollowUpClosedAt(company: JobCompany) {
  return (company as JobCompanyWithType).followUpClosedAt || "";
}

function getJobTypeValue(company: JobCompany): JobType {
  const value = (company as JobCompanyWithType).jobType;

  if (
    value === "administrativo" ||
    value === "tecnologia" ||
    value === "financeiro" ||
    value === "comercial" ||
    value === "atendimento" ||
    value === "operacoes" ||
    value === "gestao_projetos" ||
    value === "rh" ||
    value === "estagio" ||
    value === "outros"
  ) {
    return value;
  }

  return "tudo";
}

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
  paginationButton: {
    border: "1px solid rgba(125, 211, 252, 0.16)",
    background: "rgba(15, 23, 42, 0.85)",
    color: "#e2e8f0",
    borderRadius: 12,
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 800,
  },
  paginationButtonActive: {
    border: "1px solid rgba(56, 189, 248, 0.9)",
    background:
      "linear-gradient(135deg, rgba(14,165,233,0.38), rgba(56,189,248,0.24))",
    color: "#ffffff",
    borderRadius: 12,
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 900,
  },
  paginationButtonDisabled: {
    border: "1px solid rgba(125, 211, 252, 0.08)",
    background: "rgba(15, 23, 42, 0.35)",
    color: "#64748b",
    borderRadius: 12,
    padding: "10px 16px",
    cursor: "not-allowed",
    fontWeight: 800,
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
  modalNotice: {
    borderRadius: 18,
    padding: "14px 16px",
    margin: "0 0 18px",
    color: "#e0f2fe",
    background: "rgba(14,165,233,0.12)",
    border: `1px solid ${colors.borderStrong}`,
    lineHeight: 1.5,
  },
  modalError: {
    borderRadius: 18,
    padding: "14px 16px",
    margin: "0 0 18px",
    color: "#fee2e2",
    background: "rgba(239,68,68,0.13)",
    border: "1px solid rgba(248,113,113,0.42)",
    lineHeight: 1.5,
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

function dateToTime(value?: string) {
  if (!value) return 0;

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return 0;

  return date.getTime();
}

function isDateBetween(value: string, start: string, end: string) {
  const valueTime = dateToTime(value);

  if (!valueTime) return false;

  const startTime = start ? dateToTime(start) : 0;
  const endTime = end ? dateToTime(end) : 0;

  if (startTime && valueTime < startTime) return false;
  if (endTime && valueTime > endTime) return false;

  return true;
}

function matchesFollowUpDateFilter(
  company: JobCompany,
  filter: FollowUpDateFilter,
  startDate: string,
  endDate: string,
) {
  const followUpDate = company.nextFollowUpDate || "";
  const todayValue = today();
  const nextSevenDays = addDays(todayValue, 7);

  if (filter === "todos") return true;
  if (filter === "sem_data") return !followUpDate;
  if (filter === "com_data") return Boolean(followUpDate);
  if (!followUpDate) return false;
  if (filter === "vencidos") return followUpDate < todayValue;
  if (filter === "hoje") return followUpDate === todayValue;
  if (filter === "proximos7") {
    return followUpDate >= todayValue && followUpDate <= nextSevenDays;
  }
  if (filter === "personalizado") {
    return isDateBetween(followUpDate, startDate, endDate);
  }

  return true;
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizeSearchValue(value: string) {
  return normalizeText(value)
    .replace(/[^a-z0-9@._+\-\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactSearchValue(value: string) {
  return normalizeSearchValue(value).replace(/[^a-z0-9]/g, "");
}

function getSearchTokens(value: string) {
  return normalizeSearchValue(value)
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean);
}

function buildCompanySearchText(company: JobCompany) {
  return [
    company.companyName,
    company.contactName,
    company.phone,
    company.linkedin,
    company.instagram,
    company.facebook,
    company.description,
    company.jobsPageLink,
    company.desiredRole,
    jobTypeLabels[getJobTypeValue(company)],
    jobWorkModeLabels[company.workMode],
    jobStatusLabels[company.status],
    company.city,
    company.state,
    emailList(company).join(" "),
    emailList(company)
      .map((email) => email.split("@")[0])
      .join(" "),
    emailList(company)
      .map((email) => email.split("@")[1] || "")
      .join(" "),
  ]
    .filter(Boolean)
    .join(" ");
}

function matchesSearchText(searchValue: string, targetValue: string) {
  const tokens = getSearchTokens(searchValue);

  if (tokens.length === 0) return true;

  const normalizedTarget = normalizeSearchValue(targetValue);
  const compactTarget = compactSearchValue(targetValue);

  return tokens.every((token) => {
    const compactToken = compactSearchValue(token);

    return (
      normalizedTarget.includes(token) ||
      Boolean(compactToken && compactTarget.includes(compactToken))
    );
  });
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

function formatDate(value?: string) {
  if (!value) return "-";

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) return value;

  return `${day}/${month}/${year}`;
}

function formatDateTime(value?: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getLastEmailLogForCompany(logs: JobEmailLog[], company: JobCompany) {
  const companyEmails = emailList(company).map((email) => email.toLowerCase());

  return logs
    .filter((log) => {
      const matchesCompany = company.id && log.companyId === company.id;
      const matchesEmail = (log.toEmails || []).some((email) =>
        companyEmails.includes(email.toLowerCase()),
      );

      return matchesCompany || matchesEmail;
    })
    .sort(
      (a, b) =>
        new Date(b.sentAt || b.createdAt || "").getTime() -
        new Date(a.sentAt || a.createdAt || "").getTime(),
    )[0];
}

function getCompanyEmailStatus(company: JobCompany, logs: JobEmailLog[]) {
  const lastLog = getLastEmailLogForCompany(logs, company);

  if (lastLog || company.lastSentDate) {
    return {
      label: "Enviado",
      className: "status-badge status-email-sent",
      sentDate: lastLog?.sentAt || company.lastSentDate || "",
    };
  }

  return {
    label: jobStatusLabels[company.status] || "Não enviado",
    className: `status-badge status-${company.status}`,
    sentDate: "",
  };
}

function hasCompanyAlreadyReceivedEmail(
  company: JobCompany,
  logs: JobEmailLog[],
) {
  return Boolean(
    getLastEmailLogForCompany(logs, company) ||
    company.lastSentDate ||
    company.status === "curriculo_enviado",
  );
}

function getCompanyPriority(company: JobCompany, logs: JobEmailLog[]) {
  const todayValue = today();
  const followUpDate = company.nextFollowUpDate || "";
  const alreadySent = hasCompanyAlreadyReceivedEmail(company, logs);

  if (isClosedFollowUpStatus(company.status)) {
    return 5;
  }

  if (!alreadySent || company.status === "nao_enviado") {
    return 0;
  }

  if (followUpDate && followUpDate <= todayValue) {
    return 1;
  }

  if (followUpDate && followUpDate > todayValue) {
    return 2;
  }

  if (!followUpDate) {
    return 3;
  }

  return 4;
}

function compareCompaniesByPriority(
  a: JobCompany,
  b: JobCompany,
  logs: JobEmailLog[],
) {
  const priorityOrder =
    getCompanyPriority(a, logs) - getCompanyPriority(b, logs);

  if (priorityOrder !== 0) return priorityOrder;

  const aFollowUpDate = a.nextFollowUpDate || "9999-12-31";
  const bFollowUpDate = b.nextFollowUpDate || "9999-12-31";
  const followUpOrder = aFollowUpDate.localeCompare(bFollowUpDate);

  if (followUpOrder !== 0) return followUpOrder;

  const aLastSentDate = a.lastSentDate || "9999-12-31";
  const bLastSentDate = b.lastSentDate || "9999-12-31";
  const sentOrder = aLastSentDate.localeCompare(bLastSentDate);

  if (sentOrder !== 0) return sentOrder;

  return getDisplayCompanyName(a).localeCompare(
    getDisplayCompanyName(b),
    "pt-BR",
  );
}

function getPriorityLabel(company: JobCompany, logs: JobEmailLog[]) {
  const priority = getCompanyPriority(company, logs);
  const closedReason = getFollowUpClosedReason(company);

  if (priority === 5) {
    return closedReason || "Lista separada: não reenviar currículo";
  }

  if (priority === 0) return "Prioridade: enviar currículo";
  if (priority === 1) return "Prioridade: fazer retorno";
  if (priority === 2) return "Próximo retorno agendado";
  if (priority === 3) return "Sem retorno definido";

  return "Acompanhar";
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
  const [emailLogs, setEmailLogs] = useState<JobEmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [savingStatusIds, setSavingStatusIds] = useState<string[]>([]);
  const [sentLogsModalOpen, setSentLogsModalOpen] = useState(false);

  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [companyForm, setCompanyForm] = useState<JobCompany>(emptyJobCompany);
  const [companyModalMessage, setCompanyModalMessage] = useState("");
  const [companyModalMessageType, setCompanyModalMessageType] = useState<
    "success" | "error" | "info"
  >("info");
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

  const [targetedEmailModalOpen, setTargetedEmailModalOpen] = useState(false);
  const [targetedEmailSending, setTargetedEmailSending] = useState(false);

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importEmailsText, setImportEmailsText] = useState("");
  const [importCompanyPrefix, setImportCompanyPrefix] = useState("Empresa");
  const [importDesiredRole, setImportDesiredRole] = useState("");
  const [importJobType, setImportJobType] = useState<JobType>("tudo");
  const [importDescription, setImportDescription] = useState("");
  const [importNotes, setImportNotes] = useState("");
  const [importingCompanies, setImportingCompanies] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobCompanyStatus | "todos">(
    "todos",
  );
  const [modeFilter, setModeFilter] = useState<JobWorkMode | "todos">("todos");
  const [jobTypeFilter, setJobTypeFilter] = useState<JobType | "todos">(
    "todos",
  );
  const [followUpDateFilter, setFollowUpDateFilter] =
    useState<FollowUpDateFilter>("todos");
  const [followUpStartDate, setFollowUpStartDate] = useState("");
  const [followUpEndDate, setFollowUpEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [listView, setListView] = useState<ListView>("ativos");

  async function loadCompanies() {
    setLoading(true);

    try {
      const [companyList, logsList] = await Promise.all([
        getJobCompanies(),
        getJobEmailLogs(),
      ]);
      setCompanies(companyList);
      setEmailLogs(logsList);
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
    jobTypeFilter,
    followUpDateFilter,
    followUpStartDate,
    followUpEndDate,
    listView,
    emailLogs,
  ]);

  const filteredCompanies = useMemo(() => {
    const searchValue = search.trim();

    return companies
      .filter((company) => {
        const matchesStatus =
          statusFilter === "todos" || company.status === statusFilter;
        const matchesMode =
          modeFilter === "todos" || company.workMode === modeFilter;

        const matchesJobType =
          jobTypeFilter === "todos" ||
          getJobTypeValue(company) === jobTypeFilter;

        const matchesFollowUpDate = matchesFollowUpDateFilter(
          company,
          followUpDateFilter,
          followUpStartDate,
          followUpEndDate,
        );

        const matchesSearch = matchesSearchText(
          searchValue,
          buildCompanySearchText(company),
        );

        const companyIsClosed = isClosedFollowUpStatus(company.status);
        const matchesListView =
          listView === "todos" ||
          (listView === "ativos" && !companyIsClosed) ||
          (listView === "separados" && companyIsClosed);

        return (
          matchesListView &&
          matchesStatus &&
          matchesMode &&
          matchesJobType &&
          matchesFollowUpDate &&
          matchesSearch
        );
      })
      .sort((a, b) => compareCompaniesByPriority(a, b, emailLogs));
  }, [
    companies,
    search,
    statusFilter,
    modeFilter,
    jobTypeFilter,
    followUpDateFilter,
    followUpStartDate,
    followUpEndDate,
    listView,
    emailLogs,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE),
  );

  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCompanies.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCompanies, currentPage]);

  const showingStart =
    filteredCompanies.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const showingEnd = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredCompanies.length,
  );

  const kpis = useMemo(() => {
    const todayValue = today();

    return {
      total: companies.length,
      sentToday: companies.filter((item) => item.lastSentDate === todayValue)
        .length,
      notSent: companies.filter((item) => item.status === "nao_enviado").length,
      followUpToday: companies.filter(
        (item) => item.nextFollowUpDate === todayValue,
      ).length,
      followUpOverdue: companies.filter(
        (item) => item.nextFollowUpDate && item.nextFollowUpDate < todayValue,
      ).length,
      interviews: companies.filter((item) => item.status === "entrevista")
        .length,
      activeFollowUps: companies.filter(
        (item) => !isClosedFollowUpStatus(item.status),
      ).length,
      closedFollowUps: companies.filter((item) =>
        isClosedFollowUpStatus(item.status),
      ).length,
    };
  }, [companies]);

  const statusCards = useMemo(() => {
    return [
      {
        status: "todos" as const,
        label: "Todos",
        total: companies.length,
      },
      ...Object.entries(jobStatusLabels).map(([status, label]) => ({
        status: status as JobCompanyStatus,
        label,
        total: companies.filter((company) => company.status === status).length,
      })),
    ];
  }, [companies]);

  function openNewCompany() {
    setCompanyModalMessage("");
    setCompanyModalMessageType("info");
    setCompanyForm({
      ...emptyJobCompany,
      jobType: "tudo",
      emails: [{ id: crypto.randomUUID(), email: "" }],
    });
    setCompanyModalOpen(true);
  }

  function openEditCompany(company: JobCompany) {
    setCompanyModalMessage("");
    setCompanyModalMessageType("info");
    setCompanyForm({
      ...emptyJobCompany,
      ...company,
      jobType: getJobTypeValue(company),
      emails:
        company.emails && company.emails.length > 0
          ? company.emails
          : [{ id: crypto.randomUUID(), email: "" }],
    } as JobCompany);
    setCompanyModalOpen(true);
  }

  async function handleSaveCompany() {
    setCompanyModalMessage("");
    setCompanyModalMessageType("info");

    const validEmails = (companyForm.emails || [])
      .map((item) => ({
        ...item,
        id: item.id || crypto.randomUUID(),
        email: (item.email || "").trim().toLowerCase(),
      }))
      .filter((item) => item.email);

    const duplicatedEmailsInForm = validEmails
      .map((item) => item.email)
      .filter((email, index, list) => list.indexOf(email) !== index);

    const uniqueDuplicatedEmailsInForm = Array.from(
      new Set(duplicatedEmailsInForm),
    );

    if (uniqueDuplicatedEmailsInForm.length > 0) {
      const duplicatedMessage = `E-mail repetido nesta empresa: ${uniqueDuplicatedEmailsInForm.join(
        ", ",
      )}. Remova o repetido para salvar.`;

      setCompanyModalMessage(duplicatedMessage);
      setCompanyModalMessageType("error");
      setMessage(duplicatedMessage);
      return;
    }

    const existingEmails = new Map<string, string>();

    companies.forEach((company) => {
      if (company.id && companyForm.id && company.id === companyForm.id) {
        return;
      }

      emailList(company).forEach((email) => {
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail) return;

        existingEmails.set(
          normalizedEmail,
          company.companyName || getDisplayCompanyName(company),
        );
      });
    });

    const duplicatedExistingEmails = validEmails
      .map((item) => item.email)
      .filter((email) => existingEmails.has(email));

    if (duplicatedExistingEmails.length > 0) {
      const email = duplicatedExistingEmails[0];
      const companyName = existingEmails.get(email) || "outra empresa";
      const duplicatedMessage = `O e-mail "${email}" já está cadastrado em "${companyName}". O cadastro não foi salvo.`;

      setCompanyModalMessage(duplicatedMessage);
      setCompanyModalMessageType("error");
      setMessage(duplicatedMessage);
      return;
    }

    try {
      setSavingCompany(true);

      await saveJobCompany({
        ...companyForm,
        companyName: companyForm.companyName?.trim() || "",
        contactName: companyForm.contactName?.trim() || "",
        phone: companyForm.phone?.trim() || "",
        linkedin: companyForm.linkedin?.trim() || "",
        instagram: companyForm.instagram?.trim() || "",
        facebook: companyForm.facebook?.trim() || "",
        jobsPageLink: companyForm.jobsPageLink?.trim() || "",
        desiredRole: companyForm.desiredRole?.trim() || "",
        city: companyForm.city?.trim() || "",
        state: companyForm.state?.trim() || "",
        description: companyForm.description?.trim() || "",
        notes: companyForm.notes?.trim() || "",
        emails: validEmails,
        status: companyForm.status || "nao_enviado",
        workMode: companyForm.workMode || "nao_informado",
      } as JobCompany);

      await loadCompanies();
      setCompanyModalOpen(false);
      setCompanyForm(emptyJobCompany);
      setCompanyModalMessage("");
      setCompanyModalMessageType("info");
      setMessage("Empresa salva com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar empresa:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao salvar empresa.";

      const friendlyMessage = `Erro ao salvar empresa: ${errorMessage}`;

      setCompanyModalMessage(friendlyMessage);
      setCompanyModalMessageType("error");
      setMessage(friendlyMessage);
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

  async function handleUpdateCompanyStatus(
    company: JobCompany,
    newStatus: JobCompanyStatus,
  ) {
    if (!company.id) return;
    if (company.status === newStatus) return;

    const statusIsClosed = isClosedFollowUpStatus(newStatus);
    const previousStatusWasClosed = isClosedFollowUpStatus(company.status);
    const defaultClosedReason = `Removido da rotina de reenvio porque o status mudou para ${
      jobStatusLabels[newStatus] || newStatus
    }.`;

    let closedReason = getFollowUpClosedReason(company);

    if (statusIsClosed && !previousStatusWasClosed) {
      const typedReason = window.prompt(
        "Motivo para tirar esta empresa da lista de reenvio/retorno:",
        defaultClosedReason,
      );

      if (typedReason === null) {
        return;
      }

      closedReason = typedReason.trim() || defaultClosedReason;
    }

    const previousCompanies = companies;
    const updatedCompany = {
      ...company,
      status: newStatus,
      nextFollowUpDate: statusIsClosed ? "" : company.nextFollowUpDate,
      followUpClosedReason: statusIsClosed
        ? closedReason || defaultClosedReason
        : "",
      followUpClosedAt: statusIsClosed ? new Date().toISOString() : "",
    } as JobCompanyWithType;

    setSavingStatusIds((prev) => [...prev, company.id || ""]);
    setCompanies((prev) =>
      prev.map((item) => (item.id === company.id ? updatedCompany : item)),
    );

    try {
      await saveJobCompany(updatedCompany as JobCompany);
      setMessage(
        statusIsClosed
          ? `Status atualizado para "${jobStatusLabels[newStatus]}". Empresa movida para a lista separada e removida dos retornos.`
          : `Status atualizado para "${jobStatusLabels[newStatus]}".`,
      );
    } catch (error) {
      console.error(error);
      setCompanies(previousCompanies);
      setMessage("Erro ao atualizar status. Tente novamente.");
    } finally {
      setSavingStatusIds((prev) => prev.filter((id) => id !== company.id));
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

  async function handleSendTargetedJobEmail(form: TargetedJobEmailForm) {
    const toEmail = form.toEmail.trim().toLowerCase();
    const companyName =
      form.companyName.trim() || getCompanyNameFromEmail(toEmail);
    const jobTitle = form.jobTitle.trim();
    const subject = form.subject.trim() || createTargetedEmailSubject(jobTitle);
    const messageText = form.message.trim();

    if (!toEmail) {
      setMessage("Informe o e-mail para enviar a candidatura.");
      return;
    }

    if (!jobTitle) {
      setMessage("Informe o cargo/vaga da candidatura personalizada.");
      return;
    }

    if (!messageText) {
      setMessage("Gere ou escreva o texto do e-mail personalizado.");
      return;
    }

    try {
      setTargetedEmailSending(true);

      const formData = new FormData();
      formData.append("to", toEmail);
      formData.append("subject", subject);
      formData.append("message", messageText);

      if (form.resumeFile) {
        formData.append("resume", form.resumeFile);
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
          result.error || "Erro ao enviar candidatura personalizada.",
        );
      }

      const sentDate = today();
      const existingCompany = companies.find((company) =>
        emailList(company)
          .map((email) => email.toLowerCase())
          .includes(toEmail),
      );

      if (existingCompany) {
        await saveJobEmailLog({
          companyId: existingCompany.id || "",
          companyName: existingCompany.companyName || companyName,
          toEmails: [toEmail],
          subject,
          message: messageText,
          resumeFileName: form.resumeFile?.name || "",
          sentAt: new Date().toISOString(),
        });

        await saveJobCompany({
          ...existingCompany,
          companyName: existingCompany.companyName || companyName,
          desiredRole: jobTitle || existingCompany.desiredRole,
          jobsPageLink: form.jobLink.trim() || existingCompany.jobsPageLink,
          description: existingCompany.description,
          status: "curriculo_enviado",
          lastSentDate: sentDate,
          nextFollowUpDate: addDays(sentDate, 7),
        });
      } else {
        const newCompany: JobCompanyWithType = {
          ...emptyJobCompany,
          companyName,
          emails: [{ id: crypto.randomUUID(), email: toEmail }],
          desiredRole: jobTitle,
          jobsPageLink: form.jobLink.trim(),
          description:
            "Candidatura personalizada enviada para vaga específica.",
          notes: "Candidatura personalizada enviada para vaga específica.",
          status: "curriculo_enviado",
          workMode: "nao_informado",
          jobType: "tudo",
          lastSentDate: sentDate,
          nextFollowUpDate: addDays(sentDate, 7),
        };

        await saveJobCompany(newCompany as JobCompany);

        await saveJobEmailLog({
          companyId: "",
          companyName,
          toEmails: [toEmail],
          subject,
          message: messageText,
          resumeFileName: form.resumeFile?.name || "",
          sentAt: new Date().toISOString(),
        });
      }

      await loadCompanies();
      setTargetedEmailModalOpen(false);
      setMessage("Candidatura personalizada enviada com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Erro ao enviar candidatura personalizada.",
      );
    } finally {
      setTargetedEmailSending(false);
    }
  }

  async function handleImportCompanies() {
    const allEmailsFromText =
      importEmailsText.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      ) || [];

    const normalizedEmailsFromText = allEmailsFromText.map((email) =>
      email.trim().toLowerCase(),
    );

    const extractedEmails = extractEmailsFromText(importEmailsText);

    if (extractedEmails.length === 0) {
      setMessage("Cole ao menos um e-mail válido para importar.");
      return;
    }

    const duplicatedEmailsInText = normalizedEmailsFromText.filter(
      (email, index, list) => list.indexOf(email) !== index,
    );

    const uniqueDuplicatedEmailsInText = Array.from(
      new Set(duplicatedEmailsInText),
    );

    if (uniqueDuplicatedEmailsInText.length > 0) {
      setMessage(
        `Existem e-mails repetidos na lista: ${uniqueDuplicatedEmailsInText.join(
          ", ",
        )}. Remova os repetidos para importar.`,
      );
      return;
    }

    const existingEmails = new Map<string, string>();

    companies.forEach((company) => {
      emailList(company).forEach((email) => {
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail) return;

        existingEmails.set(
          normalizedEmail,
          company.companyName || getDisplayCompanyName(company),
        );
      });
    });

    const duplicatedExistingEmails = extractedEmails.filter((email) =>
      existingEmails.has(email),
    );

    if (duplicatedExistingEmails.length > 0) {
      const email = duplicatedExistingEmails[0];
      const companyName = existingEmails.get(email) || "outra empresa";

      setMessage(
        `O e-mail "${email}" já está cadastrado em "${companyName}". A importação foi cancelada.`,
      );
      return;
    }

    try {
      setImportingCompanies(true);

      for (const email of extractedEmails) {
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
          jobType: importJobType,
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
      setImportJobType("tudo");
      setImportDescription("");
      setImportNotes("");
      setImportModalOpen(false);

      setMessage(`${extractedEmails.length} empresa(s) importada(s).`);
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
              onClick={() => setSentLogsModalOpen(true)}
            >
              <History size={18} />
              E-mails enviados ({emailLogs.length})
            </button>

            <button
              style={styles.secondaryButton}
              onClick={() => setImportModalOpen(true)}
            >
              <Upload size={18} />
              Importar e-mails
            </button>

            <button
              style={styles.button}
              onClick={() => setTargetedEmailModalOpen(true)}
            >
              <FileText size={18} />
              E-mail vaga certa
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
          <button
            type="button"
            onClick={() => {
              setStatusFilter("todos");
              setFollowUpDateFilter("todos");
              setListView("todos");
            }}
          >
            <BriefcaseBusiness size={22} />
            <strong>{kpis.total}</strong>
            <span>Empresas cadastradas</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setFollowUpDateFilter("todos");
              setStatusFilter("todos");
            }}
          >
            <Send size={22} />
            <strong>{kpis.sentToday}</strong>
            <span>Currículos enviados hoje</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setStatusFilter("nao_enviado");
              setFollowUpDateFilter("todos");
              setListView("ativos");
            }}
          >
            <Mail size={22} />
            <strong>{kpis.notSent}</strong>
            <span>Ainda não enviados</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setFollowUpDateFilter("vencidos");
              setStatusFilter("todos");
              setListView("ativos");
            }}
          >
            <CalendarClock size={22} />
            <strong>{kpis.followUpOverdue}</strong>
            <span>Retornos vencidos</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setFollowUpDateFilter("hoje");
              setStatusFilter("todos");
              setListView("ativos");
            }}
          >
            <CalendarClock size={22} />
            <strong>{kpis.followUpToday}</strong>
            <span>Retornos para hoje</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setStatusFilter("entrevista");
              setFollowUpDateFilter("todos");
              setListView("separados");
            }}
          >
            <CheckCircle2 size={22} />
            <strong>{kpis.interviews}</strong>
            <span>Entrevistas</span>
          </button>
        </section>

        <section className="list-view-grid">
          <button
            type="button"
            className={
              listView === "ativos" ? "list-view-card active" : "list-view-card"
            }
            onClick={() => {
              setListView("ativos");
              setStatusFilter("todos");
              setFollowUpDateFilter("todos");
            }}
          >
            <span>Lista de envio e retorno</span>
            <strong>{kpis.activeFollowUps}</strong>
            <small>
              Empresas que ainda podem receber currículo ou retorno.
            </small>
          </button>

          <button
            type="button"
            className={
              listView === "separados"
                ? "list-view-card separated active"
                : "list-view-card separated"
            }
            onClick={() => {
              setListView("separados");
              setStatusFilter("todos");
              setFollowUpDateFilter("todos");
            }}
          >
            <span>Lista separada / não reenviar</span>
            <strong>{kpis.closedFollowUps}</strong>
            <small>
              Entrevista, resposta, recusado, contratado ou sem retorno.
            </small>
          </button>

          <button
            type="button"
            className={
              listView === "todos"
                ? "list-view-card all active"
                : "list-view-card all"
            }
            onClick={() => {
              setListView("todos");
              setStatusFilter("todos");
              setFollowUpDateFilter("todos");
            }}
          >
            <span>Ver tudo</span>
            <strong>{companies.length}</strong>
            <small>Mostra ativos e separados juntos.</small>
          </button>
        </section>

        <section className="status-cards-grid">
          {statusCards.map((card) => (
            <button
              key={card.status}
              type="button"
              className={`status-card status-card-${card.status} ${
                statusFilter === card.status ? "status-card-active" : ""
              }`}
              onClick={() => {
                setStatusFilter(card.status);
                setFollowUpDateFilter("todos");

                if (card.status === "todos") {
                  setListView("todos");
                  return;
                }

                setListView(
                  isClosedFollowUpStatus(card.status) ? "separados" : "ativos",
                );
              }}
            >
              <span>{card.label}</span>
              <strong>{card.total}</strong>
            </button>
          ))}
        </section>

        <section style={styles.card}>
          <div className="toolbar">
            <div>
              <h2 style={styles.cardTitle}>Empresas e candidaturas</h2>
              <p style={styles.cardSub}>
                {listView === "ativos"
                  ? "Use esta lista todos os dias para enviar currículo e controlar retorno."
                  : listView === "separados"
                    ? "Empresas removidas da rotina de reenvio. Aqui ficam entrevistas, respostas, recusas, contratadas ou sem retorno."
                    : "Visualização completa com empresas ativas e separadas."}
              </p>
            </div>
          </div>

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

            <label style={styles.field}>
              <span style={styles.label}>Tipo de trabalho</span>
              <select
                value={jobTypeFilter}
                onChange={(event) =>
                  setJobTypeFilter(event.target.value as JobType | "todos")
                }
                style={styles.select}
              >
                <option value="todos">Todos</option>
                {Object.entries(jobTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Data de retorno</span>
              <select
                value={followUpDateFilter}
                onChange={(event) =>
                  setFollowUpDateFilter(
                    event.target.value as FollowUpDateFilter,
                  )
                }
                style={styles.select}
              >
                {Object.entries(followUpDateFilterLabels).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ),
                )}
              </select>
            </label>

            <Field
              type="date"
              label="Retorno de"
              value={followUpStartDate}
              onChange={(value) => {
                setFollowUpStartDate(value);
                setFollowUpDateFilter("personalizado");
              }}
            />

            <Field
              type="date"
              label="Retorno até"
              value={followUpEndDate}
              onChange={(value) => {
                setFollowUpEndDate(value);
                setFollowUpDateFilter("personalizado");
              }}
            />
          </div>

          <div className="pagination-info">
            <span>
              Exibindo {showingStart} a {showingEnd} de{" "}
              {filteredCompanies.length} cadastro(s). Máximo de 50 por página.
            </span>
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
                    <th>Tipo</th>
                    <th>Status</th>
                    <th>Prioridade</th>
                    <th>Último envio</th>
                    <th>Retorno</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedCompanies.map((company) => {
                    const emailStatus = getCompanyEmailStatus(
                      company,
                      emailLogs,
                    );

                    return (
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
                          <span className="job-type-pill">
                            {jobTypeLabels[getJobTypeValue(company)]}
                          </span>
                        </td>
                        <td>
                          <div className="status-inline-editor">
                            <select
                              value={company.status}
                              onChange={(event) =>
                                void handleUpdateCompanyStatus(
                                  company,
                                  event.target.value as JobCompanyStatus,
                                )
                              }
                              disabled={savingStatusIds.includes(
                                company.id || "",
                              )}
                              className={`status-select status-${company.status}`}
                            >
                              {Object.entries(jobStatusLabels).map(
                                ([value, label]) => (
                                  <option key={value} value={value}>
                                    {label}
                                  </option>
                                ),
                              )}
                            </select>

                            {savingStatusIds.includes(company.id || "") ? (
                              <small className="status-saving">
                                <Loader2 className="spin" size={13} />{" "}
                                Salvando...
                              </small>
                            ) : emailStatus.sentDate ? (
                              <small className="status-email-info">
                                E-mail enviado
                              </small>
                            ) : null}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`priority-pill priority-${getCompanyPriority(
                              company,
                              emailLogs,
                            )}`}
                          >
                            {getPriorityLabel(company, emailLogs)}
                          </span>
                        </td>
                        <td>
                          <strong>{formatDate(company.lastSentDate)}</strong>
                          {emailStatus.sentDate && (
                            <small>
                              {formatDateTime(emailStatus.sentDate)}
                            </small>
                          )}
                        </td>
                        <td>
                          {isClosedFollowUpStatus(company.status) ? (
                            <>
                              <strong className="closed-follow-up-title">
                                Fora do reenvio
                              </strong>
                              <small className="closed-follow-up-reason">
                                {getFollowUpClosedReason(company) ||
                                  "Empresa movida para a lista separada."}
                              </small>
                              {getFollowUpClosedAt(company) && (
                                <small>
                                  {formatDateTime(getFollowUpClosedAt(company))}
                                </small>
                              )}
                            </>
                          ) : (
                            <>
                              <strong>
                                {formatDate(company.nextFollowUpDate)}
                              </strong>
                              {company.nextFollowUpDate &&
                                company.nextFollowUpDate < today() && (
                                  <small className="follow-up-overdue">
                                    Vencido
                                  </small>
                                )}
                              {company.nextFollowUpDate === today() && (
                                <small className="follow-up-today">Hoje</small>
                              )}
                            </>
                          )}
                        </td>
                        <td>
                          <div className="row-actions">
                            {isClosedFollowUpStatus(company.status) ? (
                              <span className="small-action blocked-action">
                                Não reenviar
                              </span>
                            ) : (
                              <button
                                className="small-action success"
                                onClick={() => openEmailModal(company)}
                              >
                                <Send size={16} /> Enviar
                              </button>
                            )}
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
                    );
                  })}

                  {!filteredCompanies.length && (
                    <tr>
                      <td colSpan={11}>Nenhuma empresa encontrada.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!loading && paginatedCompanies.length > 0 && (
            <div className="pagination-wrapper">
              <button
                type="button"
                style={
                  currentPage <= 1
                    ? styles.paginationButtonDisabled
                    : styles.paginationButton
                }
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Anterior
              </button>

              <div className="pagination-pages">
                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;

                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      style={
                        currentPage === page
                          ? styles.paginationButtonActive
                          : styles.paginationButton
                      }
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                style={
                  currentPage >= totalPages
                    ? styles.paginationButtonDisabled
                    : styles.paginationButton
                }
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
              >
                Próxima
              </button>
            </div>
          )}
        </section>
      </div>

      {sentLogsModalOpen && (
        <SentEmailsModal
          logs={emailLogs}
          close={() => setSentLogsModalOpen(false)}
        />
      )}

      {importModalOpen && (
        <ImportCompaniesModal
          emailsText={importEmailsText}
          setEmailsText={setImportEmailsText}
          companyPrefix={importCompanyPrefix}
          setCompanyPrefix={setImportCompanyPrefix}
          desiredRole={importDesiredRole}
          setDesiredRole={setImportDesiredRole}
          jobType={importJobType}
          setJobType={setImportJobType}
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
          close={() => {
            setCompanyModalOpen(false);
            setCompanyModalMessage("");
            setCompanyModalMessageType("info");
          }}
          save={handleSaveCompany}
          saving={savingCompany}
          modalMessage={companyModalMessage}
          modalMessageType={companyModalMessageType}
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

      {targetedEmailModalOpen && (
        <TargetedJobEmailModal
          saving={targetedEmailSending}
          send={handleSendTargetedJobEmail}
          close={() => setTargetedEmailModalOpen(false)}
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

function SentEmailsModal({
  logs,
  close,
}: {
  logs: JobEmailLog[];
  close: () => void;
}) {
  const sortedLogs = [...logs].sort(
    (a, b) =>
      new Date(b.sentAt || b.createdAt || "").getTime() -
      new Date(a.sentAt || a.createdAt || "").getTime(),
  );

  return (
    <div style={styles.modalBackdrop}>
      <section style={styles.modal}>
        <header style={styles.modalHeader}>
          <div>
            <h2 style={styles.cardTitle}>E-mails enviados</h2>
            <p style={styles.cardSub}>
              Histórico de todos os currículos enviados pelo sistema.
            </p>
          </div>
          <button type="button" style={styles.secondaryButton} onClick={close}>
            <X size={18} /> Fechar
          </button>
        </header>

        <div className="sent-logs-list">
          {sortedLogs.map((log) => (
            <article
              key={log.id || `${log.companyName}-${log.sentAt}`}
              className="sent-log-card"
            >
              <div>
                <strong>{log.companyName || "Empresa sem nome"}</strong>
                <span>{formatDateTime(log.sentAt || log.createdAt)}</span>
              </div>

              <div>
                <small>Para:</small>
                <p>{(log.toEmails || []).join(", ") || "-"}</p>
              </div>

              <div>
                <small>Assunto:</small>
                <p>{log.subject || "-"}</p>
              </div>

              {log.resumeFileName && (
                <div>
                  <small>Anexo:</small>
                  <p>{log.resumeFileName}</p>
                </div>
              )}

              <details>
                <summary>
                  <Eye size={15} /> Ver texto enviado
                </summary>
                <pre>{log.message || "-"}</pre>
              </details>
            </article>
          ))}

          {!sortedLogs.length && (
            <div className="empty-state">Nenhum e-mail enviado ainda.</div>
          )}
        </div>
      </section>
    </div>
  );
}

function ImportCompaniesModal({
  emailsText,
  setEmailsText,
  companyPrefix,
  setCompanyPrefix,
  desiredRole,
  setDesiredRole,
  jobType,
  setJobType,
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
  jobType: JobType;
  setJobType: (value: JobType) => void;
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

        {modalMessage && (
          <div
            style={
              modalMessageType === "error"
                ? styles.modalError
                : styles.modalNotice
            }
          >
            {modalMessage}
          </div>
        )}

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

          <label style={styles.field}>
            <span style={styles.label}>Tipo de trabalho para todos</span>
            <select
              value={jobType}
              onChange={(event) => setJobType(event.target.value as JobType)}
              style={styles.select}
            >
              {Object.entries(jobTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

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
  modalMessage,
  modalMessageType,
}: {
  company: JobCompany;
  setCompany: React.Dispatch<React.SetStateAction<JobCompany>>;
  close: () => void;
  save: () => void;
  saving: boolean;
  modalMessage: string;
  modalMessageType: "success" | "error" | "info";
}) {
  function addEmail() {
    setCompany((prev) => ({
      ...prev,
      emails: [...(prev.emails || []), { id: crypto.randomUUID(), email: "" }],
    }));
  }

  function removeEmail(id: string) {
    setCompany((prev) => ({
      ...prev,
      emails:
        (prev.emails || []).length <= 1
          ? prev.emails || []
          : (prev.emails || []).filter((item) => item.id !== id),
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

        {modalMessage && (
          <div
            style={
              modalMessageType === "error"
                ? styles.modalError
                : styles.modalNotice
            }
          >
            {modalMessage}
          </div>
        )}

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
              <strong>E-mails</strong>
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={addEmail}
              >
                <Plus size={15} /> Adicionar e-mail
              </button>
            </div>

            {(company.emails || []).map((item, index) => (
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

          <label style={styles.field}>
            <span style={styles.label}>Tipo de trabalho</span>
            <select
              value={getJobTypeValue(company)}
              onChange={(event) =>
                setCompany(
                  (prev) =>
                    ({
                      ...prev,
                      jobType: event.target.value as JobType,
                    }) as JobCompanyWithType,
                )
              }
              style={styles.select}
            >
              {Object.entries(jobTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

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
              {getDisplayCompanyName(company)} • selecione os e-mails e anexe
              seu currículo. Use {"{empresa}"} no texto para personalizar.
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

function TargetedJobEmailModal({
  saving,
  send,
  close,
}: {
  saving: boolean;
  send: (form: TargetedJobEmailForm) => void;
  close: () => void;
}) {
  const [companyName, setCompanyName] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobArea, setJobArea] = useState<TargetedJobArea>("geral_hibrida");
  const [jobLink, setJobLink] = useState("");
  const [subject, setSubject] = useState(DEFAULT_EMAIL_SUBJECT);
  const [message, setMessage] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  function generateStrategicText() {
    const generatedSubject = createTargetedEmailSubject(jobTitle, companyName);
    const generatedMessage = createTargetedEmailText({
      companyName,
      jobTitle,
      jobArea,
      jobLink,
    });

    setSubject(generatedSubject);
    setMessage(generatedMessage);
  }

  function handleSend() {
    send({
      companyName,
      toEmail,
      jobTitle,
      jobArea,
      jobLink,
      subject,
      message,
      resumeFile,
    });
  }

  return (
    <div style={styles.modalBackdrop}>
      <section style={styles.modal}>
        <header style={styles.modalHeader}>
          <div>
            <h2 style={styles.cardTitle}>
              E-mail personalizado para vaga certa
            </h2>
            <p style={styles.cardSub}>
              Preencha o cargo, escolha a área da vaga e anexe seu currículo. O
              sistema gera um texto profissional específico para tecnologia,
              backend, dados, administrativo, financeiro, projetos, atendimento
              ou processos.
            </p>
          </div>
          <button type="button" style={styles.secondaryButton} onClick={close}>
            <X size={18} /> Fechar
          </button>
        </header>

        {modalMessage && (
          <div
            style={
              modalMessageType === "error"
                ? styles.modalError
                : styles.modalNotice
            }
          >
            {modalMessage}
          </div>
        )}

        <div className="form-grid">
          <Field
            label="Nome da empresa"
            value={companyName}
            onChange={setCompanyName}
            placeholder="Ex: Empresa XPTO"
          />

          <Field
            label="E-mail para envio *"
            value={toEmail}
            onChange={setToEmail}
            placeholder="rh@empresa.com.br"
            type="email"
          />

          <Field
            label="Cargo / vaga certa *"
            value={jobTitle}
            onChange={(value) => {
              setJobTitle(value);
              setSubject(createTargetedEmailSubject(value, companyName));
              setJobArea(inferTargetedJobArea(value));
            }}
            placeholder="Ex: Assistente Administrativo, Analista Backend, Gestão de Projetos..."
          />

          <label style={styles.field}>
            <span style={styles.label}>Área da vaga *</span>
            <select
              value={jobArea}
              onChange={(event) =>
                setJobArea(event.target.value as TargetedJobArea)
              }
              style={styles.select}
            >
              {Object.entries(targetedJobAreaLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <small>
              A área define o texto estratégico: tecnologia, backend/dados,
              administrativo, financeiro, projetos e mais.
            </small>
          </label>

          <Field
            label="Link da vaga"
            value={jobLink}
            onChange={setJobLink}
            placeholder="Cole o link do LinkedIn, Gupy, site da empresa..."
          />

          <label style={{ ...styles.field, gridColumn: "1 / -1" }}>
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
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={generateStrategicText}
          >
            <FileText size={16} /> Gerar texto pela área escolhida
          </button>
        </div>

        <div className="form-grid one">
          <Field label="Assunto" value={subject} onChange={setSubject} />

          <label style={styles.field}>
            <span style={styles.label}>Texto personalizado do e-mail</span>
            <textarea
              style={{ ...styles.textarea, minHeight: 300 }}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Clique em Gerar texto estratégico para criar um e-mail específico para o cargo informado."
            />
          </label>
        </div>

        <div className="modal-actions">
          <button style={styles.button} onClick={handleSend} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="spin" size={16} /> Enviando...
              </>
            ) : (
              <>
                <Send size={16} /> Enviar candidatura personalizada
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
              individualmente para os e-mails cadastrados de cada empresa. Use
              {"{empresa}"} no texto para personalizar automaticamente.
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
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
        gap: 14px;
        margin: 0 0 22px;
      }

      .kpi-grid > button {
        display: grid;
        gap: 8px;
        padding: 18px;
        border-radius: 24px;
        background: rgba(15, 23, 42, 0.74);
        border: 1px solid rgba(125, 211, 252, 0.18);
      }

      .kpi-grid > button {
        color: inherit;
        text-align: left;
        cursor: pointer;
      }

      .kpi-grid > button:hover,
      .status-card:hover {
        border-color: rgba(56, 189, 248, 0.48);
        transform: translateY(-1px);
      }

      .list-view-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 14px;
        margin: 0 0 18px;
      }

      .list-view-card {
        display: grid;
        gap: 8px;
        text-align: left;
        color: #e0f2fe;
        padding: 18px;
        border-radius: 24px;
        cursor: pointer;
        background: rgba(15, 23, 42, 0.74);
        border: 1px solid rgba(125, 211, 252, 0.18);
      }

      .list-view-card strong {
        font-size: 30px;
        line-height: 1;
      }

      .list-view-card span {
        font-weight: 950;
      }

      .list-view-card small {
        color: #94a3b8;
        line-height: 1.45;
      }

      .list-view-card.active {
        border-color: rgba(56, 189, 248, 0.72);
        box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.12);
      }

      .list-view-card.separated.active {
        border-color: rgba(168, 85, 247, 0.85);
        box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.12);
      }

      .blocked-action {
        background: rgba(100, 116, 139, 0.18) !important;
        color: #cbd5e1 !important;
        border: 1px solid rgba(148, 163, 184, 0.22) !important;
        cursor: not-allowed !important;
      }

      .closed-follow-up-title {
        color: #f0abfc;
      }

      .closed-follow-up-reason {
        color: #c4b5fd;
        max-width: 260px;
      }

      .status-cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
        gap: 12px;
        margin: 0 0 22px;
      }

      .status-card {
        border: 1px solid rgba(125, 211, 252, 0.18);
        background: rgba(15, 23, 42, 0.72);
        color: #e2e8f0;
        border-radius: 20px;
        padding: 14px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        cursor: pointer;
        transition: 0.18s ease;
      }

      .status-card span {
        font-size: 13px;
        font-weight: 900;
        color: #cbd5e1;
      }

      .status-card strong {
        font-size: 26px;
        color: #ffffff;
      }

      .status-card-todos {
        border-color: rgba(56, 189, 248, 0.34);
        background: linear-gradient(
          135deg,
          rgba(14, 165, 233, 0.22),
          rgba(99, 102, 241, 0.16)
        );
      }

      .status-card-active {
        border-color: rgba(56, 189, 248, 0.92);
        background: linear-gradient(
          135deg,
          rgba(14, 165, 233, 0.32),
          rgba(56, 189, 248, 0.16)
        );
      }

      .status-inline-editor {
        display: grid;
        gap: 6px;
        min-width: 170px;
      }

      .status-select {
        width: 100%;
        border: 1px solid rgba(125, 211, 252, 0.22);
        border-radius: 999px;
        padding: 8px 10px;
        color: #f8fafc;
        font-size: 12px;
        font-weight: 900;
        outline: none;
        background: rgba(15, 23, 42, 0.92);
      }

      .status-select:disabled {
        opacity: 0.68;
        cursor: wait;
      }

      /* Correção do select de status na lista:
         o select tinha a classe do status, e essas classes mudavam o fundo do dropdown.
         Aqui forçamos o select e as opções a ficarem escuros e legíveis. */
      .status-inline-editor .status-select,
      .status-inline-editor .status-select.status-nao_enviado,
      .status-inline-editor .status-select.status-curriculo_enviado,
      .status-inline-editor .status-select.status-respondeu,
      .status-inline-editor .status-select.status-entrevista,
      .status-inline-editor .status-select.status-sem_retorno,
      .status-inline-editor .status-select.status-recusado,
      .status-inline-editor .status-select.status-contratada {
        appearance: auto;
        -webkit-appearance: menulist;
        background-color: #0f172a !important;
        color: #ffffff !important;
        border: 1px solid rgba(125, 211, 252, 0.38) !important;
        box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.45);
      }

      .status-inline-editor .status-select option,
      select option {
        background-color: #0f172a !important;
        color: #ffffff !important;
      }

      .status-inline-editor .status-select option:checked {
        background-color: #1e293b !important;
        color: #ffffff !important;
        font-weight: 900;
      }

      .status-inline-editor .status-select:focus {
        border-color: rgba(56, 189, 248, 0.9) !important;
        box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.16);
      }

      .status-saving,
      .status-email-info {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        color: #93c5fd;
        font-size: 11px;
        font-weight: 800;
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

      .filters-grid {
        display: grid;
        grid-template-columns: 1.3fr 0.72fr 0.72fr 0.72fr 0.8fr 0.62fr 0.62fr;
        gap: 14px;
        margin: 0 0 20px;
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

      .pagination-info {
        width: 100%;
        margin: 0 0 14px;
        color: #cbd5e1;
        font-weight: 800;
      }

      .pagination-wrapper {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-top: 24px;
        flex-wrap: wrap;
      }

      .pagination-pages {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .table-wrap {
        width: 100%;
        overflow-x: auto;
      }

      .admin-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 1250px;
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

      .job-type-pill {
        display: inline-flex !important;
        width: fit-content;
        margin-top: 0 !important;
        padding: 6px 10px;
        border-radius: 999px;
        background: rgba(56, 189, 248, 0.12);
        color: #bae6fd !important;
        border: 1px solid rgba(125, 211, 252, 0.2);
        font-size: 12px !important;
        font-weight: 900;
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
      .status-contratada,
      .status-email-sent {
        background: rgba(34, 197, 94, 0.16);
        color: #bbf7d0 !important;
        border: 1px solid rgba(34, 197, 94, 0.28);
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

      .follow-up-overdue {
        width: fit-content;
        padding: 4px 8px;
        border-radius: 999px;
        background: rgba(239, 68, 68, 0.16);
        color: #fecaca !important;
        border: 1px solid rgba(239, 68, 68, 0.28);
        font-weight: 900;
      }

      .follow-up-today {
        width: fit-content;
        padding: 4px 8px;
        border-radius: 999px;
        background: rgba(245, 158, 11, 0.16);
        color: #fde68a !important;
        border: 1px solid rgba(245, 158, 11, 0.28);
        font-weight: 900;
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

      .sent-logs-list {
        display: grid;
        gap: 12px;
      }

      .sent-log-card {
        display: grid;
        gap: 10px;
        padding: 16px;
        border-radius: 18px;
        background: rgba(2, 6, 23, 0.38);
        border: 1px solid rgba(125, 211, 252, 0.14);
      }

      .sent-log-card strong {
        color: #f8fafc;
        font-size: 17px;
      }

      .sent-log-card span,
      .sent-log-card small {
        color: #94a3b8;
        font-weight: 800;
      }

      .sent-log-card p {
        margin: 4px 0 0;
        color: #e2e8f0;
        line-height: 1.5;
      }

      .sent-log-card details {
        color: #e0f2fe;
      }

      .sent-log-card summary {
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-weight: 900;
      }

      .sent-log-card pre {
        white-space: pre-wrap;
        margin: 12px 0 0;
        padding: 12px;
        border-radius: 14px;
        color: #cbd5e1;
        background: rgba(15, 23, 42, 0.72);
        border: 1px solid rgba(125, 211, 252, 0.12);
        font-family: Arial, Helvetica, sans-serif;
        line-height: 1.5;
      }

      @media (max-width: 900px) {
        .kpi-grid,
        .filters-grid,
        .form-grid {
          grid-template-columns: 1fr;
        }

        .header-actions {
          width: 100%;
        }

        .header-actions button {
          width: 100%;
        }
      }
    `}</style>
  );
}
