import { CheckIcon } from "@/components/shared/icons";
import type { invitation } from "@/data/auth";

type ActivateAccountFormProps = {
  invitation: typeof invitation;
};

const fieldLabelClass =
  "mb-2 block text-[12px] font-bold tracking-[0.7px] text-secondary";

export function ActivateAccountForm({ invitation }: ActivateAccountFormProps) {
  return (
    <div>
      <label className={fieldLabelClass} htmlFor="invitation-code">
        CÓDIGO DE INVITACIÓN
      </label>
      <input
        id="invitation-code"
        defaultValue={invitation.code}
        readOnly
        className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-field-border bg-white px-4 py-[14px] font-heading text-[18px] font-bold tracking-[3px] text-heading outline-none"
      />

      <label className={fieldLabelClass} htmlFor="invitation-email">
        EMAIL
      </label>
      <input
        id="invitation-email"
        type="email"
        defaultValue={invitation.email}
        readOnly
        className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-field-border bg-white px-4 py-[14px] text-[15px] text-heading outline-none"
      />

      <label className={fieldLabelClass} htmlFor="invitation-password">
        CREAR CONTRASEÑA
      </label>
      <input
        id="invitation-password"
        type="password"
        defaultValue="contraseña"
        readOnly
        className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-field-border-warm bg-white px-4 py-[14px] text-[15px] text-heading outline-none"
      />

      <div className="mb-6 flex items-start gap-3 rounded-[14px] bg-consent-bg px-4 py-[14px]">
        <span className="mt-[1px] flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-consent-box text-white">
          <CheckIcon />
        </span>
        <span className="text-[14px] leading-[1.45] text-consent-ink">
          {invitation.consent}
        </span>
      </div>

      <button
        type="button"
        title="Próximamente"
        className="block w-full cursor-pointer rounded-[15px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] p-[15px] text-[16px] font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,.7)]"
      >
        Activar mi cuenta
      </button>
    </div>
  );
}
