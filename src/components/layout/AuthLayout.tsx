"use client";

import { useQuery } from "@tanstack/react-query";
import { CompanyCard, type CompanyData } from "@/components/company/CompanyCard";
import { StolosLogo } from "@/components/layout/StolosLogo";
import type { Sector } from "@/components/sectors/sectors";
import type { CompanyStatus } from "@/components/company/company-status";
import type { ReactNode } from "react";

interface CompanyDTO {
  name: string;
  description: { fr: string; en: string };
  sectors: Sector[];
  status: CompanyStatus;
}

interface AuthLayoutProps {
  children: ReactNode;
  lang: string;
  sectorLabels: Record<string, string>;
  statusLabels: Record<string, string>;
}

// Background card fleet placement — staggered to match Image 2 / Figma
const leftCardConfigs = [
  { top: "4%", className: "left-[-220px] 2xl:left-[-110px]", opacity: 0.82 },
  { top: "28%", className: "left-[-170px] 2xl:left-[-60px]", opacity: 0.8 },
  { top: "52%", className: "left-[-120px] 2xl:left-[-20px]", opacity: 0.8 },
  { top: "76%", className: "left-[-180px] 2xl:left-[-80px]", opacity: 0.78 },
];

const rightCardConfigs = [
  { top: "5%", className: "right-10 2xl:right-24", opacity: 0.85 },
  { top: "29%", className: "right-[-150px] 2xl:right-[-50px]", opacity: 0.8 },
  { top: "53%", className: "right-8 2xl:right-20", opacity: 0.85 },
  { top: "77%", className: "right-[-130px] 2xl:right-[-30px]", opacity: 0.8 },
];

export function AuthLayout({
  children,
  lang,
  sectorLabels,
  statusLabels,
}: AuthLayoutProps) {
  const { data: companies = [] } = useQuery<CompanyDTO[]>({
    queryKey: ["companies"],
    queryFn: () => fetch("/api/companies").then((r) => r.json()),
  });

  const localizedCompanies: CompanyData[] = companies.map((c) => ({
    name: c.name,
    description: lang === "en" ? c.description.en : c.description.fr,
    sectors: c.sectors,
    status: c.status,
  }));

  // Match the layout order in Image 2:
  // Left top: "Fermée" (FinStar), Left bottom: "Vendue" (AgriSmart)
  // Right top: Doctolib
  const closedCompany = localizedCompanies.find((c) => c.status === "CLOSED" || c.status === "INACTIVE");
  const acquiredCompany = localizedCompanies.find((c) => c.status === "ACQUIRED");
  const doctolib = localizedCompanies.find((c) => c.name.toLowerCase().includes("doctolib"));
  const otherCompanies = localizedCompanies.filter(
    (c) => c !== closedCompany && c !== acquiredCompany && c !== doctolib,
  );

  const leftCompanies: CompanyData[] = [
    closedCompany ?? localizedCompanies[2] ?? localizedCompanies[0],
    otherCompanies[0] ?? localizedCompanies[1],
    otherCompanies[1] ?? localizedCompanies[3],
    acquiredCompany ?? localizedCompanies[4] ?? localizedCompanies[0],
  ].filter(Boolean) as CompanyData[];

  const rightCompanies: CompanyData[] = [
    doctolib ?? localizedCompanies[0],
    otherCompanies[2] ?? localizedCompanies[5] ?? localizedCompanies[0],
    otherCompanies[3] ?? localizedCompanies[6] ?? localizedCompanies[0],
    otherCompanies[4] ?? localizedCompanies[7] ?? localizedCompanies[0],
  ].filter(Boolean) as CompanyData[];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      {/* Background fleet overlay — Left Column */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[500px] xl:block"
        aria-hidden="true"
      >
        {leftCompanies.map((company, i) => {
          const cfg = leftCardConfigs[i % leftCardConfigs.length];
          return (
            <div
              key={`left-${company.name}-${i}`}
              className={`absolute transition-all duration-300 ${cfg.className}`}
              style={{
                top: cfg.top,
                opacity: cfg.opacity,
              }}
            >
              <CompanyCard
                company={company}
                sectorLabels={sectorLabels}
                statusLabels={statusLabels}
              />
            </div>
          );
        })}
      </div>

      {/* Background fleet overlay — Right Column */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[500px] xl:block"
        aria-hidden="true"
      >
        {rightCompanies.map((company, i) => {
          const cfg = rightCardConfigs[i % rightCardConfigs.length];
          return (
            <div
              key={`right-${company.name}-${i}`}
              className={`absolute transition-all duration-300 ${cfg.className}`}
              style={{
                top: cfg.top,
                opacity: cfg.opacity,
              }}
            >
              <CompanyCard
                company={company}
                sectorLabels={sectorLabels}
                statusLabels={statusLabels}
              />
            </div>
          );
        })}
      </div>

      {/* Center Auth Card */}
      <div className="relative z-10 flex w-full max-w-[430px] flex-col items-center">
        <StolosLogo className="mb-7 h-[92px] w-[84px] shrink-0 drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]" />
        <div className="w-full rounded-xl border border-white/[0.08] border-t-white/[0.12] bg-[#231f3a]/85 p-8 shadow-[0_15px_35px_rgba(0,0,0,0.4),0_0_25px_rgba(100,80,200,0.08)] backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
