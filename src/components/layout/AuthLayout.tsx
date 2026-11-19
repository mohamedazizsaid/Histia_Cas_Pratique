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

/**
 * The eight decorative "Mode Carte" tiles are placed on the Figma 1920 × 1080 grid.
 * The whole grid is scaled down with --fleet-scale so the composition keeps its
 * proportions on smaller desktop screens.
 */
const leftCardPositions = [
  { left: -136, top: 37 },
  { left: -283, top: 297 },
  { left: -114, top: 567 },
  { left: -207, top: 836 },
];

const rightCardPositions = [
  { left: 1485, top: 46 },
  { left: 1634, top: 306 },
  { left: 1524, top: 579 },
  { left: 1639, top: 827 },
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

  const closedCompany = localizedCompanies.find(
    (c) => c.status === "CLOSED" || c.status === "INACTIVE",
  );
  const acquiredCompany = localizedCompanies.find((c) => c.status === "ACQUIRED");
  const doctolib = localizedCompanies.find((c) =>
    c.name.toLowerCase().includes("doctolib"),
  );
  const otherCompanies = localizedCompanies.filter(
    (c) => c !== closedCompany && c !== acquiredCompany && c !== doctolib,
  );

  // Left column, top to bottom: closed, neutral, neutral, acquired (Vendue).
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
    <div className="auth-background relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden px-4 py-10">
      {/* Decorative company fleet — 552 × 160 cards at 30% opacity */}
      <div
        className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
        aria-hidden="true"
      >
        <div className="fleet-stage">
          {leftCompanies.map((company, i) => {
            const position = leftCardPositions[i % leftCardPositions.length];
            return (
              <div
                key={`left-${company.name}-${i}`}
                className="absolute opacity-30"
                style={{ left: position.left, top: position.top }}
              >
                <CompanyCard
                  company={company}
                  sectorLabels={sectorLabels}
                  statusLabels={statusLabels}
                />
              </div>
            );
          })}

          {rightCompanies.map((company, i) => {
            const position = rightCardPositions[i % rightCardPositions.length];
            return (
              <div
                key={`right-${company.name}-${i}`}
                className="absolute opacity-30"
                style={{ left: position.left, top: position.top }}
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
      </div>

      {/* Logo + central card */}
      <div className="relative z-10 flex w-full flex-col items-center gap-6 min-[950px]:-translate-y-0 min-[950px]:gap-6">
        <StolosLogo
          className="w-auto shrink-0"
          style={{ height: "clamp(100px, 13vh, 140px)" }}
        />

        <div className="auth-card w-full max-w-[595px] rounded-[12px] border border-white/[0.06] p-4 sm:p-6 min-[1200px]:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
