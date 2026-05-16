export type ProjectType =
  | "Sistema"
  | "Landing Page"
  | "Automação"
  | "Website"
  | "App";

export type CommercialModel =
  | "Assinatura mensal"
  | "Projeto personalizado"
  | "Assinatura + personalização";

export type Project = {
  id?: string;
  name: string;
  type: string;
  niche: string;
  commercialModel: string;
  startingPrice: string;
  monthlyPrice: string;
  technologies: string[];
  link: string;

  imageUrl: string;
  images: string[];

  cardSummary: string;
  fullDescription: string;
  modules: string[];
  integrations: string[];
  indicatedBusinesses: string[];
  basicFlow: string[];
  highlight: boolean;
  createdAt?: Date;
};

export type OptionCategory =
  | "types"
  | "niches"
  | "technologies"
  | "commercialModels";
