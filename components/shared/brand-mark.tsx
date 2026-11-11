import { BrandSunIcon } from "@/components/shared/icons";

type BrandMarkProps = {
  room: string;
};

export function BrandMark({ room }: BrandMarkProps) {
  return (
    <span
      title="Próximamente"
      className="flex items-center gap-[11px] px-2 pt-1 pb-[22px]"
    >
      <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl bg-[linear-gradient(155deg,#F8C3A8,#F2937A)]">
        <BrandSunIcon />
      </span>
      <span>
        <span className="block font-heading text-[17px] font-semibold leading-none text-heading">
          OpenDayCare
        </span>
        <span className="mt-0.5 block text-[11.5px] text-meta">{room}</span>
      </span>
    </span>
  );
}
