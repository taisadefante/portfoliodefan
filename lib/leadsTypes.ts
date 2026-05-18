export type LeadOptionCategory = "niches" | "statuses" | "siteStatuses";

export type LeadOptionItem = {
  value: string;
  label: string;
  messageText?: string;
  messageImage?: string;
};

export type Lead = {
  id?: string;
  companyName: string;
  contactName: string;
  phone: string;
  whatsapp: string;
  email: string;
  niche: string;
  status: string;
  siteStatus: string;
  website: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  observation: string;
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

export const emptyLead: Lead = {
  companyName: "",
  contactName: "",
  phone: "",
  whatsapp: "",
  email: "",
  niche: "Outro",
  status: "nenhum",
  siteStatus: "sem_site",
  website: "",
  linkedin: "",
  facebook: "",
  instagram: "",
  observation: "",
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
          "Olá, tudo bem? Vi que a {empresa} ainda não possui um site profissional. Hoje, muitos clientes pesquisam no Google antes de comprar ou entrar em contato. Posso criar uma landing page moderna, rápida e preparada para gerar contatos pelo WhatsApp, com investimento acessível e entrega ágil.",
      },
      {
        value: "site_desatualizado",
        label: "Site desatualizado",
        messageText:
          "Olá, tudo bem? Analisei a presença digital da {empresa} e percebi que o site atual pode ser modernizado para transmitir mais confiança, carregar melhor no celular e converter mais visitantes em clientes. Posso te mostrar uma proposta simples para renovar essa presença online.",
      },
      {
        value: "so_instagram",
        label: "Só tem Instagram",
        messageText:
          "Olá, tudo bem? Vi que a {empresa} usa bastante as redes sociais. Isso é ótimo, mas ter um site profissional aumenta a confiança, facilita aparecer no Google e centraliza informações, serviços e WhatsApp em um único lugar. Posso criar uma página objetiva para transformar visitantes em contatos.",
      },
      {
        value: "site_bom",
        label: "Site bom",
        messageText: "",
      },
    ],
  };
