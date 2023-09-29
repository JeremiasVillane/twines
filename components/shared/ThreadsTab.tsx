import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import {
  fetchUserPosts,
  getLikedPostsByUser,
} from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

interface Result1 {
  name: string;
  image: string;
  id: string;
  threads: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
}

interface Result2 {
  text: string;
  author: {
    _id: string;
    id: string;
    bio: string;
    image: string;
    name: string;
    username: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  children: {
    author: {
      image: string;
    };
  }[];
  likes: string[];
  createdAt: string;
}
[];

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
  let result: any;

  if (accountType === "User") {
    if (data === "Publicaciones") {
      result = await fetchUserPosts(accountId);
    } else if (data === "Favoritos") {
      result = await getLikedPostsByUser(accountId);
    } else result = await fetchUserPosts(accountId);
  } else {
    result = await fetchCommunityPosts(accountId);
  }

  // if (!result) redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {data === "Favoritos"
        ? result.map((post: any) => (
            <>
              {/* @ts-ignore */}
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
        : result.threads.map((thread: any) => (
            <>
              {/* @ts-ignore */}
              <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={currentUserId}
                parentId={thread.parentId}
                content={thread.text}
                author={
                  accountType === "User"
                    ? { name: result.name, image: result.image, id: result.id }
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
