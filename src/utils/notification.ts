const NOTIFICATION_TYPES = [
    'follow',
    'follow_request',
    'mention',
    'repost',
    'like',
    'group_like',
    'group_repost',
    'poll',
    'status',
    'move',
    'user_approved',
    'update',
  ] as const;

  type NotificationType = typeof NOTIFICATION_TYPES[number];

/** Ensure the Notification is a valid, known type. */
const validType = (type: string): type is NotificationType => NOTIFICATION_TYPES.includes(type as any);

  export {
    NOTIFICATION_TYPES,
    NotificationType,
    validType
  }