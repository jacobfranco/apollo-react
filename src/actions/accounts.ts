import { HTTPError } from "src/api/HTTPError";
import { importEntities } from "src/entity-store/actions";
import { Entities } from "src/entity-store/entities";
import { selectAccount } from "src/selectors/index";
import { isLoggedIn } from "src/utils/auth";

import api from "../api/index";

import {
  importFetchedAccount,
  importFetchedAccounts,
  importErrorWhileFetchingAccountByUsername,
} from "./importer";

import type { Map as ImmutableMap } from "immutable";
import type { AppDispatch, RootState } from "src/store";
import type { APIEntity, Status } from "src/types/entities";
import type { History } from "src/types/history";

const ACCOUNT_CREATE_REQUEST = "ACCOUNT_CREATE_REQUEST";
const ACCOUNT_CREATE_SUCCESS = "ACCOUNT_CREATE_SUCCESS";
const ACCOUNT_CREATE_FAIL = "ACCOUNT_CREATE_FAIL";

const ACCOUNT_FETCH_REQUEST = "ACCOUNT_FETCH_REQUEST";
const ACCOUNT_FETCH_SUCCESS = "ACCOUNT_FETCH_SUCCESS";
const ACCOUNT_FETCH_FAIL = "ACCOUNT_FETCH_FAIL";

const ACCOUNT_BLOCK_REQUEST = "ACCOUNT_BLOCK_REQUEST";
const ACCOUNT_BLOCK_SUCCESS = "ACCOUNT_BLOCK_SUCCESS";
const ACCOUNT_BLOCK_FAIL = "ACCOUNT_BLOCK_FAIL";

const ACCOUNT_UNBLOCK_REQUEST = "ACCOUNT_UNBLOCK_REQUEST";
const ACCOUNT_UNBLOCK_SUCCESS = "ACCOUNT_UNBLOCK_SUCCESS";
const ACCOUNT_UNBLOCK_FAIL = "ACCOUNT_UNBLOCK_FAIL";

const ACCOUNT_MUTE_REQUEST = "ACCOUNT_MUTE_REQUEST";
const ACCOUNT_MUTE_SUCCESS = "ACCOUNT_MUTE_SUCCESS";
const ACCOUNT_MUTE_FAIL = "ACCOUNT_MUTE_FAIL";

const ACCOUNT_UNMUTE_REQUEST = "ACCOUNT_UNMUTE_REQUEST";
const ACCOUNT_UNMUTE_SUCCESS = "ACCOUNT_UNMUTE_SUCCESS";
const ACCOUNT_UNMUTE_FAIL = "ACCOUNT_UNMUTE_FAIL";

const ACCOUNT_REMOVE_FROM_FOLLOWERS_REQUEST =
  "ACCOUNT_REMOVE_FROM_FOLLOWERS_REQUEST";
const ACCOUNT_REMOVE_FROM_FOLLOWERS_SUCCESS =
  "ACCOUNT_REMOVE_FROM_FOLLOWERS_SUCCESS";
const ACCOUNT_REMOVE_FROM_FOLLOWERS_FAIL = "ACCOUNT_REMOVE_FROM_FOLLOWERS_FAIL";

const ACCOUNT_SEARCH_REQUEST = "ACCOUNT_SEARCH_REQUEST";
const ACCOUNT_SEARCH_SUCCESS = "ACCOUNT_SEARCH_SUCCESS";
const ACCOUNT_SEARCH_FAIL = "ACCOUNT_SEARCH_FAIL";

const ACCOUNT_LOOKUP_REQUEST = "ACCOUNT_LOOKUP_REQUEST";
const ACCOUNT_LOOKUP_SUCCESS = "ACCOUNT_LOOKUP_SUCCESS";
const ACCOUNT_LOOKUP_FAIL = "ACCOUNT_LOOKUP_FAIL";

