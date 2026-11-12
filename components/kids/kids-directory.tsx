"use client";

import { useEffect, useState } from "react";
import { AddKidDialog } from "@/components/kids/add-kid-dialog";
import { KidCard } from "@/components/kids/kid-card";
import { PlusIcon, SearchIcon } from "@/components/shared/icons";
import {
  createdKidToKid,
  isCreatedKid,
  kidsStorageKey,
  type CreatedKid,
  type Kid,
  type Room,
} from "@/data/kids";

type KidsDirectoryProps = {
  demoKids: Kid[];
  rooms: Room[];
};

function kidsCountLabel(count: number) {
  return count === 1 ? "1 niño" : `${count} niños`;
}

export function KidsDirectory({ demoKids, rooms }: KidsDirectoryProps) {
  const [createdKids, setCreatedKids] = useState<CreatedKid[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    let storedKids: CreatedKid[] = [];

    try {
      const raw = window.localStorage.getItem(kidsStorageKey);
      const parsed: unknown = raw ? JSON.parse(raw) : [];

      if (Array.isArray(parsed)) {
        storedKids = parsed.filter(isCreatedKid);
      }
    } catch {
      storedKids = [];
    }

    // Lectura única del store externo al montar; el primer render debe
    // coincidir con el HTML del servidor para no romper la hidratación.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCreatedKids(storedKids);
  }, []);

  function handleCreate(kid: CreatedKid) {
    const nextKids = [...createdKids, kid];
    setCreatedKids(nextKids);

    try {
      window.localStorage.setItem(kidsStorageKey, JSON.stringify(nextKids));
    } catch {
      // localStorage bloqueado o lleno: el alta sigue en memoria
    }

    setIsDialogOpen(false);
  }

  const existingIds = [
    ...demoKids.map((kid) => kid.id),
    ...createdKids.map((kid) => kid.id),
  ];

  return (
    <div className="mx-auto w-full max-w-[880px] px-10 pt-[34px] pb-20">
      <div className="mb-[22px] flex items-end justify-between gap-4">
        <div>
          <div className="mb-1 text-[12.5px] font-extrabold tracking-[.8px] text-coral-strong">
            GESTIÓN
          </div>
          <h1 className="m-0 font-heading text-[30px] font-semibold text-heading">
            Niños
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] px-[18px] py-[11px] text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,.7)]"
        >
          <PlusIcon />
          Agregar niño
        </button>
      </div>

      <div className="mb-[22px] flex items-center gap-[11px] rounded-[14px] border border-edge bg-card px-4 py-3">
        <SearchIcon />
        <input
          aria-label="Buscar niño"
          placeholder="Buscar niño…"
          className="flex-1 border-none bg-transparent px-0.5 py-px text-[15px] text-heading outline-none placeholder:text-placeholder"
        />
      </div>

      {rooms.map((room, roomIndex) => {
        const roomDemoKids = demoKids.filter((kid) => kid.roomId === room.id);
        const roomCreatedKids = createdKids
          .map((kid, position) => ({ kid, position }))
          .filter(({ kid }) => kid.roomId === room.id);
        const count = roomDemoKids.length + roomCreatedKids.length;

        return (
          <div key={room.id} className={roomIndex === 0 ? "" : "mt-[22px]"}>
            <div className="mb-[14px] flex items-center gap-3">
              <span className="text-[12.5px] font-extrabold tracking-[.8px] text-heading">
                {room.sectionLabel}
              </span>
              <span className="text-[13px] text-meta">
                {kidsCountLabel(count)}
              </span>
              <span className="h-px flex-1 bg-divider" />
            </div>

            {count > 0 ? (
              <div className="grid grid-cols-2 gap-[14px]">
                {roomDemoKids.map((kid) => (
                  <KidCard
                    key={kid.id}
                    kid={kid}
                    href={`/kids/${kid.id}`}
                  />
                ))}
                {roomCreatedKids.map(({ kid, position }) => (
                  <KidCard key={kid.id} kid={createdKidToKid(kid, position)} />
                ))}
              </div>
            ) : null}
          </div>
        );
      })}

      <AddKidDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreate={handleCreate}
        existingIds={existingIds}
      />
    </div>
  );
}
