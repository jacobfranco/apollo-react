import { z } from 'zod';

import { Entities } from 'src/entity-store/entities';
import { useEntity } from 'src/entity-store/hooks';
import { useApi } from 'src/hooks';
import { type GroupRelationship, groupRelationshipSchema } from 'src/schemas';

function useGroupRelationship(groupId: string | undefined) {
  const api = useApi();

  const { entity: groupRelationship, ...result } = useEntity<GroupRelationship>(
    [Entities.GROUP_RELATIONSHIPS, groupId!],
    () => api.get(`/api/v1/groups/relationships?id[]=${groupId}`),
    {
      enabled: !!groupId,
      schema: z.array(groupRelationshipSchema).nonempty().transform(arr => arr[0]),
    },
  );

  return {
    groupRelationship,
    ...result,
  };
}

export { useGroupRelationship };