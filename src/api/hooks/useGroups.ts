import { Entities } from 'src/entity-store/entities';
import { useEntities } from 'src/entity-store/hooks';
import { useApi } from 'src/hooks';
import { groupSchema, type Group } from 'src/schemas/group';

import { useGroupRelationships } from './useGroupRelationships';

function useGroups(q: string = '') {
  const api = useApi();

  const { entities, ...result } = useEntities<Group>(
    [Entities.GROUPS, 'search', q],
    () => api.get('/api/groups', { params: { q } }),
    { enabled: true, schema: groupSchema },
  );
  const { relationships } = useGroupRelationships(
    ['search', q],
    entities.map(entity => entity.id),
  );

  const groups = entities.map((group) => ({
    ...group,
    relationship: relationships[group.id] || null,
  }));

  return {
    ...result,
    groups,
  };
}

export { useGroups };