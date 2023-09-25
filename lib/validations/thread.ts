import * as z from "zod";

export const ThreadValidation = z.object({
  thread: z
    .string()
    .nonempty()
    .min(3, { message: "At least 3 characteres" })
    .max(333, { message: "At most 333 characters" }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  thread: z
    .string()
    .nonempty()
    .min(3, { message: "At least 3 characteres" })
    .max(333, { message: "At most 333 characters" }),
});
