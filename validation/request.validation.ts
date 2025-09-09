import { z } from "zod";

export const signupSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "firstName must be of atleast 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "firstName must be of atleast 2 characters" }),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be of minimum 6 characters" }),
});

