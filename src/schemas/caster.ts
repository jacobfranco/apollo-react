import { z } from "zod";
import { streamingPlatformSchema } from "./streaming-platform";
import { streamSchema } from "./stream";
import { regionSchema } from "./region";

export const casterSchema = z
  .object({
    id: z.number(),
    username: z.string().nullable(),
    gameId: z.number(),
    displayName: z.string().nullable(), // Can be null but must be present
    deletedAt: z.number().nullable(),
    platform: streamingPlatformSchema.nullable(), // Can be null but must be present
    stream: streamSchema.nullable(), // Can be null but must be present
    region: regionSchema.nullable(), // Can be null but must be present
  })
  .passthrough(); // Allows additional unspecified fields

export type Caster = z.infer<typeof casterSchema>;
