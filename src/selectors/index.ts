import { createSelector } from 'reselect';

import { 
  List as ImmutableList,
  OrderedSet as ImmutableOrderedSet,
  Map as ImmutableMap
 } from 'immutable'

import { RootState } from "src/store";
import type { Account as AccountSchema } from 'src/schemas';
import { Entities } from 'src/entity-store/entities';
import type { Account, Filter as FilterEntity, Status } from 'src/types/entities';
import { EntityStore } from 'src/entity-store/types';
import { validId } from 'src/utils/auth';
import type { ContextType } from 'src/normalizers/filter';
import { shouldFilter } from 'src/utils/timelines';
import { getSettings } from 'src/actions/settings';

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

  const getAuthUserIds = createSelector([
    (state: RootState) => state.auth.users,
  ], authUsers => {
    return authUsers.reduce((ids: ImmutableOrderedSet<string>, authUser) => {
      try {
        const id = authUser.id;
        return validId(id) ? ids.add(id) : ids;
      } catch {
        return ids;
      }
    }, ImmutableOrderedSet<string>());
  });

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
  
      (statusBase, statusRepost, username, filters, me) => {
        if (!statusBase) return null;
        const { account } = statusBase;
        const accountUsername = account.acct;
  
        // Must be owner of status if username exists.
        if (accountUsername !== username && username !== undefined) {
          return null;
        }
  
        return statusBase.withMutations((map: Status) => {
          map.set('repost', statusRepost || null);
  
          if ( account.id !== me) {
            const filtered = checkFiltered(statusRepost?.search_index || statusBase.search_index, filters);
  
            map.set('filtered', filtered);
          }
        });
      },
    );
  };

  export const makeGetOtherAccounts = () => {
    return createSelector([
      (state: RootState) => state.entities[Entities.ACCOUNTS]?.store as EntityStore<AccountSchema>,
      getAuthUserIds,
      (state: RootState) => state.me,
    ],
    (accounts, authUserIds, me) => {
      return authUserIds
        .reduce((list: ImmutableList<any>, id: string) => {
          if (id === me) return list;
          const account = accounts[id];
          return account ? list.push(account) : list;
        }, ImmutableList());
    });
  };

  type FilterContext = { contextType?: string };

export const getFilters = (state: RootState, query: FilterContext) => {
  return state.filters.filter((filter) => {
    return (!query?.contextType || filter.context.includes(toServerSideType(query.contextType)))
      && (filter.expires_at === null || Date.parse(filter.expires_at) > new Date().getTime());
  });
};

const checkFiltered = (index: string, filters: ImmutableList<FilterEntity>) =>
  filters.reduce((result, filter) =>
    result.concat(filter.keywords.reduce((result, keyword) => {
      let expr = escapeRegExp(keyword.keyword);

      if (keyword.whole_word) {
        if (/^[\w]/.test(expr)) {
          expr = `\\b${expr}`;
        }

        if (/[\w]$/.test(expr)) {
          expr = `${expr}\\b`;
        }
      }

      const regex = new RegExp(expr);

      if (regex.test(index)) return result.concat(filter.title);
      return result;
    }, ImmutableList<string>())), ImmutableList<string>());

    const escapeRegExp = (string: string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

  const toServerSideType = (columnType: string): ContextType => {
    switch (columnType) {
      case 'home':
      case 'notifications':
      case 'public':
      case 'thread':
        return columnType;
      default:
        if (columnType.includes('list:')) {
          return 'home';
        } else {
          return 'public'; // community, account, hashtag
        }
    }
  };

  export const regexFromFilters = (filters: ImmutableList<FilterEntity>) => {
    if (filters.size === 0) return null;
  
    return new RegExp(filters.map(filter =>
      filter.keywords.map(keyword => {
        let expr = escapeRegExp(keyword.keyword);
  
        if (keyword.whole_word) {
          if (/^[\w]/.test(expr)) {
            expr = `\\b${expr}`;
          }
  
          if (/[\w]$/.test(expr)) {
            expr = `${expr}\\b`;
          }
        }
  
        return expr;
      }).join('|'),
    ).join('|'), 'i');
  };

  type ColumnQuery = { type: string; prefix?: string };

  export const makeGetStatusIds = () => createSelector([
    (state: RootState, { type, prefix }: ColumnQuery) => getSettings(state).get(prefix || type, ImmutableMap()),
    (state: RootState, { type }: ColumnQuery) => state.timelines.get(type)?.items || ImmutableOrderedSet(),
    (state: RootState) => state.statuses,
  ], (columnSettings: any, statusIds: ImmutableOrderedSet<string>, statuses) => {
    return statusIds.filter((id: string) => {
      const status = statuses.get(id);
      if (!status) return true;
      return !shouldFilter(status, columnSettings);
    });
  });

  export const accountIdsToAccts = (state: RootState, ids: string[]) => ids.map((id) => selectAccount(state, id)!.acct);