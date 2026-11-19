import { SectorTag } from "@/components/sectors/sector-tag";
import type { Sector } from "@/components/sectors/sectors";
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

  return (
    <div
      className={cn(
        "glassmorphism flex w-[280px] flex-col gap-3 rounded-l p-5",
        className,
      )}
    >
      {/* Header: logo + name + badge */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-m bg-primary-600 text-sm font-semibold text-white">
            {company.name.charAt(0)}
          </div>
          <h3 className="text-s font-semibold leading-tight">{company.name}</h3>
        </div>
        {showBadge && (
          <span className="shrink-0 rounded-xs bg-primary-500/40 px-2 py-0.5 text-xxs font-medium text-primary-50">
            {statusLabels[company.status]}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="line-clamp-3 text-xs leading-relaxed text-white/60">
        {company.description}
      </p>

      {/* Sector tags */}
      <div className="flex flex-wrap gap-1">
        {company.sectors.map((sector) => (
          <SectorTag
            key={sector}
            sector={sector}
            label={sectorLabels[sector] ?? sector}
            variant="empty-small"
            isMonochrome
          />
        ))}
      </div>
    </div>
  );
}
