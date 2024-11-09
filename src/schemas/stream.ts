import { z } from "zod";
import { imageSchema } from "./image";
import { streamingPlatformSchema } from "./streaming-platform";

export const streamSchema = z.object({
  id: z.number(),
  username: z.string(),
  displayName: z.string().nullable(),
  statusText: z.string().nullable(),
  viewerCount: z.number(),
  online: z.boolean(),
  lastOnline: z.number(),
  images: z.array(imageSchema).optional().nullable(),
  platform: streamingPlatformSchema.optional().nullable(),
});

export type Stream = z.infer<typeof streamSchema>;
