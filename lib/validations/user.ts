import * as z from "zod";

export const UserValidation = z.object({
  profile_photo: z.string().url().nonempty(),
  name: z
    .string()
    .min(3, { message: "Como mínimo 3 caracteres" })
    .max(30, { message: "Como máximo 30 caracteres" }),
  username: z
    .string()
    .min(3, { message: "Como mínimo 3 caracteres" })
    .max(30, { message: "Como máximo 30 caracteres" }),
  bio: z
    .string()
    .min(3, { message: "Como mínimo 3 caracteres" })
    .max(1000, { message: "Como máximo 1000 caracteres" }),
});
