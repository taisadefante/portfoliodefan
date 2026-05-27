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
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  Edit3,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogOut,
  Plus,
  Save,
  Search,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";

import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import {
  getLeads,
  getLeadSales,
  removeLeadSale,
  saveLeadSale,
} from "@/lib/leadsFirestore";
import {
  emptyLeadSale,
  Lead,
  LeadSale,
  LeadSalePayment,
} from "@/lib/leadsTypes";
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

type ReceivableSource =
  | "sale"
  | "installment"
  | "payment"
  | "recurring-generated";

type ReceivableItem = {
  id: string;
  saleId: string;
  sale: LeadSale;
  source: ReceivableSource;
  paymentId?: string;
  installmentId?: string;
  installmentNumber?: number;
  companyName: string;
  projectName: string;
  saleType: LeadSale["saleType"];
  saleStatus: LeadSale["saleStatus"];
  amount: string;
  dueDate: string;
  paidDate: string;
  paid: boolean;
  status: string;
  paymentMethod: string;
  note: string;
  recurringPaidTotal?: number;
  recurringPaidCount?: number;
  installmentPaidTotal?: number;
  installmentPaidCount?: number;
  installmentTotalAmount?: number;
  installmentRemainingAmount?: number;
  installmentTotalCount?: number;
};

type LeadSaleWithPaymentDate = LeadSale & { paidDate?: string };

type PaymentFormState = {
  status: "pago" | "pendente" | "cancelado";
  paid: boolean;
  paidDate: string;
  paymentMethod: string;
  note: string;
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
  dangerButton: {
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
    background: "rgba(239,68,68,0.92)",
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
  textarea: {
    width: "100%",
    minHeight: 100,
    resize: "vertical",
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
    width: "min(1180px, 100%)",
    maxHeight: "92vh",
    overflow: "auto",
    borderRadius: 32,
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
    marginBottom: 20,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
  },
  actions: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 },
};

function parseMoney(value?: string) {
  if (!value) return 0;
  return Number(String(value).replace(/\./g, "").replace(",", ".")) || 0;
}

function money(value?: string | number) {
  const number = typeof value === "number" ? value : parseMoney(value);
  return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
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

function getCurrentMonthFilter() {
  return String(new Date().getMonth() + 1).padStart(2, "0");
}

function getCurrentYearFilter() {
  return String(new Date().getFullYear());
}

function getCurrentDayFilter() {
  return String(new Date().getDate()).padStart(2, "0");
}

function getSaleTypeLabel(sale: LeadSale) {
  if (sale.saleType === "recorrente") return "Mensalidade";
  if (sale.saleType === "parcelada" || sale.isInstallment) return "Parcelada";
  return "Única";
}

function getPaidTotal(payments: LeadSalePayment[]) {
  return payments
    .filter((payment) => payment.status === "pago")
    .reduce((total, payment) => total + parseMoney(payment.amount), 0);
}

function getPendingTotal(payments: LeadSalePayment[]) {
  return payments
    .filter((payment) => payment.status === "pendente")
    .reduce((total, payment) => total + parseMoney(payment.amount), 0);
}

function getRecurringPaidSummary(payments: LeadSalePayment[]) {
  const paidPayments = payments.filter(
    (payment) => getPaymentStatus(payment) === "pago",
  );

  return {
    total: paidPayments.reduce(
      (sum, payment) => sum + parseMoney(payment.amount),
      0,
    ),
    count: paidPayments.length,
  };
}

function getInstallmentFinancialSummary(
  installments: LeadSale["installments"],
) {
  const safeInstallments = Array.isArray(installments) ? installments : [];
  const paidInstallments = safeInstallments.filter((installment) =>
    Boolean(installment.paid),
  );

  const totalAmount = safeInstallments.reduce(
    (sum, installment) => sum + parseMoney(installment.amount),
    0,
  );

  const paidTotal = paidInstallments.reduce(
    (sum, installment) => sum + parseMoney(installment.amount),
    0,
  );

  return {
    totalAmount,
    paidTotal,
    remainingTotal: Math.max(totalAmount - paidTotal, 0),
    totalCount: safeInstallments.length,
    paidCount: paidInstallments.length,
  };
}

function addMonthsToDate(dateString: string, monthsToAdd: number) {
  if (!dateString) return "";

  const [yearText, monthText, dayText] = dateString.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!year || !month || !day) return "";

  const targetDate = new Date(year, month - 1 + monthsToAdd, 1);
  const lastDayOfTargetMonth = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth() + 1,
    0,
  ).getDate();

  targetDate.setDate(Math.min(day, lastDayOfTargetMonth));

  return `${targetDate.getFullYear()}-${String(
    targetDate.getMonth() + 1,
  ).padStart(2, "0")}-${String(targetDate.getDate()).padStart(2, "0")}`;
}

function dateMatchesFilters(
  date: string,
  year: string,
  month: string,
  day: string,
) {
  const [dateYear = "", dateMonth = "", dateDay = ""] = String(
    date || "",
  ).split("-");

  return (
    (!year || dateYear === year) &&
    (month === "todos" || dateMonth === month) &&
    (day === "todos" || dateDay === day)
  );
}

function getSaleMonthAmount(item: LeadSale) {
  if (item.saleType === "recorrente") {
    return item.monthlyAmount || item.amount;
  }

  return item.amount;
}

function getRecurringPaymentId(
  saleId: string,
  installmentNumber: number,
  dueDate: string,
) {
  const safeDate = String(dueDate || "").replace(/[^0-9]/g, "");
  return `recorrente_${saleId}_${installmentNumber}_${safeDate}`;
}

function getPaymentStatus(
  payment?: Partial<LeadSalePayment> & { paid?: boolean },
) {
  if (!payment) return "pendente";
  if (String(payment.status || "") === "cancelado") return "cancelado";
  if (String(payment.status || "") === "pago" || payment.paid) return "pago";
  return "pendente";
}

function isReceivableCanceled(status?: string) {
  return String(status || "") === "cancelado";
}

