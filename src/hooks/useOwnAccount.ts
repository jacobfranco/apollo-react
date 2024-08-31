import { useCallback } from 'react';

import { makeGetAccount } from 'src/selectors';

import { useAppSelector } from './useAppSelector';

export const useOwnAccount = () => {
  const getAccount = useCallback(makeGetAccount(), []);

  const account = useAppSelector((state) => {
    const { me } = state;

    if (typeof me === 'string') {
      const result = getAccount(state, me);
      return result;
    }

    return undefined;
  });

  return { account: account || undefined };
}; 