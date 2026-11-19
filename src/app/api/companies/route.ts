import { NextResponse } from "next/server";
import type { Sector } from "@/components/sectors/sectors";
import type { CompanyStatus } from "@/components/company/company-status";

interface CompanyDTO {
  name: string;
  description: { fr: string; en: string };
  sectors: Sector[];
  status: CompanyStatus;
}

// Company data served by the API — not hardcoded in the frontend
const companies: CompanyDTO[] = [
  {
    name: "Doctolib",
    description: {
      fr: "Plateforme numérique facilitant la prise de rendez-vous médicaux et la gestion des consultations",
      en: "Digital platform making it easy to book medical appointments and manage consultations",
    },
    sectors: ["HEALTHCARE", "SOFTWARE", "ARTIFICIAL_INTELLIGENCE"],
    status: "ACTIVE",
  },
  {
    name: "EcoTech",
    description: {
      fr: "Solutions innovantes pour la transition énergétique et le développement durable des entreprises",
      en: "Innovative solutions for the energy transition and sustainable business development",
    },
    sectors: ["ECOLOGY", "ENERGY", "NEW_TECHNOLOGIES"],
    status: "ACTIVE",
  },
  {
    name: "FinStar",
    description: {
      fr: "Plateforme de gestion financière et d'investissement pour les particuliers et les professionnels",
      en: "Financial management and investment platform for individuals and professionals",
    },
    sectors: ["FINANCE", "SOFTWARE"],
    status: "CLOSED",
  },
  {
    name: "SpaceVision",
    description: {
      fr: "Développement de technologies spatiales pour l'observation terrestre et les télécommunications",
      en: "Development of space technologies for Earth observation and telecommunications",
    },
    sectors: ["SPACE", "TELECOMMUNICATIONS", "DEFENSE"],
    status: "ACTIVE",
  },
  {
    name: "AgriSmart",
    description: {
      fr: "Intelligence artificielle appliquée à l'agriculture de précision et à l'optimisation des récoltes",
      en: "Artificial intelligence applied to precision agriculture and crop optimization",
    },
    sectors: ["AGRICULTURE", "ARTIFICIAL_INTELLIGENCE"],
    status: "ACQUIRED",
  },
  {
    name: "EduNova",
    description: {
      fr: "Plateforme éducative proposant des formations en ligne personnalisées et interactives",
      en: "Educational platform offering personalized and interactive online training",
    },
    sectors: ["EDUCATION", "SOFTWARE"],
    status: "ACTIVE",
  },
  {
    name: "BioGenesis",
    description: {
      fr: "Recherche et développement en biotechnologie pour la médecine régénérative",
      en: "Biotechnology research and development for regenerative medicine",
    },
    sectors: ["BIOTECHNOLOGY", "HEALTHCARE"],
    status: "ACTIVE",
  },
  {
    name: "TransitFlow",
    description: {
      fr: "Solutions de mobilité urbaine intelligente et de gestion du transport public",
      en: "Smart urban mobility solutions and public transport management",
    },
    sectors: ["TRANSPORT", "NEW_TECHNOLOGIES"],
    status: "INACTIVE",
  },
];

export async function GET() {
  return NextResponse.json(companies);
}
