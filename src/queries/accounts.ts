import { useMutation } from "@tanstack/react-query";

import { patchMeSuccess } from "src/actions/me";
import { useApi } from "src/hooks/useApi";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useOwnAccount } from "src/hooks/useOwnAccount";
import toast from "src/toast";

export type IAccount = {
  avatar: string;
  avatar_static: string;
  bot: boolean;
  created_at: string;
  discoverable: boolean;
  display_name: string;
  followers_count: number;
  following_count: number;
  group: boolean;
  header: string;
  header_static: string;
  id: string;
  last_status_at: string;
  location: string;
  locked: boolean;
  note: string;
  statuses_count: number;
  url: string;
  username: string;
  verified: boolean;
  website: string;
};

type UpdateCredentialsData = {
  accepts_chat_messages?: boolean;
  chats_onboarded?: boolean;
};

const useUpdateCredentials = () => {
  const { account } = useOwnAccount();
  const api = useApi();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: UpdateCredentialsData) =>
      api.patch("/api/accounts/update_credentials", data),
    onMutate(variables) {
      const cachedAccount = account;
      dispatch(patchMeSuccess({ ...account, ...variables }));

      return { cachedAccount };
    },
    async onSuccess(response) {
      dispatch(patchMeSuccess(await response.json()));
      toast.success("Chat Settings updated successfully");
    },
    onError(_error, _variables, context: any) {
      toast.error("Chat Settings failed to update.");
      dispatch(patchMeSuccess(context.cachedAccount));
    },
  });
};

export { useUpdateCredentials };
