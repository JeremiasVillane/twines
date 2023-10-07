"use client";

import { createPost } from "@/lib/actions/post.actions";
import { OrganizationSwitcher, useOrganization } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { SmileIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
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

const NewPost = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();
  const [value, setValue] = useState<string>("");
  const [showEmojiSelector, setShowEmojiSelector] = useState<boolean>(false);
  const emojiButtonRef = useRef<HTMLDivElement>(null);

  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  const handleSubmit = async () => {
    await createPost({
      text: value,
      author: JSON.parse(userId),
      communityId: organization ? organization.id : null,
      path: pathname,
    });

    router.push("/");
  };

  function handleEmojiSelect(emoji: string) {
    const editor = document.getElementById("editor");
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

  function handleEditorChange(content: string) {
    setValue(content);
  }

  return (
    <main className="mt-12 grid w-full gap-2">
      <ReactQuill
        id="editor"
        theme="bubble"
        value={value}
        onChange={handleEditorChange}
        modules={modules}
        formats={formats}
        className="border border-solid border-[#1f1f22] rounded-lg bg-[#101012] text-white h-[50vh]"
      />

      <section id="buttons" className="flex items-center justify-start gap-1">
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-2",
            },
          }}
        />
        <Button
          className="bg-primary-500 select-none p-2 m-0 w-full"
          onClick={handleSubmit}
        >
          Publicar
        </Button>
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
      </section>
    </main>
  );
};

export default NewPost;
