"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  MessageCircle,
  RotateCcw,
  Search,
  X,
} from "lucide-react";

import { auth } from "@/lib/firebase";
import {
  cancelFutureLeadSalePayments,
  confirmLeadSalePaymentAsPaid,
  getLeadSalePayments,
  markLeadSalePaymentAsPaid,
  markLeadSalePaymentAsPending,
  saveLeadSalePayment,
} from "@/lib/leadsFirestore";
import { LeadSalePayment } from "@/lib/leadsTypes";
import AdminMenu from "../../../components/admin/AdminMenu.tsx";

const colors = {
  panel: "rgba(15, 23, 42, 0.78)",
  panelStrong: "rgba(15, 23, 42, 0.94)",
  border: "rgba(125, 211, 252, 0.18)",
  borderStrong: "rgba(125, 211, 252, 0.34)",
  text: "#f8fafc",
  muted: "#cbd5e1",
  soft: "#94a3b8",
};

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 15% 0%, rgba(14,165,233,0.24), transparent 32%), radial-gradient(circle at 90% 8%, rgba(56,189,248,0.12), transparent 30%), linear-gradient(180deg, #020617 0%, #071426 50%, #020617 100%)",
    color: colors.text,
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  shell: {
    width: "min(1500px, calc(100% - 40px))",
    margin: "0 auto",
    padding: "28px 0 70px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 22,
    padding: 22,
    borderRadius: 30,
    background: "rgba(15, 23, 42, 0.72)",
    border: `1px solid ${colors.border}`,
    boxShadow: "0 24px 80px rgba(0,0,0,0.24)",
    marginBottom: 22,
  },
  headerLogo: { width: "auto", height: 72, objectFit: "contain" },
  title: {
    margin: 0,
    fontSize: "clamp(26px, 3vw, 42px)",
    letterSpacing: "-0.055em",
  },
  subText: { color: colors.muted, margin: "8px 0 0", lineHeight: 1.55 },
  button: {
    border: 0,
    borderRadius: 16,
    padding: "13px 16px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontWeight: 900,
    cursor: "pointer",
    color: "#fff",
    background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
    boxShadow: "0 16px 38px rgba(14,165,233,0.22)",
  },
  secondaryButton: {
    borderRadius: 16,
    padding: "13px 16px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontWeight: 900,
    cursor: "pointer",
    color: "#e0f2fe",
    background: "rgba(15,23,42,0.7)",
    border: `1px solid ${colors.border}`,
  },
  card: {
    borderRadius: 30,
    padding: 24,
    background: colors.panel,
    border: `1px solid ${colors.border}`,
    boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
  },
  cardTitle: { margin: "0 0 6px", fontSize: 26, letterSpacing: "-0.04em" },
  cardSub: { margin: "0 0 22px", color: colors.soft, lineHeight: 1.55 },
  input: {
    width: "100%",
    border: `1px solid ${colors.border}`,
    background: "rgba(2,6,23,0.45)",
    color: colors.text,
    outline: "none",
    borderRadius: 16,
    padding: "13px 14px",
  },
  select: {
    width: "100%",
    border: `1px solid ${colors.border}`,
    background: "rgba(2,6,23,0.9)",
    color: colors.text,
    outline: "none",
    borderRadius: 16,
    padding: "13px 14px",
  },
  label: { color: "#dbeafe", fontSize: 13, fontWeight: 900 },
  field: { display: "grid", gap: 8 },
  notice: {
    borderRadius: 18,
    padding: "14px 16px",
    margin: "0 0 18px",
    color: "#e0f2fe",
    background: "rgba(14,165,233,0.12)",
    border: `1px solid ${colors.borderStrong}`,
  },
  loginWrap: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 22,
  },
  loginCard: {
    width: "min(1060px, 100%)",
    display: "grid",
    gridTemplateColumns: "1fr 0.9fr",
    overflow: "hidden",
    borderRadius: 36,
    background: colors.panelStrong,
    border: `1px solid ${colors.borderStrong}`,
    boxShadow: "0 40px 120px rgba(0,0,0,0.38)",
  },
  loginBrand: {
    padding: 46,
    background:
      "radial-gradient(circle at 30% 20%, rgba(56,189,248,0.26), transparent 38%), linear-gradient(145deg, rgba(8,47,73,0.92), rgba(15,23,42,0.82))",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 620,
  },
  loginForm: {
    padding: 46,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 90,
    background: "rgba(2,6,23,0.78)",
    display: "grid",
    placeItems: "center",
    padding: 18,
  },
  modal: {
    width: "min(520px, 100%)",
    borderRadius: 28,
    padding: 24,
    background: "#0f172a",
    border: `1px solid ${colors.borderStrong}`,
    boxShadow: "0 40px 120px rgba(0,0,0,0.5)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 18,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 20,
  },
};

