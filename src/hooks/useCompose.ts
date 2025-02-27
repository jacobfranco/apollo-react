import { useAppSelector } from './useAppSelector';

import type { ReducerCompose } from 'src/reducers/compose';

/** Get compose for given key with fallback to 'default' */
export const useCompose = <ID extends string>(composeId: ID extends 'default' ? never : ID): ReturnType<typeof ReducerCompose> => {
  return useAppSelector((state) => state.compose.get(composeId, state.compose.get('default')!));
};