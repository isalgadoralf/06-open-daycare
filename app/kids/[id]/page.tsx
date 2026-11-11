import { Suspense } from "react";
import { KidProfile } from "@/components/kids/kid-profile";
import { kids } from "@/data/kids";

export function generateStaticParams() {
  return kids.map((kid) => ({ id: kid.id }));
}

export default function KidPage({ params }: PageProps<"/kids/[id]">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[820px] px-10 pt-[34px] pb-20" />
      }
    >
      <KidProfile params={params} />
    </Suspense>
  );
}
