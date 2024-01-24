import { createSelector } from 'reselect';

import { RootState } from "src/store";
import type { Account as AccountSchema } from 'src/schemas';
import { Entities } from 'src/entity-store/entities';
import type { Account } from 'src/types/entities';

export function selectAccount(state: RootState, accountId: string) {
    return state.entities[Entities.ACCOUNTS]?.store[accountId] as AccountSchema | undefined;
  }

  export function selectOwnAccount(state: RootState) {
    if (state.me) {
      return selectAccount(state, state.me);
    }
  }

  const getAccountBase         = (state: RootState, id: string) => state.entities[Entities.ACCOUNTS]?.store[id] as Account | undefined;
  const getAccountRelationship = (state: RootState, id: string) => state.relationships.get(id); 

  export const makeGetAccount = () => {
    return createSelector([
      getAccountBase,
      getAccountRelationship,
    ], (account, relationship) => {
      if (!account) return null;
      return { ...account, relationship };
    });
  };