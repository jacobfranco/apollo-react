import { isLoggedIn } from "src/utils/auth";

import api from "../api/index";

import { importFetchedStatuses } from "./importer";

import type { AppDispatch, RootState } from "src/store";
import type { APIEntity } from "src/types/entities";

const LIKED_STATUSES_FETCH_REQUEST = "LIKED_STATUSES_FETCH_REQUEST";
const LIKED_STATUSES_FETCH_SUCCESS = "LIKED_STATUSES_FETCH_SUCCESS";
const LIKED_STATUSES_FETCH_FAIL = "LIKED_STATUSES_FETCH_FAIL";

const LIKED_STATUSES_EXPAND_REQUEST = "LIKED_STATUSES_EXPAND_REQUEST";
const LIKED_STATUSES_EXPAND_SUCCESS = "LIKED_STATUSES_EXPAND_SUCCESS";
const LIKED_STATUSES_EXPAND_FAIL = "LIKED_STATUSES_EXPAND_FAIL";

const ACCOUNT_LIKED_STATUSES_FETCH_REQUEST =
  "ACCOUNT_LIKED_STATUSES_FETCH_REQUEST";
const ACCOUNT_LIKED_STATUSES_FETCH_SUCCESS =
  "ACCOUNT_LIKED_STATUSES_FETCH_SUCCESS";
const ACCOUNT_LIKED_STATUSES_FETCH_FAIL = "ACCOUNT_LIKED_STATUSES_FETCH_FAIL";

const ACCOUNT_LIKED_STATUSES_EXPAND_REQUEST =
  "ACCOUNT_LIKED_STATUSES_EXPAND_REQUEST";
const ACCOUNT_LIKED_STATUSES_EXPAND_SUCCESS =
  "ACCOUNT_LIKED_STATUSES_EXPAND_SUCCESS";
const ACCOUNT_LIKED_STATUSES_EXPAND_FAIL = "ACCOUNT_LIKED_STATUSES_EXPAND_FAIL";

const fetchLikedStatuses =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    if (getState().status_lists.get("likes")?.isLoading) {
      return;
    }

    dispatch(fetchLikedStatusesRequest());

    api(getState)
      .get("/api/likes")
      .then(async (response) => {
        const next = response.next();
        const data = await response.json();
        dispatch(importFetchedStatuses(data));
        dispatch(fetchLikedStatusesSuccess(data, next));
      })
      .catch((error) => {
        dispatch(fetchLikedStatusesFail(error));
      });
  };

const fetchLikedStatusesRequest = () => ({
  type: LIKED_STATUSES_FETCH_REQUEST,
  skipLoading: true,
});

const fetchLikedStatusesSuccess = (
  statuses: APIEntity[],
  next: string | null
) => ({
  type: LIKED_STATUSES_FETCH_SUCCESS,
  statuses,
  next,
  skipLoading: true,
});

const fetchLikedStatusesFail = (error: unknown) => ({
  type: LIKED_STATUSES_FETCH_FAIL,
  error,
  skipLoading: true,
});

const expandLikedStatuses =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    const url = getState().status_lists.get("likes")?.next || null;

    if (url === null || getState().status_lists.get("likes")?.isLoading) {
      return;
    }

    dispatch(expandLikedStatusesRequest());

    api(getState)
      .get(url)
      .then(async (response) => {
        const next = response.next();
        const data = await response.json();
        dispatch(importFetchedStatuses(data));
        dispatch(expandLikedStatusesSuccess(data, next));
      })
      .catch((error) => {
        dispatch(expandLikedStatusesFail(error));
      });
  };

const expandLikedStatusesRequest = () => ({
  type: LIKED_STATUSES_EXPAND_REQUEST,
});

const expandLikedStatusesSuccess = (
  statuses: APIEntity[],
  next: string | null
) => ({
  type: LIKED_STATUSES_EXPAND_SUCCESS,
  statuses,
  next,
});

const expandLikedStatusesFail = (error: unknown) => ({
  type: LIKED_STATUSES_EXPAND_FAIL,
  error,
});

