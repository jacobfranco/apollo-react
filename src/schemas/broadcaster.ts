import { z } from "zod";
import { broadcastSchema } from "./broadcast";

export const broadcasterSchema = z
  .object({
    broadcasterId: z.number(),
    broadcasterName: z.string(), // Required and non-null
    broadcasterExternalId: z.string(), // Required and non-null
    broadcasterPlatformId: z.number(),
    broadcasterDefaultLanguageId: z.number(),
    broadcasts: z.array(broadcastSchema), // Must be present and an array
    official: z.boolean(),
  })
  .passthrough(); // Allows additional unspecified fields

export type Broadcaster = z.infer<typeof broadcasterSchema>;
