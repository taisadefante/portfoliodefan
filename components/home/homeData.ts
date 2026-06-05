import {
  BadgeCheck,
  Bot,
  Code2,
  Gem,
  Globe2,
  LayoutDashboard,
  Rocket,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import type { Project } from "./types";

export const colors = {
  bg: "#020617",
  panel: "rgba(15, 23, 42, 0.74)",
  panelStrong: "rgba(15, 23, 42, 0.92)",
  border: "rgba(125, 211, 252, 0.13)",
  borderStrong: "rgba(125, 211, 252, 0.28)",
  text: "#f8fafc",
  muted: "#cbd5e1",
  soft: "#94a3b8",
  blue: "#38bdf8",
  gold: "#facc15",
};

export const whatsappUrl = `https://wa.me/5521988359825?text=${encodeURIComponent(
  "Olá, Tais! Vi seu portfólio da Defan e quero uma proposta para site, sistema ou automação.",
)}`;

export const services = [
  {
    icon: Rocket,
    title: "Landing Pages",
    description:
      "Páginas estratégicas para transformar visitantes em contatos, apresentar sua oferta com clareza e fortalecer sua presença digital.",
  },
  {
    icon: Globe2,
    title: "Websites",
    description:
      "Sites profissionais, responsivos e bem estruturados para empresas que precisam transmitir confiança desde o primeiro acesso.",
  },
  {
    icon: LayoutDashboard,
    title: "Sistemas",
    description:
      "Sistemas sob medida com painéis, cadastros, relatórios, dashboards, CRM, financeiro e áreas administrativas.",
  },
  {
    icon: Workflow,
    title: "Automações",
    description:
      "Automações para reduzir tarefas repetitivas, padronizar processos e tornar a operação mais ágil e organizada.",
  },
  {
    icon: Bot,
    title: "Integrações",
    description:
      "Integrações com APIs, Firebase, WhatsApp, e-mail, pagamentos, bancos de dados e ferramentas externas.",
  },
  {
    icon: Code2,
    title: "Assinatura mensal",
    description:
      "Modelos profissionais para empresas que desejam iniciar com menor investimento e evoluir com novas funcionalidades.",
  },
];

export const carouselItems = [
  "Landing Pages",
  "Websites",
  "Sistemas Web",
  "Automações",
  "Dashboards",
  "CRM",
  "Painel Admin",
  "Next.js",
  "React",
  "TypeScript",
  "Firebase",
  "Firestore",
  "Storage",
  "APIs",
  "WhatsApp",
  "E-mail",
  "Pagamentos",
  "Relatórios",
];

export const values = [
  {
    icon: ShieldCheck,
    title: "Estratégia",
    text: "Cada projeto é pensado para comunicar melhor, gerar confiança e facilitar a decisão do cliente.",
  },
  {
    icon: BadgeCheck,
    title: "Execução profissional",
    text: "Do layout ao funcionamento, a entrega é conduzida com organização, cuidado técnico e atenção aos detalhes.",
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
    text: "A organização do sistema melhorou nossa rotina. Ficou mais fácil acompanhar dados, clientes e processos.",
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
