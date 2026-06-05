import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type {
  JobApplication,
  JobCompany,
  JobEmailLog,
  JobEmailTemplate,
} from "@/lib/empregosTypes";

const companiesCollection = "jobCompanies";
const applicationsCollection = "jobApplications";
const logsCollection = "jobEmailLogs";
const templatesCollection = "jobEmailTemplates";

type JsonLike =
  | string
  | number
  | boolean
  | null
  | JsonLike[]
  | { [key: string]: JsonLike };

function cleanFirestoreData<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map((item) => cleanFirestoreData(item))
      .filter((item) => item !== undefined) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, itemValue]) => itemValue !== undefined)
        .map(([key, itemValue]) => [key, cleanFirestoreData(itemValue)]),
    ) as T;
  }

  return value;
}

function normalizeEmails(company: JobCompany) {
  return (company.emails || [])
    .map((item) => ({
      id: item.id || crypto.randomUUID(),
      email: (item.email || "").trim().toLowerCase(),
    }))
    .filter((item) => item.email);
}

export async function getJobCompanies(): Promise<JobCompany[]> {
  const snapshot = await getDocs(
    query(collection(db, companiesCollection), orderBy("createdAt", "desc")),
  );

  return snapshot.docs.map(
    (item) =>
      ({
        id: item.id,
        ...item.data(),
      }) as JobCompany,
  );
}

export async function saveJobCompany(company: JobCompany): Promise<string> {
  const now = new Date().toISOString();

  const payload = cleanFirestoreData({
    ...company,
    companyName: company.companyName?.trim() || "",
    contactName: company.contactName?.trim() || "",
    phone: company.phone?.trim() || "",
    linkedin: company.linkedin?.trim() || "",
    instagram: company.instagram?.trim() || "",
    facebook: company.facebook?.trim() || "",
    jobsPageLink: company.jobsPageLink?.trim() || "",
    desiredRole: company.desiredRole?.trim() || "",
    city: company.city?.trim() || "",
    state: company.state?.trim() || "",
    description: company.description?.trim() || "",
    notes: company.notes?.trim() || "",
    emails: normalizeEmails(company),
    status: company.status || "nao_enviado",
    workMode: company.workMode || "nao_informado",
    updatedAt: now,
    createdAt: company.createdAt || now,
  });

  if (company.id) {
    await setDoc(doc(db, companiesCollection, company.id), payload, {
      merge: true,
    });
    return company.id;
  }

  const created = await addDoc(collection(db, companiesCollection), payload);
  return created.id;
}

export async function removeJobCompany(id: string) {
  await deleteDoc(doc(db, companiesCollection, id));
}

export async function getJobApplications(): Promise<JobApplication[]> {
  const snapshot = await getDocs(
    query(collection(db, applicationsCollection), orderBy("createdAt", "desc")),
  );

  return snapshot.docs.map(
    (item) =>
      ({
        id: item.id,
        ...item.data(),
      }) as JobApplication,
  );
}

export async function saveJobApplication(application: JobApplication) {
  const now = new Date().toISOString();

  const payload = cleanFirestoreData({
    ...application,
    updatedAt: now,
    createdAt: application.createdAt || now,
  });

  if (application.id) {
    await setDoc(doc(db, applicationsCollection, application.id), payload, {
      merge: true,
    });
    return application.id;
  }

  const created = await addDoc(collection(db, applicationsCollection), payload);
  return created.id;
}

export async function removeJobApplication(id: string) {
  await deleteDoc(doc(db, applicationsCollection, id));
}

export async function getJobEmailLogs(): Promise<JobEmailLog[]> {
  const snapshot = await getDocs(
    query(collection(db, logsCollection), orderBy("sentAt", "desc")),
  );

  return snapshot.docs.map(
    (item) =>
      ({
        id: item.id,
        ...item.data(),
      }) as JobEmailLog,
  );
}

export async function saveJobEmailLog(log: JobEmailLog) {
  const now = new Date().toISOString();

  const payload = cleanFirestoreData({
    ...log,
    createdAt: log.createdAt || now,
  });

  const created = await addDoc(collection(db, logsCollection), payload);
  return created.id;
}

export async function getJobEmailTemplates(): Promise<JobEmailTemplate[]> {
  const snapshot = await getDocs(
    query(collection(db, templatesCollection), orderBy("createdAt", "asc")),
  );

  return snapshot.docs.map(
    (item) =>
      ({
        id: item.id,
        ...item.data(),
      }) as JobEmailTemplate,
  );
}

export async function saveJobEmailTemplate(template: JobEmailTemplate) {
  const now = new Date().toISOString();

  const payload = cleanFirestoreData({
    ...template,
    updatedAt: now,
    createdAt: template.createdAt || now,
  });

  if (template.id) {
    await setDoc(doc(db, templatesCollection, template.id), payload, {
      merge: true,
    });
    return template.id;
  }

  const created = await addDoc(collection(db, templatesCollection), payload);
  return created.id;
}
