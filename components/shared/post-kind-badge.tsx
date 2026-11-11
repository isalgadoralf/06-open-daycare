import type { PostKind } from "@/data/feed";

type KindStyle = {
  label: string;
  background: string;
  text: string;
  dot: string;
};

const KIND_STYLES: Record<PostKind, KindStyle> = {
  achievement: {
    label: "LOGRO",
    background: "bg-badge-achievement",
    text: "text-badge-achievement-ink",
    dot: "bg-badge-achievement-ink",
  },
  activity: {
    label: "ACTIVIDAD",
    background: "bg-badge-activity",
    text: "text-badge-activity-ink",
    dot: "bg-badge-activity-ink",
  },
  announcement: {
    label: "ANUNCIO",
    background: "bg-badge-announcement",
    text: "text-badge-announcement-ink",
    dot: "bg-badge-announcement-ink",
  },
};

type PostKindBadgeProps = {
  kind: PostKind;
};

export function PostKindBadge({ kind }: PostKindBadgeProps) {
  const { label, background, text, dot } = KIND_STYLES[kind];

  return (
    <div
      className={`flex items-center gap-[7px] rounded-full px-3 py-1.5 ${background}`}
    >
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      <span className={`text-[12px] font-extrabold tracking-[.5px] ${text}`}>
        {label}
      </span>
    </div>
  );
}
