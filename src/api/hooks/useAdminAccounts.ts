import { Entities } from "src/entity-store/entities";
import { useEntities } from "src/entity-store/hooks/index";
import { useApi } from "src/hooks/useApi";
import { accountSchema } from "src/schemas/account";

interface ApolloAdminFilters {
  local?: boolean;
  remote?: boolean;
  active?: boolean;
  pending?: boolean;
  disabled?: boolean;
  silenced?: boolean;
  suspended?: boolean;
  sensitized?: boolean;
}

/** https://docs.joinmastodon.org/methods/admin/accounts/#v1 */
export function useAdminAccounts(filters: ApolloAdminFilters, limit?: number) {
  const api = useApi();

  const searchParams = new URLSearchParams();

  for (const [name, value] of Object.entries(filters)) {
    searchParams.append(name, value.toString());
  }

  if (typeof limit === "number") {
    searchParams.append("limit", limit.toString());
  }

  const { entities, ...rest } = useEntities(
    [Entities.ACCOUNTS, searchParams.toString()],
    () => api.get("/api/admin/accounts", { searchParams }),
    { schema: accountSchema }
  );

  return { accounts: entities, ...rest };
}
