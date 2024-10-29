import { Entities } from "src/entity-store/entities";
import { useCreateEntity } from "src/entity-store/hooks/useCreateEntity";
import { useApi } from "src/hooks/useApi";
import { useOwnAccount } from "src/hooks/useOwnAccount";

import type { Group } from "src/schemas";

function useCancelMembershipRequest(group: Group) {
  const api = useApi();
  const { account: me } = useOwnAccount();

  const { createEntity, isSubmitting } = useCreateEntity(
    [Entities.GROUP_RELATIONSHIPS],
    () =>
      api.post(`/api/groups/${group.id}/membership_requests/${me?.id}/reject`)
  );

  return {
    mutate: createEntity,
    isSubmitting,
  };
}

export { useCancelMembershipRequest };
