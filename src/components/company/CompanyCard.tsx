import { sectorMap, type Sector } from "@/components/sectors/sectors";
import type { CompanyStatus } from "@/components/company/company-status";
import { cn } from "@/lib/utils";

export interface CompanyData {
  name: string;
  description: string;
  sectors: Sector[];
  status: CompanyStatus;
}

interface CompanyCardProps {
  company: CompanyData;
  sectorLabels: Record<string, string>;
  statusLabels: Record<string, string>;
  className?: string;
}

export function CompanyCard({
  company,
  sectorLabels,
  statusLabels,
  className,
}: CompanyCardProps) {
  const showBadge =
    company.status === "CLOSED" ||
    company.status === "INACTIVE" ||
    company.status === "ACQUIRED";

  const getStatusBadgeClass = (status: CompanyStatus) => {
    switch (status) {
      case "CLOSED":
        return "text-[#f87171] bg-[#ef4444]/15";
      case "ACQUIRED":
        return "text-[#f59e0b] bg-[#f59e0b]/15";
      case "INACTIVE":
        return "text-[#9ca3af] bg-[#9ca3af]/15";
      default:
        return "text-white/60 bg-white/10";
    }
  };

  const initial = company.name.charAt(0).toUpperCase();
  const isDoctolib = company.name.toLowerCase().includes("doctolib");

  return (
    <div
      className={cn(
        "relative flex w-[350px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#161327]/60 p-5 shadow-xl backdrop-blur-md select-none",
        className,
      )}
    >
      {/* Background watermark letter */}
      <div
        className="pointer-events-none absolute -left-2 -top-8 select-none text-[120px] font-black italic leading-none text-white/[0.035]"
        aria-hidden="true"
      >
        {initial}
      </div>

      {/* Header: Avatar + Company Name + Status badge */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full text-base font-bold italic shadow-inner",
              isDoctolib
                ? "bg-[#173a5e] text-[#3b93e8]"
                : "bg-primary-600/60 text-white",
            )}
          >
            {initial}
          </div>
          <h3 className="text-base font-bold tracking-tight text-[#e2e4ea]">
            {company.name}
          </h3>
        </div>

        {showBadge && (
          <span
            className={cn(
              "shrink-0 rounded-md px-2.5 py-0.5 text-xs font-normal",
              getStatusBadgeClass(company.status),
            )}
          >
            {statusLabels[company.status] ?? company.status}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="relative z-10 mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-white/50">
        {company.description}
      </p>

      {/* Sector tags — inline icon + label matching Figma */}
      <div className="relative z-10 mt-3.5 flex flex-wrap items-center gap-4 text-xs text-white/50">
        {company.sectors.map((sector) => {
          const config = sectorMap[sector];
          if (!config) return null;
          const Icon = config.emptyIcon;
          const label = sectorLabels[sector] ?? sector;
          return (
            <div key={sector} className="flex items-center gap-1.5">
              <Icon className="size-3.5 opacity-60" />
              <span className="text-[12px] font-normal">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
