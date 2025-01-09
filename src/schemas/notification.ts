import { z } from "zod";

import { accountSchema } from "./account.ts";
import { statusSchema } from "./status.ts";

const baseNotificationSchema = z.object({
  account: accountSchema,
  created_at: z.string().datetime().catch(new Date().toUTCString()),
  id: z.string(),
  type: z.string(),
});

const mentionNotificationSchema = baseNotificationSchema.extend({
  type: z.literal("mention"),
  status: statusSchema,
});

const statusNotificationSchema = baseNotificationSchema.extend({
  type: z.literal("status"),
  status: statusSchema,
});

const repostNotificationSchema = baseNotificationSchema.extend({
  type: z.literal("repost"),
  status: statusSchema,
});

const followNotificationSchema = baseNotificationSchema.extend({
  type: z.literal("follow"),
});

const followRequestNotificationSchema = baseNotificationSchema.extend({
  type: z.literal("follow_request"),
});

const likeNotificationSchema = baseNotificationSchema.extend({
  type: z.literal("like"),
  status: statusSchema,
});

const pollNotificationSchema = baseNotificationSchema.extend({
  type: z.literal("poll"),
  status: statusSchema,
});

const updateNotificationSchema = baseNotificationSchema.extend({
  type: z.literal("update"),
  status: statusSchema,
});

const moveNotificationSchema = baseNotificationSchema.extend({
  type: z.literal("move"),
  target: accountSchema,
});

const notificationSchema = z.discriminatedUnion("type", [
  mentionNotificationSchema,
  statusNotificationSchema,
  repostNotificationSchema,
  followNotificationSchema,
  followRequestNotificationSchema,
  likeNotificationSchema,
  pollNotificationSchema,
  updateNotificationSchema,
  moveNotificationSchema,
]);

type Notification = z.infer<typeof notificationSchema>;

export { notificationSchema, type Notification };
