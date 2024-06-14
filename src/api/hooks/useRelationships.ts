import { Entities } from 'src/entity-store/entities';
import { useBatchedEntities } from 'src/entity-store/hooks/useBatchedEntities';
import { useLoggedIn } from 'src/hooks';
import { useApi } from 'src/hooks/useApi';
import { type Relationship, relationshipSchema } from 'src/schemas';

function useRelationships(listKey: string[], ids: string[]) {
  const api = useApi();
  const { isLoggedIn } = useLoggedIn();

  function fetchRelationships(ids: string[]) {
    const q = ids.map((id) => `id[]=${id}`).join('&');
    return api.get(`/api/accounts/relationships?${q}`);
  }

  const { entityMap: relationships, ...result } = useBatchedEntities<Relationship>(
    [Entities.RELATIONSHIPS, ...listKey],
    ids,
    fetchRelationships,
    { schema: relationshipSchema, enabled: isLoggedIn },
  );

  return { relationships, ...result };
}

export { useRelationships };