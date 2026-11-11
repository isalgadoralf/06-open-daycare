import { AppSidebar } from "@/components/shared/app-sidebar";
import { classroom, teacher } from "@/data/feed";

export default function KidsLayout({ children }: LayoutProps<"/kids">) {
  return (
    <div className="flex h-screen min-w-[1008px] bg-cream">
      <AppSidebar activeItem="kids" room={classroom.room} teacher={teacher} />

      <main className="h-screen min-w-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
