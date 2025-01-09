import { z } from "zod";

const historySchema = z.object({
  accounts: z.coerce.number(),
  uses: z.coerce.number(),
});

const spaceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  linkUrl: z.string().catch(""),
  imageUrl: z.string().url().catch(""),
  history: z.array(historySchema).nullable().catch(null),
  following: z.boolean().catch(false),
});

type Space = z.infer<typeof spaceSchema>;

export { spaceSchema, type Space };
