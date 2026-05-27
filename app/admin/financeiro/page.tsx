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
  CalendarDays,
  CreditCard,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  Search,
} from "lucide-react";

import { auth, db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { getLeadSalePayments, getLeadSales } from "@/lib/leadsFirestore";
import { LeadSale, LeadSalePayment } from "@/lib/leadsTypes";
import AdminMenu from "../../../components/admin/AdminMenu";

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
    width: "100%",
    maxWidth: "100%",
    margin: "0 auto",
    padding: "22px 18px 70px",
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
};

type MonthSummary = {
  key: string;
  year: string;
  month: string;
  label: string;
  payments: LeadSalePayment[];
  received: number;
  pending: number;
  overdue: number;
  canceled: number;
  forecast: number;
  total: number;
  quantity: number;
  paidQuantity: number;
  pendingQuantity: number;
  overdueQuantity: number;
  canceledQuantity: number;
  companies: string[];
  projects: string[];
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

function getMonthName(month: string) {
  return monthOptions.find((item) => item.value === month)?.label || month;
}

function getPaymentDateParts(payment: LeadSalePayment) {
  const [year = "", month = "", day = ""] = String(payment.dueDate || "").split(
    "-",
  );
  return { year, month, day };
}

function getRealStatus(payment: LeadSalePayment) {
  if (payment.status === "pago") return "pago";
  if (payment.status === "cancelado") return "cancelado";

  if (payment.status === "pendente" && payment.dueDate) {
    const today = new Date().toISOString().slice(0, 10);
    if (payment.dueDate < today) return "vencido";
  }

  return payment.status || "pendente";
}

function getSaleTypeLabel(payment: LeadSalePayment) {
  if (payment.saleType === "recorrente") return "Recorrente";
  if (payment.saleType === "parcelada") return "Parcelada";
  return "Única";
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function buildMonthSummaries(payments: LeadSalePayment[]): MonthSummary[] {
  const map = new Map<string, MonthSummary>();

  payments.forEach((payment) => {
    const { year, month } = getPaymentDateParts(payment);

    if (!year || !month) return;

    const key = `${year}-${month}`;
    const amount = parseMoney(payment.amount);
    const status = getRealStatus(payment);

    const current =
      map.get(key) ||
      ({
        key,
        year,
        month,
        label: `${getMonthName(month)} de ${year}`,
        payments: [],
        received: 0,
        pending: 0,
        overdue: 0,
        canceled: 0,
        forecast: 0,
        total: 0,
        quantity: 0,
        paidQuantity: 0,
        pendingQuantity: 0,
        overdueQuantity: 0,
        canceledQuantity: 0,
        companies: [],
        projects: [],
      } as MonthSummary);

    current.payments.push(payment);
    current.total += amount;
    current.quantity += 1;

    if (status === "pago") {
      current.received += amount;
      current.paidQuantity += 1;
    } else if (status === "cancelado") {
      current.canceled += amount;
      current.canceledQuantity += 1;
    } else if (status === "vencido") {
      current.overdue += amount;
      current.overdueQuantity += 1;
    } else {
      current.pending += amount;
      current.pendingQuantity += 1;
    }

    if (status !== "cancelado") {
      current.forecast += amount;
    }

    current.companies = unique([
      ...current.companies,
      payment.companyName || "Cliente sem nome",
    ]);

    current.projects = unique([
      ...current.projects,
      payment.projectName || "Projeto sem nome",
    ]);

    map.set(key, current);
  });

  return Array.from(map.values()).sort((a, b) => b.key.localeCompare(a.key));
}

function normalizePaymentFromSale(
  payment: LeadSalePayment,
  sale: LeadSale,
): LeadSalePayment {
  return {
    ...payment,
    saleId: payment.saleId || sale.id || "",
    leadId: payment.leadId || sale.leadId || "",
    companyName: payment.companyName || sale.companyName || "Cliente sem nome",
    projectName: payment.projectName || sale.projectName || "Projeto sem nome",
    saleType: payment.saleType || sale.saleType || "recorrente",
    number:
      Number(payment.number || payment.installmentNumber || 0) ||
      Number(payment.installmentNumber || 0) ||
      1,
    amount: payment.amount || sale.monthlyAmount || sale.amount || "0",
    dueDate: payment.dueDate || sale.firstPaymentDueDate || sale.saleDate || "",
    paidDate: payment.paidDate || "",
    paymentMethod: payment.paymentMethod || sale.paymentMethod || "",
    receiptLink: payment.receiptLink || "",
    note: payment.note || "",
    status: payment.status || "pendente",
  };
}

async function getRecurringPaymentsFromSales() {
  const sales = await getLeadSales();
  const recurringSales = sales.filter(
    (sale) => sale.id && sale.saleType === "recorrente",
  );

  const pairs = await Promise.all(
    recurringSales.map(async (sale) => {
      const snapshot = await getDocs(
        query(
          collection(db, "leadSales", sale.id || "", "payments"),
          orderBy("dueDate", "asc"),
        ),
      );

      return snapshot.docs.map((paymentDoc) =>
        normalizePaymentFromSale(
          {
            id: paymentDoc.id,
            ...paymentDoc.data(),
          } as LeadSalePayment,
          sale,
        ),
      );
    }),
  );

  return pairs.flat();
}

function getPaymentUniqueKey(payment: LeadSalePayment) {
  return [
    payment.id || "",
    payment.saleId || "",
    payment.companyName || "",
    payment.projectName || "",
    payment.saleType || "",
    payment.number || "",
    payment.dueDate || "",
    payment.amount || "",
  ].join("|");
}

async function getAllFinancialPayments() {
  const [regularPayments, recurringPayments] = await Promise.all([
    getLeadSalePayments(),
    getRecurringPaymentsFromSales(),
  ]);

  const map = new Map<string, LeadSalePayment>();

  [...regularPayments, ...recurringPayments].forEach((payment) => {
    map.set(getPaymentUniqueKey(payment), payment);
  });

  return Array.from(map.values());
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
  const [typeFilter, setTypeFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [message, setMessage] = useState("");

  const isAllowed = useMemo(() => {
    if (!user?.email || !adminEmail) return false;
    return user.email.toLowerCase() === adminEmail.toLowerCase();
  }, [user, adminEmail]);

  async function loadPayments() {
    const list = await getAllFinancialPayments();
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

  const filteredPayments = useMemo(() => {
    const term = normalizeText(search.trim());

    return payments.filter((payment) => {
      const { year, month } = getPaymentDateParts(payment);
      const realStatus = getRealStatus(payment);

      const matchesClient =
        clientFilter === "todos" ||
        payment.leadId === clientFilter ||
        payment.companyName === clientFilter;

      const matchesYear = !yearFilter || year === yearFilter;
      const matchesMonth = monthFilter === "todos" || month === monthFilter;
      const matchesType =
        typeFilter === "todos" || payment.saleType === typeFilter;
      const matchesStatus =
        statusFilter === "todos" || realStatus === statusFilter;

      const text = normalizeText(
        [
          payment.companyName,
          payment.projectName,
          payment.paymentMethod,
          payment.note,
          payment.status,
          payment.saleType,
          payment.amount,
          payment.dueDate,
        ].join(" "),
      );

      return (
        matchesClient &&
        matchesYear &&
        matchesMonth &&
        matchesType &&
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
    typeFilter,
    statusFilter,
  ]);

  const monthSummaries = useMemo(
    () => buildMonthSummaries(filteredPayments),
    [filteredPayments],
  );

  const totals = useMemo(() => {
    return monthSummaries.reduce(
      (acc, item) => ({
        received: acc.received + item.received,
        pending: acc.pending + item.pending,
        overdue: acc.overdue + item.overdue,
        canceled: acc.canceled + item.canceled,
        forecast: acc.forecast + item.forecast,
        total: acc.total + item.total,
        quantity: acc.quantity + item.quantity,
      }),
      {
        received: 0,
        pending: 0,
        overdue: 0,
        canceled: 0,
        forecast: 0,
        total: 0,
        quantity: 0,
      },
    );
  }, [monthSummaries]);

  function clearFilters() {
    setSearch("");
    setClientFilter("todos");
    setYearFilter(getCurrentYear());
    setMonthFilter(getCurrentMonth());
    setTypeFilter("todos");
    setStatusFilter("todos");
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
                  Visão mensal consolidada de recebimentos, pendências, vencidos
                  e cancelados.
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
                Visão consolidada por mês, sem baixa individual. Os valores vêm
                das vendas cadastradas, incluindo mensalidades recorrentes.
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
              <h2 style={styles.cardTitle}>Resumo financeiro por mês</h2>
              <p style={styles.cardSub}>
                Cada linha representa a soma de um mês: recebido, a receber,
                vencido, cancelado, previsão e quantidade de cobranças.
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
                onChange={(event) => setYearFilter(event.target.value)}
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
                onChange={(event) => setMonthFilter(event.target.value)}
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
              <span style={styles.label}>Tipo</span>
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                style={styles.select}
              >
                <option value="todos">Todos</option>
                <option value="unica">Única</option>
                <option value="parcelada">Parcelada</option>
                <option value="recorrente">Recorrente</option>
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
              <CreditCard size={22} />
              <strong>{money(totals.forecast)}</strong>
              <span>Previsão do período</span>
            </div>
            <div>
              <CreditCard size={22} />
              <strong>{money(totals.received)}</strong>
              <span>Recebido</span>
            </div>
            <div>
              <CreditCard size={22} />
              <strong>{money(totals.pending)}</strong>
              <span>A receber</span>
            </div>
            <div>
              <CreditCard size={22} />
              <strong>{money(totals.overdue)}</strong>
              <span>Vencido</span>
            </div>
            <div>
              <CreditCard size={22} />
              <strong>{money(totals.canceled)}</strong>
              <span>Cancelado</span>
            </div>
            <div>
              <CalendarDays size={22} />
              <strong>{totals.quantity}</strong>
              <span>Cobranças no período</span>
            </div>
          </div>

          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mês</th>
                  <th>Previsão</th>
                  <th>Recebido</th>
                  <th>A receber</th>
                  <th>Vencido</th>
                  <th>Cancelado</th>
                  <th>Cobranças</th>
                  <th>Clientes</th>
                  <th>Projetos / Informações</th>
                </tr>
              </thead>

              <tbody>
                {monthSummaries.map((summary) => (
                  <tr key={summary.key}>
                    <td>
                      <strong>{summary.label}</strong>
                      <span>{summary.key}</span>
                    </td>

                    <td>
                      <strong>{money(summary.forecast)}</strong>
                      <span>Total não cancelado</span>
                    </td>

                    <td>
                      <strong className="money-success">
                        {money(summary.received)}
                      </strong>
                      <span>{summary.paidQuantity} pago(s)</span>
                    </td>

                    <td>
                      <strong className="money-warning">
                        {money(summary.pending)}
                      </strong>
                      <span>{summary.pendingQuantity} pendente(s)</span>
                    </td>

                    <td>
                      <strong className="money-danger">
                        {money(summary.overdue)}
                      </strong>
                      <span>{summary.overdueQuantity} vencido(s)</span>
                    </td>

                    <td>
                      <strong>{money(summary.canceled)}</strong>
                      <span>{summary.canceledQuantity} cancelado(s)</span>
                    </td>

                    <td>
                      <strong>{summary.quantity}</strong>
                      <span>Total no mês</span>
                    </td>

                    <td>
                      <strong>{summary.companies.length}</strong>
                      <span>{summary.companies.slice(0, 5).join(", ")}</span>
                      {summary.companies.length > 5 && (
                        <small>
                          +{summary.companies.length - 5} cliente(s)
                        </small>
                      )}
                    </td>

                    <td>
                      <div className="month-details">
                        {summary.payments.slice(0, 12).map((payment) => (
                          <div
                            key={`${payment.id || payment.saleId}-${payment.number}-${payment.dueDate}`}
                            className="month-detail-line"
                          >
                            <strong>
                              {payment.companyName || "Cliente sem nome"}
                            </strong>
                            <span>
                              {payment.projectName || "Projeto sem nome"} •{" "}
                              {getSaleTypeLabel(payment)} •{" "}
                              {formatDate(payment.dueDate)} •{" "}
                              {money(payment.amount)} • {getRealStatus(payment)}
                            </span>
                          </div>
                        ))}

                        {summary.payments.length > 12 && (
                          <small>
                            +{summary.payments.length - 12} lançamento(s) neste
                            mês
                          </small>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {!monthSummaries.length && (
                  <tr>
                    <td colSpan={9}>Nenhum mês encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

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

      button,
      input,
      select {
        font-family: inherit;
      }

      button:disabled {
        opacity: 0.65;
        cursor: not-allowed;
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
        flex-wrap: wrap;
      }

      .filters-grid {
        display: grid;
        grid-template-columns: 1.2fr 140px 170px 170px 180px 1.4fr;
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
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 12px;
        margin-bottom: 18px;
      }

      .kpi-grid > div {
        border-radius: 20px;
        padding: 18px;
        background: rgba(2, 6, 23, 0.35);
        border: 1px solid rgba(125, 211, 252, 0.14);
        display: grid;
        gap: 8px;
      }

      .kpi-grid strong {
        display: block;
        font-size: 23px;
        color: #f8fafc;
        line-height: 1;
      }

      .kpi-grid span {
        display: block;
        margin-top: 2px;
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
        min-width: 1500px;
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
        color: #94a3b8;
      }

      .money-success {
        color: #bbf7d0 !important;
      }

      .money-warning {
        color: #fde68a !important;
      }

      .money-danger {
        color: #fecaca !important;
      }

      .month-details {
        display: grid;
        gap: 8px;
        max-width: 520px;
      }

      .month-detail-line {
        padding: 9px 10px;
        border-radius: 12px;
        background: rgba(15, 23, 42, 0.62);
        border: 1px solid rgba(125, 211, 252, 0.1);
      }

      .month-detail-line strong {
        font-size: 13px;
      }

      .month-detail-line span {
        font-size: 12px;
        line-height: 1.45;
      }

      @media (max-width: 1380px) {
        .filters-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .kpi-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      @media (max-width: 900px) {
        .filters-grid,
        .kpi-grid {
          grid-template-columns: 1fr;
        }

        .admin-top-header,
        .list-toolbar {
          flex-direction: column;
          align-items: flex-start !important;
        }

        .admin-top-header > div {
          flex-wrap: wrap;
        }
      }

      @media (max-width: 640px) {
        .admin-login-card {
          grid-template-columns: 1fr !important;
        }
      }
    `}</style>
  );
}
