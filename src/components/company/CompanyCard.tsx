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

/**
 * Decorative "Mode Carte" tile — Figma component 1:271.
 * 552 × 160, black 30%, blur 4px, white halo, radius 10.
 */
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
      case "INACTIVE":
        return "bg-[#d46b75]/10 text-[#e75261]";
      case "ACQUIRED":
        return "bg-[#ffc20a]/10 text-[#ffc20a]";
      default:
        return "bg-[#29a844]/10 text-[#29a844]";
    }
  };

  const initial = company.name.charAt(0).toUpperCase();
  const isDoctolib = company.name.toLowerCase().includes("doctolib");

  return (
    <div
      className={cn(
        "company-card-glass relative flex h-[160px] w-[552px] shrink-0 select-none flex-col gap-4 overflow-hidden rounded-[10px] p-[18px]",
        className,
      )}
    >
      {/* Oversized company mark, masked by the tile */}
      <div
        className="pointer-events-none absolute -left-[70px] -top-[177px] flex size-[540px] items-center justify-center"
        aria-hidden="true"
      >
        <span className="font-serif text-[400px] font-black italic leading-none text-white/[0.045]">
          {initial}
        </span>
      </div>

      {/* Header: avatar + name + status */}
      <div className="relative z-10 flex h-[38px] items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex size-[38px] shrink-0 items-center justify-center rounded-full",
              isDoctolib
                ? "bg-[#1b4a7a] text-[#bfe0ff]"
                : "bg-[#4b408c] text-white",
            )}
          >
            <span className="font-serif text-[20px] font-bold italic leading-none">
              {initial}
            </span>
          </div>
          <h3 className="truncate text-[20px] font-bold leading-[24px] text-white">
            {company.name}
          </h3>
        </div>

        {showBadge && (
          <span
            className={cn(
              "shrink-0 rounded-[4px] px-2 py-1 text-[12px] font-medium leading-[16px]",
              getStatusBadgeClass(company.status),
            )}
          >
            {statusLabels[company.status] ?? company.status}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="relative z-10 line-clamp-2 max-w-[378px] text-[13px] font-normal leading-[18px] text-white">
        {company.description}
      </p>

      {/* Sectors */}
      <div className="relative z-10 flex items-center gap-[26px] text-white">
        {company.sectors.map((sector) => {
          const config = sectorMap[sector];
          if (!config) return null;
          const Icon = config.emptyIcon;
          const label = sectorLabels[sector] ?? sector;
          return (
            <div key={sector} className="flex items-center gap-1.5">
              <Icon className="size-2 shrink-0" />
              <span className="text-[13px] font-light leading-[16px] tracking-[0.02em]">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