const FOLLOWERS_FETCH_REQUEST = "FOLLOWERS_FETCH_REQUEST";
const FOLLOWERS_FETCH_SUCCESS = "FOLLOWERS_FETCH_SUCCESS";
const FOLLOWERS_FETCH_FAIL = "FOLLOWERS_FETCH_FAIL";

const FOLLOWERS_EXPAND_REQUEST = "FOLLOWERS_EXPAND_REQUEST";
const FOLLOWERS_EXPAND_SUCCESS = "FOLLOWERS_EXPAND_SUCCESS";
const FOLLOWERS_EXPAND_FAIL = "FOLLOWERS_EXPAND_FAIL";

const FOLLOWING_FETCH_REQUEST = "FOLLOWING_FETCH_REQUEST";
const FOLLOWING_FETCH_SUCCESS = "FOLLOWING_FETCH_SUCCESS";
const FOLLOWING_FETCH_FAIL = "FOLLOWING_FETCH_FAIL";

const FOLLOWING_EXPAND_REQUEST = "FOLLOWING_EXPAND_REQUEST";
const FOLLOWING_EXPAND_SUCCESS = "FOLLOWING_EXPAND_SUCCESS";
const FOLLOWING_EXPAND_FAIL = "FOLLOWING_EXPAND_FAIL";

const RELATIONSHIPS_FETCH_REQUEST = "RELATIONSHIPS_FETCH_REQUEST";
const RELATIONSHIPS_FETCH_SUCCESS = "RELATIONSHIPS_FETCH_SUCCESS";
const RELATIONSHIPS_FETCH_FAIL = "RELATIONSHIPS_FETCH_FAIL";

const FOLLOW_REQUESTS_FETCH_REQUEST = "FOLLOW_REQUESTS_FETCH_REQUEST";
const FOLLOW_REQUESTS_FETCH_SUCCESS = "FOLLOW_REQUESTS_FETCH_SUCCESS";
const FOLLOW_REQUESTS_FETCH_FAIL = "FOLLOW_REQUESTS_FETCH_FAIL";

const FOLLOW_REQUESTS_EXPAND_REQUEST = "FOLLOW_REQUESTS_EXPAND_REQUEST";
const FOLLOW_REQUESTS_EXPAND_SUCCESS = "FOLLOW_REQUESTS_EXPAND_SUCCESS";
const FOLLOW_REQUESTS_EXPAND_FAIL = "FOLLOW_REQUESTS_EXPAND_FAIL";

const FOLLOW_REQUEST_AUTHORIZE_REQUEST = "FOLLOW_REQUEST_AUTHORIZE_REQUEST";
const FOLLOW_REQUEST_AUTHORIZE_SUCCESS = "FOLLOW_REQUEST_AUTHORIZE_SUCCESS";
const FOLLOW_REQUEST_AUTHORIZE_FAIL = "FOLLOW_REQUEST_AUTHORIZE_FAIL";

const FOLLOW_REQUEST_REJECT_REQUEST = "FOLLOW_REQUEST_REJECT_REQUEST";
const FOLLOW_REQUEST_REJECT_SUCCESS = "FOLLOW_REQUEST_REJECT_SUCCESS";
const FOLLOW_REQUEST_REJECT_FAIL = "FOLLOW_REQUEST_REJECT_FAIL";

const NOTIFICATION_SETTINGS_REQUEST = "NOTIFICATION_SETTINGS_REQUEST";
const NOTIFICATION_SETTINGS_SUCCESS = "NOTIFICATION_SETTINGS_SUCCESS";
const NOTIFICATION_SETTINGS_FAIL = "NOTIFICATION_SETTINGS_FAIL";

const CHECK_EMAIL_REQUEST = "CHECK_EMAIL_REQUEST";
const CHECK_EMAIL_SUCCESS = "CHECK_EMAIL_SUCCESS";
const CHECK_EMAIL_FAIL = "CHECK_EMAIL_FAIL";

