"use client";

import Script from "next/script";

const GA_ID_1 = process.env.NEXT_PUBLIC_GA_ID;
const GA_ID_2 = process.env.NEXT_PUBLIC_GA_ID_2;

const gaIds = [GA_ID_1, GA_ID_2].filter(Boolean) as string[];

export default function GoogleAnalytics() {
  if (!gaIds.length) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaIds[0]}`}
        strategy="afterInteractive"
      />

      <Script id="google-analytics-defan" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${gaIds.map((id) => `gtag('config', '${id}', { anonymize_ip: true });`).join("\n")}
        `}
      </Script>
    </>
  );
}
