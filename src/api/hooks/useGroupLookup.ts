import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Entities } from "src/entity-store/entities";
import { useEntityLookup } from "src/entity-store/hooks/useEntityLookup";
import { useApi } from "src/hooks/useApi";
import { groupSchema } from "src/schemas";

import { useGroupRelationship } from "./useGroupRelationship";

function useGroupLookup(slug: string) {
  const api = useApi();
  const history = useHistory();

  const {
    entity: group,
    isUnauthorized,
    ...result
  } = useEntityLookup(
    Entities.GROUPS,
    (group) => group.slug.toLowerCase() === slug.toLowerCase(),
    () => api.get(`/api/groups/lookup?name=${slug}`),
    { schema: groupSchema, enabled: true && !!slug }
  );

  const { groupRelationship: relationship } = useGroupRelationship(group?.id);

  useEffect(() => {
    if (isUnauthorized) {
      history.push("/login");
    }
  }, [isUnauthorized]);

  return {
    ...result,
    isUnauthorized,
    entity: group
      ? { ...group, relationship: relationship || null }
      : undefined,
  };
}

export { useGroupLookup };