const maybeRedirectLogin = (error: HTTPError, history?: History) => {
  // The client is unauthorized - redirect to login.
  if (history && error?.response?.status === 401) {
    history.push("/login");
  }
};

const noOp = () => new Promise((f) => f(undefined));

const createAccount =
  (params: Record<string, any>) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: ACCOUNT_CREATE_REQUEST, params });
    return api(getState, "app")
      .post("/api/accounts", params)
      .then((response) => response.json())
      .then((token) => {
        return dispatch({ type: ACCOUNT_CREATE_SUCCESS, params, token });
      })
      .catch((error) => {
        dispatch({ type: ACCOUNT_CREATE_FAIL, error, params });
        throw error;
      });
  };

const fetchAccount =
  (id: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(fetchRelationships([id]));

    const account = selectAccount(getState(), id);

    if (account) {
      return Promise.resolve(null);
    }

    dispatch(fetchAccountRequest(id));

    return api(getState)
      .get(`/api/accounts/${id}`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(importFetchedAccount(data));
        dispatch(fetchAccountSuccess(data));
      })
      .catch((error) => {
        dispatch(fetchAccountFail(id, error));
      });
  };

const fetchAccountByUsername =
  (username: string, history?: History) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const { me } = getState();

    return dispatch(accountLookup(username))
      .then((account) => {
        dispatch(fetchRelationships([account.id]));
        dispatch(fetchAccountSuccess(account));
      })
      .catch((error) => {
        dispatch(fetchAccountFail(null, error));
        dispatch(importErrorWhileFetchingAccountByUsername(username));
        maybeRedirectLogin(error, history);
      });
  };

const fetchAccountRequest = (id: string) => ({
  type: ACCOUNT_FETCH_REQUEST,
  id,
});

const fetchAccountSuccess = (account: APIEntity) => ({
  type: ACCOUNT_FETCH_SUCCESS,
  account,
});

const fetchAccountFail = (id: string | null, error: unknown) => ({
  type: ACCOUNT_FETCH_FAIL,
  id,
  error,
  skipAlert: true,
});

const blockAccount =
  (id: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return null;

    dispatch(blockAccountRequest(id));

    return api(getState)
      .post(`/api/accounts/${id}/block`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(importEntities([data], Entities.RELATIONSHIPS));
        // Pass in entire statuses map so we can use it to filter stuff in different parts of the reducers
        return dispatch(blockAccountSuccess(data, getState().statuses));
      })
      .catch((error) => dispatch(blockAccountFail(error)));
  };

const unblockAccount =
  (id: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return null;

    dispatch(unblockAccountRequest(id));

    return api(getState)
      .post(`/api/accounts/${id}/unblock`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(importEntities([data], Entities.RELATIONSHIPS));
        return dispatch(unblockAccountSuccess(data));
      })
      .catch((error) => dispatch(unblockAccountFail(error)));
  };

const blockAccountRequest = (id: string) => ({
  type: ACCOUNT_BLOCK_REQUEST,
  id,
});

const blockAccountSuccess = (
  relationship: APIEntity,
  statuses: ImmutableMap<string, Status>
) => ({
  type: ACCOUNT_BLOCK_SUCCESS,
  relationship,
  statuses,
});

const blockAccountFail = (error: unknown) => ({
  type: ACCOUNT_BLOCK_FAIL,
  error,
});

const unblockAccountRequest = (id: string) => ({
  type: ACCOUNT_UNBLOCK_REQUEST,
  id,
});

const unblockAccountSuccess = (relationship: APIEntity) => ({
  type: ACCOUNT_UNBLOCK_SUCCESS,
  relationship,
});

const unblockAccountFail = (error: unknown) => ({
  type: ACCOUNT_UNBLOCK_FAIL,
  error,
});

