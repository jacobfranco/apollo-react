import { useCallback } from 'react';

import { makeGetAccount } from 'src/selectors';

import { useAppSelector } from './useAppSelector';

export const useOwnAccount = () => {
  const getAccount = useCallback(makeGetAccount(), []);

  const account = useAppSelector((state) =>  {
    const { me } = state;
    console.log('useOwnAccount - state.me:', me);

    if (typeof me === 'string') {
      const result = getAccount(state, me);
      console.log('useOwnAccount - result:', result);
      return result;
    }

    return undefined;
  });

  return { account: account || undefined };
}; 