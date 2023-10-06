"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { createPost } from "@/lib/actions/post.actions";
import { ThreadValidation } from "@/lib/validations/thread";
import { OrganizationSwitcher, useOrganization } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmojiClickData } from "emoji-picker-react";
import { Smile } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import EmojiSelector from "../shared/EmojiSelector";
import { Textarea } from "../ui/textarea";

function PostThread({ userId }: { userId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();

  const [showEmoji, setShowEmoji] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  const [selectedEmoji, setSelectedEmoji] = useState("");
  const { register, handleSubmit, setValue, watch } = useForm();

  const threadValue = watch("thread", "");

  const onSelectEmoji = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    setSelectedEmoji(emoji);

    // Actualiza el valor del campo 'thread' con el emoji seleccionado
    setValue("thread", threadValue + emoji);
  };

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: JSON.parse(userId),
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    console.log(values)
    await createPost({
      text: values.thread,
      author: JSON.parse(userId),
      communityId: organization ? organization.id : null,
      path: pathname,
    });

    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea
                  rows={15}
                  name="thread"
                  value={threadValue}
                  onChange={(e) => setValue("thread", e.target.value)}
                  // {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between gap-3">
          <Smile
            strokeWidth={1.5}
            color="white"
            size={40}
            onClick={() => setShowEmoji(!showEmoji)}
          />
          {showEmoji && <EmojiSelector onSelectEmoji={onSelectEmoji} />}
          <Button type="submit" className="bg-primary-500 w-full select-none">
            Publicar
          </Button>
          <OrganizationSwitcher
            appearance={{
              baseTheme: dark,
              elements: {
                organizationSwitcherTrigger: "py-2 px-4",
              },
            }}
          />
        </div>
      </form>
    </Form>
  );
}

export default PostThread;
