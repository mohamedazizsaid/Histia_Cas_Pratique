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
        "relative flex w-[335px] flex-col overflow-hidden rounded-xl border border-white/[0.08] border-t-white/[0.14] bg-[#161327]/65 px-4 py-3.5 backdrop-blur-md select-none",
        "shadow-[0_0_24px_rgba(150,130,235,0.12),0_10px_25px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      {/* Background watermark letter */}
      <div
        className="pointer-events-none absolute -left-2 -top-6 select-none text-[100px] font-black italic leading-none text-white/[0.035]"
        aria-hidden="true"
      >
        {initial}
      </div>

      {/* Header: Avatar + Company Name + Status badge */}
      <div className="relative z-10 flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "flex size-8.5 shrink-0 items-center justify-center rounded-full text-sm font-bold italic shadow-inner",
              isDoctolib
                ? "bg-[#173a5e] text-[#3b93e8]"
                : "bg-primary-600/60 text-white",
            )}
          >
            {initial}
          </div>
          <h3 className="text-[15px] font-bold tracking-tight text-[#e2e4ea]">
            {company.name}
          </h3>
        </div>

        {showBadge && (
          <span
            className={cn(
              "shrink-0 rounded-md px-2 py-0.5 text-[11px] font-normal",
              getStatusBadgeClass(company.status),
            )}
          >
            {statusLabels[company.status] ?? company.status}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="relative z-10 mt-1.5 line-clamp-2 text-[12px] leading-snug text-white/50">
        {company.description}
      </p>

      {/* Sector tags — inline icon + label matching Figma */}
      <div className="relative z-10 mt-2.5 flex flex-wrap items-center gap-3 text-xs text-white/50">
        {company.sectors.map((sector) => {
          const config = sectorMap[sector];
          if (!config) return null;
          const Icon = config.emptyIcon;
          const label = sectorLabels[sector] ?? sector;
          return (
            <div key={sector} className="flex items-center gap-1.5">
              <Icon className="size-3.5 opacity-60" />
              <span className="text-[11.5px] font-normal">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
