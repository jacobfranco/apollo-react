import { Entities } from 'src/entity-store/entities';
import { useEntities } from 'src/entity-store/hooks';
import { useApi, useOwnAccount } from 'src/hooks';
import { Group, groupSchema } from 'src/schemas';

function usePendingGroups() {
  const api = useApi();
  const { account } = useOwnAccount();

  const { entities, ...result } = useEntities<Group>(
    [Entities.GROUPS, account?.id!, 'pending'],
    () => api.get('/api/v1/groups', {
      params: {
        pending: true,
      },
    }),
    {
      schema: groupSchema,
      enabled: !!account && true,
    },
  );

  return {
    ...result,
    groups: entities,
  };
}

export { usePendingGroups };