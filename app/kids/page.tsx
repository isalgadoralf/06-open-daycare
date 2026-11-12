import { KidsDirectory } from "@/components/kids/kids-directory";
import { kids, rooms } from "@/data/kids";

export default function KidsPage() {
  return <KidsDirectory demoKids={kids} rooms={rooms} />;
}
