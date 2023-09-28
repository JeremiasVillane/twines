import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import {
  fetchUserPosts,
  getLikedPostsByUser,
} from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

interface Result {
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
      {result.threads.map((thread: any) => (
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
      ))}
    </section>
  );
};

export default ThreadsTab;
