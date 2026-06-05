import { proofItems } from "./data";

export default function SocialProof() {
  return (
    <section
      style={{
        position: "relative",
        padding: "90px 0",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, rgba(2,6,23,1) 0%, rgba(7,20,47,1) 50%, rgba(2,6,23,1) 100%)",
      }}
    >
      <style jsx>{`
        @keyframes proofEnter {
          from {
            opacity: 0;
            transform: translateY(34px) scale(0.96);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .proof-card-premium:hover {
          transform: translateY(-10px) !important;
          border-color: rgba(56, 189, 248, 0.45) !important;
          box-shadow:
            0 30px 90px rgba(37, 99, 235, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
        }

        .proof-card-premium:hover .proof-icon-premium {
          transform: rotate(-6deg) scale(1.08);
          background: linear-gradient(135deg, #2563eb, #38bdf8) !important;
          color: #fff !important;
        }

        @media (max-width: 980px) {
          .proof-grid-premium {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 640px) {
          section {
            padding: 64px 0 !important;
          }

          .proof-grid-premium {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }

          .proof-card-premium {
            padding: 24px !important;
          }
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "rgba(37,99,235,.15)",
          filter: "blur(100px)",
          top: -160,
          left: -120,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "rgba(56,189,248,.1)",
          filter: "blur(90px)",
          right: -100,
          bottom: -120,
          pointerEvents: "none",
        }}
      />

      <div
        className="container proof-grid-premium"
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(proofItems.length, 4)}, 1fr)`,
          gap: 20,
        }}
      >
        {proofItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <article
              key={item.label}
              className="proof-card-premium"
              style={{
                position: "relative",
                padding: 30,
                borderRadius: 28,
                background:
                  "linear-gradient(145deg, rgba(15,23,42,.88), rgba(2,6,23,.82))",
                border: "1px solid rgba(148,163,184,.16)",
                boxShadow:
                  "0 20px 70px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.05)",
                overflow: "hidden",
                minHeight: 245,
                animation: "proofEnter .8s ease both",
                animationDelay: `${index * 120}ms`,
                transition: "all .35s ease",
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
                className="proof-icon-premium"
                style={{
                  position: "relative",
                  zIndex: 2,
                  width: 54,
                  height: 54,
                  borderRadius: 18,
                  display: "grid",
                  placeItems: "center",
                  color: "#93c5fd",
                  background: "rgba(37,99,235,.16)",
                  border: "1px solid rgba(147,197,253,.18)",
                  marginBottom: 26,
                  transition: "all .35s ease",
                }}
              >
                <Icon size={25} />
              </div>

              <strong
                style={{
                  position: "relative",
                  zIndex: 2,
                  display: "block",
                  color: "#f8fafc",
                  fontSize: "clamp(34px, 4vw, 50px)",
                  lineHeight: 1,
                  letterSpacing: -1.8,
                  marginBottom: 10,
                }}
              >
                {item.value}
              </strong>

              <span
                style={{
                  position: "relative",
                  zIndex: 2,
                  display: "block",
                  color: "#bfdbfe",
                  fontSize: 15,
                  fontWeight: 900,
                  marginBottom: 12,
                }}
              >
                {item.label}
              </span>

              <p
                style={{
                  position: "relative",
                  zIndex: 2,
                  margin: 0,
                  color: "#94a3b8",
                  fontSize: 14,
                  lineHeight: 1.65,
                }}
              >
                {item.small}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
