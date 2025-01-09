import { useTransaction } from "src/entity-store/hooks";
import { EntityCallbacks } from "src/entity-store/hooks/types";
import { useApi } from "src/hooks/useApi";
import { useGetState } from "src/hooks/useGetState";
import { accountIdsToUsernames } from "src/selectors/index";

import type { Account } from "src/schemas/index";

function useSuggest() {
  const api = useApi();
  const getState = useGetState();
  const { transaction } = useTransaction();

  function suggestEffect(accountIds: string[], suggested: boolean) {
    const updater = (account: Account): Account => {
      account.is_suggested = suggested;
      return account;
    };

    transaction({
      Accounts: accountIds.reduce<
        Record<string, (account: Account) => Account>
      >((result, id) => ({ ...result, [id]: updater }), {}),
    });
  }

  async function suggest(
    accountIds: string[],
    callbacks?: EntityCallbacks<void, unknown>
  ) {
    const usernames = accountIdsToUsernames(getState(), accountIds);
    suggestEffect(accountIds, true);

    try {
      await api.patch("/api/admin/users/suggest", { nicknames: usernames });
      callbacks?.onSuccess?.();
    } catch (e) {
      callbacks?.onError?.(e);
      suggestEffect(accountIds, false);
    }
  }

  async function unsuggest(
    accountIds: string[],
    callbacks?: EntityCallbacks<void, unknown>
  ) {
    const usernames = accountIdsToUsernames(getState(), accountIds);
    suggestEffect(accountIds, false);

    try {
      await api.patch("/api/admin/users/unsuggest", { nicknames: usernames });
      callbacks?.onSuccess?.();
    } catch (e) {
      callbacks?.onError?.(e);
      suggestEffect(accountIds, true);
    }
  }

  return { suggest, unsuggest };
}

export { useSuggest };