const muteAccount =
  (id: string, notifications?: boolean, duration = 0) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return null;

    dispatch(muteAccountRequest(id));

    const params: Record<string, any> = {
      notifications,
    };

    return api(getState)
      .post(`/api/accounts/${id}/mute`, params)
      .then((response) => response.json())
      .then((data) => {
        dispatch(importEntities([data], Entities.RELATIONSHIPS));
        // Pass in entire statuses map so we can use it to filter stuff in different parts of the reducers
        return dispatch(muteAccountSuccess(data, getState().statuses));
      })
      .catch((error) => dispatch(muteAccountFail(error)));
  };

const unmuteAccount =
  (id: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return null;

    dispatch(unmuteAccountRequest(id));

    return api(getState)
      .post(`/api/accounts/${id}/unmute`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(importEntities([data], Entities.RELATIONSHIPS));
        return dispatch(unmuteAccountSuccess(data));
      })
      .catch((error) => dispatch(unmuteAccountFail(error)));
  };

const muteAccountRequest = (id: string) => ({
  type: ACCOUNT_MUTE_REQUEST,
  id,
});

const muteAccountSuccess = (
  relationship: APIEntity,
  statuses: ImmutableMap<string, Status>
) => ({
  type: ACCOUNT_MUTE_SUCCESS,
  relationship,
  statuses,
});

const muteAccountFail = (error: unknown) => ({
  type: ACCOUNT_MUTE_FAIL,
  error,
});

const unmuteAccountRequest = (id: string) => ({
  type: ACCOUNT_UNMUTE_REQUEST,
  id,
});

const unmuteAccountSuccess = (relationship: APIEntity) => ({
  type: ACCOUNT_UNMUTE_SUCCESS,
  relationship,
});

const unmuteAccountFail = (error: unknown) => ({
  type: ACCOUNT_UNMUTE_FAIL,
  error,
});

const removeFromFollowers =
  (id: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return null;

    dispatch(removeFromFollowersRequest(id));

    return api(getState)
      .post(`/api/accounts/${id}/remove_from_followers`)
      .then((response) => response.json())
      .then((data) => dispatch(removeFromFollowersSuccess(data)))
      .catch((error) => dispatch(removeFromFollowersFail(id, error)));
  };

const removeFromFollowersRequest = (id: string) => ({
  type: ACCOUNT_REMOVE_FROM_FOLLOWERS_REQUEST,
  id,
});

const removeFromFollowersSuccess = (relationship: APIEntity) => ({
  type: ACCOUNT_REMOVE_FROM_FOLLOWERS_SUCCESS,
  relationship,
});

const removeFromFollowersFail = (id: string, error: unknown) => ({
  type: ACCOUNT_REMOVE_FROM_FOLLOWERS_FAIL,
  id,
  error,
});

const fetchFollowers =
  (id: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(fetchFollowersRequest(id));

    return api(getState)
      .get(`/api/accounts/${id}/followers`)
      .then(async (response) => {
        const next = response.next();
        const data = await response.json();

        dispatch(importFetchedAccounts(data));
        dispatch(fetchFollowersSuccess(id, data, next));
        dispatch(fetchRelationships(data.map((item: APIEntity) => item.id)));
      })
      .catch((error) => {
        dispatch(fetchFollowersFail(id, error));
      });
  };

const fetchFollowersRequest = (id: string) => ({
  type: FOLLOWERS_FETCH_REQUEST,
  id,
});

const fetchFollowersSuccess = (
  id: string,
  accounts: APIEntity[],
  next: string | null
) => ({
  type: FOLLOWERS_FETCH_SUCCESS,
  id,
  accounts,
  next,
});

const fetchFollowersFail = (id: string, error: unknown) => ({
  type: FOLLOWERS_FETCH_FAIL,
  id,
  error,
});

