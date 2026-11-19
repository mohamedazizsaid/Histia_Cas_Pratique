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

// Background card fleet placement — staggered / décalées to match Figma natural layout
const leftCardConfigs = [
  { top: "4%", className: "left-[-40px] 2xl:left-10", opacity: 0.35 },
  { top: "27%", className: "left-[-120px] 2xl:left-[-30px]", opacity: 0.32 },
  { top: "50%", className: "left-[-30px] 2xl:left-12", opacity: 0.28 },
  { top: "74%", className: "left-[-110px] 2xl:left-[-20px]", opacity: 0.24 },
];

const rightCardConfigs = [
  { top: "4%", className: "right-[-40px] 2xl:right-10", opacity: 0.35 },
  { top: "27%", className: "right-[-120px] 2xl:right-[-30px]", opacity: 0.32 },
  { top: "50%", className: "right-[-30px] 2xl:right-12", opacity: 0.28 },
  { top: "74%", className: "right-[-140px] 2xl:right-[-40px]", opacity: 0.24 },
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

  const leftCompanies = localizedCompanies.slice(0, 4);
  const rightCompanies = localizedCompanies.slice(4, 8);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      {/* Background fleet overlay — Left Column (décalées / staggered) */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[450px] xl:block"
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

      {/* Background fleet overlay — Right Column (décalées / staggered) */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[450px] xl:block"
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

      {/* Center Auth Card with subtle luminous aura */}
      <div className="relative z-10 flex w-full max-w-[430px] flex-col items-center">
        <StolosLogo className="mb-6 h-20 w-20 shrink-0 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
        <div className="w-full rounded-2xl border border-white/[0.08] border-t-white/[0.14] bg-[#18142c]/85 p-8 shadow-[0_0_35px_rgba(140,120,230,0.12),0_25px_60px_rgba(0,0,0,0.65)] backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
