import { Entities } from 'src/entity-store/entities';
import { useEntityActions } from 'src/entity-store/hooks';
import { type Group, groupRelationshipSchema } from 'src/schemas';

function useUnmuteGroup(group?: Group) {
  const { createEntity, isSubmitting } = useEntityActions(
    [Entities.GROUP_RELATIONSHIPS, group?.id as string],
    { post: `/api/v1/groups/${group?.id}/unmute` },
    { schema: groupRelationshipSchema },
  );

  return {
    mutate: createEntity,
    isSubmitting,
  };
}

export { useUnmuteGroup };