import { Entities } from 'src/entity-store/entities';
import { useEntities } from 'src/entity-store/hooks';
import { useApi } from 'src/hooks/useApi';
import { groupSchema } from 'src/schemas';

import type { Group } from 'src/schemas';

function useGroupMutes() {
  const api = useApi();

  const { entities, ...result } = useEntities<Group>(
    [Entities.GROUP_MUTES],
    () => api.get('/api/groups/mutes'),
    { schema: groupSchema, enabled: true },
  );

  return {
    ...result,
    mutes: entities,
  };
}

export { useGroupMutes };