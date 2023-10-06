"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@/components/ui/spinner";
import { Post } from "@/types";
import { fetchPosts } from "@/lib/actions/post.actions";
import Feed from "../cards/Feed";

export function LoadMore({ userId }: { userId: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);

  const { ref, inView } = useInView();

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const loadMorePosts = async () => {
    await delay(2000);
    const nextPage = page + 1;
    const newPosts = (await fetchPosts(nextPage)) ?? [];

    setPosts((prevPosts: Post[]) => [...prevPosts, ...newPosts]);
    setPage(nextPage);
  };

  useEffect(() => {
    if (inView) {
      loadMorePosts();
    }
  }, [inView]);

  return (
    <>
      <Feed posts={posts} userId={userId} />
      <div
        className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3"
        ref={ref}
      >
        <Spinner />
      </div>
    </>
  );
}
