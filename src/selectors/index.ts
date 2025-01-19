import { createSelector } from "reselect";

import {
  List as ImmutableList,
  OrderedSet as ImmutableOrderedSet,
  Map as ImmutableMap,
  fromJS,
  Record,
} from "immutable";

import { RootState } from "src/store";
import type { Account as AccountSchema } from "src/schemas";
import { Entities } from "src/entity-store/entities";
import type {
  Account,
  EmbeddedEntity,
  Filter as FilterEntity,
  Notification,
  Status,
} from "src/types/entities";
import { EntityStore } from "src/entity-store/types";
import { validId } from "src/utils/auth";
import type { ContextType } from "src/normalizers/filter";
import { shouldFilter } from "src/utils/timelines";
import { getSettings } from "src/actions/settings";
import { Series } from "src/schemas/series";
import { Match } from "src/schemas/match";
import { ReducerStatus } from "src/reducers/statuses";
import { AdminReportRecord } from "src/normalizers";
import { ReducerAccount } from "src/reducers/accounts";

const normalizeId = (id: any): string => (typeof id === "string" ? id : "");

export function selectAccount(state: RootState, accountId: string) {
  return state.entities[Entities.ACCOUNTS]?.store[accountId] as
    | AccountSchema
    | undefined;
}

export function selectOwnAccount(state: RootState) {
  if (state.me) {
    return selectAccount(state, state.me);
  }
}

export const accountIdsToUsernames = (state: RootState, ids: string[]) =>
  ids.map((id) => selectAccount(state, id)!.username);

const getAccountBase = (state: RootState, id: string) =>
  state.entities[Entities.ACCOUNTS]?.store[id] as Account | undefined;
const getAccountRelationship = (state: RootState, id: string) =>
  state.relationships.get(id);

export const makeGetAccount = () => {
  return createSelector(
    [getAccountBase, getAccountRelationship],
    (account, relationship) => {
      if (!account) return null;
      return {
        ...account,
        relationship,
      };
    }
  );
};

type APIStatus = { id: string; username?: string };

export const makeGetStatus = () => {
  return createSelector(
    [
      (state: RootState, { id }: APIStatus) =>
        state.statuses.get(id) as Status | undefined,
      (state: RootState, { id }: APIStatus) =>
        state.statuses.get(state.statuses.get(id)?.repost || "") as
          | Status
          | undefined,
      (_state: RootState, { username }: APIStatus) => username,
      getFilters,
      (state: RootState) => state.me,
    ],

    (statusBase, statusRepost, username, filters, me) => {
      // Logging the IDs involved
      const primaryId = statusBase ? statusBase.id : "undefined";
      const repostId = statusRepost ? statusRepost.id : "undefined";
      console.log(
        `Selector invoked with ID: ${primaryId}, Repost ID: ${repostId}`
      );

      if (!statusBase) return null;
      const { account } = statusBase;
      const accountUsername = account.username;

      // Must be owner of status if username exists.
      if (accountUsername !== username && username !== undefined) {
        return null;
      }

      return statusBase.withMutations((map: Status) => {
        map.set("repost", statusRepost || null);

        if (account.id !== me) {
          const filtered = checkFiltered(
            statusRepost?.search_index || statusBase.search_index,
            filters
          );

          map.set("filtered", filtered);
        }
      });
    }
  );
};

export function makeGetOtherAccounts() {
  return createSelector(
    [
      (state: RootState) =>
        state.entities[Entities.ACCOUNTS]?.store as EntityStore<AccountSchema>,
      (state: RootState) => state.auth.users,
      (state: RootState) => state.me,
    ],
    (store, authUsers, me): AccountSchema[] => {
      const accountIds = Object.values(authUsers).map(
        (authUser) => authUser.id
      );

      return accountIds.reduce<AccountSchema[]>((accounts, id: string) => {
        if (id === me) return accounts;

        const account = store[id];
        if (account) {
          accounts.push(account);
        }

        return accounts;
      }, []);
    }
  );
}

type FilterContext = { contextType?: string };

export const getFilters = (state: RootState, query: FilterContext) => {
  return state.filters.filter((filter) => {
    return (
      (!query?.contextType ||
        filter.context.includes(toServerSideType(query.contextType))) &&
      (filter.expires_at === null ||
        Date.parse(filter.expires_at) > new Date().getTime())
    );
  });
};

const checkFiltered = (index: string, filters: ImmutableList<FilterEntity>) =>
  filters.reduce(
    (result, filter) =>
      result.concat(
        filter.keywords.reduce((result, keyword) => {
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
        }, ImmutableList<string>())
      ),
    ImmutableList<string>()
  );

