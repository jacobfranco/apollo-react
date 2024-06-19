import { useMutation } from '@tanstack/react-query';

import { fetchRelationshipsFail, fetchRelationshipsSuccess } from 'src/actions/accounts';
import { useApi, useAppDispatch } from 'src/hooks';

const useFetchRelationships = () => {
  const api = useApi();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ accountIds }: { accountIds: string[]}) => {
      const ids = accountIds.map((id) => `id[]=${id}`).join('&');

      return api.get(`/api/accounts/relationships?${ids}`);
    },
    onSuccess(response) {
      dispatch(fetchRelationshipsSuccess(response.data));
    },
    onError(error) {
      dispatch(fetchRelationshipsFail(error));
    },
  });
};

export { useFetchRelationships };