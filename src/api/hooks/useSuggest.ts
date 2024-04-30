import { useTransaction } from 'src/entity-store/hooks';
import { EntityCallbacks } from 'src/entity-store/hooks/types';
import { useApi, useGetState } from 'src/hooks';
import { accountIdsToAccts } from 'src/selectors';

import type { Account } from 'src/schemas';

function useSuggest() {
  const api = useApi();
  const getState = useGetState();
  const { transaction } = useTransaction();

  function suggestEffect(accountIds: string[], suggested: boolean) {
    const updater = (account: Account): Account => {
      return account;
    };

    transaction({
      Accounts: accountIds.reduce<Record<string, (account: Account) => Account>>(
        (result, id) => ({ ...result, [id]: updater }),
      {}),
    });
  }

  async function suggest(accountIds: string[], callbacks?: EntityCallbacks<void, unknown>) {
    const accts = accountIdsToAccts(getState(), accountIds);
    suggestEffect(accountIds, true);
    try {
      await api.patch('/api/pleroma/admin/users/suggest', { nicknames: accts });
      callbacks?.onSuccess?.();
    } catch (e) {
      callbacks?.onError?.(e);
      suggestEffect(accountIds, false);
    }
  }

  async function unsuggest(accountIds: string[], callbacks?: EntityCallbacks<void, unknown>) {
    const accts = accountIdsToAccts(getState(), accountIds);
    suggestEffect(accountIds, false);
    try {
      await api.patch('/api/pleroma/admin/users/unsuggest', { nicknames: accts });
      callbacks?.onSuccess?.();
    } catch (e) {
      callbacks?.onError?.(e);
      suggestEffect(accountIds, true);
    }
  }

  return {
    suggest,
    unsuggest,
  };
}

export { useSuggest };