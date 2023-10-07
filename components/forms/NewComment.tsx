"use client";

import { addCommentToPost } from "@/lib/actions/post.actions";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { SmileIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import "react-quill/dist/quill.bubble.css";
import "react-quill/dist/quill.snow.css";
import EmojiSelector from "../shared/EmojiSelector";
import { Button } from "../ui/button";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block", "link"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "link",
];

interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

const NewComment = ({ threadId, currentUserImg, currentUserId }: Props) => {
  const pathname = usePathname();
  const [value, setValue] = useState<string>("");
  const [showEmojiSelector, setShowEmojiSelector] = useState<boolean>(false);
  const emojiButtonRef = useRef<HTMLDivElement>(null);

  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  const handleSubmit = async () => {
    await addCommentToPost(
      threadId,
      value,
      JSON.parse(currentUserId),
      pathname
    );

    setValue("");
  };

  function handleEmojiSelect(emoji: string) {
    const editor = document.getElementById("comment");
    const selection = window.getSelection();

    if (editor && selection) {
      const range = selection.getRangeAt(0);
      const newNode = document.createTextNode(emoji);

      range.insertNode(newNode);

      range.setEndAfter(newNode);
      range.setStartAfter(newNode);

      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  return (
    <main className="comment-form">
      <section id="author&content" className="flex w-full items-center gap-0">
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-1",
            },
          }}
        />
        <ReactQuill
          id="comment"
          theme="bubble"
          placeholder="Escribe tu comentario..."
          value={value}
          onChange={setValue}
          modules={modules}
          formats={formats}
          className="border-none bg-transparent outline-transparent outline-solid outline-2 text-white xl:w-[33vw] lg:w-[40vw] md:w-[40vw] sm:w-[40vw] sxs:w-[45vw] xs:w-[66vw] xxs:w-[55vw]"
        />
      </section>

      <section id="buttons" className="flex items-center gap-1 max-sxs:w-full">
        <div
          id="emoji-picker"
          className="relative flex items-center justify-center"
        >
          <button
            onClick={() => setShowEmojiSelector(!showEmojiSelector)}
            title="Emojis"
          >
            <span ref={emojiButtonRef}>
              <SmileIcon className="text-light-1 m-1" />
            </span>
          </button>
          {showEmojiSelector && (
            <EmojiSelector
              onSelect={handleEmojiSelect}
              setShowEmojiSelector={setShowEmojiSelector}
              emojiButtonRef={emojiButtonRef}
            />
          )}
        </div>
        <Button className="comment-form_btn" onClick={handleSubmit}>
          Publicar
        </Button>
      </section>
    </main>
  );
};

export default NewComment;