const monthOptions = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

function parseMoney(value?: string) {
  if (!value) return 0;
  return Number(String(value).replace(/\./g, "").replace(",", ".")) || 0;
}

function money(value?: string | number) {
  const number = typeof value === "number" ? value : parseMoney(value);
  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value?: string) {
  if (!value) return "-";
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getCurrentYear() {
  return String(new Date().getFullYear());
}

function getCurrentMonth() {
  return String(new Date().getMonth() + 1).padStart(2, "0");
}

function isOverdue(payment: LeadSalePayment) {
  if (payment.status !== "pendente") return false;
  if (!payment.dueDate) return false;

  const today = new Date().toISOString().slice(0, 10);
  return payment.dueDate < today;
}

function getPaymentDateParts(payment: LeadSalePayment) {
  const [year = "", month = "", day = ""] = String(payment.dueDate || "").split(
    "-",
  );
  return { year, month, day };
}

export default function AdminFinanceiroPage() {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [payments, setPayments] = useState<LeadSalePayment[]>([]);
  const [search, setSearch] = useState("");
  const [clientFilter, setClientFilter] = useState("todos");
  const [yearFilter, setYearFilter] = useState(getCurrentYear());
  const [monthFilter, setMonthFilter] = useState(getCurrentMonth());
  const [dayFilter, setDayFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [message, setMessage] = useState("");

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentToPay, setPaymentToPay] = useState<LeadSalePayment | null>(
    null,
  );
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().slice(0, 10),
  );

  const isAllowed = useMemo(() => {
    if (!user?.email || !adminEmail) return false;
    return user.email.toLowerCase() === adminEmail.toLowerCase();
  }, [user, adminEmail]);

  async function loadPayments() {
    const list = await getLeadSalePayments();
    setPayments(list);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);

      if (currentUser) {
        await loadPayments();
      }
    });

    return () => unsubscribe();
  }, []);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setMessage("Informe o e-mail e a senha.");
      return;
    }

    try {
      setLoggingIn(true);
      await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
    } catch (error) {
      console.error(error);
      setMessage("E-mail ou senha inválidos.");
    } finally {
      setLoggingIn(false);
    }
  }

  async function logout() {
    await signOut(auth);
  }

  const clientOptions = useMemo(() => {
    const map = new Map<string, string>();

    payments.forEach((payment) => {
      const leadId = payment.leadId || payment.companyName;
      const companyName = payment.companyName || "Cliente sem nome";

      if (leadId) {
        map.set(leadId, companyName);
      }
    });

    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [payments]);

  const yearOptions = useMemo(() => {
    const years = new Set<string>();

    payments.forEach((payment) => {
      const { year } = getPaymentDateParts(payment);
      if (year) years.add(year);
    });

    years.add(getCurrentYear());

    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [payments]);

  const dayOptions = useMemo(() => {
    const days = new Set<string>();

    payments.forEach((payment) => {
      const { year, month, day } = getPaymentDateParts(payment);

      const matchesClient =
        clientFilter === "todos" ||
        payment.leadId === clientFilter ||
        payment.companyName === clientFilter;

      const matchesYear = !yearFilter || year === yearFilter;
      const matchesMonth = monthFilter === "todos" || month === monthFilter;

      if (matchesClient && matchesYear && matchesMonth && day) {
        days.add(day);
      }
    });

    return Array.from(days).sort((a, b) => Number(a) - Number(b));
  }, [payments, clientFilter, yearFilter, monthFilter]);

  const filteredPayments = useMemo(() => {
    const term = normalizeText(search.trim());

    return payments.filter((payment) => {
      const { year, month, day } = getPaymentDateParts(payment);
      const realStatus = isOverdue(payment) ? "vencido" : payment.status;

      const matchesClient =
        clientFilter === "todos" ||
        payment.leadId === clientFilter ||
        payment.companyName === clientFilter;

      const matchesYear = !yearFilter || year === yearFilter;
      const matchesMonth = monthFilter === "todos" || month === monthFilter;
      const matchesDay = dayFilter === "todos" || day === dayFilter;
      const matchesStatus =
        statusFilter === "todos" || realStatus === statusFilter;

      const text = normalizeText(
        [
          payment.companyName,
          payment.projectName,
          payment.paymentMethod,
          payment.note,
          payment.status,
        ].join(" "),
      );

      return (
        matchesClient &&
        matchesYear &&
        matchesMonth &&
        matchesDay &&
        matchesStatus &&
        (!term || text.includes(term))
      );
    });
  }, [
    payments,
    search,
    clientFilter,
    yearFilter,
    monthFilter,
    dayFilter,
    statusFilter,
  ]);

  const totals = useMemo(() => {
    const received = filteredPayments
      .filter((item) => item.status === "pago")
      .reduce((sum, item) => sum + parseMoney(item.amount), 0);

    const pending = filteredPayments
      .filter((item) => item.status === "pendente" && !isOverdue(item))
      .reduce((sum, item) => sum + parseMoney(item.amount), 0);

    const overdue = filteredPayments
      .filter((item) => isOverdue(item))
      .reduce((sum, item) => sum + parseMoney(item.amount), 0);

    const canceled = filteredPayments
      .filter((item) => item.status === "cancelado")
      .reduce((sum, item) => sum + parseMoney(item.amount), 0);

    return { received, pending, overdue, canceled };
  }, [filteredPayments]);

  function clearFilters() {
    setSearch("");
    setClientFilter("todos");
    setYearFilter(getCurrentYear());
    setMonthFilter(getCurrentMonth());
    setDayFilter("todos");
    setStatusFilter("todos");
  }

  function openPaymentModal(payment: LeadSalePayment) {
    setPaymentToPay(payment);
    setPaymentDate(payment.paidDate || new Date().toISOString().slice(0, 10));
    setPaymentModalOpen(true);
  }

  function closePaymentModal() {
    setPaymentModalOpen(false);
    setPaymentToPay(null);
    setPaymentDate(new Date().toISOString().slice(0, 10));
  }

  async function confirmPayment() {
    if (!paymentToPay) return;

    await confirmLeadSalePaymentAsPaid(
      paymentToPay,
      paymentDate || new Date().toISOString().slice(0, 10),
    );

    await loadPayments();
    closePaymentModal();
    setMessage("Pagamento marcado como pago.");
  }

  async function handlePending(payment: LeadSalePayment) {
    await markLeadSalePaymentAsPending(payment);
    await loadPayments();
    setMessage("Baixa removida.");
  }

  async function handleReactivatePayment(payment: LeadSalePayment) {
    const confirmed = window.confirm(
      "Deseja reativar esta cobrança e voltar o status para pendente?",
    );

    if (!confirmed) return;

    await saveLeadSalePayment({
      ...payment,
      status: "pendente",
      paidDate: "",
    });

    await loadPayments();
    setMessage("Cobrança reativada com sucesso.");
  }

  async function handleCancelFuture(payment: LeadSalePayment) {
    if (!payment.saleId) return;

    const confirmed = window.confirm(
      "Deseja cancelar este pagamento e todos os próximos não pagos?",
    );

    if (!confirmed) return;

    await cancelFutureLeadSalePayments(payment.saleId, payment.number);
    await loadPayments();
    setMessage("Pagamentos futuros cancelados.");
  }

  async function handleEditPayment(payment: LeadSalePayment) {
    const newAmount = window.prompt("Novo valor:", payment.amount);
    if (newAmount === null) return;

    const newDueDate = window.prompt(
      "Novo vencimento no formato AAAA-MM-DD:",
      payment.dueDate,
    );
    if (newDueDate === null) return;

    await saveLeadSalePayment({
      ...payment,
      amount: newAmount,
      dueDate: newDueDate,
    });

    await loadPayments();
    setMessage("Pagamento atualizado.");
  }

  function getWhatsAppMessage(payment: LeadSalePayment) {
    return encodeURIComponent(
      `Olá! Tudo bem?\n\nPassando para lembrar sobre o pagamento referente ao projeto ${payment.projectName}.\n\nCliente: ${payment.companyName}\nVencimento: ${formatDate(payment.dueDate)}\nValor: ${money(payment.amount)}\n\nQualquer dúvida, fico à disposição.`,
    );
  }

  if (checkingAuth) {
    return (
      <main style={styles.page}>
        <div style={styles.loginWrap}>
          <div
            style={{
              ...styles.card,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Loader2 className="spin" size={20} /> Carregando financeiro...
          </div>
        </div>
        <GlobalStyle />
      </main>
    );
  }

  if (!user) {
    return (
      <main style={styles.page}>
        <div style={styles.loginWrap}>
          <section style={styles.loginCard} className="admin-login-card">
            <div style={styles.loginBrand}>
              <div>
                <Image
                  src="/logo-white.png"
                  alt="Defan Soluções Digitais"
                  width={380}
                  height={130}
                  priority
                  style={{ width: "auto", height: 104, objectFit: "contain" }}
                />
                <h1
                  style={{
                    margin: "28px 0 14px",
                    fontSize: "clamp(34px, 4vw, 58px)",
                    lineHeight: 1,
                    letterSpacing: "-0.07em",
                  }}
                >
                  Financeiro Defan
                </h1>
                <p
                  style={{
                    color: colors.muted,
                    lineHeight: 1.7,
                    fontSize: 17,
                    margin: 0,
                  }}
                >
                  Controle mensal de recebimentos, pendências, vencidos e
                  cobranças.
                </p>
              </div>
            </div>

            <form style={styles.loginForm} onSubmit={login}>
              <a
                href="/"
                style={{
                  ...styles.secondaryButton,
                  width: "fit-content",
                  marginBottom: 24,
                }}
              >
                <ArrowLeft size={17} /> Voltar ao site
              </a>

              <h2 style={{ ...styles.cardTitle, fontSize: 34 }}>
                Entrar no financeiro
              </h2>

              {message && <div style={styles.notice}>{message}</div>}

              <div style={{ display: "grid", gap: 16 }}>
                <Field
                  label="E-mail"
                  type="email"
                  value={loginEmail}
                  onChange={setLoginEmail}
                />

                <label style={styles.field}>
                  <span style={styles.label}>Senha</span>
                  <div className="password-wrap">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </label>

                <button
                  type="submit"
                  style={styles.button}
                  disabled={loggingIn}
                >
                  {loggingIn ? (
                    <>
                      <Loader2 className="spin" size={18} /> Entrando...
                    </>
                  ) : (
                    <>
                      Entrar <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>

        <GlobalStyle />
      </main>
    );
  }

  if (!isAllowed) {
    return (
      <main style={styles.page}>
        <div style={styles.loginWrap}>
          <section style={{ ...styles.card, width: "min(560px, 100%)" }}>
            <h1 style={styles.cardTitle}>Acesso não autorizado</h1>
            <p style={styles.cardSub}>
              Você entrou com <strong>{user.email}</strong>, mas o e-mail
              permitido é definido em <strong>NEXT_PUBLIC_ADMIN_EMAIL</strong>.
            </p>
            <button style={styles.secondaryButton} onClick={logout}>
              <LogOut size={17} /> Sair
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header} className="admin-top-header">
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Image
              src="/logo-white.png"
              alt="Defan Soluções Digitais"
              width={300}
              height={100}
              style={styles.headerLogo}
            />

            <div>
              <h1 style={styles.title}>Financeiro</h1>
              <p style={styles.subText}>
                Visão estratégica mensal dos recebimentos, pendências e
                cobranças.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="/" style={styles.secondaryButton}>
              <ArrowLeft size={17} /> Ver site
            </a>
            <button style={styles.secondaryButton} onClick={logout}>
              <LogOut size={17} /> Sair
            </button>
          </div>
        </header>

        <AdminMenu />

        {message && <div style={styles.notice}>{message}</div>}

        <section style={styles.card}>
          <div className="list-toolbar">
            <div>
              <h2 style={styles.cardTitle}>Financeiro mensal</h2>
              <p style={styles.cardSub}>
                Exibindo por padrão o mês atual. Use os filtros para ver por
                cliente, dia, mês, ano e status.
              </p>
            </div>

            <button
              type="button"
              style={styles.secondaryButton}
              onClick={clearFilters}
            >
              Limpar filtros
            </button>
          </div>

          <div className="filters-grid">
            <label style={styles.field}>
              <span style={styles.label}>Cliente</span>
              <select
                value={clientFilter}
                onChange={(event) => setClientFilter(event.target.value)}
                style={styles.select}
              >
                <option value="todos">Todos os clientes</option>
                {clientOptions.map(([leadId, companyName]) => (
                  <option key={leadId} value={leadId}>
                    {companyName}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Ano</span>
              <select
                value={yearFilter}
                onChange={(event) => {
                  setYearFilter(event.target.value);
                  setDayFilter("todos");
                }}
                style={styles.select}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Mês</span>
              <select
                value={monthFilter}
                onChange={(event) => {
                  setMonthFilter(event.target.value);
                  setDayFilter("todos");
                }}
                style={styles.select}
              >
                <option value="todos">Todos os meses</option>
                {monthOptions.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Dia</span>
              <select
                value={dayFilter}
                onChange={(event) => setDayFilter(event.target.value)}
                style={styles.select}
              >
                <option value="todos">Todos os dias</option>
                {dayOptions.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Status</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                style={styles.select}
              >
                <option value="todos">Todos</option>
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="vencido">Vencido</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Buscar</span>
              <div className="search-box">
                <Search size={18} color={colors.soft} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cliente, projeto, observação..."
                />
              </div>
            </label>
          </div>

          <div className="kpi-grid">
            <div>
              <strong>{money(totals.received)}</strong>
              <span>Recebido no período</span>
            </div>
            <div>
              <strong>{money(totals.pending)}</strong>
              <span>A receber</span>
            </div>
            <div>
              <strong>{money(totals.overdue)}</strong>
              <span>Vencido</span>
            </div>
            <div>
              <strong>{money(totals.canceled)}</strong>
              <span>Cancelado</span>
            </div>
          </div>

          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Cliente / Projeto</th>
                  <th>Parcela</th>
                  <th>Vencimento</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Pagamento</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment) => {
                  const realStatus = isOverdue(payment)
                    ? "vencido"
                    : payment.status;

                  return (
                    <tr key={payment.id}>
                      <td>
                        <strong>{payment.companyName}</strong>
                        <span>{payment.projectName}</span>
                      </td>

                      <td>
                        {payment.saleType === "recorrente"
                          ? `${payment.number}/12`
                          : payment.saleType === "parcelada"
                            ? `Parcela ${payment.number}`
                            : "Única"}
                      </td>

                      <td>{formatDate(payment.dueDate)}</td>

                      <td>{money(payment.amount)}</td>

                      <td>
                        <span className={`status-badge status-${realStatus}`}>
                          {realStatus}
                        </span>
                      </td>

                      <td>
                        <small>{payment.paymentMethod || "-"}</small>
                        {payment.paidDate && (
                          <small>Pago em {formatDate(payment.paidDate)}</small>
                        )}
                      </td>

                      <td>
                        <div className="row-actions">
                          {payment.status === "pago" ? (
                            <button
                              className="small-action danger"
                              onClick={() => handlePending(payment)}
                            >
                              <X size={15} /> Remover baixa
                            </button>
                          ) : payment.status === "cancelado" ? (
                            <button
                              className="small-action reactivate"
                              onClick={() => handleReactivatePayment(payment)}
                            >
                              <RotateCcw size={15} /> Reativar
                            </button>
                          ) : (
                            <button
                              className="small-action success"
                              onClick={() => openPaymentModal(payment)}
                            >
                              <CheckCircle2 size={15} /> Pago
                            </button>
                          )}

                          {payment.status !== "pago" &&
                            payment.status !== "cancelado" && (
                              <>
                                <button
                                  className="small-action"
                                  onClick={() => handleEditPayment(payment)}
                                >
                                  <CreditCard size={15} /> Editar
                                </button>

                                <a
                                  className="small-action whatsapp"
                                  href={`https://wa.me/?text=${getWhatsAppMessage(
                                    payment,
                                  )}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <MessageCircle size={15} /> Cobrar
                                </a>

                                <button
                                  className="small-action danger"
                                  onClick={() => handleCancelFuture(payment)}
                                >
                                  <X size={15} /> Cancelar próximos
                                </button>
                              </>
                            )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {!filteredPayments.length && (
                  <tr>
                    <td colSpan={7}>Nenhum pagamento encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {paymentModalOpen && paymentToPay && (
        <div style={styles.modalBackdrop}>
          <section style={styles.modal}>
            <header style={styles.modalHeader}>
              <div>
                <h2 style={styles.cardTitle}>Confirmar pagamento</h2>
                <p style={styles.cardSub}>
                  Informe a data em que o pagamento foi recebido.
                </p>
              </div>

              <button
                type="button"
                style={styles.secondaryButton}
                onClick={closePaymentModal}
              >
                <X size={18} /> Fechar
              </button>
            </header>

            <div style={{ display: "grid", gap: 14 }}>
              <div className="payment-modal-info">
                <strong>{paymentToPay.companyName}</strong>
                <span>{paymentToPay.projectName}</span>
                <small>
                  Parcela {paymentToPay.number} • Valor{" "}
                  {money(paymentToPay.amount)}
                </small>
                <small>Vencimento: {formatDate(paymentToPay.dueDate)}</small>
              </div>

              <Field
                type="date"
                label="Data do pagamento"
                value={paymentDate}
                onChange={setPaymentDate}
              />
            </div>

            <div style={styles.actions}>
              <button
                type="button"
                style={styles.button}
                onClick={confirmPayment}
              >
                <CheckCircle2 size={16} /> Confirmar pagamento
              </button>

              <button
                type="button"
                style={styles.secondaryButton}
                onClick={closePaymentModal}
              >
                Cancelar
              </button>
            </div>
          </section>
        </div>
      )}

      <GlobalStyle />
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      <input
        type={type}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={styles.input}
      />
    </label>
  );
}

function GlobalStyle() {
  return (
    <style jsx global>{`
      a {
        text-decoration: none;
      }

      .spin {
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .password-wrap {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        border: 1px solid rgba(125, 211, 252, 0.18);
        background: rgba(2, 6, 23, 0.45);
        border-radius: 16px;
        overflow: hidden;
      }

      .password-wrap input {
        border: 0;
        background: transparent;
        color: #f8fafc;
        outline: none;
        padding: 13px 14px;
        width: 100%;
      }

      .password-wrap button {
        border: 0;
        background: transparent;
        color: #94a3b8;
        cursor: pointer;
        padding: 0 14px;
        height: 100%;
        display: grid;
        place-items: center;
      }

      .list-toolbar {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 18px;
      }

      .filters-grid {
        display: grid;
        grid-template-columns: 1.2fr 140px 170px 140px 180px 1.4fr;
        gap: 14px;
        margin-bottom: 18px;
        align-items: end;
      }

      .search-box {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: 8px;
        border: 1px solid rgba(125, 211, 252, 0.18);
        background: rgba(2, 6, 23, 0.45);
        border-radius: 16px;
        padding: 0 13px;
      }

      .search-box input {
        border: 0;
        outline: 0;
        color: #f8fafc;
        background: transparent;
        padding: 13px 0;
      }

      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-bottom: 18px;
      }

      .kpi-grid > div {
        border-radius: 20px;
        padding: 18px;
        background: rgba(2, 6, 23, 0.35);
        border: 1px solid rgba(125, 211, 252, 0.14);
      }

      .kpi-grid strong {
        display: block;
        font-size: 24px;
        color: #f8fafc;
        line-height: 1;
      }

      .kpi-grid span {
        display: block;
        margin-top: 8px;
        color: #94a3b8;
        font-size: 13px;
        font-weight: 900;
      }

      .table-wrap {
        overflow: auto;
        border-radius: 22px;
        border: 1px solid rgba(125, 211, 252, 0.16);
      }

      .admin-table {
        width: 100%;
        min-width: 1180px;
        border-collapse: collapse;
        background: rgba(2, 6, 23, 0.32);
      }

      .admin-table th,
      .admin-table td {
        padding: 14px;
        border-bottom: 1px solid rgba(125, 211, 252, 0.1);
        text-align: left;
        vertical-align: top;
        color: #cbd5e1;
        font-size: 14px;
      }

      .admin-table th {
        position: sticky;
        top: 0;
        z-index: 2;
        background: #0f172a;
        color: #e0f2fe;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .admin-table td strong {
        display: block;
        color: #f8fafc;
        margin-bottom: 4px;
      }

      .admin-table td span,
      .admin-table td small {
        display: block;
        margin-top: 4px;
      }

      .status-badge {
        display: inline-flex !important;
        width: fit-content;
        padding: 7px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 900;
        border: 1px solid rgba(125, 211, 252, 0.16);
        text-transform: capitalize;
      }

      .status-pendente {
        color: #fef3c7;
        background: rgba(245, 158, 11, 0.15);
      }

      .status-vencido {
        color: #fecaca;
        background: rgba(239, 68, 68, 0.18);
      }

      .status-pago {
        color: #bbf7d0;
        background: rgba(34, 197, 94, 0.14);
      }

      .status-cancelado {
        color: #cbd5e1;
        background: rgba(100, 116, 139, 0.22);
      }

      .row-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .small-action {
        border: 0;
        border-radius: 12px;
        padding: 10px 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        color: #e0f2fe;
        background: rgba(14, 165, 233, 0.16);
        cursor: pointer;
        font-weight: 900;
      }

      .small-action.success {
        color: #fff;
        background: rgba(34, 197, 94, 0.85);
      }

      .small-action.danger {
        color: #fff;
        background: rgba(239, 68, 68, 0.82);
      }

      .small-action.whatsapp {
        color: #fff;
        background: rgba(22, 163, 74, 0.82);
      }

      .small-action.reactivate {
        color: #fff;
        background: rgba(124, 58, 237, 0.86);
      }

      .payment-modal-info {
        display: grid;
        gap: 6px;
        border-radius: 18px;
        padding: 16px;
        background: rgba(2, 6, 23, 0.42);
        border: 1px solid rgba(125, 211, 252, 0.16);
      }

      .payment-modal-info strong {
        color: #f8fafc;
        font-size: 18px;
      }

      .payment-modal-info span,
      .payment-modal-info small {
        color: #cbd5e1;
      }

      @media (max-width: 1180px) {
        .filters-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .kpi-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 760px) {
        .filters-grid,
        .kpi-grid {
          grid-template-columns: 1fr;
        }

        .admin-top-header,
        .list-toolbar {
          flex-direction: column;
          align-items: flex-start !important;
        }
      }
    `}</style>
  );
}
