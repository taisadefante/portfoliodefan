import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  defaultLeadOptions,
  Lead,
  LeadContact,
  LeadOptionCategory,
  LeadOptionItem,
  LeadSale,
  LeadSalePayment,
} from "@/lib/leadsTypes";

const now = () => new Date().toISOString();

const clean = <T extends Record<string, unknown>>(data: T): T =>
  Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  ) as T;

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

  const formattedYear = targetDate.getFullYear();
  const formattedMonth = String(targetDate.getMonth() + 1).padStart(2, "0");
  const formattedDay = String(targetDate.getDate()).padStart(2, "0");

  return `${formattedYear}-${formattedMonth}-${formattedDay}`;
}

function parseMoney(value?: string) {
  if (!value) return 0;
  return Number(String(value).replace(/\./g, "").replace(",", ".")) || 0;
}

function formatMoney(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function normalizeSaleType(sale: LeadSale) {
  if (sale.saleType) return sale.saleType;
  if (sale.isInstallment) return "parcelada";
  return "unica";
}

export async function getLeads(): Promise<Lead[]> {
  const snap = await getDocs(
    query(collection(db, "leads"), orderBy("companyName", "asc")),
  );

  return snap.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Lead),
  }));
}

export async function saveLead(lead: Lead) {
  const payload = clean({
    ...lead,
    updatedAt: now(),
    createdAt: lead.createdAt || now(),
  });

  if (lead.id) {
    await setDoc(doc(db, "leads", lead.id), payload, { merge: true });
  } else {
    await addDoc(collection(db, "leads"), payload);
  }
}

export async function removeLead(id: string) {
  await deleteDoc(doc(db, "leads", id));
}

export async function getLeadContacts(leadId: string): Promise<LeadContact[]> {
  const snap = await getDocs(
    query(
      collection(db, "leadContacts"),
      where("leadId", "==", leadId),
      orderBy("contactDate", "desc"),
    ),
  );

  return snap.docs.map((item) => ({
    id: item.id,
    ...(item.data() as LeadContact),
  }));
}

export async function saveLeadContact(contact: LeadContact) {
  const payload = clean({
    ...contact,
    updatedAt: now(),
    createdAt: contact.createdAt || now(),
  });

  if (contact.id) {
    await setDoc(doc(db, "leadContacts", contact.id), payload, {
      merge: true,
    });
  } else {
    await addDoc(collection(db, "leadContacts"), payload);
  }
}

export async function removeLeadContact(id: string) {
  await deleteDoc(doc(db, "leadContacts", id));
}

export async function getLeadSales(leadId?: string): Promise<LeadSale[]> {
  const base = collection(db, "leadSales");

  const q = leadId
    ? query(base, where("leadId", "==", leadId), orderBy("saleDate", "desc"))
    : query(base, orderBy("saleDate", "desc"));

  const snap = await getDocs(q);

  return snap.docs.map((item) => ({
    id: item.id,
    ...(item.data() as LeadSale),
  }));
}

export async function saveLeadSale(sale: LeadSale) {
  const payload = clean({
    ...sale,
    saleStatus: sale.saleStatus || "ativa",
    saleType: normalizeSaleType(sale),
    updatedAt: now(),
    createdAt: sale.createdAt || now(),
  });

  if (sale.id) {
    await setDoc(doc(db, "leadSales", sale.id), payload, { merge: true });

    await createSalePayments({
      ...sale,
      id: sale.id,
    });

    return sale.id;
  }

  const created = await addDoc(collection(db, "leadSales"), payload);
  const saleId = created.id;

  await createSalePayments({
    ...sale,
    id: saleId,
  });

  return saleId;
}

export async function removeLeadSale(id: string) {
  const payments = await getLeadSalePaymentsBySale(id);

  await Promise.all(
    payments.map((payment) =>
      payment.id
        ? deleteDoc(doc(db, "leadSalePayments", payment.id))
        : Promise.resolve(),
    ),
  );

  await deleteDoc(doc(db, "leadSales", id));
}

export async function getLeadOptions(): Promise<
  Record<LeadOptionCategory, LeadOptionItem[]>
> {
  const result = { ...defaultLeadOptions };
  const snap = await getDocs(collection(db, "leadOptions"));

  snap.docs.forEach((item) => {
    const id = item.id as LeadOptionCategory;
    const data = item.data() as { items?: LeadOptionItem[] };

    if (Array.isArray(data.items)) {
      result[id] = data.items;
    }
  });

  return result;
}

export async function saveLeadOptions(
  category: LeadOptionCategory,
  items: LeadOptionItem[],
) {
  await setDoc(
    doc(db, "leadOptions", category),
    { items, updatedAt: now() },
    { merge: true },
  );
}

