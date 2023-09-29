"use client";

import { usePathname, useRouter } from "next/navigation";
import { deletePost } from "@/lib/actions/thread.actions";
import { Trash2 } from "lucide-react";

interface Props {
  threadId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

function DeleteThread({
  threadId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  if (JSON.parse(currentUserId) !== authorId || pathname === "/") return null;

  return (
    <span className="cursor-pointer object-contain" title="Eliminar">
      <Trash2
        size={18}
        color="rgb(222 33 66)"
        onClick={async () => {
          await deletePost(JSON.parse(threadId), pathname);
          if (!parentId || !isComment) {
            router.push("/");
          }
        }}
      />
    </span>
  );
}

export default DeleteThread;
