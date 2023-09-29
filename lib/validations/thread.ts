import * as z from "zod";

export const ThreadValidation = z.object({
  thread: z
    .string()
    .nonempty({ message: "La publicación no puede ser vacía" })
    .min(3, { message: "Debe tener al menos 3 caracteres" })
    .max(333, { message: "No puede tener más de 333 caracteres" }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  thread: z
    .string()
    .nonempty({ message: "El comentario no puede ser vacía" })
    .min(3, { message: "Debe tener al menos 3 caracteres" })
    .max(333, { message: "No puede tener más de 333 caracteres" }),
});
