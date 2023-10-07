import PostCard from "@/components/cards/PostCard";
import NewComment from "@/components/forms/NewComment";
import { fetchPostById } from "@/lib/actions/post.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const post = await fetchPostById(params.id);

  return (
    <main className="relative">
      <section id="main-post">
        {/* @ts-expect-error Async Server Component */}
        <PostCard
          key={post._id}
          id={post._id}
          currentUserId={user.id}
          parentId={post.parentId}
          content={post.text}
          author={post.author}
          community={post.community}
          createdAt={post.createdAt}
          comments={post.children}
          likes={post.likes}
        />
      </section>

      <section id="comment-form" className="mt-7">
        <NewComment
          threadId={post.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </section>

      <section id="comments" className="mt-10">
        {post.children.map((childItem: any) => (
          <>
            {/* @ts-expect-error Async Server Component */}
            <PostCard
              key={childItem._id}
              id={childItem._id}
              currentUserId={user.id}
              parentId={childItem.parentId}
              content={childItem.text}
              author={childItem.author}
              community={childItem.community}
              createdAt={childItem.createdAt}
              comments={childItem.children}
              likes={childItem.likes}
              isComment
            />
          </>
        ))}
      </section>
    </main>
  );
};

export default Page;