export async function createSalePayments(sale: LeadSale) {
  if (!sale.id) return;

  const existing = await getLeadSalePaymentsBySale(sale.id);

  if (existing.length > 0) return;

  const saleType = normalizeSaleType(sale);

  if (saleType === "recorrente") {
    const firstDate =
      sale.firstPaymentDueDate ||
      sale.firstInstallmentDueDate ||
      sale.saleDate ||
      new Date().toISOString().slice(0, 10);

    const amount = sale.monthlyAmount || sale.amount;

    const payment: Omit<LeadSalePayment, "id"> = {
      saleId: sale.id || "",
      leadId: sale.leadId || "",
      companyName: sale.companyName || "",
      projectName: sale.projectName || "",
      saleType: "recorrente",
      number: 1,
      amount,
      dueDate: firstDate,
      paidDate: "",
      paymentMethod: sale.paymentMethod || "Pix",
      receiptLink: "",
      note: "",
      status: "pendente",
      createdAt: now(),
      updatedAt: now(),
    };

    await addDoc(collection(db, "leadSalePayments"), clean(payment));
    return;
  }

  if (saleType === "parcelada" || sale.isInstallment) {
    let installments = Array.isArray(sale.installments)
      ? sale.installments
      : [];

    if (!installments.length) {
      const total = Number(sale.installmentsTotal || 1);
      const amount = parseMoney(sale.amount);
      const firstDueDate =
        sale.firstInstallmentDueDate ||
        sale.firstPaymentDueDate ||
        sale.saleDate ||
        new Date().toISOString().slice(0, 10);

      const installmentAmount = total > 0 ? amount / total : amount;

      installments = Array.from({ length: total }, (_, index) => ({
        id: `${sale.id}-${index + 1}`,
        number: index + 1,
        amount: formatMoney(installmentAmount),
        dueDate: addMonthsToDate(firstDueDate, index),
        paid: false,
        paidDate: "",
        paymentMethod: sale.paymentMethod || "Pix",
        receiptLink: "",
        note: "",
      }));
    }

    const payments: Omit<LeadSalePayment, "id">[] = installments.map(
      (installment) => ({
        saleId: sale.id || "",
        leadId: sale.leadId || "",
        companyName: sale.companyName || "",
        projectName: sale.projectName || "",
        saleType: "parcelada",
        number: installment.number,
        amount: installment.amount,
        dueDate:
          installment.dueDate ||
          sale.firstInstallmentDueDate ||
          sale.saleDate ||
          new Date().toISOString().slice(0, 10),
        paidDate: installment.paidDate || "",
        paymentMethod: installment.paymentMethod || sale.paymentMethod || "Pix",
        receiptLink: installment.receiptLink || "",
        note: installment.note || "",
        status: installment.paid ? "pago" : "pendente",
        createdAt: now(),
        updatedAt: now(),
      }),
    );

    await Promise.all(
      payments.map((payment) =>
        addDoc(collection(db, "leadSalePayments"), clean(payment)),
      ),
    );

    return;
  }

  const payment: Omit<LeadSalePayment, "id"> = {
    saleId: sale.id || "",
    leadId: sale.leadId || "",
    companyName: sale.companyName || "",
    projectName: sale.projectName || "",
    saleType: "unica",
    number: 1,
    amount: sale.amount || "0,00",
    dueDate:
      sale.firstPaymentDueDate ||
      sale.firstInstallmentDueDate ||
      sale.saleDate ||
      new Date().toISOString().slice(0, 10),
    paidDate: sale.paymentStatus === "pago" ? sale.saleDate : "",
    paymentMethod: sale.paymentMethod || "Pix",
    receiptLink: "",
    note: "",
    status: sale.paymentStatus === "pago" ? "pago" : "pendente",
    createdAt: now(),
    updatedAt: now(),
  };

  await addDoc(collection(db, "leadSalePayments"), clean(payment));
}

export async function ensurePaymentsForAllSales() {
  const sales = await getLeadSales();

  await Promise.all(
    sales.map(async (sale) => {
      if (!sale.id) return;

      const payments = await getLeadSalePaymentsBySale(sale.id);

      if (payments.length === 0) {
        await createSalePayments(sale);
      }
    }),
  );
}

export async function getLeadSalePayments(): Promise<LeadSalePayment[]> {
  await ensurePaymentsForAllSales();

  const snap = await getDocs(collection(db, "leadSalePayments"));

  return snap.docs
    .map((item) => ({
      id: item.id,
      ...(item.data() as LeadSalePayment),
    }))
    .sort((a, b) =>
      String(a.dueDate || "").localeCompare(String(b.dueDate || "")),
    );
}

export async function getLeadSalePaymentsBySale(
  saleId: string,
): Promise<LeadSalePayment[]> {
  const snap = await getDocs(
    query(collection(db, "leadSalePayments"), where("saleId", "==", saleId)),
  );

  return snap.docs
    .map((item) => ({
      id: item.id,
      ...(item.data() as LeadSalePayment),
    }))
    .sort((a, b) =>
      String(a.dueDate || "").localeCompare(String(b.dueDate || "")),
    );
}

export async function saveLeadSalePayment(payment: LeadSalePayment) {
  const payload = clean({
    ...payment,
    updatedAt: now(),
    createdAt: payment.createdAt || now(),
  });

  if (payment.id) {
    await setDoc(doc(db, "leadSalePayments", payment.id), payload, {
      merge: true,
    });
  } else {
    await addDoc(collection(db, "leadSalePayments"), payload);
  }
}