const expandFollowers =
  (id: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return null;

    const url = getState().user_lists.followers.get(id)?.next as string;

    if (url === null) {
      return null;
    }

    dispatch(expandFollowersRequest(id));

    return api(getState)
      .get(url)
      .then(async (response) => {
        const next = response.next();
        const data = await response.json();

        dispatch(importFetchedAccounts(data));
        dispatch(expandFollowersSuccess(id, data, next));
        dispatch(fetchRelationships(data.map((item: APIEntity) => item.id)));
      })
      .catch((error) => {
        dispatch(expandFollowersFail(id, error));
      });
  };

const expandFollowersRequest = (id: string) => ({
  type: FOLLOWERS_EXPAND_REQUEST,
  id,
});

const expandFollowersSuccess = (
  id: string,
  accounts: APIEntity[],
  next: string | null
) => ({
  type: FOLLOWERS_EXPAND_SUCCESS,
  id,
  accounts,
  next,
});

const expandFollowersFail = (id: string, error: unknown) => ({
  type: FOLLOWERS_EXPAND_FAIL,
  id,
  error,
});

const fetchFollowing =
  (id: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(fetchFollowingRequest(id));

    return api(getState)
      .get(`/api/accounts/${id}/following`)
      .then(async (response) => {
        const next = response.next();
        const data = await response.json();

        dispatch(importFetchedAccounts(data));
        dispatch(fetchFollowingSuccess(id, data, next));
        dispatch(fetchRelationships(data.map((item: APIEntity) => item.id)));
      })
      .catch((error) => {
        dispatch(fetchFollowingFail(id, error));
      });
  };

const fetchFollowingRequest = (id: string) => ({
  type: FOLLOWING_FETCH_REQUEST,
  id,
});

const fetchFollowingSuccess = (
  id: string,
  accounts: APIEntity[],
  next: string | null
) => ({
  type: FOLLOWING_FETCH_SUCCESS,
  id,
  accounts,
  next,
});

const fetchFollowingFail = (id: string, error: unknown) => ({
  type: FOLLOWING_FETCH_FAIL,
  id,
  error,
});

const expandFollowing =
  (id: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return null;

    const url = getState().user_lists.following.get(id)!.next;

    if (url === null) {
      return null;
    }

    dispatch(expandFollowingRequest(id));

    return api(getState)
      .get(url)
      .then(async (response) => {
        const next = response.next();
        const data = await response.json();

        dispatch(importFetchedAccounts(data));
        dispatch(expandFollowingSuccess(id, data, next));
        dispatch(fetchRelationships(data.map((item: APIEntity) => item.id)));
      })
      .catch((error) => {
        dispatch(expandFollowingFail(id, error));
      });
  };

const expandFollowingRequest = (id: string) => ({
  type: FOLLOWING_EXPAND_REQUEST,
  id,
});

const expandFollowingSuccess = (
  id: string,
  accounts: APIEntity[],
  next: string | null
) => ({
  type: FOLLOWING_EXPAND_SUCCESS,
  id,
  accounts,
  next,
});

const expandFollowingFail = (id: string, error: unknown) => ({
  type: FOLLOWING_EXPAND_FAIL,
  id,
  error,
});

const fetchRelationships =
  (accountIds: string[]) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return null;

    const loadedRelationships = getState().relationships;
    const newAccountIds = accountIds.filter(
      (id) => loadedRelationships.get(id, null) === null
    );

    if (newAccountIds.length === 0) {
      return null;
    }

    dispatch(fetchRelationshipsRequest(newAccountIds));

    return api(getState)
      .get(
        `/api/accounts/relationships?${newAccountIds
          .map((id) => `id[]=${id}`)
          .join("&")}`
      )
      .then((response) => response.json())
      .then((data) => {
        dispatch(importEntities(data, Entities.RELATIONSHIPS));
        dispatch(fetchRelationshipsSuccess(data));
      })
      .catch((error) => dispatch(fetchRelationshipsFail(error)));
  };

const fetchRelationshipsRequest = (ids: string[]) => ({
  type: RELATIONSHIPS_FETCH_REQUEST,
  ids,
  skipLoading: true,
});

