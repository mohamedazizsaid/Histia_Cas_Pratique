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

// Positions for background cards — carefully placed to match Figma
const cardPositions = [
  { top: "5%", left: "-8%", rotate: "-6deg", opacity: 0.4, scale: 0.85 },
  { top: "25%", left: "-5%", rotate: "-3deg", opacity: 0.35, scale: 0.8 },
  { top: "55%", left: "-6%", rotate: "-4deg", opacity: 0.3, scale: 0.82 },
  { top: "75%", left: "-4%", rotate: "-2deg", opacity: 0.25, scale: 0.78 },
  { top: "3%", right: "-5%", rotate: "4deg", opacity: 0.4, scale: 0.85 },
  { top: "28%", right: "-3%", rotate: "3deg", opacity: 0.35, scale: 0.82 },
  { top: "53%", right: "-4%", rotate: "5deg", opacity: 0.3, scale: 0.8 },
  { top: "78%", right: "-6%", rotate: "2deg", opacity: 0.25, scale: 0.78 },
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

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background cards */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {localizedCompanies.map((company, i) => {
          const pos = cardPositions[i % cardPositions.length];
          return (
            <div
              key={company.name}
              className="absolute"
              style={{
                top: pos.top,
                left: pos.left,
                right: pos.right,
                transform: `rotate(${pos.rotate}) scale(${pos.scale})`,
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

      {/* Center card */}
      <div className="relative z-10 flex w-full max-w-[28rem] flex-col items-center px-4">
        <StolosLogo className="mb-6 h-16 w-16" />
        <div className="glassmorphism w-full rounded-l p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