async function ensureSixRecurringPayments(
  sale: LeadSale,
  existingPayments: LeadSalePayment[],
) {
  const saleId = sale.id || "";
  if (
    !saleId ||
    sale.saleType !== "recorrente" ||
    sale.saleStatus === "cancelada"
  ) {
    return;
  }

  const firstDueDate = sale.firstPaymentDueDate || sale.saleDate || "";
  if (!firstDueDate) return;

  const payments = [...existingPayments];
  const monthlyAmount = sale.monthlyAmount || sale.amount || "0";
  let activeOpenCount = payments.filter((payment) => {
    const status = getPaymentStatus(payment);
    return status !== "pago" && status !== "cancelado";
  }).length;

  let installmentNumber = Math.max(
    0,
    ...payments.map((payment) => Number(payment.installmentNumber || 0)),
  );

  if (installmentNumber < 1) installmentNumber = 0;

  while (activeOpenCount < 6) {
    installmentNumber += 1;
    const dueDate = addMonthsToDate(firstDueDate, installmentNumber - 1);
    const existing = payments.find(
      (payment) =>
        Number(payment.installmentNumber || 0) === installmentNumber ||
        String(payment.dueDate || "") === dueDate,
    );

    if (existing) {
      const status = getPaymentStatus(existing);
      if (status !== "pago" && status !== "cancelado") {
        activeOpenCount += 1;
      }
      continue;
    }

    const paymentId = getRecurringPaymentId(saleId, installmentNumber, dueDate);
    const payment = {
      id: paymentId,
      saleId,
      amount: monthlyAmount,
      dueDate,
      status: "pendente",
      paidDate: "",
      paymentMethod: sale.paymentMethod || "",
      note: "",
      installmentNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as LeadSalePayment;

    await setDoc(doc(db, "leadSales", saleId, "payments", paymentId), payment, {
      merge: true,
    });

    payments.push(payment);
    activeOpenCount += 1;
  }
}

async function cancelRecurringPayments(
  saleId: string,
  payments: LeadSalePayment[],
  currentPaymentId: string,
) {
  const now = new Date().toISOString();

  await Promise.all(
    payments
      .filter((payment) => getPaymentStatus(payment) !== "pago")
      .map((payment) => {
        const paymentId = payment.id || currentPaymentId;
        if (!paymentId) return Promise.resolve();

        return setDoc(
          doc(db, "leadSales", saleId, "payments", paymentId),
          {
            ...payment,
            status: "cancelado",
            updatedAt: now,
          },
          { merge: true },
        );
      }),
  );
}

async function fetchLeadSalePaymentsBySale(saleId: string) {
  if (!saleId) return [];

  const snapshot = await getDocs(
    query(
      collection(db, "leadSales", saleId, "payments"),
      orderBy("dueDate", "asc"),
    ),
  );

  return snapshot.docs.map(
    (paymentDoc) =>
      ({
        id: paymentDoc.id,
        ...paymentDoc.data(),
      }) as LeadSalePayment,
  );
}

function buildReceivables(
  sales: LeadSale[],
  paymentsBySale: Record<string, LeadSalePayment[]>,
) {
  return sales.flatMap((item) => {
    const saleId = item.id || "";
    if (!saleId) return [];

    const saleType =
      item.saleType || (item.isInstallment ? "parcelada" : "unica");
    const companyName = item.companyName || "Cliente não informado";
    const projectName = item.projectName || "Projeto sem nome";
    const saleStatus = item.saleStatus || "ativa";
    const payments = paymentsBySale[saleId] || [];

    if (
      saleType === "parcelada" &&
      Array.isArray(item.installments) &&
      item.installments.length > 0
    ) {
      const installmentSummary = getInstallmentFinancialSummary(
        item.installments,
      );

      return item.installments.map((installment) => ({
        id: `${saleId}-installment-${installment.id || installment.number}`,
        saleId,
        sale: item,
        source: "installment" as const,
        installmentId: installment.id,
        installmentNumber: installment.number,
        companyName,
        projectName,
        saleType,
        saleStatus,
        amount: installment.amount || "0",
        dueDate:
          installment.dueDate ||
          item.firstInstallmentDueDate ||
          item.saleDate ||
          "",
        paidDate: installment.paidDate || "",
        paid: Boolean(installment.paid),
        status: installment.paid ? "pago" : "pendente",
        paymentMethod: installment.paymentMethod || item.paymentMethod || "",
        note: installment.note || "",
        installmentPaidTotal: installmentSummary.paidTotal,
        installmentPaidCount: installmentSummary.paidCount,
        installmentTotalAmount: installmentSummary.totalAmount,
        installmentRemainingAmount: installmentSummary.remainingTotal,
        installmentTotalCount: installmentSummary.totalCount,
      }));
    }

    if (saleType === "recorrente") {
      const monthsToShow = 6;
      const firstDueDate = item.firstPaymentDueDate || item.saleDate || "";
      const recurringPaidSummary = getRecurringPaidSummary(payments);
      const generated = Array.from({ length: monthsToShow }, (_, index) => {
        const installmentNumber = index + 1;
        const dueDate = addMonthsToDate(firstDueDate, index);
        const deterministicPaymentId = getRecurringPaymentId(
          saleId,
          installmentNumber,
          dueDate,
        );

        const savedPayment = payments.find((payment) => {
          const sameId = payment.id === deterministicPaymentId;
          const sameInstallment =
            Number(payment.installmentNumber || 0) === installmentNumber;
          const sameDueDate = String(payment.dueDate || "") === dueDate;

          return sameId || sameInstallment || sameDueDate;
        });

        const paymentId = savedPayment?.id || deterministicPaymentId;

        return {
          id: `${saleId}-recurring-${installmentNumber}`,
          saleId,
          sale: item,
          source: savedPayment
            ? ("payment" as const)
            : ("recurring-generated" as const),
          paymentId,
          installmentNumber,
          companyName,
          projectName,
          saleType,
          saleStatus,
          amount:
            savedPayment?.amount || item.monthlyAmount || item.amount || "0",
          dueDate: savedPayment?.dueDate || dueDate,
          paidDate: savedPayment?.paidDate || "",
          paid:
            savedPayment?.status === "pago" ||
            Boolean(
              (
                savedPayment as
                  | (LeadSalePayment & { paid?: boolean })
                  | undefined
              )?.paid,
            ),
          status: savedPayment?.status || "pendente",
          paymentMethod:
            savedPayment?.paymentMethod || item.paymentMethod || "",
          note: savedPayment?.note || "",
          recurringPaidTotal: recurringPaidSummary.total,
          recurringPaidCount: recurringPaidSummary.count,
        };
      });

      const extraSavedPayments = payments
        .filter((payment) => {
          const alreadyGenerated = generated.some((generatedPayment) => {
            const sameId = generatedPayment.paymentId === payment.id;
            const sameInstallment =
              Number(generatedPayment.installmentNumber || 0) ===
              Number(payment.installmentNumber || 0);
            const sameDueDate =
              String(generatedPayment.dueDate || "") ===
              String(payment.dueDate || "");

            return sameId || sameInstallment || sameDueDate;
          });

          return !alreadyGenerated;
        })
        .map((payment) => ({
          id: `${saleId}-payment-${payment.id || payment.dueDate}`,
          saleId,
          sale: item,
          source: "payment" as const,
          paymentId: payment.id,
          installmentNumber:
            Number(payment.installmentNumber || 0) || undefined,
          companyName,
          projectName,
          saleType,
          saleStatus,
          amount: payment.amount || item.monthlyAmount || item.amount || "0",
          dueDate:
            payment.dueDate || item.firstPaymentDueDate || item.saleDate || "",
          paidDate: payment.paidDate || "",
          paid:
            payment.status === "pago" ||
            Boolean((payment as LeadSalePayment & { paid?: boolean }).paid),
          status: payment.status || "pendente",
          paymentMethod: payment.paymentMethod || item.paymentMethod || "",
          note: payment.note || "",
          recurringPaidTotal: recurringPaidSummary.total,
          recurringPaidCount: recurringPaidSummary.count,
        }));

      return [...generated, ...extraSavedPayments];
    }

    if (payments.length > 0) {
      return payments.map((payment) => ({
        id: `${saleId}-payment-${payment.id || payment.dueDate}`,
        saleId,
        sale: item,
        source: "payment" as const,
        paymentId: payment.id,
        companyName,
        projectName,
        saleType,
        saleStatus,
        amount: payment.amount || getSaleMonthAmount(item),
        dueDate:
          payment.dueDate || item.firstPaymentDueDate || item.saleDate || "",
        paidDate: payment.paidDate || "",
        paid:
          payment.status === "pago" ||
          Boolean((payment as LeadSalePayment & { paid?: boolean }).paid),
        status: payment.status || "pendente",
        paymentMethod: payment.paymentMethod || item.paymentMethod || "",
        note: payment.note || "",
      }));
    }

    return [
      {
        id: `${saleId}-sale`,
        saleId,
        sale: item,
        source: "sale" as const,
        companyName,
        projectName,
        saleType,
        saleStatus,
        amount: item.amount || "0",
        dueDate: item.firstPaymentDueDate || item.saleDate || "",
        paidDate: (item as LeadSaleWithPaymentDate).paidDate || "",
        paid: item.paymentStatus === "pago",
        status: item.paymentStatus || "pendente",
        paymentMethod: item.paymentMethod || "",
        note: "",
      },
    ];
  });
}

function getInstallmentTotalLabel(item: ReceivableItem) {
  if (item.saleType !== "parcelada") return money(item.amount);

  return `${money(item.installmentTotalAmount || 0)} total`;
}

function getPendingLabel(
  item: ReceivableItem,
  isPaid: boolean,
  isCanceled: boolean,
) {
  if (item.saleType === "parcelada") {
    return money(isCanceled ? 0 : item.installmentRemainingAmount || 0);
  }

  return isPaid || isCanceled ? money(0) : money(item.amount);
}

function getTotalPaidLabel(item: ReceivableItem) {
  if (item.saleType === "recorrente") {
    const count = item.recurringPaidCount || 0;
    return `${money(item.recurringPaidTotal || 0)} (${count} pago${count === 1 ? "" : "s"})`;
  }

  if (item.saleType === "parcelada") {
    const count = item.installmentPaidCount || 0;
    const totalCount = item.installmentTotalCount || 0;
    return `${money(item.installmentPaidTotal || 0)} (${count}/${totalCount} paga${count === 1 ? "" : "s"})`;
  }

  return item.paid ? money(item.amount) : money(0);
}

export default function AdminVendasPage() {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [sales, setSales] = useState<LeadSale[]>([]);
  const [paymentsBySale, setPaymentsBySale] = useState<
    Record<string, LeadSalePayment[]>
  >({});
  const [sale, setSale] = useState<LeadSale>(emptyLeadSale);
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [clientFilter, setClientFilter] = useState("todos");
  const [yearFilter, setYearFilter] = useState(getCurrentYearFilter());
  const [monthFilter, setMonthFilter] = useState(getCurrentMonthFilter());
  const [dayFilter, setDayFilter] = useState("todos");
  const [typeFilter, setTypeFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [message, setMessage] = useState("");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [overdueModalOpen, setOverdueModalOpen] = useState(false);
  const [selectedReceivable, setSelectedReceivable] =
    useState<ReceivableItem | null>(null);
  const [paymentForm, setPaymentForm] = useState<PaymentFormState>({
    status: "pago",
    paid: true,
    paidDate: new Date().toISOString().slice(0, 10),
    paymentMethod: "",
    note: "",
  });
  const [savingPayment, setSavingPayment] = useState(false);

  const isAllowed = useMemo(() => {
    if (!user?.email || !adminEmail) return false;
    return user.email.toLowerCase() === adminEmail.toLowerCase();
  }, [user, adminEmail]);

  async function loadSales() {
    const [leadList, saleList] = await Promise.all([
      getLeads(),
      getLeadSales(),
    ]);
    setLeads(leadList);
    setSales(saleList);

    const paymentPairs = await Promise.all(
      saleList
        .filter((item) => item.id)
        .map(async (item) => {
          const payments = await fetchLeadSalePaymentsBySale(item.id || "");
          return [item.id || "", payments] as const;
        }),
    );

    setPaymentsBySale(Object.fromEntries(paymentPairs));
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);

      if (currentUser) {
        await loadSales();
      }
    });

    return () => unsubscribe();
  }, []);

  const clientOptions = useMemo(() => {
    const map = new Map<string, string>();

    sales.forEach((item) => {
      const key = item.leadId || item.companyName;
      const label = item.companyName || "Cliente sem nome";

      if (key) {
        map.set(key, label);
      }
    });

    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [sales]);

  const yearOptions = useMemo(() => {
    const years = new Set<string>();

    buildReceivables(sales, paymentsBySale).forEach((item) => {
      const year = String(item.dueDate || "").slice(0, 4);
      if (year) years.add(year);
    });

    years.add(getCurrentYearFilter());

    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [sales, paymentsBySale]);

  const dayOptions = useMemo(() => {
    const days = new Set<string>();

    buildReceivables(sales, paymentsBySale).forEach((item) => {
      const date = String(item.dueDate || "");
      const [year = "", month = "", day = ""] = date.split("-");

      const matchesYear = !yearFilter || year === yearFilter;
      const matchesMonth = monthFilter === "todos" || month === monthFilter;

      if (matchesYear && matchesMonth && day) {
        days.add(day);
      }
    });

    return Array.from(days).sort((a, b) => Number(a) - Number(b));
  }, [sales, paymentsBySale, yearFilter, monthFilter]);

  const receivables = useMemo(() => {
    const term = normalizeText(search.trim());
    const allReceivables = buildReceivables(sales, paymentsBySale);

    return allReceivables
      .filter((item) => {
        const matchesDate = dateMatchesFilters(
          item.dueDate,
          yearFilter,
          monthFilter,
          dayFilter,
        );

        const matchesClient =
          clientFilter === "todos" ||
          item.sale.leadId === clientFilter ||
          item.companyName === clientFilter;

        const matchesType =
          typeFilter === "todos" || item.saleType === typeFilter;
        const matchesStatus =
          statusFilter === "todos" || item.saleStatus === statusFilter;

        const text = normalizeText(
          [
            item.companyName,
            item.projectName,
            item.sale.projectType,
            item.paymentMethod,
            item.sale.paymentStatus,
            item.sale.deployLink,
            item.sale.projectLink,
            item.sale.databaseName,
            item.sale.notes,
          ].join(" "),
        );

        return (
          matchesDate &&
          matchesClient &&
          matchesType &&
          matchesStatus &&
          (!term || text.includes(term))
        );
      })
      .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)));
  }, [
    sales,
    paymentsBySale,
    search,
    clientFilter,
    yearFilter,
    monthFilter,
    dayFilter,
    typeFilter,
    statusFilter,
  ]);

  const overdueReceivables = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    return buildReceivables(sales, paymentsBySale).filter(
      (item) =>
        item.dueDate &&
        item.dueDate < today &&
        !item.paid &&
        !isReceivableCanceled(item.status) &&
        item.saleStatus !== "cancelada",
    );
  }, [sales, paymentsBySale]);

  const overdueTotal = useMemo(
    () =>
      overdueReceivables.reduce(
        (sum, item) => sum + parseMoney(item.amount),
        0,
      ),
    [overdueReceivables],
  );

  const totals = useMemo(() => {
    const totalToReceive = receivables.reduce(
      (sum, item) => sum + parseMoney(item.amount),
      0,
    );

    const paid = receivables.reduce(
      (sum, item) => sum + (item.paid ? parseMoney(item.amount) : 0),
      0,
    );

    const pending = receivables.reduce(
      (sum, item) => sum + (!item.paid ? parseMoney(item.amount) : 0),
      0,
    );

    return { totalToReceive, paid, pending };
  }, [receivables]);

  function openPaymentModal(receivable: ReceivableItem) {
    setSelectedReceivable(receivable);
    setPaymentForm({
      status:
        receivable.status === "cancelado"
          ? "cancelado"
          : receivable.paid
            ? "pago"
            : "pendente",
      paid: receivable.paid,
      paidDate:
        receivable.paidDate ||
        receivable.dueDate ||
        new Date().toISOString().slice(0, 10),
      paymentMethod:
        receivable.paymentMethod || receivable.sale.paymentMethod || "",
      note: receivable.note || "",
    });
    setPaymentModalOpen(true);
  }

  async function handleSavePayment() {
    if (!selectedReceivable) return;

    if (paymentForm.status === "pago" && !paymentForm.paidDate) {
      setMessage("Informe a data do pagamento.");
      return;
    }

    const targetSale = sales.find(
      (item) => item.id === selectedReceivable.saleId,
    );

    if (!targetSale?.id) {
      setMessage("Venda não encontrada para atualizar o pagamento.");
      return;
    }

    const normalizedStatus = paymentForm.status;
    const isPaid = normalizedStatus === "pago";
    const isCanceled = normalizedStatus === "cancelado";

    try {
      setSavingPayment(true);

      if (selectedReceivable.source === "installment") {
        const updatedInstallments = (targetSale.installments || []).map(
          (item) =>
            item.id === selectedReceivable.installmentId ||
            item.number === selectedReceivable.installmentNumber
              ? {
                  ...item,
                  paid: isPaid,
                  paidDate: isPaid ? paymentForm.paidDate : "",
                  paymentMethod: paymentForm.paymentMethod,
                  note: paymentForm.note,
                }
              : item,
        );

        const allPaid =
          updatedInstallments.length > 0 &&
          updatedInstallments.every((item) => Boolean(item.paid));

        await saveLeadSale({
          ...targetSale,
          installments: updatedInstallments,
          paymentStatus: allPaid ? "pago" : "pendente",
          saleStatus: allPaid ? "finalizada" : targetSale.saleStatus || "ativa",
        });
      } else if (
        selectedReceivable.source === "payment" ||
        selectedReceivable.source === "recurring-generated"
      ) {
        const paymentId =
          selectedReceivable.saleType === "recorrente"
            ? getRecurringPaymentId(
                selectedReceivable.saleId,
                selectedReceivable.installmentNumber || 1,
                selectedReceivable.dueDate,
              )
            : selectedReceivable.paymentId ||
              getRecurringPaymentId(
                selectedReceivable.saleId,
                selectedReceivable.installmentNumber || 1,
                selectedReceivable.dueDate,
              );

        const paymentPayload = {
          id: paymentId,
          saleId: selectedReceivable.saleId,
          amount: selectedReceivable.amount,
          dueDate: selectedReceivable.dueDate,
          status: normalizedStatus,
          paid: isPaid,
          paidDate: isPaid ? paymentForm.paidDate : "",
          paymentMethod: paymentForm.paymentMethod,
          note: paymentForm.note,
          installmentNumber: selectedReceivable.installmentNumber || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as LeadSalePayment;

        await setDoc(
          doc(
            db,
            "leadSales",
            selectedReceivable.saleId,
            "payments",
            paymentId,
          ),
          paymentPayload,
          { merge: true },
        );

        if (isCanceled && selectedReceivable.saleType === "recorrente") {
          const currentPayments =
            paymentsBySale[selectedReceivable.saleId] || [];
          await cancelRecurringPayments(
            selectedReceivable.saleId,
            [...currentPayments, paymentPayload],
            paymentId,
          );
        }

        setPaymentsBySale((prev) => {
          const currentPayments = prev[selectedReceivable.saleId] || [];
          const filteredPayments = currentPayments.filter((payment) => {
            const sameId = payment.id === paymentId;
            const sameInstallment =
              Number(payment.installmentNumber || 0) ===
              Number(selectedReceivable.installmentNumber || 0);
            const sameDueDate =
              String(payment.dueDate || "") === selectedReceivable.dueDate;

            return !(sameId || sameInstallment || sameDueDate);
          });

          return {
            ...prev,
            [selectedReceivable.saleId]: [...filteredPayments, paymentPayload],
          };
        });

        await saveLeadSale({
          ...targetSale,
          paymentStatus: isPaid ? "pago" : "pendente",
          saleStatus: isCanceled
            ? "cancelada"
            : targetSale.saleStatus || "ativa",
        });

        if (selectedReceivable.saleType === "recorrente" && isPaid) {
          const refreshedPayments = await fetchLeadSalePaymentsBySale(
            selectedReceivable.saleId,
          );
          await ensureSixRecurringPayments(targetSale, refreshedPayments);
        }
      } else {
        await saveLeadSale({
          ...targetSale,
          paymentStatus: isPaid ? "pago" : "pendente",
          paidDate: isPaid ? paymentForm.paidDate : "",
          paymentMethod: paymentForm.paymentMethod,
        } as LeadSale);
      }

      await loadSales();
      setPaymentModalOpen(false);
      setSelectedReceivable(null);
      setMessage(
        isCanceled
          ? "Serviço recorrente cancelado. Novos pagamentos não serão gerados."
          : "Pagamento atualizado com sucesso.",
      );
    } catch (error) {
      console.error(error);
      setMessage("Erro ao atualizar pagamento.");
    } finally {
      setSavingPayment(false);
    }
  }

  function clearFilters() {
    setSearch("");
    setClientFilter("todos");
    setYearFilter(getCurrentYearFilter());
    setMonthFilter(getCurrentMonthFilter());
    setDayFilter("todos");
    setTypeFilter("todos");
    setStatusFilter("todos");
  }

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

  function openNewSale() {
    const today = new Date().toISOString().slice(0, 10);

    setSale({
      ...emptyLeadSale,
      saleDate: today,
      firstPaymentDueDate: today,
      firstInstallmentDueDate: today,
      recurringMonths: "12",
      saleType: "unica",
      saleStatus: "ativa",
    });

    setSaleModalOpen(true);
  }

  function openEditSale(item: LeadSale) {
    setSale({
      ...emptyLeadSale,
      ...item,
      saleType: item.saleType || (item.isInstallment ? "parcelada" : "unica"),
      saleStatus: item.saleStatus || "ativa",
      recurringMonths: item.recurringMonths || "12",
      installments: Array.isArray(item.installments) ? item.installments : [],
    });

    setSaleModalOpen(true);
  }

  async function handleSaveSale() {
    if (!sale.leadId || !sale.companyName.trim()) {
      setMessage("Selecione o cliente/empresa da venda.");
      return;
    }

    if (!sale.projectName.trim()) {
      setMessage("Informe o nome do projeto.");
      return;
    }

    if (sale.saleType === "recorrente" && !sale.monthlyAmount.trim()) {
      setMessage("Informe o valor mensal da recorrência.");
      return;
    }

    try {
      setSaving(true);

      const saleToSave = {
        ...sale,
        isInstallment: sale.saleType === "parcelada",
        paymentStatus: sale.paymentStatus || "pendente",
        saleStatus: sale.saleStatus || "ativa",
        recurringMonths:
          sale.saleType === "recorrente" ? "6" : sale.recurringMonths || "12",
      };

      const savedResult = (await saveLeadSale(saleToSave)) as unknown as
        | { id?: string }
        | string
        | void;

      let recurringSaleId = sale.id || "";

      if (!recurringSaleId && typeof savedResult === "string") {
        recurringSaleId = savedResult;
      }

      if (!recurringSaleId && savedResult && typeof savedResult === "object") {
        recurringSaleId = savedResult.id || "";
      }

      if (saleToSave.saleType === "recorrente") {
        let savedSale = recurringSaleId
          ? ({ ...saleToSave, id: recurringSaleId } as LeadSale)
          : undefined;

        if (!savedSale?.id) {
          const refreshedSales = await getLeadSales();
          savedSale = refreshedSales
            .filter(
              (item) =>
                item.saleType === "recorrente" &&
                item.companyName === saleToSave.companyName &&
                item.projectName === saleToSave.projectName &&
                item.saleDate === saleToSave.saleDate,
            )
            .sort((a, b) =>
              String(b.id || "").localeCompare(String(a.id || "")),
            )[0];
        }

        if (savedSale?.id) {
          const existingPayments = await fetchLeadSalePaymentsBySale(
            savedSale.id,
          );
          await ensureSixRecurringPayments(savedSale, existingPayments);
        }
      }

      await loadSales();
      setSale(emptyLeadSale);
      setSaleModalOpen(false);
      setMessage("Venda salva com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao salvar venda.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteSale(id?: string) {
    if (!id || !window.confirm("Deseja excluir esta venda e seus pagamentos?"))
      return;

    try {
      await removeLeadSale(id);
      await loadSales();
      setMessage("Venda excluída com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao excluir venda.");
    }
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
            <Loader2 className="spin" size={20} /> Carregando vendas...
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
                  Painel de vendas
                </h1>
                <p
                  style={{
                    color: colors.muted,
                    lineHeight: 1.7,
                    fontSize: 17,
                    margin: 0,
                  }}
                >
                  Gerencie projetos, vendas únicas, parcelamentos e mensalidades
                  recorrentes.
                </p>
              </div>

              <div style={{ display: "grid", gap: 12, marginTop: 34 }}>
                <span className="admin-badge">
                  <ShoppingCart size={15} /> Vendas e contratos
                </span>
                <span className="admin-badge">
                  <CreditCard size={15} /> Mensalidades recorrentes
                </span>
                <span className="admin-badge">
                  <Lock size={15} /> Acesso protegido
                </span>
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
                Entrar no painel
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
              <h1 style={styles.title}>Vendas</h1>
              <p style={styles.subText}>
                Cadastre vendas únicas, parceladas e mensalidades recorrentes.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
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

        {overdueReceivables.length > 0 && (
          <button
            type="button"
            className="overdue-alert"
            onClick={() => setOverdueModalOpen(true)}
          >
            <strong>Pagamentos em atraso</strong>
            <span>
              Existem {overdueReceivables.length} pagamento(s) vencido(s),
              totalizando {money(overdueTotal)}.
            </span>
          </button>
        )}

        <section style={styles.card}>
          <div className="list-toolbar">
            <div>
              <h2 style={styles.cardTitle}>Vendas cadastradas</h2>
              <p style={styles.cardSub}>
                {sales.length} venda(s) cadastrada(s).
              </p>
            </div>
            <button style={styles.button} onClick={openNewSale}>
              <Plus size={18} /> Nova venda
            </button>
          </div>

          <div className="filters-header">
            <span>
              Exibindo por padrão as vendas do mês atual. Use os filtros para
              alterar.
            </span>

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
                {clientOptions.map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
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
                <option value="todos">Todos</option>
                <option value="01">Janeiro</option>
                <option value="02">Fevereiro</option>
                <option value="03">Março</option>
                <option value="04">Abril</option>
                <option value="05">Maio</option>
                <option value="06">Junho</option>
                <option value="07">Julho</option>
                <option value="08">Agosto</option>
                <option value="09">Setembro</option>
                <option value="10">Outubro</option>
                <option value="11">Novembro</option>
                <option value="12">Dezembro</option>
              </select>
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Dia</span>
              <select
                value={dayFilter}
                onChange={(event) => setDayFilter(event.target.value)}
                style={styles.select}
              >
                <option value="todos">Todos</option>
                {dayOptions.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Tipo da venda</span>
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                style={styles.select}
              >
                <option value="todos">Todas</option>
                <option value="unica">Única</option>
                <option value="parcelada">Parcelada</option>
                <option value="recorrente">Mensalidade</option>
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
                <option value="ativa">Ativa</option>
                <option value="cancelada">Cancelada</option>
                <option value="finalizada">Finalizada</option>
              </select>
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Buscar venda</span>
              <div className="search-box">
                <Search size={18} color={colors.soft} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cliente, projeto, deploy..."
                />
              </div>
            </label>
          </div>

          <div className="kpi-grid">
            <div>
              <strong>{money(totals.totalToReceive)}</strong>
              <span>Valor previsto no mês</span>
            </div>
            <div>
              <strong>{money(totals.paid)}</strong>
              <span>Recebido no mês</span>
            </div>
            <div>
              <strong>{money(totals.pending)}</strong>
              <span>Pendente no mês</span>
            </div>
            <div>
              <strong>{receivables.length}</strong>
              <span>Recebimentos do mês</span>
            </div>
          </div>

          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Cliente / Projeto</th>
                  <th>Tipo</th>
                  <th>Valor / Total</th>
                  <th>Recebido</th>
                  <th>Total já pago</th>
                  <th>Pendente</th>
                  <th>Status</th>
                  <th>Venda</th>
                  <th>Vencimento</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {receivables.map((item) => {
                  const isPaid = item.paid;
                  const isCanceled = isReceivableCanceled(item.status);

                  return (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.companyName}</strong>
                        <span>{item.projectName}</span>
                        {item.sale.deployLink && (
                          <a
                            href={item.sale.deployLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Abrir deploy
                          </a>
                        )}
                      </td>

                      <td>
                        <span
                          className={`status-badge status-${item.saleType || "unica"}`}
                        >
                          {getSaleTypeLabel(item.sale)}
                        </span>
                        {item.source === "installment" && (
                          <small>Parcela {item.installmentNumber}</small>
                        )}
                        {item.source === "recurring-generated" && (
                          <small>Mensalidade {item.installmentNumber}</small>
                        )}
                      </td>

                      <td>
                        {item.saleType === "parcelada" ? (
                          <>
                            <strong>{getInstallmentTotalLabel(item)}</strong>
                            <small>Parcela: {money(item.amount)}</small>
                          </>
                        ) : (
                          money(item.amount)
                        )}
                      </td>
                      <td>{isPaid ? money(item.amount) : money(0)}</td>
                      <td>
                        {item.saleType === "recorrente" ||
                        item.saleType === "parcelada" ? (
                          <strong>{getTotalPaidLabel(item)}</strong>
                        ) : item.paid ? (
                          money(item.amount)
                        ) : (
                          money(0)
                        )}
                      </td>
                      <td>
                        <strong>
                          {getPendingLabel(item, isPaid, isCanceled)}
                        </strong>
                        {item.saleType === "parcelada" && (
                          <small>Falta receber</small>
                        )}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${isPaid ? "status-finalizada" : isCanceled ? "status-cancelada" : "status-pendente"}`}
                        >
                          {isPaid
                            ? "Pago"
                            : isCanceled
                              ? "Cancelado"
                              : "Pendente"}
                        </span>
                        {item.paidDate && (
                          <small>Pago em {formatDate(item.paidDate)}</small>
                        )}
                      </td>

                      <td>{formatDate(item.sale.saleDate)}</td>
                      <td>{formatDate(item.dueDate)}</td>

                      <td>
                        <div className="row-actions">
                          <button
                            className="small-action success icon-action"
                            onClick={() => openPaymentModal(item)}
                            title="Informar pagamento"
                            aria-label="Informar pagamento"
                          >
                            <CheckCircle2 size={17} />
                          </button>
                          <button
                            className="small-action icon-action"
                            onClick={() => openEditSale(item.sale)}
                            title="Editar venda"
                            aria-label="Editar venda"
                          >
                            <Edit3 size={17} />
                          </button>
                          <button
                            className="small-action danger icon-action"
                            onClick={() => handleDeleteSale(item.saleId)}
                            title="Excluir venda"
                            aria-label="Excluir venda"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {!receivables.length && (
                  <tr>
                    <td colSpan={10}>Nenhuma venda encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {saleModalOpen && (
        <SaleModal
          sale={sale}
          leads={leads}
          setSale={setSale}
          close={() => setSaleModalOpen(false)}
          saveSale={handleSaveSale}
          deleteSale={handleDeleteSale}
          saving={saving}
        />
      )}

      {paymentModalOpen && selectedReceivable && (
        <PaymentModal
          receivable={selectedReceivable}
          form={paymentForm}
          setForm={setPaymentForm}
          close={() => setPaymentModalOpen(false)}
          save={handleSavePayment}
          saving={savingPayment}
        />
      )}

      {overdueModalOpen && (
        <OverduePaymentsModal
          receivables={overdueReceivables}
          close={() => setOverdueModalOpen(false)}
          openPayment={(item) => {
            setOverdueModalOpen(false);
            openPaymentModal(item);
          }}
        />
      )}

      <GlobalStyle />
    </main>
  );
}

function SaleModal({
  sale,
  leads,
  setSale,
  close,
  saveSale,
  deleteSale,
  saving,
}: {
  sale: LeadSale;
  leads: Lead[];
  setSale: React.Dispatch<React.SetStateAction<LeadSale>>;
  close: () => void;
  saveSale: () => void;
  deleteSale: (id?: string) => void;
  saving: boolean;
}) {
  const clientLeads = useMemo(() => {
    return leads
      .filter((item) => {
        const leadWithOptionalStatus = item as Lead & {
          status?: string;
          leadStatus?: string;
        };

        const status = normalizeText(
          String(
            leadWithOptionalStatus.status ||
              leadWithOptionalStatus.leadStatus ||
              "",
          ),
        );

        return status === "cliente";
      })
      .sort((a, b) => (a.companyName || "").localeCompare(b.companyName || ""));
  }, [leads]);

  function generateInstallments() {
    const total = Number(sale.installmentsTotal || 0);
    const amount = parseMoney(sale.amount);
    const firstDueDate = sale.firstInstallmentDueDate || "";

    if (!total || !amount) {
      window.alert("Informe o valor total e a quantidade de parcelas.");
      return;
    }

    if (!firstDueDate) {
      window.alert("Informe a data de vencimento da 1ª parcela.");
      return;
    }

    const installmentAmount = amount / total;

    setSale((prev) => ({
      ...prev,
      saleType: "parcelada",
      isInstallment: true,
      paymentStatus: "pendente",
      firstInstallmentDueDate: firstDueDate,
      installments: Array.from({ length: total }, (_, index) => ({
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${index}`,
        number: index + 1,
        amount: installmentAmount.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        dueDate: addMonthsToDate(firstDueDate, index),
        paid: false,
        paidDate: "",
        paymentMethod: prev.paymentMethod || "",
        receiptLink: "",
        note: "",
      })),
    }));
  }

  return (
    <div style={styles.modalBackdrop}>
      <section style={styles.modal}>
        <header style={styles.modalHeader}>
          <div>
            <h2 style={styles.cardTitle}>
              {sale.id ? "Editar venda" : "Nova venda"}
            </h2>
            <p style={styles.cardSub}>
              Cadastre venda única, parcelada ou mensalidade recorrente.
            </p>
          </div>
          <button type="button" style={styles.secondaryButton} onClick={close}>
            <X size={18} /> Fechar
          </button>
        </header>

        <div style={styles.formGrid} className="admin-form-grid">
          <h3 className="form-section-title">Dados principais</h3>

          <label style={styles.field}>
            <span style={styles.label}>Cliente / empresa *</span>
            <select
              value={sale.leadId || ""}
              onChange={(event) => {
                const selected = leads.find(
                  (item) => item.id === event.target.value,
                );
                setSale((p) => ({
                  ...p,
                  leadId: selected?.id || "",
                  companyName: selected?.companyName || "",
                }));
              }}
              style={styles.select}
            >
              <option value="">Selecione um cliente cadastrado</option>
              {clientLeads.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.companyName}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Tipo de venda</span>
            <select
              value={sale.saleType}
              onChange={(event) => {
                const saleType = event.target.value as LeadSale["saleType"];
                setSale((p) => ({
                  ...p,
                  saleType,
                  isInstallment: saleType === "parcelada",
                  paymentStatus: "pendente",
                }));
              }}
              style={styles.select}
            >
              <option value="unica">Venda única</option>
              <option value="parcelada">Parcelada</option>
              <option value="recorrente">Mensalidade recorrente</option>
            </select>
          </label>

          <Field
            label="Nome do projeto *"
            value={sale.projectName}
            onChange={(v) => setSale((p) => ({ ...p, projectName: v }))}
          />

          <Field
            label="Tipo do projeto"
            value={sale.projectType}
            onChange={(v) => setSale((p) => ({ ...p, projectType: v }))}
          />

          <h3 className="form-section-title">Valores e cobrança</h3>

          {sale.saleType === "recorrente" ? (
            <>
              <Field
                label="Valor mensal"
                value={sale.monthlyAmount}
                onChange={(v) =>
                  setSale((p) => ({ ...p, monthlyAmount: v, amount: v }))
                }
                placeholder="Ex: 399,00"
              />

              <Field
                label="Quantidade de meses"
                value={sale.recurringMonths}
                onChange={(v) => setSale((p) => ({ ...p, recurringMonths: v }))}
                placeholder="Ex: 12"
              />

              <Field
                type="date"
                label="1º vencimento"
                value={sale.firstPaymentDueDate}
                onChange={(v) =>
                  setSale((p) => ({ ...p, firstPaymentDueDate: v }))
                }
              />
            </>
          ) : (
            <Field
              label="Valor total"
              value={sale.amount}
              onChange={(v) => setSale((p) => ({ ...p, amount: v }))}
              placeholder="Ex: 1.200,00"
            />
          )}

          <Field
            label="Forma de pagamento"
            value={sale.paymentMethod}
            onChange={(v) => setSale((p) => ({ ...p, paymentMethod: v }))}
            placeholder="Pix, boleto, cartão..."
          />

          <label style={styles.field}>
            <span style={styles.label}>Pagamento</span>
            <select
              value={sale.paymentStatus || "pendente"}
              onChange={(event) =>
                setSale(
                  (p) =>
                    ({
                      ...p,
                      paymentStatus: event.target
                        .value as LeadSale["paymentStatus"],
                      paidDate:
                        event.target.value === "pago"
                          ? (p as LeadSaleWithPaymentDate).paidDate ||
                            new Date().toISOString().slice(0, 10)
                          : "",
                    }) as LeadSale,
                )
              }
              style={styles.select}
            >
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
            </select>
          </label>

          {sale.paymentStatus === "pago" && (
            <Field
              type="date"
              label="Data do pagamento"
              value={(sale as LeadSaleWithPaymentDate).paidDate || ""}
              onChange={(v) =>
                setSale((p) => ({ ...p, paidDate: v }) as LeadSale)
              }
            />
          )}

          <h3 className="form-section-title">Status e datas</h3>

          <label style={styles.field}>
            <span style={styles.label}>Status da venda</span>
            <select
              value={sale.saleStatus}
              onChange={(event) =>
                setSale((p) => ({
                  ...p,
                  saleStatus: event.target.value as LeadSale["saleStatus"],
                }))
              }
              style={styles.select}
            >
              <option value="ativa">Ativa</option>
              <option value="cancelada">Cancelada</option>
              <option value="finalizada">Finalizada</option>
            </select>
          </label>

          <Field
            type="date"
            label="Data da venda"
            value={sale.saleDate}
            onChange={(v) => setSale((p) => ({ ...p, saleDate: v }))}
          />

          {sale.saleType === "unica" && (
            <Field
              type="date"
              label="Data de vencimento"
              value={sale.firstPaymentDueDate}
              onChange={(v) =>
                setSale((p) => ({ ...p, firstPaymentDueDate: v }))
              }
            />
          )}

          <Field
            type="date"
            label="Data de entrega"
            value={sale.deliveryDate}
            onChange={(v) => setSale((p) => ({ ...p, deliveryDate: v }))}
          />

          <h3 className="form-section-title">Links e informações técnicas</h3>

          <Field
            label="Link do projeto"
            value={sale.projectLink}
            onChange={(v) => setSale((p) => ({ ...p, projectLink: v }))}
          />

          <Field
            label="Deploy"
            value={sale.deployLink}
            onChange={(v) => setSale((p) => ({ ...p, deployLink: v }))}
          />

          <Field
            label="Banco de dados"
            value={sale.databaseName}
            onChange={(v) => setSale((p) => ({ ...p, databaseName: v }))}
          />

          <Field
            label="Imagem / print do projeto"
            value={sale.image}
            onChange={(v) => setSale((p) => ({ ...p, image: v }))}
          />

          <Field
            label="Contrato / proposta"
            value={sale.contractLink}
            onChange={(v) => setSale((p) => ({ ...p, contractLink: v }))}
          />

          {sale.saleType === "parcelada" && (
            <h3 className="form-section-title">Parcelamento</h3>
          )}

          {sale.saleType === "parcelada" && (
            <div className="payment-box">
              <div className="installment-config">
                <Field
                  label="Quantidade de parcelas"
                  value={sale.installmentsTotal}
                  onChange={(v) =>
                    setSale((p) => ({ ...p, installmentsTotal: v }))
                  }
                  placeholder="Ex: 3"
                />

                <Field
                  type="date"
                  label="1º vencimento"
                  value={sale.firstInstallmentDueDate}
                  onChange={(v) =>
                    setSale((p) => ({ ...p, firstInstallmentDueDate: v }))
                  }
                />

                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={generateInstallments}
                >
                  <Plus size={16} /> Gerar parcelas
                </button>
              </div>
            </div>
          )}

          {sale.saleType === "parcelada" && sale.installments.length > 0 && (
            <div className="installment-preview">
              <h3>Parcelas geradas</h3>
              {sale.installments.map((item) => (
                <div key={item.id} className="installment-line">
                  <span>Parcela {item.number}</span>
                  <span>{money(item.amount)}</span>
                  <span>{formatDate(item.dueDate)}</span>
                </div>
              ))}
            </div>
          )}

          <h3 className="form-section-title">Descrição e observações</h3>

          <label style={{ ...styles.field, gridColumn: "1 / -1" }}>
            <span style={styles.label}>Itens inclusos</span>
            <textarea
              style={styles.textarea}
              value={sale.includedItems}
              onChange={(event) =>
                setSale((p) => ({ ...p, includedItems: event.target.value }))
              }
            />
          </label>

          <label style={{ ...styles.field, gridColumn: "1 / -1" }}>
            <span style={styles.label}>Acessos / informações técnicas</span>
            <textarea
              style={styles.textarea}
              value={sale.accessInfo}
              onChange={(event) =>
                setSale((p) => ({ ...p, accessInfo: event.target.value }))
              }
            />
          </label>

          <label style={{ ...styles.field, gridColumn: "1 / -1" }}>
            <span style={styles.label}>Observações</span>
            <textarea
              style={styles.textarea}
              value={sale.notes}
              onChange={(event) =>
                setSale((p) => ({ ...p, notes: event.target.value }))
              }
            />
          </label>
        </div>

        <div style={styles.actions}>
          <button style={styles.button} onClick={saveSale} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="spin" size={16} /> Salvando...
              </>
            ) : (
              <>
                <Save size={16} /> Salvar venda
              </>
            )}
          </button>

          <button style={styles.secondaryButton} onClick={close}>
            Cancelar
          </button>

          {sale.id && (
            <button
              style={styles.dangerButton}
              onClick={() => deleteSale(sale.id)}
            >
              <Trash2 size={16} /> Excluir venda
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

function PaymentModal({
  receivable,
  form,
  setForm,
  close,
  save,
  saving,
}: {
  receivable: ReceivableItem;
  form: PaymentFormState;
  setForm: React.Dispatch<React.SetStateAction<PaymentFormState>>;
  close: () => void;
  save: () => void;
  saving: boolean;
}) {
  return (
    <div style={styles.modalBackdrop}>
      <section style={{ ...styles.modal, width: "min(620px, 100%)" }}>
        <header style={styles.modalHeader}>
          <div>
            <h2 style={styles.cardTitle}>Informar pagamento</h2>
            <p style={styles.cardSub}>
              {receivable.companyName} • {receivable.projectName}
            </p>
          </div>
          <button type="button" style={styles.secondaryButton} onClick={close}>
            <X size={18} /> Fechar
          </button>
        </header>

        <div className="payment-summary">
          <div>
            <span>Valor</span>
            <strong>{money(receivable.amount)}</strong>
          </div>
          <div>
            <span>Vencimento</span>
            <strong>{formatDate(receivable.dueDate)}</strong>
          </div>
          <div>
            <span>Tipo</span>
            <strong>
              {receivable.source === "installment"
                ? `Parcela ${receivable.installmentNumber}`
                : getSaleTypeLabel(receivable.sale)}
            </strong>
          </div>
          {receivable.saleType === "recorrente" && (
            <div>
              <span>Total já pago nesta recorrência</span>
              <strong>{getRecurringPaidLabel(receivable)}</strong>
            </div>
          )}
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <label style={styles.field}>
            <span style={styles.label}>Status do pagamento</span>
            <select
              value={form.status}
              onChange={(event) => {
                const status = event.target.value as PaymentFormState["status"];

                setForm((prev) => ({
                  ...prev,
                  status,
                  paid: status === "pago",
                  paidDate:
                    status === "pago"
                      ? prev.paidDate || new Date().toISOString().slice(0, 10)
                      : "",
                }));
              }}
              style={styles.select}
            >
              <option value="pago">Pago</option>
              <option value="pendente">Pendente</option>
              {receivable.saleType === "recorrente" && (
                <option value="cancelado">Cancelar serviço</option>
              )}
            </select>
          </label>

          {form.status === "pago" && (
            <Field
              type="date"
              label="Data do pagamento"
              value={form.paidDate}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, paidDate: value }))
              }
            />
          )}

          <Field
            label="Forma de pagamento"
            value={form.paymentMethod}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, paymentMethod: value }))
            }
            placeholder="Pix, boleto, cartão..."
          />

          <label style={styles.field}>
            <span style={styles.label}>Observação do pagamento</span>
            <textarea
              style={styles.textarea}
              value={form.note}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, note: event.target.value }))
              }
            />
          </label>
        </div>

        <div style={styles.actions}>
          <button style={styles.button} onClick={save} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="spin" size={16} /> Salvando...
              </>
            ) : (
              <>
                <CalendarCheck size={16} /> Salvar pagamento
              </>
            )}
          </button>
          <button style={styles.secondaryButton} onClick={close}>
            Cancelar
          </button>
        </div>
      </section>
    </div>
  );
}

