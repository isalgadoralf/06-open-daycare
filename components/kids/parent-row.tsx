import { Avatar } from "@/components/shared/avatar";
import type { LinkedParent } from "@/data/kids";

type ParentRowProps = {
  parent: LinkedParent;
};

export function ParentRow({ parent }: ParentRowProps) {
  const isActive = parent.status === "active";
  const tone = parent.relation === "Mamá" ? "lilac" : "blue";
  const detail = isActive
    ? parent.relation === "Mamá"
      ? "activa"
      : "activo"
    : "invitación enviada";
  const badge = isActive
    ? parent.relation === "Mamá"
      ? "ACTIVA"
      : "ACTIVO"
    : "PENDIENTE";
  const relationLabel = `${parent.relation} · ${detail}`;

  return (
    <div className="flex items-center gap-3">
      <Avatar label={parent.initial} tone={tone} size="md" />

      <div className="min-w-0 flex-1">
        <div className="text-[14.5px] font-extrabold text-heading">
          {parent.name}
        </div>
        <div className="text-[12.5px] text-meta">{relationLabel}</div>
      </div>

      <span
        className={`flex-none rounded-full px-[9px] py-1 text-[10.5px] font-extrabold ${
          isActive
            ? "bg-badge-achievement text-badge-achievement-ink"
            : "bg-badge-pending text-badge-pending-ink"
        }`}
      >
        {badge}
      </span>
    </div>
  );
}
