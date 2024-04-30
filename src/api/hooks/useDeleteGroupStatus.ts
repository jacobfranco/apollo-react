import { Entities } from 'src/entity-store/entities';
import { useDeleteEntity } from 'src/entity-store/hooks';
import { useApi } from 'src/hooks';

import type { Group } from 'src/schemas';

function useDeleteGroupStatus(group: Group, statusId: string) {
  const api = useApi();
  const { deleteEntity, isSubmitting } = useDeleteEntity(
    Entities.STATUSES,
    () => api.delete(`/api/groups/${group.id}/statuses/${statusId}`),
  );

  return {
    mutate: deleteEntity,
    isSubmitting,
  };
}

export { useDeleteGroupStatus };