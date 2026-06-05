import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { heroChecks, whatsappUrl } from "./data";

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "calc(100vh - 64px)",
        padding: "140px 0 90px",
        backgroundImage:
          "linear-gradient(90deg, rgba(2,6,23,.96) 0%, rgba(2,6,23,.88) 30%, rgba(2,6,23,.55) 58%, rgba(2,6,23,.18) 100%), url('/hero-tech-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center right",
        backgroundRepeat: "no-repeat",
      }}
    >
      <style jsx>{`
        @media (max-width: 980px) {
          section {
            min-height: auto !important;
            padding: 110px 0 70px !important;
            background-image:
              linear-gradient(
                180deg,
                rgba(2, 6, 23, 0.96) 0%,
                rgba(2, 6, 23, 0.9) 52%,
                rgba(2, 6, 23, 0.72) 100%
              ),
              url("/hero-tech-bg.png") !important;
            background-position: center top !important;
          }

          .hero-copy-inline {
            text-align: center !important;
            margin: 0 auto !important;
          }

          .hero-copy-inline p {
            margin-left: auto !important;
            margin-right: auto !important;
          }

          .hero-actions-inline,
          .hero-checks-inline,
          .hero-pill-inline {
            justify-content: center !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
        }

        @media (max-width: 640px) {
          section {
            padding: 92px 0 54px !important;
            background-position: center top !important;
          }

          .hero-actions-inline {
            flex-direction: column !important;
          }

          .hero-actions-inline a {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>

      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          className="hero-copy-inline reveal-up"
          style={{
            maxWidth: 760,
          }}
        >
          <span
            className="hero-pill-inline"
            style={{
              width: "fit-content",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              borderRadius: 999,
              color: "#bfdbfe",
              background: "rgba(37,99,235,.18)",
              border: "1px solid rgba(147,197,253,.26)",
              fontSize: 13,
              fontWeight: 900,
              backdropFilter: "blur(12px)",
            }}
          >
            <Sparkles size={15} /> Soluções digitais que geram credibilidade e
            resultados
          </span>

          <h1
            style={{
              margin: "24px 0 24px",
              color: "#f8fafc",
              fontSize: "clamp(44px, 5.6vw, 86px)",
              lineHeight: 0.94,
              letterSpacing: -3.5,
              fontWeight: 950,
              textShadow: "0 18px 60px rgba(0,0,0,.45)",
            }}
          >
            Seu negócio parece{" "}
            <strong style={{ color: "#38bdf8" }}>amador</strong> na internet?
          </h1>

          <p
            style={{
              maxWidth: 650,
              color: "#dbeafe",
              fontSize: 18,
              lineHeight: 1.75,
              margin: "0 0 34px",
              textShadow: "0 10px 35px rgba(0,0,0,.45)",
            }}
          >
            Criamos sites, sistemas e automações que aumentam sua credibilidade,
            organizam sua operação e ajudam sua empresa a vender mais com uma
            presença digital forte.
          </p>

          <div
            className="hero-actions-inline"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              marginBottom: 30,
            }}
          >
            <a
              className="btn btn-primary"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              Solicitar proposta <ArrowRight size={18} />
            </a>

            <a className="btn btn-ghost" href="#projetos">
              Ver projetos reais <ArrowRight size={18} />
            </a>
          </div>

          <div
            className="hero-checks-inline"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {heroChecks.map((item) => (
              <span
                key={item}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  color: "#e0f2fe",
                  fontSize: 14,
                  fontWeight: 800,
                  textShadow: "0 8px 25px rgba(0,0,0,.45)",
                }}
              >
                <CheckCircle2 size={16} color="#38bdf8" /> {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
