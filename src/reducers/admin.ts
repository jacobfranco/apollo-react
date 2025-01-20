import {
  Map as ImmutableMap,
  List as ImmutableList,
  Record as ImmutableRecord,
  OrderedSet as ImmutableOrderedSet,
} from "immutable";

import {
  ADMIN_REPORTS_FETCH_SUCCESS,
  ADMIN_REPORTS_PATCH_REQUEST,
  ADMIN_REPORTS_PATCH_SUCCESS,
  ADMIN_USERS_FETCH_SUCCESS,
  ADMIN_USERS_DELETE_REQUEST,
  ADMIN_USERS_DELETE_SUCCESS,
  ADMIN_SPACES_FETCH_SUCCESS,
  ADMIN_SPACE_CREATE_SUCCESS,
  ADMIN_SPACE_DELETE_SUCCESS,
  ADMIN_SPACE_UPDATE_SUCCESS,
} from "src/actions/admin";
import {
  AdminReportRecord,
  normalizeAccount,
  normalizeAdminReport,
  normalizeSpace,
} from "src/normalizers/index";
import { normalizeId } from "src/utils/normalizers";

import type { AnyAction } from "redux";
import type { APIEntity, Space } from "src/types/entities";
import { ReducerAccount } from "./accounts";

const ReducerRecord = ImmutableRecord({
  reports: ImmutableMap<string, ReducerAdminReport>(),
  openReports: ImmutableOrderedSet<string>(),
  users: ImmutableMap<string, ReducerAccount>(),
  latestUsers: ImmutableOrderedSet<string>(),
  awaitingApproval: ImmutableOrderedSet<string>(),
  needsReboot: false,
  spaces: ImmutableMap<string, Space>(),
});

type State = ReturnType<typeof ReducerRecord>;

type AdminReportRecord = ReturnType<typeof normalizeAdminReport>;
type AccountRecord = ReturnType<typeof normalizeAccount>;

export interface ReducerAdminReport extends AdminReportRecord {
  account: string | null;
  target_account: string | null;
  action_taken_by_account: string | null;
  assigned_account: string | null;
  statuses: ImmutableList<string | null>;
}

// Lol https://javascript.plainenglish.io/typescript-essentials-conditionally-filter-types-488705bfbf56
type FilterConditionally<Source, Condition> = Pick<
  Source,
  { [K in keyof Source]: Source[K] extends Condition ? K : never }[keyof Source]
>;

type SetKeys = keyof FilterConditionally<State, ImmutableOrderedSet<string>>;

type APIReport = { id: string; state: string; statuses: any[] };
type APIUser = {
  id: string;
  email: string;
  nickname: string;
  registration_reason: string;
};

type Filters = Record<string, boolean>;

const toIds = (items: any[]) => items.map((item) => item.id);

const mergeSet = (state: State, key: SetKeys, users: APIUser[]): State => {
  const newIds = toIds(users);
  return state.update(key, (ids: ImmutableOrderedSet<string>) =>
    ids.union(newIds)
  );
};

const replaceSet = (state: State, key: SetKeys, users: APIUser[]): State => {
  const newIds = toIds(users);
  return state.set(key, ImmutableOrderedSet(newIds));
};

const maybeImportUnapproved = (
  state: State,
  users: APIUser[],
  filters: Filters
): State => {
  if (filters.pending) {
    return mergeSet(state, "awaitingApproval", users);
  } else {
    return state;
  }
};

const maybeImportLatest = (
  state: State,
  users: APIUser[],
  filters: Filters,
  page: number
): State => {
  if (page === 1 && !filters.pending) {
    return replaceSet(state, "latestUsers", users);
  } else {
    return state;
  }
};

const minifyUser = (user: AccountRecord): ReducerAccount => {
  return user.mergeWith((o, n) => n || o) as ReducerAccount;
};

const fixUser = (user: APIEntity): ReducerAccount => {
  return normalizeAccount(user).withMutations((user) => {
    minifyUser(user);
  }) as ReducerAccount;
};

function importUsers(
  state: State,
  users: APIUser[],
  filters: Filters,
  page: number
): State {
  return state.withMutations((state) => {
    maybeImportUnapproved(state, users, filters);
    maybeImportLatest(state, users, filters, page);

    users.forEach((user) => {
      const normalizedUser = fixUser(user);
      state.setIn(["users", user.id], normalizedUser);
    });
  });
}

function importReports(state: State, reports: APIEntity[]): State {
  return state.withMutations((mutableState) => {
    reports.forEach((report) => {
      // Import accounts into users map
      if (report.account) {
        mutableState.setIn(["users", report.account.id], report.account);
      }
      if (report.target_account) {
        mutableState.setIn(
          ["users", report.target_account.id],
          report.target_account
        );
      }

      // Then normalize and import the report
      const normalized = normalizeAdminReport(report);

      if (!normalized.action_taken) {
        mutableState.update("openReports", (orderedSet) =>
          orderedSet.add(report.id)
        );
      }

      mutableState.setIn(["reports", report.id], AdminReportRecord(normalized));
    });
  });
}

function handleReportDiffs(state: State, reports: APIReport[]) {
  // Note: the reports here aren't full report objects
  // hence the need for a new function.
  return state.withMutations((state) => {
    reports.forEach((report) => {
      switch (report.state) {
        case "open":
          state.update("openReports", (orderedSet) =>
            orderedSet.add(report.id)
          );
          break;
        default:
          state.update("openReports", (orderedSet) =>
            orderedSet.delete(report.id)
          );
      }
    });
  });
}

function importSpaces(state: State, spaces: APIEntity[]): State {
  return state.withMutations((mutableState) => {
    spaces.forEach((space) => {
      const normalized = normalizeSpace(space);
      mutableState.setIn(["spaces", normalized.id], normalized);
    });
  });
}

export default function admin(
  state: State = ReducerRecord(),
  action: AnyAction
): State {
  console.log("Admin reducer received action:", action.type);
  switch (action.type) {
    case ADMIN_REPORTS_FETCH_SUCCESS:
      console.log("Processing FETCH_SUCCESS with reports:", action.reports);
      const newState = importReports(state, action.reports);
      console.log("State after importReports:", newState.toJS());
      return newState;
    case ADMIN_REPORTS_PATCH_REQUEST:
    case ADMIN_REPORTS_PATCH_SUCCESS:
      return handleReportDiffs(state, action.reports);
    case ADMIN_USERS_FETCH_SUCCESS:
      return importUsers(state, action.accounts, action.filters, action.page);
    case ADMIN_USERS_DELETE_REQUEST:
    case ADMIN_USERS_DELETE_SUCCESS:
    case ADMIN_SPACES_FETCH_SUCCESS:
      return importSpaces(state, action.spaces);
    case ADMIN_SPACE_CREATE_SUCCESS:
      return state.setIn(
        ["spaces", action.space.id],
        normalizeSpace(action.space)
      );
    case ADMIN_SPACE_UPDATE_SUCCESS:
      return state.setIn(
        ["spaces", action.space.id],
        normalizeSpace(action.space)
      );
    case ADMIN_SPACE_DELETE_SUCCESS:
      return state.deleteIn(["spaces", action.id]);
    default:
      return state;
  }
}
