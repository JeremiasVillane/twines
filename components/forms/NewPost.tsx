"use client";

import { createPost } from "@/lib/actions/post.actions";
import { OrganizationSwitcher, useOrganization } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
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

const NewPost = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();
  const [value, setValue] = useState<string>("");

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

  return (
    <div className="mt-12 grid w-full gap-2">
      <ReactQuill
        theme="bubble"
        value={value}
        onChange={setValue}
        modules={modules}
        formats={formats}
        className="border border-solid border-[#1f1f22] rounded-lg bg-[#101012] text-white h-[50vh]"
      />

      <div className="flex items-center justify-start gap-1">
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
      </div>
    </div>
  );
};

export default NewPost;
