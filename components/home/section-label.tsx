import type { ReactNode } from "react";

type SectionLabelProps = {
  children: ReactNode;
};

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <div className="mb-[14px] flex items-center gap-[14px]">
      <span className="text-[12.5px] font-extrabold tracking-[.8px] text-label">
        {children}
      </span>
      <span className="h-px flex-1 bg-divider" />
    </div>
  );
}
