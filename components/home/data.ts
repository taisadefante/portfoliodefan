import {
  BadgeCheck,
  Bot,
  Code2,
  Crown,
  Gem,
  Globe2,
  LayoutDashboard,
  Rocket,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import type { ServiceItem } from "./types";

export const whatsappNumber = "5521988359825";

export const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  "Olá, Tais! Vi o site da Defan e quero uma proposta para site, sistema ou automação.",
)}`;

export const navItems = [
  { label: "Serviços", href: "#servicos" },
  { label: "Projetos", href: "/projetos" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "FAQ", href: "#faq" },
  { label: "Contato", href: "#contato" },
];

export const services: ServiceItem[] = [
  {
    icon: Rocket,
    title: "Landing Pages",
    description:
      "Páginas estratégicas para transformar visitantes em contatos e aumentar suas conversões.",
  },
  {
    icon: Globe2,
    title: "Websites",
    description:
      "Sites profissionais, responsivos e rápidos para transmitir credibilidade e gerar negócios.",
  },
  {
    icon: LayoutDashboard,
    title: "Sistemas",
    description:
      "Sistemas sob medida com painéis, cadastros, relatórios, dashboards e muito mais.",
  },
  {
    icon: Zap,
    title: "Automações",
    description:
      "Reduza tarefas repetitivas, padronize processos e ganhe tempo para focar no que importa.",
  },
  {
    icon: Workflow,
    title: "Integrações",
    description:
      "Integração com APIs, Firebase, WhatsApp, e-mail, pagamentos e ferramentas externas.",
  },
  {
    icon: Crown,
    title: "Assinatura mensal",
    description:
      "Comece com menor investimento e evolua seu sistema conforme seu negócio cresce.",
  },
];

export const techItems = [
  "Next.js",
  "React",
  "TypeScript",
  "Firebase",
  "Firestore",
  "APIs",
  "WhatsApp",
  "E-mail",
  "Pagamentos",
  "Integrações",
  "Dashboards",
  "CRM",
  "Painel Admin",
  "SaaS",
];

export const values = [
  {
    icon: ShieldCheck,
    title: "Estratégia",
    text: "Cada projeto nasce para comunicar melhor, gerar confiança e facilitar a decisão do cliente.",
  },
  {
    icon: BadgeCheck,
    title: "Execução profissional",
    text: "Do layout ao funcionamento, a entrega é conduzida com organização e cuidado técnico.",
  },
  {
    icon: Gem,
    title: "Solução sob medida",
    text: "Cada página, sistema ou automação recebe identidade, propósito e adaptação ao negócio.",
  },
];

export const testimonials = [
  {
    name: "Mariana Alves",
    company: "Consultoria Empresarial",
    text: "A nova presença digital deixou a empresa mais profissional, clara e segura para apresentar aos clientes.",
  },
  {
    name: "Rafael Martins",
    company: "Serviços e Manutenção",
    text: "A organização do sistema melhorou nossa rotina. Ficou muito mais fácil acompanhar dados e clientes.",
  },
  {
    name: "Camila Ferreira",
    company: "Clínica de Estética",
    text: "A página ficou elegante, objetiva e transmitiu muito mais credibilidade para divulgar meus serviços.",
  },
];

export const faqs = [
  {
    question: "A Defan cria projetos por assinatura mensal?",
    answer:
      "Sim. Essa opção é indicada para empresas que querem começar com menor investimento inicial e ter uma solução profissional em funcionamento.",
  },
  {
    question: "Também é possível criar algo totalmente personalizado?",
    answer:
      "Sim. Projetos personalizados são indicados quando a empresa precisa de regras próprias, módulos específicos, integrações ou fluxos exclusivos.",
  },
  {
    question: "Os projetos funcionam no celular?",
    answer:
      "Sim. As páginas e sistemas são pensadas para funcionar bem em computador, tablet e celular.",
  },
  {
    question: "Posso evoluir meu projeto depois?",
    answer:
      "Sim. O projeto pode começar simples e evoluir com novas páginas, módulos, integrações e automações.",
  },
];

export const heroChecks = [
  "Entrega rápida",
  "Tecnologia moderna",
  "Suporte próximo",
  "Foco em resultados",
];

export const heroStats = [
  { label: "Receita no mês", value: "R$ 128.750" },
  { label: "Novos clientes", value: "248" },
  { label: "Vendas", value: "1.482" },
];

export const proofItems = [
  {
    icon: Sparkles,
    value: "5.0",
    label: "Avaliação Google",
    small: "Experiência profissional e atendimento próximo",
  },
  {
    icon: Code2,
    value: "+200",
    label: "Projetos entregues",
    small: "Sites, sistemas e automações",
  },
  {
    icon: LayoutDashboard,
    value: "+50",
    label: "Sistemas desenvolvidos",
    small: "Soluções personalizadas",
  },
  {
    icon: BadgeCheck,
    value: "100%",
    label: "Clientes satisfeitos",
    small: "Compromisso com resultados",
  },
];
