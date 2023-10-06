import PostCard from "@/components/cards/PostCard";
import { Post } from "@/types";

export interface PostProps {
  posts: Post[] | null;
  userId: string;
}

export default function Feed({ posts, userId }: PostProps) {
  return (
    <>
      {posts ? (
        posts.map((post) => (
          <>
            {/* @ts-expect-error Async Server Component */}
            <PostCard
              key={post._id}
              id={post._id}
              currentUserId={userId}
              parentId={post.parentId}
              content={post.text}
              author={post.author}
              community={post.community}
              createdAt={post.createdAt}
              comments={post.children}
              likes={post.likes}
            />
          </>
        ))
      ) : (
        <div className="text-xl font-bold">No hay más publicaciones</div>
      )}
    </>
  );
}
