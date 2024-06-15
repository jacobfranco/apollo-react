import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Entities } from 'src/entity-store/entities';
import { useEntityLookup } from 'src/entity-store/hooks';
import { useLoggedIn } from 'src/hooks';
import { useApi } from 'src/hooks/useApi';
import { type Account, accountSchema } from 'src/schemas';

import { useRelationship } from './useRelationship';

interface UseAccountLookupOpts {
  withRelationship?: boolean;
}

function useAccountLookup(id: string | undefined, opts: UseAccountLookupOpts = {}) {
  const api = useApi();
  const history = useHistory();
  const { me } = useLoggedIn();
  const { withRelationship } = opts;

  const { entity: account, isUnauthorized, ...result } = useEntityLookup<Account>(
    Entities.ACCOUNTS,
    (account) => account.id === id,
    () => api.get(`/api/v1/accounts/lookup?id=${id}`),
    { schema: accountSchema, enabled: !!id },
  );

  const {
    relationship,
    isLoading: isRelationshipLoading,
  } = useRelationship(account?.id, { enabled: withRelationship });

  const isBlocked = account?.relationship?.blocked_by === true;
  const isUnavailable = false; // TODO: Maybe change

  useEffect(() => {
    if (isUnauthorized) {
      history.push('/login');
    }
  }, [isUnauthorized]);

  return {
    ...result,
    isLoading: result.isLoading,
    isRelationshipLoading,
    isUnauthorized,
    isUnavailable,
    account: account ? { ...account, relationship } : undefined,
  };
}

export { useAccountLookup };
