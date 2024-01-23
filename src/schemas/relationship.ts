import z from 'zod';

const relationshipSchema = z.object({ // TODO: Make more comprehensive
  blocked_by: z.boolean().catch(false),
  blocking: z.boolean().catch(false),
  followed_by: z.boolean().catch(false),
  following: z.boolean().catch(false),
  id: z.string(),
  muting: z.boolean().catch(false),
  muting_notifications: z.boolean().catch(false),
  notifying: z.boolean().catch(false),
  requested: z.boolean().catch(false),
});

type Relationship = z.infer<typeof relationshipSchema>;

export { relationshipSchema, type Relationship };