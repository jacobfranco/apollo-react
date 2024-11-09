import { z } from "zod";

export const imageSchema = z.object({
  id: z.number(),
  type: z.string(),
  url: z.string().url().or(z.literal("")), // Allow empty string or valid URL
  thumbnail: z.string().url().or(z.literal("")), // Allow empty string or valid URL
  fallback: z.boolean(),
});

export type Image = z.infer<typeof imageSchema>;
