export type JobCompanyStatus =
  | "nao_enviado"
  | "curriculo_enviado"
  | "respondeu"
  | "entrevista"
  | "sem_retorno"
  | "recusado"
  | "contratada";

export type JobWorkMode = "presencial" | "hibrido" | "remoto" | "nao_informado";

export type JobEmailItem = {
  id: string;
  email: string;
};

export type JobCompany = {
  id?: string;
  companyName: string;
  contactName: string;
  emails: JobEmailItem[];
  phone: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  description: string;
  jobsPageLink: string;
  desiredRole: string;
  city: string;
  state: string;
  workMode: JobWorkMode;
  status: JobCompanyStatus;
  lastSentDate: string;
  nextFollowUpDate: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
};

export type JobApplication = {
  id?: string;
  companyId: string;
  companyName: string;
  jobTitle: string;
  jobLink: string;
  salary: string;
  workMode: JobWorkMode;
  status: JobCompanyStatus;
  foundDate: string;
  appliedDate: string;
  nextFollowUpDate: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
};

export type JobEmailLog = {
  id?: string;
  companyId: string;
  companyName: string;
  toEmails: string[];
  subject: string;
  message: string;
  resumeFileName?: string;
  sentAt: string;
  createdAt?: string;
};

export type JobEmailTemplate = {
  id?: string;
  name: string;
  subject: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
};

export const emptyJobCompany: JobCompany = {
  companyName: "",
  contactName: "",
  emails: [{ id: "email-1", email: "" }],
  phone: "",
  linkedin: "",
  instagram: "",
  facebook: "",
  description: "",
  jobsPageLink: "",
  desiredRole: "",
  city: "",
  state: "",
  workMode: "nao_informado",
  status: "nao_enviado",
  lastSentDate: "",
  nextFollowUpDate: "",
  notes: "",
};

export const emptyJobApplication: JobApplication = {
  companyId: "",
  companyName: "",
  jobTitle: "",
  jobLink: "",
  salary: "",
  workMode: "nao_informado",
  status: "nao_enviado",
  foundDate: "",
  appliedDate: "",
  nextFollowUpDate: "",
  notes: "",
};

export const defaultJobEmailTemplates: JobEmailTemplate[] = [
  {
    id: "programadora",
    name: "Programadora / Desenvolvedora",
    subject: "Currículo - Desenvolvedora Web / Sistemas",
    message:
      "Olá, tudo bem?\n\nMeu nome é Taís Defante e estou em busca de uma oportunidade na área de desenvolvimento web, sistemas, automações ou tecnologia.\n\nTenho experiência com criação de sites, landing pages, sistemas personalizados, automações, Next.js, Firebase e integrações.\n\nSegue meu currículo em anexo para avaliação.\n\nFico à disposição para uma conversa.\n\nAtenciosamente,\nTaís Defante\nTelefone/WhatsApp: 21 98835-9825",
  },
  {
    id: "administrativo",
    name: "Administrativo",
    subject: "Currículo - Área Administrativa",
    message:
      "Olá, tudo bem?\n\nMeu nome é Taís Defante e estou em busca de uma oportunidade profissional na área administrativa, atendimento, suporte, organização de processos ou funções relacionadas.\n\nSegue meu currículo em anexo para avaliação.\n\nFico à disposição para uma conversa.\n\nAtenciosamente,\nTaís Defante\nTelefone/WhatsApp: 21 98835-9825",
  },
  {
    id: "generico",
    name: "Genérico",
    subject: "Envio de currículo",
    message:
      "Olá, tudo bem?\n\nMeu nome é Taís Defante e estou em busca de uma oportunidade profissional.\n\nSegue meu currículo em anexo para avaliação.\n\nFico à disposição para uma conversa.\n\nAtenciosamente,\nTaís Defante\nTelefone/WhatsApp: 21 98835-9825",
  },
];

export const jobStatusLabels: Record<JobCompanyStatus, string> = {
  nao_enviado: "Não enviado",
  curriculo_enviado: "Currículo enviado",
  respondeu: "Respondeu",
  entrevista: "Entrevista marcada",
  sem_retorno: "Sem retorno",
  recusado: "Recusado",
  contratada: "Contratada",
};

export const jobWorkModeLabels: Record<JobWorkMode, string> = {
  presencial: "Presencial",
  hibrido: "Híbrido",
  remoto: "Remoto",
  nao_informado: "Não informado",
};
