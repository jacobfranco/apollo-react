import { Entities } from 'src/entity-store/entities';
import { useEntityActions } from 'src/entity-store/hooks';
import { groupRelationshipSchema } from 'src/schemas';

import { useGroups } from './useGroups';

import type { Group, GroupRelationship } from 'src/schemas';

function useLeaveGroup(group: Group) {
  const { invalidate } = useGroups();

  const { createEntity, isSubmitting } = useEntityActions<GroupRelationship>(
    [Entities.GROUP_RELATIONSHIPS, group.id],
    { post: `/api/groups/${group.id}/leave` },
    { schema: groupRelationshipSchema },
  );

  return {
    mutate: createEntity,
    isSubmitting,
    invalidate,
  };
}

export { useLeaveGroup };