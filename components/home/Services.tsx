import { services } from "./data";
import SectionTitle from "./SectionTitle";

export default function Services() {
  return (
    <section id="servicos" className="section-block">
      <style jsx>{`
        @keyframes serviceEnter {
          0% {
            opacity: 0;
            transform: translateY(42px) scale(0.94);
            filter: blur(10px);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        .service-card-premium {
          animation: serviceEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .service-card-premium:hover {
          transform: translateY(-12px) scale(1.02) !important;
          border-color: rgba(56, 189, 248, 0.45) !important;
          box-shadow:
            0 35px 90px rgba(37, 99, 235, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
        }

        .service-card-premium:hover .service-icon-premium {
          background: linear-gradient(135deg, #2563eb, #38bdf8) !important;
          color: white !important;
          transform: rotate(-7deg) scale(1.08);
        }

        .service-card-premium:hover .card-arrow-premium {
          transform: translate(6px, -6px);
          color: #38bdf8 !important;
        }

        @media (max-width: 980px) {
          .services-grid-premium {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 640px) {
          .services-grid-premium {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }

          .service-card-premium {
            padding: 24px !important;
            min-height: auto !important;
          }
        }
      `}</style>

      <div className="container">
        <SectionTitle
          eyebrow="Serviços"
          title="Soluções digitais para empresas que precisam transmitir confiança"
        />

        <div
          className="services-grid-premium"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 22,
            marginTop: 46,
          }}
        >
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <article
                className="service-card-premium"
                key={service.title}
                style={{
                  position: "relative",
                  minHeight: 300,
                  padding: 30,
                  borderRadius: 30,
                  background:
                    "linear-gradient(145deg, rgba(15,23,42,.9), rgba(2,6,23,.84))",
                  border: "1px solid rgba(148,163,184,.16)",
                  boxShadow:
                    "0 22px 70px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.05)",
                  overflow: "hidden",
                  animationDelay: `${index * 140}ms`,
                  transition: "all .38s ease",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle at top right, rgba(56,189,248,.14), transparent 42%)",
                    pointerEvents: "none",
                  }}
                />

                <div
                  className="service-icon-premium"
                  style={{
                    position: "relative",
                    zIndex: 2,
                    width: 60,
                    height: 60,
                    borderRadius: 20,
                    display: "grid",
                    placeItems: "center",
                    color: "#93c5fd",
                    background: "rgba(37,99,235,.16)",
                    border: "1px solid rgba(147,197,253,.18)",
                    marginBottom: 28,
                    transition: "all .35s ease",
                  }}
                >
                  <Icon size={30} />
                </div>

                <div style={{ position: "relative", zIndex: 2 }}>
                  <h3
                    style={{
                      margin: "0 0 14px",
                      color: "#f8fafc",
                      fontSize: 24,
                      lineHeight: 1.15,
                      letterSpacing: -0.8,
                    }}
                  >
                    {service.title}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: "#94a3b8",
                      fontSize: 15,
                      lineHeight: 1.7,
                    }}
                  >
                    {service.description}
                  </p>
                </div>

                <span
                  className="card-arrow-premium"
                  style={{
                    position: "absolute",
                    right: 24,
                    bottom: 22,
                    zIndex: 2,
                    color: "#64748b",
                    fontSize: 28,
                    fontWeight: 900,
                    transition: "all .35s ease",
                  }}
                >
                  ↗
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
