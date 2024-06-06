import { z } from 'zod';

const mentionSchema = z.object({
  id: z.string(),
  url: z.string().url().catch(''),
  username: z.string().catch(''),
}).transform((mention) => {
  return mention;
});

type Mention = z.infer<typeof mentionSchema>;

export { mentionSchema, type Mention };