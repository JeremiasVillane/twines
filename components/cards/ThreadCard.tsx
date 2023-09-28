import { formatDateString } from "@/lib/utils";
import { Forward, MessageSquare, Repeat2, Send, Share } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
  likes?: { likedBy: string }[];
  isComment?: boolean;
}

const ThreadCard = ({
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
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
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
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>

            <p className="mt-2 text-small-regular text-light-2">{content}</p>

            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5">
                <LikeButton
                  threadId={JSON.stringify(id)}
                  userId={author.id}
                  likes={likes ? likes.length : 0}
                />

                <Link href={`/thread/${id}`}>
                  <span title="Comentarios">
                    <MessageSquare strokeWidth={1.5} color="rgb(92 92 123)" />
                  </span>
                </Link>

                <span title="RePublicar">
                  <Repeat2 strokeWidth={1.5} color="rgb(92 92 123)" />
                </span>

                <span title="Compartir">
                  <Forward strokeWidth={1.5} color="rgb(92 92 123)" />
                </span>
              </div>

              {
                // isComment &&
                comments.length > 0 && (
                  <Link href={`/thread/${id}`}>
                    <p className="mt-1 text-subtle-medium text-gray-1">
                      {comments.length} comentario{comments.length > 1 && "s"}
                    </p>
                  </Link>
                )
              }
            </div>
          </div>
        </div>
      </div>
      {!isComment && (
        <Link
          href={community ? `/communities/${community.id}` : `/thread/${id}`}
          className="mt-5 flex items-center"
        >
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt)}{" "}
            {community && " - Comunidad " + community.name}
          </p>

          {community && (
            <Image
              src={community.image}
              alt={community.name}
              width={14}
              height={14}
              className="ml-1 rounded-full object-cover"
            />
          )}
        </Link>
      )}
    </article>
  );
};

export default ThreadCard;
