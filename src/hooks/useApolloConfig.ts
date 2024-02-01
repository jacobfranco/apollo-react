import { getApolloConfig } from 'src/actions/apollo';

import { useAppSelector } from './useAppSelector';

import type { ApolloConfig } from 'src/types/apollo';

/** Get the Soapbox config from the store */
export const useApolloConfig = (): ApolloConfig => {
  return useAppSelector((state) => getApolloConfig(state));
};