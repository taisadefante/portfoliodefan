import type { Metadata } from "next";

const siteUrl = "https://defan.com.br";

export const metadata: Metadata = {
  title: "Projetos Digitais por Assinatura e Personalizados",
  description:
    "Catálogo de projetos digitais da Defan: landing pages, websites, sistemas web, dashboards, automações e soluções personalizadas para empresas.",
  alternates: {
    canonical: `${siteUrl}/projetos`,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${siteUrl}/projetos`,
    siteName: "Defan Soluções Digitais",
    title: "Projetos Digitais por Assinatura e Personalizados | Defan",
    description:
      "Veja projetos digitais cadastrados: sites, landing pages, sistemas, dashboards e automações para empresas.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Projetos Defan Soluções Digitais",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projetos Digitais | Defan Soluções Digitais",
    description:
      "Catálogo de soluções digitais por assinatura e projetos personalizados.",
    images: ["/og-image.png"],
  },
};

export default function ProjetosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