const fetchRelationshipsSuccess = (relationships: APIEntity[]) => ({
  type: RELATIONSHIPS_FETCH_SUCCESS,
  relationships,
  skipLoading: true,
});

const fetchRelationshipsFail = (error: unknown) => ({
  type: RELATIONSHIPS_FETCH_FAIL,
  error,
  skipLoading: true,
});

const fetchFollowRequests =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return null;

    dispatch(fetchFollowRequestsRequest());

    return api(getState)
      .get("/api/follow_requests")
      .then(async (response) => {
        const next = response.next();
        const data = await response.json();
        dispatch(importFetchedAccounts(data));
        dispatch(fetchFollowRequestsSuccess(data, next));
      })
      .catch((error) => dispatch(fetchFollowRequestsFail(error)));
  };

const fetchFollowRequestsRequest = () => ({
  type: FOLLOW_REQUESTS_FETCH_REQUEST,
});

const fetchFollowRequestsSuccess = (
  accounts: APIEntity[],
  next: string | null
) => ({
  type: FOLLOW_REQUESTS_FETCH_SUCCESS,
  accounts,
  next,
});

const fetchFollowRequestsFail = (error: unknown) => ({
  type: FOLLOW_REQUESTS_FETCH_FAIL,
  error,
});

const expandFollowRequests =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return null;

    const url = getState().user_lists.follow_requests.next;

    if (url === null) {
      return null;
    }

    dispatch(expandFollowRequestsRequest());

    return api(getState)
      .get(url)
      .then(async (response) => {
        const next = response.next();
        const data = await response.json();
        dispatch(importFetchedAccounts(data));
        dispatch(expandFollowRequestsSuccess(data, next));
      })
      .catch((error) => dispatch(expandFollowRequestsFail(error)));
  };

const expandFollowRequestsRequest = () => ({
  type: FOLLOW_REQUESTS_EXPAND_REQUEST,
});

const expandFollowRequestsSuccess = (
  accounts: APIEntity[],
  next: string | null
) => ({
  type: FOLLOW_REQUESTS_EXPAND_SUCCESS,
  accounts,
  next,
});

const expandFollowRequestsFail = (error: unknown) => ({
  type: FOLLOW_REQUESTS_EXPAND_FAIL,
  error,
});

const authorizeFollowRequest =
  (id: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return null;

    dispatch(authorizeFollowRequestRequest(id));

    return api(getState)
      .post(`/api/follow_requests/${id}/authorize`)
      .then(() => dispatch(authorizeFollowRequestSuccess(id)))
      .catch((error) => dispatch(authorizeFollowRequestFail(id, error)));
  };

const authorizeFollowRequestRequest = (id: string) => ({
  type: FOLLOW_REQUEST_AUTHORIZE_REQUEST,
  id,
});

const authorizeFollowRequestSuccess = (id: string) => ({
  type: FOLLOW_REQUEST_AUTHORIZE_SUCCESS,
  id,
});

const authorizeFollowRequestFail = (id: string, error: unknown) => ({
  type: FOLLOW_REQUEST_AUTHORIZE_FAIL,
  id,
  error,
});

const rejectFollowRequest =
  (id: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(rejectFollowRequestRequest(id));

    api(getState)
      .post(`/api/follow_requests/${id}/reject`)
      .then(() => dispatch(rejectFollowRequestSuccess(id)))
      .catch((error) => dispatch(rejectFollowRequestFail(id, error)));
  };

const rejectFollowRequestRequest = (id: string) => ({
  type: FOLLOW_REQUEST_REJECT_REQUEST,
  id,
});

const rejectFollowRequestSuccess = (id: string) => ({
  type: FOLLOW_REQUEST_REJECT_SUCCESS,
  id,
});

const rejectFollowRequestFail = (id: string, error: unknown) => ({
  type: FOLLOW_REQUEST_REJECT_FAIL,
  id,
  error,
});

