import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import {
  fetchUserPosts,
  getLikedPostsByUser,
} from "@/lib/actions/user.actions";
import ThreadCard from "../cards/ThreadCard";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
  data: string;
}

const ThreadsTab = async ({
  currentUserId,
  accountId,
  accountType,
  data,
}: Props) => {
  let mainposts: any;
  let comments: any;
  let favourites: any;

  if (accountType === "User") {
    mainposts = await fetchUserPosts(accountId, "mainposts");
    comments = await fetchUserPosts(accountId, "comments");
    favourites = await getLikedPostsByUser(accountId);
  } else {
    mainposts = await fetchCommunityPosts(accountId);
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {data === "Favoritos"
        ? favourites.map((post: any) => (
            <>
              {/* @ts-expect-error Async Server Component */}
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={currentUserId}
                parentId={post.parentId}
                content={post.text}
                author={{
                  name: post.author.name,
                  image: post.author.image,
                  id: post.author.id,
                }}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
                likes={post.likes}
              />
            </>
          ))
        : data === "Publicaciones"
        ? mainposts.threads.map((thread: any) => (
            <>
              {/* @ts-expect-error Async Server Component */}
              <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={currentUserId}
                parentId={thread.parentId}
                content={thread.text}
                author={
                  accountType === "User"
                    ? {
                        name: mainposts.name,
                        image: mainposts.image,
                        id: mainposts.id,
                      }
                    : {
                        name: thread.author.name,
                        image: thread.author.image,
                        id: thread.author.id,
                      }
                }
                community={thread.community}
                createdAt={thread.createdAt}
                comments={thread.children}
                likes={thread.likes}
              />
            </>
          ))
        : comments.threads.map((thread: any) => (
            <>
              {/* @ts-expect-error Async Server Component */}
              <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={currentUserId}
                parentId={thread.parentId}
                content={thread.text}
                author={
                  accountType === "User"
                    ? {
                        name: comments.name,
                        image: comments.image,
                        id: comments.id,
                      }
                    : {
                        name: thread.author.name,
                        image: thread.author.image,
                        id: thread.author.id,
                      }
                }
                community={thread.community}
                createdAt={thread.createdAt}
                comments={thread.children}
                likes={thread.likes}
              />
            </>
          ))}
    </section>
  );
};

export default ThreadsTab;
