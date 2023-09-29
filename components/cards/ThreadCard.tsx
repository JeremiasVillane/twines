import { isLiked } from "@/lib/actions/thread.actions";
import Thread from "@/lib/models/thread.model";
import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { formatDateString } from "@/lib/utils";
import { Forward, MessageSquare, Repeat2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DeleteButton from "../shared/DeleteButton";
import LikeButton from "../shared/LikeButton";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  likes: { likedBy: string }[];
  isComment?: boolean;
}

const ThreadCard = async ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  likes,
  isComment,
}: Props) => {
  const liked = await isLiked(id, currentUserId);

  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      {/* {!isComment && parentId && (
        <span>
          En respuesta a
        </span>
      )} */}
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center select-none">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="Profile image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>

            <div className="thread-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <div className="flex content-between items-end gap-5">
              <Link href={`/profile/${author.id}`} className="w-fit">
                <h4
                  className="cursor-pointer text-base-semibold text-light-1"
                  title={author.name}
                >
                  {author.name.split(" ")[0]}
                </h4>
              </Link>
              <p
                className="text-subtle-medium text-gray-1 py-[0.12rem] select-none cursor-default"
                title={formatDateString(createdAt, "long")}
              >
                {formatDateString(createdAt, "short")}
              </p>
            </div>

            <p className="mt-2 text-small-regular text-light-2 whitespace-pre-line">
              {content}
            </p>

            <div className={`${isComment && "mb-7"} mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5">
                <LikeButton
                  threadId={JSON.stringify(id)}
                  userId={JSON.stringify(currentUserId)}
                  liked={liked}
                />

                <Link href={`/thread/${id}`}>
                  <span title="Comentarios">
                    <MessageSquare strokeWidth={1.5} color="rgb(92 92 123)" />
                  </span>
                </Link>

                <span title="Republicar">
                  <Repeat2 strokeWidth={1.5} color="rgb(92 92 123)" />
                </span>

                <span title="Compartir">
                  <Forward strokeWidth={1.5} color="rgb(92 92 123)" />
                </span>
              </div>

              {(comments || likes) && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1 select-none">
                    {comments?.length > 0 && comments?.length + " comentario"}
                    {comments?.length > 1 && "s"}
                    {comments?.length > 0 && likes?.length > 0 && " - "}
                    {likes?.length > 0 && likes?.length + " me gusta"}
                  </p>
                </Link>
              )}
              {community && (
                <Link
                  href={`/communities/${community.id}`}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={community.image}
                    alt={community.name}
                    width={14}
                    height={14}
                    className="rounded-full"
                  />
                  <p className="text-subtle-medium text-gray-1 self-end">
                    {community && "Comunidad " + community.name}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
        <DeleteButton
          threadId={JSON.stringify(id)}
          currentUserId={JSON.stringify(currentUserId)}
          authorId={author.id}
          parentId={parentId}
          isComment={isComment}
        />
      </div>
    </article>
  );
};

export default ThreadCard;
