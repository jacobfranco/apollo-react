import { useMutation } from "@tanstack/react-query";

import {
  fetchRelationshipsFail,
  fetchRelationshipsSuccess,
} from "src/actions/accounts";
import { useApi } from "src/hooks/useApi";
import { useAppDispatch } from "src/hooks/useAppDispatch";

const useFetchRelationships = () => {
  const api = useApi();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ accountIds }: { accountIds: string[] }) => {
      const ids = accountIds.map((id) => `id[]=${id}`).join("&");

      return api.get(`/api/accounts/relationships?${ids}`);
    },
    async onSuccess(response) {
      dispatch(fetchRelationshipsSuccess(await response.json()));
    },
    onError(error) {
      dispatch(fetchRelationshipsFail(error));
    },
  });
};

export { useFetchRelationships };
