import type { Metadata, Viewport } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const siteUrl = "https://defan.com.br";
const secondaryUrl = "https://defansolucoesdigitais.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  applicationName: "Defan Soluções Digitais",

  title: {
    default:
      "Defan Soluções Digitais | Landing Pages, Sites, Sistemas e Automações",
    template: "%s | Defan Soluções Digitais",
  },

  description:
    "Criação de landing pages, websites, sistemas web, dashboards, automações e soluções digitais profissionais para empresas que querem vender melhor e organizar processos.",

  keywords: [
    "Defan Soluções Digitais",
    "landing page profissional",
    "criação de sites",
    "sistemas web",
    "automação empresarial",
    "Next.js",
    "Firebase",
    "dashboard",
    "portfolio digital",
    "site para empresa",
    "sistema personalizado",
    "website profissional",
    "automação whatsapp",
    "crm empresarial",
    "painel administrativo",
    "dashboard financeiro",
    "website Campo Grande",
    "empresa de tecnologia",
  ],

  authors: [
    {
      name: "Tais Defante",
      url: siteUrl,
    },
  ],

  creator: "Tais Defante",

  publisher: "Defan Soluções Digitais",

  category: "Tecnologia",

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Defan Soluções Digitais",

    title:
      "Defan Soluções Digitais | Landing Pages, Sites, Sistemas e Automações",

    description:
      "Projetos digitais profissionais para empresas: landing pages, websites, sistemas, dashboards e automações.",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Defan Soluções Digitais",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Defan Soluções Digitais | Landing Pages, Sites, Sistemas e Automações",

    description:
      "Landing pages, websites, sistemas web e automações para empresas.",

    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],

    shortcut: ["/favicon.ico"],

    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  verification: {
    // google: "SEU_CODIGO_GOOGLE_SEARCH_CONSOLE",
  },

  other: {
    "theme-color": "#020617",
    "msapplication-TileColor": "#020617",
    "business:contact_data:website": siteUrl,
    "business:contact_data:alternate_website": secondaryUrl,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}

        <GoogleAnalytics />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",

              name: "Defan Soluções Digitais",

              url: siteUrl,

              logo: `${siteUrl}/icon.png`,

              sameAs: [secondaryUrl, "https://github.com/taisadefante"],

              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+55-21-98835-9825",
                  contactType: "customer service",
                  areaServed: "BR",
                  availableLanguage: ["Portuguese"],
                },
              ],

              address: {
                "@type": "PostalAddress",
                addressCountry: "BR",
                addressRegion: "MS",
                addressLocality: "Campo Grande",
              },

              description:
                "Empresa especializada em landing pages, websites, sistemas web e automações empresariais.",
            }),
          }}
        />
      </body>
    </html>
  );
}
