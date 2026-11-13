"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { demoEmail, sessionStorageKey } from "@/data/auth";

const fieldLabelClass =
  "mb-2 block text-[12px] font-bold tracking-[0.7px] text-secondary";
const fieldInputClass =
  "mb-[18px] w-full rounded-[14px] border-[1.5px] border-field-border bg-white px-4 py-[14px] text-[15px] text-heading outline-none placeholder:text-placeholder";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState(demoEmail);
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      window.localStorage.setItem(
        sessionStorageKey,
        JSON.stringify({ email }),
      );
    } catch {
      // localStorage bloqueado (modo privado): la navegación continúa
    }

    router.push("/");
  }

  return (
    <div className="w-full max-w-[392px]">
      <h2 className="mb-[6px] font-heading text-[30px] font-semibold text-heading">
        Iniciar sesión
      </h2>
      <p className="mb-7 text-[15px] text-secondary">
        Ingresá para ver el día de hoy.
      </p>

      <form onSubmit={handleSubmit}>
        <label className={fieldLabelClass} htmlFor="email">
          EMAIL
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={fieldInputClass}
        />

        <label className={fieldLabelClass} htmlFor="password">
          CONTRASEÑA
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={`${fieldInputClass} mb-[10px]`}
        />
        <div className="mb-5 text-right">
          <span
            title="Próximamente"
            className="cursor-pointer text-[13.5px] font-bold text-edit"
          >
            ¿Olvidaste tu contraseña?
          </span>
        </div>

        <button
          type="submit"
          className="block w-full rounded-[15px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] p-[15px] text-[16px] font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,.7)]"
        >
          Iniciar sesión
        </button>
      </form>

      <p className="mt-6 text-center text-[14.5px] text-secondary">
        ¿Te invitó la guardería?{" "}
        <Link
          href="/activate-account"
          className="font-extrabold text-edit"
        >
          Activá tu cuenta
        </Link>
      </p>
    </div>
  );
}