const updateNotificationSettings =
  (params: Record<string, any>) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: NOTIFICATION_SETTINGS_REQUEST, params });
    return api(getState)
      .put("/api/pleroma/notification_settings", params)
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: NOTIFICATION_SETTINGS_SUCCESS, params, data });
      })
      .catch((error) => {
        dispatch({ type: NOTIFICATION_SETTINGS_FAIL, params, error });
        throw error;
      });
  };

const accountSearch =
  (params: Record<string, any>, signal?: AbortSignal) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: ACCOUNT_SEARCH_REQUEST, params });
    return api(getState)
      .get("/api/accounts/search", { searchParams: params, signal })
      .then((response) => response.json())
      .then((accounts) => {
        dispatch(importFetchedAccounts(accounts));
        dispatch({ type: ACCOUNT_SEARCH_SUCCESS, accounts });
        return accounts;
      })
      .catch((error) => {
        dispatch({ type: ACCOUNT_SEARCH_FAIL, skipAlert: true });
        throw error;
      });
  };

const accountLookup =
  (username: string, signal?: AbortSignal) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: ACCOUNT_LOOKUP_REQUEST, username });
    return api(getState)
      .get("/api/accounts/lookup", { searchParams: { username }, signal })
      .then((response) => response.json())
      .then((account) => {
        if (account && account.id) dispatch(importFetchedAccount(account));
        dispatch({ type: ACCOUNT_LOOKUP_SUCCESS, account });
        return account;
      })
      .catch((error) => {
        dispatch({ type: ACCOUNT_LOOKUP_FAIL });
        throw error;
      });
  };

const checkEmail =
  (email: string, signal?: AbortSignal) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: CHECK_EMAIL_REQUEST, email });
    try {
      // Make a GET request, passing email as a query parameter
      const response = await api(getState).get("/api/accounts/checkEmail", {
        searchParams: { email },
        signal,
      });
      const data = await response.json(); // => { exists: boolean }
      dispatch({ type: CHECK_EMAIL_SUCCESS, emailExists: data.exists });
      return data.exists;
    } catch (err) {
      dispatch({ type: CHECK_EMAIL_FAIL });
      throw err;
    }
  };

