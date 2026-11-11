import { KidCard } from "@/components/kids/kid-card";
import { PlusIcon, SearchIcon } from "@/components/shared/icons";
import { kids, room } from "@/data/kids";

export default function KidsPage() {
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
        <span
          title="Próximamente"
          className="flex items-center gap-2 rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] px-[18px] py-[11px] text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,.7)]"
        >
          <PlusIcon />
          Agregar niño
        </span>
      </div>

      <div className="mb-[22px] flex items-center gap-[11px] rounded-[14px] border border-edge bg-card px-4 py-3">
        <SearchIcon />
        <input
          aria-label="Buscar niño"
          placeholder="Buscar niño…"
          className="flex-1 border-none bg-transparent px-0.5 py-px text-[15px] text-heading outline-none placeholder:text-placeholder"
        />
      </div>

      <div className="mb-[14px] flex items-center gap-3">
        <span className="text-[12.5px] font-extrabold tracking-[.8px] text-heading">
          {room.sectionLabel}
        </span>
        <span className="text-[13px] text-meta">{kids.length} niños</span>
        <span className="h-px flex-1 bg-divider" />
      </div>

      <div className="grid grid-cols-2 gap-[14px]">
        {kids.map((kid) => (
          <KidCard key={kid.id} kid={kid} />
        ))}
      </div>
    </div>
  );
}