function OverduePaymentsModal({
  receivables,
  close,
  openPayment,
}: {
  receivables: ReceivableItem[];
  close: () => void;
  openPayment: (item: ReceivableItem) => void;
}) {
  const total = receivables.reduce(
    (sum, item) => sum + parseMoney(item.amount),
    0,
  );

  return (
    <div style={styles.modalBackdrop}>
      <section style={{ ...styles.modal, width: "min(980px, 100%)" }}>
        <header style={styles.modalHeader}>
          <div>
            <h2 style={styles.cardTitle}>Pagamentos vencidos</h2>
            <p style={styles.cardSub}>
              {receivables.length} pagamento(s) em atraso • Total {money(total)}
            </p>
          </div>
          <button type="button" style={styles.secondaryButton} onClick={close}>
            <X size={18} /> Fechar
          </button>
        </header>

        <div className="table-wrap">
          <table className="admin-table overdue-table">
            <thead>
              <tr>
                <th>Cliente / Projeto</th>
                <th>Tipo</th>
                <th>Valor / Total</th>
                <th>Vencimento</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {receivables.map((item) => (
                <tr key={`overdue-${item.id}`}>
                  <td>
                    <strong>{item.companyName}</strong>
                    <span>{item.projectName}</span>
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${item.saleType || "unica"}`}
                    >
                      {getSaleTypeLabel(item.sale)}
                    </span>
                    {item.installmentNumber && (
                      <small>Nº {item.installmentNumber}</small>
                    )}
                  </td>
                  <td>{money(item.amount)}</td>
                  <td>{formatDate(item.dueDate)}</td>
                  <td>
                    <button
                      type="button"
                      className="small-action success"
                      onClick={() => openPayment(item)}
                    >
                      <CheckCircle2 size={16} /> Pagar
                    </button>
                  </td>
                </tr>
              ))}

              {!receivables.length && (
                <tr>
                  <td colSpan={5}>Nenhum pagamento vencido.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
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

      .overdue-alert {
        width: 100%;
        border: 0;
        cursor: pointer;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        margin: 0 0 18px;
        padding: 16px 18px;
        border-radius: 22px;
        background: rgba(239, 68, 68, 0.18);
        border: 1px solid rgba(248, 113, 113, 0.45);
        color: #fee2e2;
        box-shadow: 0 18px 50px rgba(239, 68, 68, 0.14);
      }

      .overdue-alert strong {
        display: block;
        font-size: 16px;
      }

      .overdue-alert span {
        color: #fecaca;
        font-weight: 800;
      }

      .form-section {
        grid-column: 1 / -1;
        border-radius: 24px;
        padding: 18px;
        background: rgba(2, 6, 23, 0.26);
        border: 1px solid rgba(125, 211, 252, 0.14);
        display: grid;
        gap: 16px;
      }

      .form-section h3 {
        margin: 0;
        color: #e0f2fe;
        font-size: 18px;
      }

      .form-section-title {
        grid-column: 1 / -1;
        margin: 14px 0 0;
        padding: 12px 14px;
        border-radius: 16px;
        color: #e0f2fe;
        background: rgba(14, 165, 233, 0.1);
        border: 1px solid rgba(125, 211, 252, 0.16);
        font-size: 15px;
      }

      .form-section-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .admin-badge {
        display: inline-flex;
        width: fit-content;
        align-items: center;
        gap: 7px;
        padding: 8px 11px;
        border-radius: 999px;
        background: rgba(14, 165, 233, 0.12);
        border: 1px solid rgba(125, 211, 252, 0.18);
        color: #bae6fd;
        font-size: 12px;
        font-weight: 900;
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

      .filters-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        margin-bottom: 14px;
        color: #94a3b8;
        font-size: 13px;
        font-weight: 800;
      }

      .filters-grid {
        display: grid;
        grid-template-columns: 1.15fr 140px 170px 140px 180px 180px 1.4fr;
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
        min-width: 1280px;
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

      .admin-table td a {
        display: inline-flex;
        color: #7dd3fc;
        margin-top: 6px;
        font-size: 13px;
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

      .status-unica,
      .status-ativa {
        color: #bbf7d0;
        background: rgba(34, 197, 94, 0.14);
      }

      .status-parcelada {
        color: #bae6fd;
        background: rgba(14, 165, 233, 0.16);
      }

      .status-recorrente {
        color: #fef3c7;
        background: rgba(245, 158, 11, 0.15);
      }

      .status-cancelada {
        color: #fecaca;
        background: rgba(239, 68, 68, 0.18);
      }

      .status-pendente {
        color: #fef3c7;
        background: rgba(245, 158, 11, 0.16);
      }

      .status-finalizada {
        color: #ddd6fe;
        background: rgba(124, 58, 237, 0.18);
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

      .small-action.danger {
        color: #fff;
        background: rgba(239, 68, 68, 0.82);
      }

      .small-action.success {
        color: #dcfce7;
        background: rgba(34, 197, 94, 0.18);
      }

      .icon-action {
        width: 42px;
        height: 42px;
        padding: 0;
      }

      .payment-summary {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        margin-bottom: 18px;
      }

      .payment-summary > div {
        border-radius: 18px;
        padding: 14px;
        background: rgba(2, 6, 23, 0.35);
        border: 1px solid rgba(125, 211, 252, 0.14);
      }

      .payment-summary span {
        display: block;
        color: #94a3b8;
        font-size: 12px;
        font-weight: 900;
        margin-bottom: 6px;
      }

      .payment-summary strong {
        color: #f8fafc;
      }

      .payment-box,
      .installment-preview {
        grid-column: 1 / -1;
        border-radius: 22px;
        padding: 16px;
        background: rgba(2, 6, 23, 0.35);
        border: 1px solid rgba(125, 211, 252, 0.14);
        display: grid;
        gap: 14px;
      }

      .installment-config {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: 12px;
        align-items: end;
      }

      .installment-preview h3 {
        margin: 0;
      }

      .installment-line {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 10px;
        padding: 10px;
        border-radius: 14px;
        background: rgba(15, 23, 42, 0.72);
        color: #dbeafe;
      }

      @media (max-width: 900px) {
        .admin-form-grid,
        .form-section-grid,
        .filters-grid,
        .kpi-grid,
        .payment-summary,
        .installment-config,
        .installment-line {
          grid-template-columns: 1fr !important;
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
