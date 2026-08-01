import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(40),
  country: z.string().max(80),
  level: z.string().max(80),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
