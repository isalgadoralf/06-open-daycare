import type { ComponentType } from "react";
import { Avatar } from "@/components/shared/avatar";
import { BrandMark } from "@/components/shared/brand-mark";
import {
  BellIcon,
  ChildrenIcon,
  HomeIcon,
  LogOutIcon,
  PlusIcon,
  UserIcon,
} from "@/components/shared/icons";
import type { Teacher } from "@/data/feed";

type NavItem = {
  label: string;
  icon: ComponentType;
  active: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Feed", icon: HomeIcon, active: true },
  { label: "Niños", icon: ChildrenIcon, active: false },
  { label: "Avisos", icon: BellIcon, active: false },
  { label: "Mi cuenta", icon: UserIcon, active: false },
];

type AppSidebarProps = {
  room: string;
  teacher: Teacher;
};

export function AppSidebar({ room, teacher }: AppSidebarProps) {
  return (
    <aside className="sticky top-0 flex h-screen w-[248px] flex-none flex-col border-r border-edge bg-card px-4 py-6">
      <BrandMark room={room} />

      <span
        title="Próximamente"
        className="mb-[18px] flex w-full items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] p-3 text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,.75)]"
      >
        <PlusIcon />
        Nueva publicación
      </span>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <span
              key={item.label}
              aria-current={item.active ? "page" : undefined}
              title={item.active ? undefined : "Próximamente"}
              className={`flex items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px] ${
                item.active
                  ? "bg-nav-active font-extrabold text-coral-strong"
                  : "bg-transparent font-semibold text-nav"
              }`}
            >
              <Icon />
              {item.label}
            </span>
          );
        })}
      </nav>

      <div className="mt-[10px] border-t border-edge pt-[14px]">
        <div className="flex items-center gap-[11px] px-2 py-1.5">
          <Avatar label={teacher.initial} tone="peach" size="sm" />
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-extrabold text-heading">
              {teacher.name}
            </div>
            <div className="text-[12px] text-meta">{teacher.role}</div>
          </div>
          <span
            title="Próximamente"
            aria-label="Cerrar sesión"
            className="flex h-8 w-8 flex-none items-center justify-center rounded-[10px] bg-cream text-secondary"
          >
            <LogOutIcon />
          </span>
        </div>
      </div>
    </aside>
  );
}