export async function markLeadSalePaymentAsPaid(payment: LeadSalePayment) {
  await confirmLeadSalePaymentAsPaid(
    payment,
    new Date().toISOString().slice(0, 10),
  );
}

export async function confirmLeadSalePaymentAsPaid(
  payment: LeadSalePayment,
  paidDate: string,
) {
  if (!payment.id) return;

  await setDoc(
    doc(db, "leadSalePayments", payment.id),
    {
      status: "pago",
      paidDate,
      updatedAt: now(),
    },
    { merge: true },
  );

  if (payment.saleType !== "recorrente" || !payment.saleId) return;

  const saleRef = doc(db, "leadSales", payment.saleId);
  const saleSnap = await getDoc(saleRef);

  if (!saleSnap.exists()) return;

  const sale = {
    id: saleSnap.id,
    ...(saleSnap.data() as LeadSale),
  };

  if (sale.saleStatus === "cancelada") return;

  const payments = await getLeadSalePaymentsBySale(payment.saleId);

  const nextNumber = payment.number + 1;
  const alreadyHasNext = payments.some((item) => item.number === nextNumber);

  if (alreadyHasNext) return;

  const nextDueDate = addMonthsToDate(payment.dueDate, 1);

  const nextPayment: Omit<LeadSalePayment, "id"> = {
    saleId: payment.saleId,
    leadId: payment.leadId || sale.leadId || "",
    companyName: payment.companyName || sale.companyName || "",
    projectName: payment.projectName || sale.projectName || "",
    saleType: "recorrente",
    number: nextNumber,
    amount: sale.monthlyAmount || payment.amount || sale.amount || "0,00",
    dueDate: nextDueDate,
    paidDate: "",
    paymentMethod: payment.paymentMethod || sale.paymentMethod || "Pix",
    receiptLink: "",
    note: "",
    status: "pendente",
    createdAt: now(),
    updatedAt: now(),
  };

  await addDoc(collection(db, "leadSalePayments"), clean(nextPayment));
}

export async function markLeadSalePaymentAsPending(payment: LeadSalePayment) {
  if (!payment.id) return;

  await setDoc(
    doc(db, "leadSalePayments", payment.id),
    {
      status: "pendente",
      paidDate: "",
      updatedAt: now(),
    },
    { merge: true },
  );
}

export async function cancelFutureLeadSalePayments(
  saleId: string,
  fromPaymentNumber: number,
) {
  const payments = await getLeadSalePaymentsBySale(saleId);

  const futurePayments = payments.filter(
    (payment) =>
      payment.number >= fromPaymentNumber && payment.status !== "pago",
  );

  await Promise.all(
    futurePayments.map((payment) =>
      payment.id
        ? setDoc(
            doc(db, "leadSalePayments", payment.id),
            {
              status: "cancelado",
              updatedAt: now(),
            },
            { merge: true },
          )
        : Promise.resolve(),
    ),
  );

  await setDoc(
    doc(db, "leadSales", saleId),
    {
      saleStatus: "cancelada",
      updatedAt: now(),
    },
    { merge: true },
  );
}

export async function updateFutureLeadSalePayments(
  saleId: string,
  data: {
    amount?: string;
    paymentMethod?: string;
    firstDueDate?: string;
  },
) {
  const payments = await getLeadSalePaymentsBySale(saleId);

  const editablePayments = payments.filter(
    (payment) => payment.status !== "pago" && payment.status !== "cancelado",
  );

  await Promise.all(
    editablePayments.map((payment, index) => {
      if (!payment.id) return Promise.resolve();

      return setDoc(
        doc(db, "leadSalePayments", payment.id),
        clean({
          amount: data.amount || payment.amount,
          paymentMethod: data.paymentMethod || payment.paymentMethod,
          dueDate: data.firstDueDate
            ? addMonthsToDate(data.firstDueDate, index)
            : payment.dueDate,
          updatedAt: now(),
        }),
        { merge: true },
      );
    }),
  );
}

/**
 * Use esta função uma vez se você já criou uma venda recorrente com 12 parcelas
 * e quer manter apenas a primeira pendente + as já pagas.
 */
export async function removeUnpaidFutureRecurringPayments(saleId: string) {
  const payments = await getLeadSalePaymentsBySale(saleId);

  const unpaidFuturePayments = payments.filter(
    (payment) =>
      payment.saleType === "recorrente" &&
      payment.status !== "pago" &&
      payment.number > 1,
  );

  await Promise.all(
    unpaidFuturePayments.map((payment) =>
      payment.id
        ? deleteDoc(doc(db, "leadSalePayments", payment.id))
        : Promise.resolve(),
    ),
  );
}

/**
 * Aliases de compatibilidade.
 */
export const cancelFuturePayments = cancelFutureLeadSalePayments;
export const markPaymentAsPaid = markLeadSalePaymentAsPaid;
export const markPaymentAsPending = markLeadSalePaymentAsPending;
export const updatePayment = saveLeadSalePayment;
