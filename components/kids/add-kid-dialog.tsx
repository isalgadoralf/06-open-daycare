"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import { ChevronDownIcon } from "@/components/shared/icons";
import {
  buildKidId,
  parseAllergyTags,
  rooms,
  type CreatedKid,
  type RoomId,
} from "@/data/kids";

type AddKidDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (kid: CreatedKid) => void;
  existingIds: string[];
};

type FormErrors = {
  name?: string;
  birthDate?: string;
  roomId?: string;
};

const defaultRoomId: RoomId = "soles";

function fieldClassName(hasError: boolean) {
  return [
    "w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] text-heading outline-none placeholder:text-placeholder",
    hasError
      ? "border-coral-strong"
      : "border-field-border focus:border-field-border-warm",
  ].join(" ");
}

export function AddKidDialog({
  open,
  onClose,
  onCreate,
  existingIds,
}: AddKidDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const birthDateRef = useRef<HTMLInputElement>(null);
  const roomRef = useRef<HTMLSelectElement>(null);
  const formId = useId();

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [roomId, setRoomId] = useState<RoomId>(defaultRoomId);
  const [allergies, setAllergies] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const nameId = `${formId}-name`;
  const birthDateId = `${formId}-birth-date`;
  const roomIdField = `${formId}-room`;
  const allergiesId = `${formId}-allergies`;
  const medicalNotesId = `${formId}-medical-notes`;
  const titleId = `${formId}-title`;

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
      nameRef.current?.focus();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const scrollParent = dialogRef.current?.closest("main");

    if (!scrollParent) {
      return;
    }

    const previousOverflow = scrollParent.style.overflow;
    scrollParent.style.overflow = "hidden";

    return () => {
      scrollParent.style.overflow = previousOverflow;
    };
  }, [open]);

  function clearError(field: keyof FormErrors) {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate(): FormErrors {
    const next: FormErrors = {};

    if (!name.trim()) {
      next.name = "Ingresá el nombre completo.";
    }

    if (!birthDate) {
      next.birthDate = "Ingresá la fecha de nacimiento.";
    } else {
      const [year, month, day] = birthDate.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const isRealDate =
        !Number.isNaN(date.getTime()) &&
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;

      if (!isRealDate) {
        next.birthDate = "Ingresá una fecha válida.";
      } else if (date > today) {
        next.birthDate = "La fecha no puede ser futura.";
      }
    }

    if (!roomId) {
      next.roomId = "Elegí una sala.";
    }

    return next;
  }

  function resetForm() {
    setName("");
    setBirthDate("");
    setRoomId(defaultRoomId);
    setAllergies("");
    setMedicalNotes("");
    setErrors({});
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (nextErrors.name) {
      nameRef.current?.focus();
      return;
    }

    if (nextErrors.birthDate) {
      birthDateRef.current?.focus();
      return;
    }

    if (nextErrors.roomId) {
      roomRef.current?.focus();
      return;
    }

    onCreate({
      id: buildKidId(name.trim(), existingIds),
      name: name.trim(),
      birthDate,
      roomId,
      allergies: parseAllergyTags(allergies),
      medicalNotes: medicalNotes.trim(),
      createdAt: new Date().toISOString(),
    });

    resetForm();
  }

  function handleDialogClose() {
    setErrors({});
    onClose();
  }

  function handleDialogClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      dialogRef.current?.close();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClick={handleDialogClick}
      onClose={handleDialogClose}
      className="m-auto w-[min(520px,calc(100vw-48px))] max-h-[calc(100vh-64px)] overflow-hidden rounded-[24px] border border-edge bg-auth-bg p-0 text-heading shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)] backdrop:bg-[rgba(63,54,46,.45)]"
    >
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex max-h-[calc(100vh-64px)] flex-col"
      >
        <div className="grid flex-none grid-cols-[1fr_auto_1fr] items-center border-b border-edge px-[26px] py-5">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="justify-self-start text-[15px] font-bold text-secondary"
          >
            Cancelar
          </button>
          <h2
            id={titleId}
            className="m-0 font-heading text-[18px] font-semibold text-heading"
          >
            Agregar niño
          </h2>
          <button
            type="submit"
            className="justify-self-end text-[15px] font-extrabold text-coral-strong"
          >
            Guardar
          </button>
        </div>

        <div className="overflow-y-auto px-[26px] py-6">
          <div className="mb-[18px]">
            <label
              htmlFor={nameId}
              className="mb-2 block text-[12px] font-extrabold tracking-[.7px] text-secondary"
            >
              NOMBRE COMPLETO
            </label>
            <input
              id={nameId}
              ref={nameRef}
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                clearError("name");
              }}
              placeholder="Ej. Martina López"
              required
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${nameId}-error` : undefined}
              className={fieldClassName(Boolean(errors.name))}
            />
            {errors.name ? (
              <p
                id={`${nameId}-error`}
                role="alert"
                className="mt-[6px] mb-0 text-[12.5px] font-bold text-coral-strong"
              >
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="mb-[18px] flex gap-[14px]">
            <div className="min-w-0 flex-1">
              <label
                htmlFor={birthDateId}
                className="mb-2 block text-[12px] font-extrabold tracking-[.7px] text-secondary"
              >
                FECHA DE NACIMIENTO
              </label>
              <input
                id={birthDateId}
                ref={birthDateRef}
                type="date"
                value={birthDate}
                onChange={(event) => {
                  setBirthDate(event.target.value);
                  clearError("birthDate");
                }}
                required
                aria-invalid={Boolean(errors.birthDate)}
                aria-describedby={
                  errors.birthDate ? `${birthDateId}-error` : undefined
                }
                className={fieldClassName(Boolean(errors.birthDate))}
              />
              {errors.birthDate ? (
                <p
                  id={`${birthDateId}-error`}
                  role="alert"
                  className="mt-[6px] mb-0 text-[12.5px] font-bold text-coral-strong"
                >
                  {errors.birthDate}
                </p>
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <label
                htmlFor={roomIdField}
                className="mb-2 block text-[12px] font-extrabold tracking-[.7px] text-secondary"
              >
                SALA
              </label>
              <div className="relative">
                <select
                  id={roomIdField}
                  ref={roomRef}
                  value={roomId}
                  onChange={(event) => {
                    setRoomId(event.target.value as RoomId);
                    clearError("roomId");
                  }}
                  required
                  aria-invalid={Boolean(errors.roomId)}
                  aria-describedby={
                    errors.roomId ? `${roomIdField}-error` : undefined
                  }
                  className={`${fieldClassName(Boolean(errors.roomId))} appearance-none pr-10 font-bold`}
                >
                  {rooms.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.short}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
                  <ChevronDownIcon />
                </span>
              </div>
              {errors.roomId ? (
                <p
                  id={`${roomIdField}-error`}
                  role="alert"
                  className="mt-[6px] mb-0 text-[12.5px] font-bold text-coral-strong"
                >
                  {errors.roomId}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mb-[18px]">
            <label
              htmlFor={allergiesId}
              className="mb-2 block text-[12px] font-extrabold tracking-[.7px] text-secondary"
            >
              ALERGIAS (ETIQUETAS)
            </label>
            <input
              id={allergiesId}
              value={allergies}
              onChange={(event) => setAllergies(event.target.value)}
              placeholder="Ej. Maní, Lactosa"
              className={fieldClassName(false)}
            />
          </div>

          <div>
            <label
              htmlFor={medicalNotesId}
              className="mb-2 block text-[12px] font-extrabold tracking-[.7px] text-secondary"
            >
              NOTAS MÉDICAS
            </label>
            <textarea
              id={medicalNotesId}
              value={medicalNotes}
              onChange={(event) => setMedicalNotes(event.target.value)}
              placeholder="Indicaciones, medicación, contactos…"
              className={`${fieldClassName(false)} min-h-[90px] resize-y leading-[1.5]`}
            />
          </div>
        </div>
      </form>
    </dialog>
  );
}
