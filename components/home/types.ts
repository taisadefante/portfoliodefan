import type { LucideIcon } from "lucide-react";

export type SeoFaqItem = {
  question: string;
  answer: string;
};

export type Project = {
  id?: string;
  name: string;
  type?: string;
  niche?: string;
  commercialModel?: string;
  startingPrice?: string;
  monthlyPrice?: string;
  technologies?: string[];
  link?: string;
  imageUrl?: string;
  images?: string[];
  cardSummary?: string;
  fullDescription?: string;
  modules?: string[];
  integrations?: string[];
  indicatedBusinesses?: string[];
  basicFlow?: string[];
  highlight?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  seoLocation?: string;
  seoText?: string;
  seoFaqs?: SeoFaqItem[];
};

export type ServiceItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};
