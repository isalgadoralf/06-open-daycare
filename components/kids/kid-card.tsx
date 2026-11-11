import Link from "next/link";
import { Avatar } from "@/components/shared/avatar";
import { ChevronRightIcon } from "@/components/shared/icons";
import type { Kid } from "@/data/kids";

type KidCardProps = {
  kid: Kid;
};

function linkedParentsLabel(kid: Kid) {
  const count = kid.parents.length;

  if (count === 0) {
    return "sin padres vinculados";
  }

  if (count === 1) {
    return "1 padre vinculado";
  }

  return `${count} padres vinculados`;
}

export function KidCard({ kid }: KidCardProps) {
  const hasAlert = Boolean(kid.alert);
  const needsLink = kid.parents.length === 0;
  const subtitle = `${kid.age} años · ${linkedParentsLabel(kid)}`;

  return (
    <Link
      href={`/kids/${kid.id}`}
      className="flex min-w-0 items-center gap-[14px] rounded-[18px] border border-edge bg-card p-4 shadow-[0_4px_14px_-12px_rgba(120,90,60,.5)] transition duration-150 hover:-translate-y-0.5 hover:border-kid-hover"
    >
      <Avatar label={kid.initial} tone={kid.tone} size="card" />

      <div className="min-w-0 flex-1">
        <div className="font-heading text-[16px] font-semibold text-heading">
          {kid.name}
        </div>
        <div className="text-[13px] text-meta">{subtitle}</div>
      </div>

      {hasAlert ? (
        <span className="flex-none rounded-[999px] bg-pill-alert px-[9px] py-[5px] text-[11px] font-extrabold text-pill-alert-ink">
          {kid.alert?.cardLabel}
        </span>
      ) : needsLink ? (
        <span className="flex-none rounded-[999px] bg-pill-link px-[9px] py-[5px] text-[11px] font-extrabold text-pill-link-ink">
          VINCULAR
        </span>
      ) : (
        <ChevronRightIcon />
      )}
    </Link>
  );
}
