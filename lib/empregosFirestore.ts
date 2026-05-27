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

function cleanUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as T;
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

  const payload = cleanUndefined({
    ...company,
    emails: Array.isArray(company.emails) ? company.emails : [],
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

  const payload = cleanUndefined({
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

  const payload = cleanUndefined({
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

  const payload = cleanUndefined({
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
