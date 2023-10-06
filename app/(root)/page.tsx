import Feed from "@/components/cards/Feed";
import { LoadMore } from "@/components/shared/LoadMore";
import { fetchPosts } from "@/lib/actions/post.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const posts = await fetchPosts(1);
  return (
    <>
      <h1 className="head-text text-left select-none">Inicio</h1>

      <section className="mt-9 flex flex-col gap-10">
        {posts?.length === 0 ? (
          <p className="no-results">No hay publicaciones</p>
        ) : (
          <>
            <Feed posts={posts} userId={user.id} />
            {/* <LoadMore userId={user.id} /> */}
          </>
        )}
      </section>
    </>
  );
}
