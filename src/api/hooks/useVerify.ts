import { useTransaction } from 'src/entity-store/hooks';
import { EntityCallbacks } from 'src/entity-store/hooks/types';
import { useApi, useGetState } from 'src/hooks';
import { accountIdsToAccts } from 'src/selectors';

import type { Account } from 'src/schemas';

function useVerify() {
  const api = useApi();
  const getState = useGetState();
  const { transaction } = useTransaction();

  function verifyEffect(accountIds: string[], verified: boolean) {
    const updater = (account: Account): Account => {
      account.verified = verified;
      return account;
    };

    transaction({
      Accounts: accountIds.reduce<Record<string, (account: Account) => Account>>(
        (result, id) => ({ ...result, [id]: updater }),
      {}),
    });
  }

  async function verify(accountIds: string[], callbacks?: EntityCallbacks<void, unknown>) {
    const accts = accountIdsToAccts(getState(), accountIds);
    verifyEffect(accountIds, true);
    try {
      await api.put('/api/v1/pleroma/admin/users/tag', { nicknames: accts, tags: ['verified'] });
      callbacks?.onSuccess?.();
    } catch (e) {
      callbacks?.onError?.(e);
      verifyEffect(accountIds, false);
    }
  }

  async function unverify(accountIds: string[], callbacks?: EntityCallbacks<void, unknown>) {
    const accts = accountIdsToAccts(getState(), accountIds);
    verifyEffect(accountIds, false);
    try {
      await api.delete('/api/v1/pleroma/admin/users/tag', { data: { nicknames: accts, tags: ['verified'] } });
      callbacks?.onSuccess?.();
    } catch (e) {
      callbacks?.onError?.(e);
      verifyEffect(accountIds, true);
    }
  }

  return {
    verify,
    unverify,
  };
}

export { useVerify };