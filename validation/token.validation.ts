import { z } from "zod";

export const tokenSchema = z.object({
  id: z.string(),
});

export type TTokenSchema = z.infer<typeof tokenSchema>;