export {
  ACCOUNT_CREATE_REQUEST,
  ACCOUNT_CREATE_SUCCESS,
  ACCOUNT_CREATE_FAIL,
  ACCOUNT_FETCH_REQUEST,
  ACCOUNT_FETCH_SUCCESS,
  ACCOUNT_FETCH_FAIL,
  ACCOUNT_BLOCK_REQUEST,
  ACCOUNT_BLOCK_SUCCESS,
  ACCOUNT_BLOCK_FAIL,
  ACCOUNT_UNBLOCK_REQUEST,
  ACCOUNT_UNBLOCK_SUCCESS,
  ACCOUNT_UNBLOCK_FAIL,
  ACCOUNT_MUTE_REQUEST,
  ACCOUNT_MUTE_SUCCESS,
  ACCOUNT_MUTE_FAIL,
  ACCOUNT_UNMUTE_REQUEST,
  ACCOUNT_UNMUTE_SUCCESS,
  ACCOUNT_UNMUTE_FAIL,
  ACCOUNT_REMOVE_FROM_FOLLOWERS_REQUEST,
  ACCOUNT_REMOVE_FROM_FOLLOWERS_SUCCESS,
  ACCOUNT_REMOVE_FROM_FOLLOWERS_FAIL,
  ACCOUNT_SEARCH_REQUEST,
  ACCOUNT_SEARCH_SUCCESS,
  ACCOUNT_SEARCH_FAIL,
  ACCOUNT_LOOKUP_REQUEST,
  ACCOUNT_LOOKUP_SUCCESS,
  ACCOUNT_LOOKUP_FAIL,
  FOLLOWERS_FETCH_REQUEST,
  FOLLOWERS_FETCH_SUCCESS,
  FOLLOWERS_FETCH_FAIL,
  FOLLOWERS_EXPAND_REQUEST,
  FOLLOWERS_EXPAND_SUCCESS,
  FOLLOWERS_EXPAND_FAIL,
  FOLLOWING_FETCH_REQUEST,
  FOLLOWING_FETCH_SUCCESS,
  FOLLOWING_FETCH_FAIL,
  FOLLOWING_EXPAND_REQUEST,
  FOLLOWING_EXPAND_SUCCESS,
  FOLLOWING_EXPAND_FAIL,
  RELATIONSHIPS_FETCH_REQUEST,
  RELATIONSHIPS_FETCH_SUCCESS,
  RELATIONSHIPS_FETCH_FAIL,
  FOLLOW_REQUESTS_FETCH_REQUEST,
  FOLLOW_REQUESTS_FETCH_SUCCESS,
  FOLLOW_REQUESTS_FETCH_FAIL,
  FOLLOW_REQUESTS_EXPAND_REQUEST,
  FOLLOW_REQUESTS_EXPAND_SUCCESS,
  FOLLOW_REQUESTS_EXPAND_FAIL,
  FOLLOW_REQUEST_AUTHORIZE_REQUEST,
  FOLLOW_REQUEST_AUTHORIZE_SUCCESS,
  FOLLOW_REQUEST_AUTHORIZE_FAIL,
  FOLLOW_REQUEST_REJECT_REQUEST,
  FOLLOW_REQUEST_REJECT_SUCCESS,
  FOLLOW_REQUEST_REJECT_FAIL,
  NOTIFICATION_SETTINGS_REQUEST,
  NOTIFICATION_SETTINGS_SUCCESS,
  NOTIFICATION_SETTINGS_FAIL,
  CHECK_EMAIL_REQUEST,
  CHECK_EMAIL_SUCCESS,
  CHECK_EMAIL_FAIL,
  createAccount,
  fetchAccount,
  fetchAccountByUsername,
  fetchAccountRequest,
  fetchAccountSuccess,
  fetchAccountFail,
  blockAccount,
  unblockAccount,
  blockAccountRequest,
  blockAccountSuccess,
  blockAccountFail,
  unblockAccountRequest,
  unblockAccountSuccess,
  unblockAccountFail,
  muteAccount,
  unmuteAccount,
  muteAccountRequest,
  muteAccountSuccess,
  muteAccountFail,
  unmuteAccountRequest,
  unmuteAccountSuccess,
  unmuteAccountFail,
  removeFromFollowers,
  removeFromFollowersRequest,
  removeFromFollowersSuccess,
  removeFromFollowersFail,
  fetchFollowers,
  fetchFollowersRequest,
  fetchFollowersSuccess,
  fetchFollowersFail,
  expandFollowers,
  expandFollowersRequest,
  expandFollowersSuccess,
  expandFollowersFail,
  fetchFollowing,
  fetchFollowingRequest,
  fetchFollowingSuccess,
  fetchFollowingFail,
  expandFollowing,
  expandFollowingRequest,
  expandFollowingSuccess,
  expandFollowingFail,
  fetchRelationships,
  fetchRelationshipsRequest,
  fetchRelationshipsSuccess,
  fetchRelationshipsFail,
  fetchFollowRequests,
  fetchFollowRequestsRequest,
  fetchFollowRequestsSuccess,
  fetchFollowRequestsFail,
  expandFollowRequests,
  expandFollowRequestsRequest,
  expandFollowRequestsSuccess,
  expandFollowRequestsFail,
  authorizeFollowRequest,
  authorizeFollowRequestRequest,
  authorizeFollowRequestSuccess,
  authorizeFollowRequestFail,
  rejectFollowRequest,
  rejectFollowRequestRequest,
  rejectFollowRequestSuccess,
  rejectFollowRequestFail,
  updateNotificationSettings,
  accountSearch,
  accountLookup,
  checkEmail,
};
