import { Entities } from 'src/entity-store/entities';
import { useEntities } from 'src/entity-store/hooks';
import { useApi } from 'src/hooks';
import { type Group, groupSchema } from 'src/schemas';

import { useGroupRelationships } from './useGroupRelationships';

function useSuggestedGroups() {
  const api = useApi();

  const { entities, ...result } = useEntities<Group>(
    [Entities.GROUPS, 'suggested'],
    () => api.get('/api/truth/suggestions/groups'),
    {
      schema: groupSchema,
      enabled: true,
    },
  );

  const { relationships } = useGroupRelationships(['suggested'], entities.map(entity => entity.id));

  const groups = entities.map((group) => ({
    ...group,
    relationship: relationships[group.id] || null,
  }));

  return {
    ...result,
    groups,
  };
}

export { useSuggestedGroups };