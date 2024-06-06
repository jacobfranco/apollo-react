/**
 * Admin account normalizer:
 * Converts API admin-level account information into our internal format.
 */
import {
    Map as ImmutableMap,
    List as ImmutableList,
    Record as ImmutableRecord,
    fromJS,
  } from 'immutable';
  
  import type { ReducerAccount } from 'src/reducers/accounts';
  import type { Account, EmbeddedEntity } from 'src/types/entities';
  
  export const AdminAccountRecord = ImmutableRecord({
    account: null as EmbeddedEntity<Account | ReducerAccount>,
    approved: false,
    confirmed: false,
    created_at: new Date(),
    disabled: false,
    email: '',
    id: '',
    invite_request: null as string | null,
    ip: null as string | null,
    ips: ImmutableList<string>(),
    locale: null as string | null,
    role: null as 'admin' | 'moderator' | null,
    sensitized: false,
    silenced: false,
    suspended: false,
    username: '',
  });
  
  
  export const normalizeAdminAccount = (account: Record<string, any>) => {
    return AdminAccountRecord(
      ImmutableMap(fromJS(account)));
  };