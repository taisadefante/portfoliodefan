export type LeadOptionCategory = "niches" | "statuses" | "siteStatuses";

export type LeadOptionItem = {
  value: string;
  label: string;
  messageText?: string;
  messageImage?: string;
};

export type LeadTemperature = "frio" | "morno" | "quente";

export type Lead = {
  id?: string;
  companyName: string;
  contactName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  niche: string;
  status: string;
  siteStatus: string;
  website: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  observation: string;
  score?: number;
  temperature?: LeadTemperature;
  nextContactDate?: string;
  contactHistory?: unknown[];
  createdAt?: string;
  updatedAt?: string;
};

export type LeadContact = {
  id?: string;
  leadId: string;
  companyName: string;
  contactDate: string;
  observation: string;
  createdAt?: string;
  updatedAt?: string;
};

export type LeadSaleInstallment = {
  id: string;
  number: number;
  amount: string;
  dueDate: string;
  paid: boolean;
  paidDate: string;
  paymentMethod: string;
  receiptLink: string;
  note: string;
};

export type LeadSaleType = "unica" | "parcelada" | "recorrente";

export type LeadSaleStatus = "ativa" | "cancelada" | "finalizada";

export type LeadPaymentStatus = "pendente" | "pago" | "vencido" | "cancelado";

export type LeadSalePayment = {
  id?: string;
  saleId: string;
  leadId: string;
  companyName: string;
  projectName: string;
  saleType: LeadSaleType;
  number: number;
  amount: string;
  dueDate: string;
  paidDate: string;
  paymentMethod: string;
  receiptLink: string;
  note: string;
  status: LeadPaymentStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type LeadSale = {
  id?: string;
  leadId: string;
  companyName: string;
  projectName: string;
  projectType: string;
  projectLink: string;
  deployLink: string;
  databaseName: string;
  image: string;
  amount: string;
  paymentMethod: string;
  paymentStatus: string;
  saleDate: string;
  deliveryDate: string;
  contractLink: string;
  includedItems: string;
  accessInfo: string;
  notes: string;

  isInstallment: boolean;
  installmentsTotal: string;
  firstInstallmentDueDate: string;
  installments: LeadSaleInstallment[];

  saleType: LeadSaleType;
  saleStatus: LeadSaleStatus;
  monthlyAmount: string;
  recurringMonths: string;
  firstPaymentDueDate: string;

  createdAt?: string;
  updatedAt?: string;
};

/* =========================
   PROJETOS
========================= */

export type OptionCategory =
  | "types"
  | "niches"
  | "technologies"
  | "commercialModels";

export type Project = {
  id?: string;

  name: string;

  type: string;

  niche: string;

  commercialModel: string;

  startingPrice?: string;

  monthlyPrice?: string;

  technologies: string[];

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

export const emptyLead: Lead = {
  companyName: "",
  contactName: "",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  niche: "Outro",
  status: "nenhum",
  siteStatus: "sem_site",
  website: "",
  linkedin: "",
  facebook: "",
  instagram: "",
  observation: "",
  score: 0,
  temperature: "frio",
  nextContactDate: "",
};

export const emptyLeadContact: LeadContact = {
  leadId: "",
  companyName: "",
  contactDate: "",
  observation: "",
};

export const emptyLeadSale: LeadSale = {
  leadId: "",
  companyName: "",
  projectName: "",
  projectType: "",
  projectLink: "",
  deployLink: "",
  databaseName: "",
  image: "",
  amount: "",
  paymentMethod: "Pix",
  paymentStatus: "pendente",
  saleDate: "",
  deliveryDate: "",
  contractLink: "",
  includedItems: "",
  accessInfo: "",
  notes: "",

  isInstallment: false,
  installmentsTotal: "",
  firstInstallmentDueDate: "",
  installments: [],

  saleType: "unica",
  saleStatus: "ativa",
  monthlyAmount: "",
  recurringMonths: "12",
  firstPaymentDueDate: "",
};

export const leadOptionCategoryLabels: Record<LeadOptionCategory, string> = {
  niches: "Nichos",
  statuses: "Status da venda",
  siteStatuses: "Situação do site e mensagens",
};

export const defaultLeadOptions: Record<LeadOptionCategory, LeadOptionItem[]> =
  {
    niches: [
      { value: "clinica", label: "Clínica" },
      { value: "loja", label: "Loja" },
      { value: "servicos", label: "Prestação de serviços" },
      { value: "restaurante", label: "Restaurante" },
      { value: "eventos", label: "Eventos" },
      { value: "outro", label: "Outro" },
    ],

    statuses: [
      { value: "nenhum", label: "Nenhum" },
      { value: "interessado", label: "Interessado" },
      { value: "sem_interesse", label: "Sem interesse" },
      { value: "cliente", label: "Cliente" },
    ],

    siteStatuses: [
      {
        value: "sem_site",
        label: "Não possui site",
        messageText:
          "Olá, tudo bem? Vi que a {empresa} ainda não possui um site profissional.",
      },

      {
        value: "site_desatualizado",
        label: "Site desatualizado",
        messageText: "Olá, tudo bem? Analisei a presença digital da {empresa}.",
      },

      {
        value: "so_instagram",
        label: "Só tem Instagram",
        messageText:
          "Olá, tudo bem? Vi que a {empresa} usa bastante as redes sociais.",
      },

      {
        value: "site_bom",
        label: "Site bom",
        messageText: "",
      },
    ],
  };
