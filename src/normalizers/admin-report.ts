/**
 * Admin report normalizer:
 * Converts API admin-level report information into our internal format.
 */
import {
  Map as ImmutableMap,
  List as ImmutableList,
  Record as ImmutableRecord,
  fromJS,
} from "immutable";

import type { ReducerAccount } from "src/reducers/accounts";
import type { Account, EmbeddedEntity, Status } from "src/types/entities";

export const AdminReportRecord = ImmutableRecord({
  account: null as EmbeddedEntity<Account | ReducerAccount>,
  action_taken: false,
  action_taken_by_account: null as EmbeddedEntity<
    Account | ReducerAccount
  > | null,
  assigned_account: null as EmbeddedEntity<Account | ReducerAccount> | null,
  category: "",
  comment: "",
  created_at: new Date(),
  id: "",
  rules: ImmutableList<string>(),
  status_ids: ImmutableList<string>(),
  statuses: ImmutableList<EmbeddedEntity<Status>>(),
  target_account: null as EmbeddedEntity<Account | ReducerAccount>,
  updated_at: new Date(),
});

export const normalizeAdminReport = (report: Record<string, any>) => {
  return AdminReportRecord(ImmutableMap(fromJS(report)));
};
