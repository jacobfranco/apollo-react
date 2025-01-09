import { Entities } from "src/entity-store/entities";
import { useEntities } from "src/entity-store/hooks/useEntities";
import { useApi } from "src/hooks/useApi";
import { useOwnAccount } from "src/hooks/useOwnAccount";
import { Group, groupSchema } from "src/schemas";

function usePendingGroups() {
  const api = useApi();
  const { account } = useOwnAccount();

  const { entities, ...result } = useEntities<Group>(
    [Entities.GROUPS, account?.id!, "pending"],
    () =>
      api.get("/api/groups", {
        searchParams: {
          pending: true,
        },
      }),
    {
      schema: groupSchema,
      enabled: !!account && true,
    }
  );

  return {
    ...result,
    groups: entities,
  };
}

export { usePendingGroups };
