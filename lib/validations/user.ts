import * as z from "zod";

export const UserValidation = z.object({
  profile_photo: z.string().url().nonempty(),
  name: z
    .string()
    .min(3, { message: "At least 3 characteres" })
    .max(30, { message: "At most 30 characters" }),
  username: z
    .string()
    .min(3, { message: "At least 3 characteres" })
    .max(30, { message: "At most 30 characters" }),
  bio: z
    .string()
    .min(3, { message: "At least 3 characteres" })
    .max(1000, { message: "At most 1000 characters" }),
});
