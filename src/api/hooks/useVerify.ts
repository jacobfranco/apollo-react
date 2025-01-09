import { useTransaction } from "src/entity-store/hooks/index";
import { EntityCallbacks } from "src/entity-store/hooks/types";
import { useApi } from "src/hooks/useApi";
import { useGetState } from "src/hooks/useGetState";
import { accountIdsToUsernames } from "src/selectors/index";

import type { Account } from "src/schemas/index";

function useVerify() {
  const api = useApi();
  const getState = useGetState();
  const { transaction } = useTransaction();

  function verifyEffect(accountIds: string[], verified: boolean) {
    const updater = (account: Account): Account => {
      // Update tags
      const tags = account.tags.filter((tag) => tag !== "verified");
      if (verified) {
        tags.push("verified");
      }

      return {
        ...account,
        tags,
        verified,
      };
    };

    transaction({
      Accounts: accountIds.reduce<
        Record<string, (account: Account) => Account>
      >((result, id) => ({ ...result, [id]: updater }), {}),
    });
  }

  async function verify(
    accountIds: string[],
    callbacks?: EntityCallbacks<void, unknown>
  ) {
    const usernames = accountIdsToUsernames(getState(), accountIds);
    verifyEffect(accountIds, true);

    try {
      await api.put("/api/admin/users/tag", {
        nicknames: usernames,
        tags: ["verified"],
      });
      callbacks?.onSuccess?.();
    } catch (e) {
      callbacks?.onError?.(e);
      verifyEffect(accountIds, false);
    }
  }

  async function unverify(
    accountIds: string[],
    callbacks?: EntityCallbacks<void, unknown>
  ) {
    const usernames = accountIdsToUsernames(getState(), accountIds);
    verifyEffect(accountIds, false);

    try {
      await api.request("DELETE", "/api/admin/users/tag", {
        nicknames: usernames,
        tags: ["verified"],
      });
      callbacks?.onSuccess?.();
    } catch (e) {
      callbacks?.onError?.(e);
      verifyEffect(accountIds, true);
    }
  }

  return { verify, unverify };
}

export { useVerify };
