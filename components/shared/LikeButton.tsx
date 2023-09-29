"use client";

import { likePost } from "@/lib/actions/thread.actions";
import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";

interface Props {
  threadId: string;
  userId: string;
  liked: boolean;
}

const LikeButton = ({ threadId, userId, liked }: Props) => {
  const pathname = usePathname();

  const handleLike = async () => {
    await likePost(JSON.parse(threadId), JSON.parse(userId), pathname);
  };

  return (
    <div className="flex items-center gap-1 cursor-pointer" title="Me gusta">
      <Heart
        strokeWidth={1.5}
        color={liked ? "rgb(222 33 66)" : "rgb(92 92 123)"}
        onClick={handleLike}
      />
    </div>
  );
};

export default LikeButton;
