"use client";

export default function MensalidadeSection() {
  return (
    <section
      style={{
        padding: "70px 20px",
        background: "linear-gradient(135deg, #020617 0%, #03142f 100%)",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 420px",
          gap: "42px",
          alignItems: "center",
        }}
      >
        <div>
          <span
            style={{
              display: "inline-block",
              padding: "8px 16px",
              borderRadius: "999px",
              border: "1px solid rgba(56,189,248,.35)",
              color: "#38bdf8",
              fontSize: "13px",
              fontWeight: 800,
              marginBottom: "18px",
            }}
          >
            PROJETOS POR MENSALIDADE
          </span>

          <h2
            style={{
              color: "#fff",
              fontSize: "clamp(34px, 4vw, 52px)",
              lineHeight: "1.08",
              fontWeight: 900,
              margin: "0 0 18px",
              maxWidth: "720px",
            }}
          >
            Site, sistema ou automação sem investir milhares de reais
          </h2>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: "18px",
              lineHeight: "1.7",
              maxWidth: "680px",
              marginBottom: "28px",
            }}
          >
            Na Defan, sua empresa pode começar com um projeto profissional por
            mensalidade, com planos acessíveis e soluções sob medida.
          </p>

          <a
            href="https://wa.me/5521988359825"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              padding: "14px 24px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #2563eb, #38bdf8)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 800,
              boxShadow: "0 0 25px rgba(56,189,248,.25)",
            }}
          >
            Solicitar proposta
          </a>
        </div>

        <div
          style={{
            border: "1px solid rgba(56,189,248,.2)",
            borderRadius: "28px",
            padding: "28px",
            background: "rgba(15,23,42,.65)",
          }}
        >
          <div
            style={{
              textAlign: "center",
              border: "1px solid rgba(56,189,248,.2)",
              borderRadius: "22px",
              padding: "28px 20px",
              marginBottom: "24px",
            }}
          >
            <p style={{ color: "#fff", fontWeight: 800, margin: 0 }}>
              PLANOS A PARTIR DE
            </p>

            <strong
              style={{
                display: "block",
                fontSize: "64px",
                color: "#38bdf8",
                lineHeight: 1,
                margin: "10px 0",
              }}
            >
              R$ 50
            </strong>

            <p style={{ color: "#fff", fontWeight: 700, margin: 0 }}>
              por mês*
            </p>
          </div>

          {[
            "Baixo investimento inicial",
            "Projeto profissional sob medida",
            "Sites, sistemas e automações",
            "Planos flexíveis para sua empresa",
          ].map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                color: "#fff",
                fontSize: "16px",
                marginBottom: "14px",
              }}
            >
              <span
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "#2563eb",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontWeight: 900,
                }}
              >
                ✓
              </span>
              {item}
            </div>
          ))}

          <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "18px" }}>
            *Valor inicial sujeito ao escopo e funcionalidades do projeto.
          </p>
        </div>
      </div>
    </section>
  );
}