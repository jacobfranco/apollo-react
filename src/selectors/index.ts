import { createSelector } from 'reselect';

import { RootState } from "src/store";
import type { Account as AccountSchema } from 'src/schemas';
import { Entities } from 'src/entity-store/entities';
import type { Account, Status } from 'src/types/entities';

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

  type APIStatus = { id: string; username?: string };

  export const makeGetStatus = () => {
    return createSelector(
      [
        (state: RootState, { id }: APIStatus) => state.statuses.get(id) as Status | undefined,
        (state: RootState, { id }: APIStatus) => state.statuses.get(state.statuses.get(id)?.repost || '') as Status | undefined,
        (_state: RootState, { username }: APIStatus) => username,
        getFilters,
        (state: RootState) => state.me,
      ],
  
      (statusBase, statusRepost, username, filters, me, features) => {
        if (!statusBase) return null;
        const { account } = statusBase;
        const accountUsername = account.acct;
  
        // Must be owner of status if username exists.
        if (accountUsername !== username && username !== undefined) {
          return null;
        }
  
        return statusBase.withMutations((map: Status) => {
          map.set('repost', statusRepost || null);
  
          if ((features.filters) && account.id !== me) {
            const filtered = checkFiltered(statusRepost?.search_index || statusBase.search_index, filters);
  
            map.set('filtered', filtered);
          }
        });
      },
    );
  };