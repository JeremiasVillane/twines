"use client";

import { addCommentToPost } from "@/lib/actions/post.actions";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import "react-quill/dist/quill.bubble.css";
import "react-quill/dist/quill.snow.css";
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

  return (
    <div className="comment-form">
      <div className="flex w-full items-center gap-0">
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-1",
            },
          }}
        />
        <ReactQuill
          theme="bubble"
          placeholder="Escribe tu comentario..."
          value={value}
          onChange={setValue}
          modules={modules}
          formats={formats}
          className="border-none bg-transparent outline-transparent outline-solid outline-2 text-white xl:w-[33vw] lg:w-[40vw] md:w-[40vw] sm:w-[40vw] sxs:w-[45vw] xs:w-[66vw] xxs:w-[55vw]"
        />
      </div>
      <Button className="comment-form_btn" onClick={handleSubmit}>
        Publicar
      </Button>
    </div>
  );
};

export default NewComment;
