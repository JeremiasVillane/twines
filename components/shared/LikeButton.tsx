"use client";

import { likePost } from "@/lib/actions/thread.actions";
import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";

interface Props {
  threadId: string;
  userId: string;
}

const LikeButton = ({ threadId, userId }: Props) => {
  const pathname = usePathname();

  const handleLike = async () => {
    await likePost(JSON.parse(threadId), JSON.parse(userId), pathname);
  };

  return (
    <div className="flex items-center gap-1 cursor-pointer" title="Me gusta">
      <Heart strokeWidth={1.5} color="rgb(92 92 123)" onClick={handleLike} />
    </div>
  );
};

export default LikeButton;
