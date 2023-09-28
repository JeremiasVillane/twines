"use client";

import { likePost } from "@/lib/actions/thread.actions";
import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";

interface Props {
  threadId: string;
  userId: string;
  likes: number;
}

const LikeButton = ({ threadId, userId, likes }: Props) => {
  const pathname = usePathname();

  const handleLike = async () => {
    await likePost(JSON.parse(threadId), userId, pathname);
  };

  return (
    <div className="flex items-center gap-1 cursor-pointer" title="Me gusta">
      <Heart strokeWidth={1.5} color="rgb(92 92 123)" onClick={handleLike} />
      <span className="text-small-semibold text-gray-1">
        {likes > 0 && likes}
      </span>
    </div>
  );
};

export default LikeButton;
