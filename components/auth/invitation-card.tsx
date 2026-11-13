import type { invitation } from "@/data/auth";

type InvitationCardProps = {
  invitation: typeof invitation;
};

export function InvitationCard({ invitation }: InvitationCardProps) {
  return (
    <div className="mb-[22px] flex items-center gap-[14px] rounded-2xl border-[1.5px] border-field-border bg-white px-4 py-[14px]">
      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-avatar-sky font-heading text-[19px] font-semibold text-avatar-sky-ink">
        {invitation.childInitial}
      </div>
      <div>
        <div className="text-[13px] text-secondary">
          Te invitaron a seguir a
        </div>
        <div className="font-heading text-[17px] font-semibold text-heading">
          {invitation.childName} · {invitation.room}
        </div>
      </div>
    </div>
  );
}
