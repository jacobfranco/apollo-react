import { Entities } from 'src/entity-store/entities';
import { useEntityActions } from 'src/entity-store/hooks';

import type { Account, Group, GroupMember } from 'src/schemas';

function useBlockGroupMember(group: Group, account: Account) {
  const { createEntity } = useEntityActions<GroupMember>(
    [Entities.GROUP_MEMBERSHIPS, account.id],
    { post: `/api/groups/${group?.id}/blocks` },
  );

  return createEntity;
}

export { useBlockGroupMember };