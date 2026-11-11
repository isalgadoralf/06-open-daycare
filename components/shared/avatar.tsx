import type { ReactNode } from "react";

export type AvatarTone = "peach" | "sky" | "lilac" | "periwinkle";

export type AvatarSize = "sm" | "md" | "lg";

type AvatarProps = {
  label: string;
  tone: AvatarTone;
  size: AvatarSize;
  icon?: ReactNode;
};

const SIZE_CLASSES: Record<AvatarSize, { box: string; text: string }> = {
  sm: { box: "h-[38px] w-[38px]", text: "text-[16px]" },
  md: { box: "h-[40px] w-[40px]", text: "text-[16px]" },
  lg: { box: "h-[44px] w-[44px]", text: "text-[17px]" },
};

const TONE_CLASSES: Record<AvatarTone, string> = {
  peach: "bg-avatar-peach text-white",
  sky: "bg-avatar-sky text-avatar-sky-ink",
  lilac: "bg-avatar-lilac text-white",
  periwinkle: "bg-avatar-periwinkle text-avatar-periwinkle-ink",
};

export function Avatar({ label, tone, size, icon }: AvatarProps) {
  const { box, text } = SIZE_CLASSES[size];

  return (
    <div
      className={`flex flex-none items-center justify-center rounded-full font-heading font-semibold ${box} ${text} ${TONE_CLASSES[tone]}`}
    >
      {icon ?? label}
    </div>
  );
}
