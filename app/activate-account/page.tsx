import type { Metadata } from "next";
import Link from "next/link";
import { ActivateAccountForm } from "@/components/auth/activate-account-form";
import { InvitationCard } from "@/components/auth/invitation-card";
import { BrandSunIcon } from "@/components/shared/icons";
import { invitation } from "@/data/auth";

export const metadata: Metadata = {
  title: "Activar cuenta | OpenDayCare",
};

export default function ActivateAccountPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-auth-bg p-10">
      <div className="w-full max-w-[440px]">
        <div className="mb-[22px] flex h-[58px] w-[58px] items-center justify-center rounded-[18px] bg-[linear-gradient(155deg,#F8C3A8,#F2937A)] shadow-[0_12px_26px_-10px_rgba(238,129,100,.65)]">
          <BrandSunIcon size={30} />
        </div>

        <h1 className="mb-2 font-heading text-[32px] font-semibold leading-[1.15] text-heading">
          Bienvenida a OpenDayCare
        </h1>
        <p className="mb-[26px] text-[15.5px] leading-[1.55] text-secondary">
          Te invitaron a seguir el día de tu hijo. Creá tu contraseña para
          activar la cuenta.
        </p>

        <InvitationCard invitation={invitation} />
        <ActivateAccountForm invitation={invitation} />

        <p className="mt-[22px] text-center text-[14.5px] text-secondary">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="font-extrabold text-edit">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
