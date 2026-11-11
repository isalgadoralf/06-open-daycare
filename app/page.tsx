import { FeedComposer } from "@/components/home/feed-composer";
import { FeedPostCard } from "@/components/home/feed-post-card";
import { SectionLabel } from "@/components/home/section-label";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { classroom, posts, teacher } from "@/data/feed";

export default function Home() {
  return (
    <div className="flex h-screen min-w-[1008px] bg-cream">
      <AppSidebar room={classroom.room} teacher={teacher} />

      <main className="h-screen min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[760px] px-10 pt-[34px] pb-20">
          <div className="mb-6">
            <div className="mb-1 text-[12.5px] font-extrabold tracking-[.8px] text-coral-strong">
              {classroom.eyebrow}
            </div>
            <h1 className="m-0 font-heading text-[30px] font-semibold text-heading">
              {classroom.salutation}
            </h1>
            <p className="mt-[5px] mb-0 text-[14.5px] text-secondary">
              {classroom.summary}
            </p>
          </div>

          <FeedComposer initial={teacher.initial} />

          <SectionLabel>PUBLICADO HOY</SectionLabel>

          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <FeedPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
