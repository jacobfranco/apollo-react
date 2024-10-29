import { Entities } from "src/entity-store/entities";
import { useBatchedEntities } from "src/entity-store/hooks/useBatchedEntities";
import { useApi } from "src/hooks/useApi";
import { useLoggedIn } from "src/hooks/useLoggedIn";
import { type GroupRelationship, groupRelationshipSchema } from "src/schemas";

function useGroupRelationships(listKey: string[], ids: string[]) {
  const api = useApi();
  const { isLoggedIn } = useLoggedIn();

  function fetchGroupRelationships(ids: string[]) {
    const q = ids.map((id) => `id[]=${id}`).join("&");
    return api.get(`/api/groups/relationships?${q}`);
  }

  const { entityMap: relationships, ...result } =
    useBatchedEntities<GroupRelationship>(
      [Entities.RELATIONSHIPS, ...listKey],
      ids,
      fetchGroupRelationships,
      { schema: groupRelationshipSchema, enabled: isLoggedIn }
    );

  return { relationships, ...result };
}

export { useGroupRelationships };