const escapeRegExp = (string: string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string

const toServerSideType = (columnType: string): ContextType => {
  switch (columnType) {
    case "home":
    case "notifications":
    case "public":
    case "thread":
      return columnType;
    default:
      if (columnType.includes("list:")) {
        return "home";
      } else {
        return "public"; // community, account, hashtag
      }
  }
};

export const regexFromFilters = (filters: ImmutableList<FilterEntity>) => {
  if (filters.size === 0) return null;

  return new RegExp(
    filters
      .map((filter) =>
        filter.keywords
          .map((keyword) => {
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
          })
          .join("|")
      )
      .join("|"),
    "i"
  );
};

type ColumnQuery = { type: string; prefix?: string };

export const makeGetStatusIds = () =>
  createSelector(
    [
      (state: RootState, { type, prefix }: ColumnQuery) =>
        getSettings(state).get(prefix || type, ImmutableMap()),
      (state: RootState, { type }: ColumnQuery) =>
        state.timelines.get(type)?.items || ImmutableOrderedSet(),
      (state: RootState) => state.statuses,
    ],
    (columnSettings: any, statusIds: ImmutableOrderedSet<string>, statuses) => {
      return statusIds.filter((id: string) => {
        const status = statuses.get(id);
        if (!status) return true;
        return !shouldFilter(status, columnSettings);
      });
    }
  );

export const makeGetNotification = () => {
  return createSelector(
    [
      (_state: RootState, notification: Notification) => notification,
      (state: RootState, notification: Notification) =>
        selectAccount(state, normalizeId(notification.account)),
      (state: RootState, notification: Notification) =>
        selectAccount(state, normalizeId(notification.target)),
      (state: RootState, notification: Notification) =>
        state.statuses.get(normalizeId(notification.status)),
    ],
    (notification, account, target, status) => {
      return notification.merge({
        // @ts-ignore
        account: account || null,
        // @ts-ignore
        target: target || null,
        // @ts-ignore
        status: status || null,
      });
    }
  );
};

export const getAccountGallery = createSelector(
  [
    (state: RootState, id: string) =>
      state.timelines.get(`account:${id}:media`)?.items ||
      ImmutableOrderedSet<string>(),
    (state: RootState) => state.statuses,
  ],
  (statusIds, statuses) => {
    return statusIds.reduce((medias: ImmutableList<any>, statusId: string) => {
      const status = statuses.get(statusId);
      if (!status) return medias;
      if (status.repost) return medias;

      return medias.concat(
        status.media_attachments.map((media) =>
          media.merge({ status, account: status.account })
        )
      );
    }, ImmutableList());
  }
);

export const getSpaceMediaGallery = createSelector(
  [
    (state: RootState, spacePath: string) =>
      state.timelines.get(`space:${spacePath}:media`)?.items ||
      ImmutableOrderedSet<string>(),
    (state: RootState) => state.statuses,
  ],
  (statusIds, statuses) => {
    return statusIds.reduce((medias: ImmutableList<any>, statusId: string) => {
      const status = statuses.get(statusId);
      if (!status) return medias;
      if (status.repost) return medias;

      // Add the media attachments to the beginning of the list instead of the end
      return medias.unshift(
        ...status.media_attachments.map((media) =>
          media.merge({ status, account: status.account })
        )
      );
    }, ImmutableList());
  }
);

export const makeGetReport = () => {
  const getStatus = makeGetStatus();

  return createSelector(
    [
      (state: RootState, id: string) => {
        const report = state.admin.reports.get(id);
        console.log(
          "makeGetReport - Retrieved Report:",
          report?.toJS() || "No Report Found"
        );
        return report;
      },
      (state: RootState, id: string) => {
        const report = state.admin.reports.get(id);
        const statusIds = report?.get("status_ids") || ImmutableList();
        console.log("makeGetReport - Status IDs:", statusIds.toJS());

        const statuses = statusIds
          .map((statusId) => {
            const status = getStatus(state, { id: statusId });
            console.log(
              `makeGetReport - Status for ID ${statusId}:`,
              status?.toJS() || "No Status Found"
            );
            return status || null;
          })
          .filter(Boolean) as ImmutableList<EmbeddedEntity<Status>>;

        console.log(
          "makeGetReport - Final statuses list in selector:",
          statuses.toJS()
        );
        return statuses;
      },
    ],
    (report, statuses) => {
      if (!report) return null;

      const result = AdminReportRecord().merge({
        id: report.get("id"),
        account: report.get("account"),
        target_account: report.get("target_account"),
        action_taken: report.get("action_taken"),
        action_taken_by_account: report.get("action_taken_by_account"),
        assigned_account: report.get("assigned_account"),
        category: report.get("category"),
        comment: report.get("comment"),
        created_at: report.get("created_at"),
        rules: report.get("rules"),
        status_ids: report.get("status_ids"),
        statuses,
        updated_at: report.get("updated_at"),
      });

      console.log("makeGetReport - Final Report Object:", result.toJS());
      return result;
    }
  );
};

export const selectSeriesState = (state: RootState) => state.series;

export const selectSeriesByWeek = createSelector(
  selectSeriesState,
  (seriesState) => seriesState.get("seriesByWeek").toList()
);

export const selectSeriesByIdMap = createSelector(
  selectSeriesState,
  (seriesState) => seriesState.get("seriesById")
);

export const selectSeriesLoading = createSelector(
  selectSeriesState,
  (seriesState) => seriesState.get("loading")
);

export const selectSeriesError = createSelector(
  selectSeriesState,
  (seriesState) => seriesState.get("error")
);

export const selectSeriesById = (
  state: RootState,
  seriesId: number
): Series | undefined => {
  const seriesById = state.series.get("seriesById");
  const seriesByWeek = state.series.get("seriesByWeek");
  return seriesById.get(seriesId) || seriesByWeek.get(seriesId);
};

export const selectSeriesListByIds = (
  state: RootState,
  ids: number[]
): Series[] => {
  const seriesById = state.series.get("seriesById");
  const seriesByWeek = state.series.get("seriesByWeek");

  return ids
    .map((id) => seriesById.get(id) || seriesByWeek.get(id))
    .filter((series): series is Series => series !== undefined);
};

export const selectHasFetchedSeriesById = (
  state: RootState,
  seriesId: number
): boolean => {
  return state.series.get("fetchedSeriesIds").get(seriesId) ?? false;
};

export const selectMatchesState = (state: RootState) => state.matches;

export const selectMatchById = (
  state: RootState,
  matchId: number
): Match | undefined => {
  const matchesState = selectMatchesState(state);
  return matchesState ? matchesState[matchId] : undefined;
};

export const selectTeamsState = (state: RootState) => state.teams;

export const selectTeamsById = createSelector(selectTeamsState, (teamsState) =>
  teamsState.get("teamsById")
);

export const selectTeamsLoading = createSelector(
  selectTeamsState,
  (teamsState) => teamsState.get("loading")
);

export const selectTeamsError = createSelector(selectTeamsState, (teamsState) =>
  teamsState.get("error")
);

export const selectTeamsList = createSelector(selectTeamsById, (teamsById) =>
  teamsById.toList().toArray()
);

export const selectTeamById = (state: RootState, teamId: number) => {
  const teamsById = selectTeamsById(state);
  return teamsById.get(teamId);
};

export const selectTeamLoading = (state: RootState, teamId: number) => {
  const loadingTeamIds = state.teams.get("loadingTeamIds");
  return loadingTeamIds.has(teamId);
};

export const selectTeamError = (state: RootState, teamId: number) => {
  const teamErrors = state.teams.get("teamErrors");
  return teamErrors.get(teamId);
};

// Select Players State
export const selectPlayersState = (state: RootState) => state.players;

// Select Players by ID
export const selectPlayersById = createSelector(
  selectPlayersState,
  (playersState) => playersState.get("playersById")
);

// Select Loading State
export const selectPlayersLoading = createSelector(
  selectPlayersState,
  (playersState) => playersState.get("loading")
);

// Select Error State
export const selectPlayersError = createSelector(
  selectPlayersState,
  (playersState) => playersState.get("error")
);

// Select Players List as Array
export const selectPlayersList = createSelector(
  selectPlayersById,
  (playersById) => playersById.toList().toArray()
);

// Select Player by ID
export const selectPlayerById = (state: RootState, playerId: number) => {
  const playersById = selectPlayersById(state);
  return playersById.get(playerId);
};

export const selectPlayersByRosterId = (state: RootState, rosterId: number) => {
  const playersByRosterId = state.players.get("playersByRosterId");
  const playerIds = playersByRosterId.get(rosterId) || [];
  const playersById = state.players.get("playersById");
  return playerIds.map((id) => playersById.get(id)).filter(Boolean);
};

export const selectRosterPlayersLoading = (
  state: RootState,
  rosterId: number
): boolean => {
  return (state.players.getIn(["rosterLoading", rosterId]) as boolean) ?? false;
};

export const selectRosterPlayersError = (
  state: RootState,
  rosterId: number
): string | null => {
  return (state.players.getIn(["rosterError", rosterId]) as string) ?? null;
};

export const hasFetchedPlayersByRosterId = (
  state: RootState,
  rosterId: number
): boolean => {
  return state.players.get("playersByRosterId").has(rosterId);
};
