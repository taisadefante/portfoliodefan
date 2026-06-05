import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";
import { heroChecks, whatsappUrl } from "./data";

const metrics = [
  { label: "Receita no mês", value: "R$ 128.750", icon: WalletCards, change: "+18.4%" },
  { label: "Novos clientes", value: "248", icon: Users, change: "+12.8%" },
  { label: "Conversões", value: "1.482", icon: TrendingUp, change: "+24.3%" },
];

const sidebarItems = ["Dashboard", "Clientes", "Vendas", "Financeiro", "Relatórios", "Automações"];

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-copy reveal-up">
          <span className="hero-pill">
            <Sparkles size={15} /> Soluções digitais que geram credibilidade e resultados
          </span>

          <h1>
            Seu negócio parece <strong>amador</strong> na internet?
          </h1>

          <p>
            Criamos sites, sistemas e automações que aumentam sua credibilidade, organizam sua operação
            e ajudam sua empresa a vender mais com uma presença digital forte.
          </p>

          <div className="hero-actions">
            <a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
              Solicitar proposta <ArrowRight size={18} />
            </a>

            <a className="btn btn-ghost" href="#projetos">
              Ver projetos reais <ArrowRight size={18} />
            </a>
          </div>

          <div className="hero-checks">
            {heroChecks.map((item) => (
              <span key={item}>
                <CheckCircle2 size={16} /> {item}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-mockup reveal-float" aria-label="Dashboard profissional Defan">
          <div className="mockup-orb mockup-orb-1" />
          <div className="mockup-orb mockup-orb-2" />

          <div className="dashboard-card professional-dashboard">
            <div className="dashboard-sidebar">
              <Image src="/logo-white.png" alt="Defan" width={115} height={40} priority />
              {sidebarItems.map((item, index) => (
                <span key={item} className={index === 0 ? "active" : ""}>
                  {item}
                </span>
              ))}
            </div>

            <div className="dashboard-main">
              <div className="dashboard-top">
                <div className="search">
                  <Search size={14} /> Buscar projeto, cliente ou venda...
                </div>
                <span>Olá, Defan</span>
              </div>

              <div className="dashboard-heading-row">
                <div>
                  <small>Visão geral</small>
                  <h3>Performance digital</h3>
                </div>
                <span className="live-badge">Ao vivo</span>
              </div>

              <div className="stat-grid professional-stats">
                {metrics.map((metric, index) => {
                  const Icon = metric.icon;

                  return (
                    <div key={metric.label} className="stat-box pro-stat" style={{ animationDelay: `${index * 110}ms` }}>
                      <div className="stat-icon"><Icon size={17} /></div>
                      <small>{metric.label}</small>
                      <strong>{metric.value}</strong>
                      <em>{metric.change}</em>
                    </div>
                  );
                })}
              </div>

              <div className="analytics-grid">
                <div className="chart-card pro-chart-card">
                  <div className="chart-header">
                    <div>
                      <span>Vendas e conversões</span>
                      <strong>Últimos 7 dias</strong>
                    </div>
                    <em>+31%</em>
                  </div>

                  <svg className="revenue-chart" viewBox="0 0 520 190" role="img" aria-label="Gráfico de crescimento">
                    <defs>
                      <linearGradient id="areaBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.55" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.03" />
                      </linearGradient>
                      <linearGradient id="lineBlue" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="55%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#93c5fd" />
                      </linearGradient>
                    </defs>

                    {[35, 75, 115, 155].map((y) => (
                      <line key={y} x1="0" x2="520" y1={y} y2={y} className="chart-grid-line" />
                    ))}

                    <path
                      className="chart-area"
                      d="M0 150 C 45 132, 58 94, 105 104 C 153 115, 162 55, 210 63 C 250 70, 268 125, 315 100 C 365 75, 382 36, 430 48 C 474 59, 486 34, 520 26 L520 190 L0 190 Z"
                    />
                    <path
                      className="chart-line"
                      d="M0 150 C 45 132, 58 94, 105 104 C 153 115, 162 55, 210 63 C 250 70, 268 125, 315 100 C 365 75, 382 36, 430 48 C 474 59, 486 34, 520 26"
                    />
                    {[0, 105, 210, 315, 430, 520].map((x, index) => {
                      const y = [150, 104, 63, 100, 48, 26][index];
                      return <circle key={x} cx={x} cy={y} r="5" className="chart-dot" />;
                    })}
                  </svg>
                </div>

                <div className="side-analytics">
                  <div className="conversion-ring">
                    <svg viewBox="0 0 120 120" aria-label="Taxa de conversão">
                      <circle cx="60" cy="60" r="48" />
                      <circle cx="60" cy="60" r="48" />
                    </svg>
                    <div>
                      <strong>87%</strong>
                      <span>Taxa de conversão</span>
                    </div>
                  </div>

                  <div className="progress-list">
                    {[
                      ["Landing pages", "92%"],
                      ["Sistemas", "81%"],
                      ["Automações", "76%"],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <span>{label}<b>{value}</b></span>
                        <i><em style={{ width: value }} /></i>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="activity-card pro-activity">
                <strong>Atividades recentes</strong>
                <span>Novo cliente cadastrado · há 2 horas</span>
                <span>Pagamento recebido · há 5 horas</span>
                <span>Automação concluída · hoje</span>
              </div>
            </div>
          </div>

          <div className="phone-card pro-phone-card">
            <span>Receita</span>
            <strong>R$ 128.750</strong>
            <svg viewBox="0 0 180 90" aria-label="Gráfico mobile">
              <path d="M0 68 C25 50 38 72 62 48 C84 26 98 38 118 29 C142 18 158 28 180 10" />
              <path d="M0 68 C25 50 38 72 62 48 C84 26 98 38 118 29 C142 18 158 28 180 10 L180 90 L0 90 Z" />
            </svg>
          </div>

          <div className="floating-badge">
            <ShieldCheck size={24} /> Soluções que transformam negócios
          </div>
        </div>
      </div>
    </section>
  );
}