const fetchAccountLikedStatuses =
  (accountId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    if (getState().status_lists.get(`likes:${accountId}`)?.isLoading) {
      return;
    }

    dispatch(fetchAccountLikedStatusesRequest(accountId));

    api(getState)
      .get(`/api/accounts/${accountId}/likes`)
      .then(async (response) => {
        const next = response.next();
        const data = await response.json();
        dispatch(importFetchedStatuses(data));
        dispatch(fetchAccountLikedStatusesSuccess(accountId, data, next));
      })
      .catch((error) => {
        dispatch(fetchAccountLikedStatusesFail(accountId, error));
      });
  };

const fetchAccountLikedStatusesRequest = (accountId: string) => ({
  type: ACCOUNT_LIKED_STATUSES_FETCH_REQUEST,
  accountId,
  skipLoading: true,
});

const fetchAccountLikedStatusesSuccess = (
  accountId: string,
  statuses: APIEntity,
  next: string | null
) => ({
  type: ACCOUNT_LIKED_STATUSES_FETCH_SUCCESS,
  accountId,
  statuses,
  next,
  skipLoading: true,
});

const fetchAccountLikedStatusesFail = (accountId: string, error: unknown) => ({
  type: ACCOUNT_LIKED_STATUSES_FETCH_FAIL,
  accountId,
  error,
  skipLoading: true,
});

const expandAccountLikedStatuses =
  (accountId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    const url = getState().status_lists.get(`likes:${accountId}`)?.next || null;

    if (
      url === null ||
      getState().status_lists.get(`likes:${accountId}`)?.isLoading
    ) {
      return;
    }

    dispatch(expandAccountLikedStatusesRequest(accountId));

    api(getState)
      .get(url)
      .then(async (response) => {
        const next = response.next();
        const data = await response.json();
        dispatch(importFetchedStatuses(data));
        dispatch(expandAccountLikedStatusesSuccess(accountId, data, next));
      })
      .catch((error) => {
        dispatch(expandAccountLikedStatusesFail(accountId, error));
      });
  };

const expandAccountLikedStatusesRequest = (accountId: string) => ({
  type: ACCOUNT_LIKED_STATUSES_EXPAND_REQUEST,
  accountId,
});

const expandAccountLikedStatusesSuccess = (
  accountId: string,
  statuses: APIEntity[],
  next: string | null
) => ({
  type: ACCOUNT_LIKED_STATUSES_EXPAND_SUCCESS,
  accountId,
  statuses,
  next,
});

const expandAccountLikedStatusesFail = (accountId: string, error: unknown) => ({
  type: ACCOUNT_LIKED_STATUSES_EXPAND_FAIL,
  accountId,
  error,
});

export {
  LIKED_STATUSES_FETCH_REQUEST,
  LIKED_STATUSES_FETCH_SUCCESS,
  LIKED_STATUSES_FETCH_FAIL,
  LIKED_STATUSES_EXPAND_REQUEST,
  LIKED_STATUSES_EXPAND_SUCCESS,
  LIKED_STATUSES_EXPAND_FAIL,
  ACCOUNT_LIKED_STATUSES_FETCH_REQUEST,
  ACCOUNT_LIKED_STATUSES_FETCH_SUCCESS,
  ACCOUNT_LIKED_STATUSES_FETCH_FAIL,
  ACCOUNT_LIKED_STATUSES_EXPAND_REQUEST,
  ACCOUNT_LIKED_STATUSES_EXPAND_SUCCESS,
  ACCOUNT_LIKED_STATUSES_EXPAND_FAIL,
  fetchLikedStatuses,
  fetchLikedStatusesRequest,
  fetchLikedStatusesSuccess,
  fetchLikedStatusesFail,
  expandLikedStatuses,
  expandLikedStatusesRequest,
  expandLikedStatusesSuccess,
  expandLikedStatusesFail,
  fetchAccountLikedStatuses,
  fetchAccountLikedStatusesRequest,
  fetchAccountLikedStatusesSuccess,
  fetchAccountLikedStatusesFail,
  expandAccountLikedStatuses,
  expandAccountLikedStatusesRequest,
  expandAccountLikedStatusesSuccess,
  expandAccountLikedStatusesFail,
};
