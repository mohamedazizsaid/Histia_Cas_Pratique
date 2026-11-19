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

// Background card fleet placement — matching Figma's 2 columns (left & right)
const leftCardPositions = [
  { top: "3%", opacity: 0.35 },
  { top: "27%", opacity: 0.32 },
  { top: "51%", opacity: 0.28 },
  { top: "75%", opacity: 0.24 },
];

const rightCardPositions = [
  { top: "3%", opacity: 0.35 },
  { top: "27%", opacity: 0.32 },
  { top: "51%", opacity: 0.28 },
  { top: "75%", opacity: 0.24 },
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

  // Split into left and right columns
  const leftCompanies = localizedCompanies.slice(0, 4);
  const rightCompanies = localizedCompanies.slice(4, 8);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      {/* Background fleet overlay — Left Column */}
      <div
        className="pointer-events-none absolute inset-y-0 left-[-40px] hidden w-[360px] xl:block 2xl:left-6"
        aria-hidden="true"
      >
        {leftCompanies.map((company, i) => {
          const pos = leftCardPositions[i % leftCardPositions.length];
          return (
            <div
              key={`left-${company.name}-${i}`}
              className="absolute left-0 transition-opacity"
              style={{
                top: pos.top,
                opacity: pos.opacity,
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
        className="pointer-events-none absolute inset-y-0 right-[-40px] hidden w-[360px] xl:block 2xl:right-6"
        aria-hidden="true"
      >
        {rightCompanies.map((company, i) => {
          const pos = rightCardPositions[i % rightCardPositions.length];
          return (
            <div
              key={`right-${company.name}-${i}`}
              className="absolute right-0 transition-opacity"
              style={{
                top: pos.top,
                opacity: pos.opacity,
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
        <StolosLogo className="mb-6 h-20 w-20 shrink-0 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
        <div className="w-full rounded-2xl border border-white/[0.08] bg-[#18142c]/85 p-8 shadow-[0_25px_60px_rgba(0,0,0,0.65)] backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
