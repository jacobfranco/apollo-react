import api from "../api";

import type { AppDispatch, RootState } from "src/store";
import type { APIEntity } from "src/types/entities";

const SCHEDULED_STATUSES_FETCH_REQUEST = "SCHEDULED_STATUSES_FETCH_REQUEST";
const SCHEDULED_STATUSES_FETCH_SUCCESS = "SCHEDULED_STATUSES_FETCH_SUCCESS";
const SCHEDULED_STATUSES_FETCH_FAIL = "SCHEDULED_STATUSES_FETCH_FAIL";

const SCHEDULED_STATUSES_EXPAND_REQUEST = "SCHEDULED_STATUSES_EXPAND_REQUEST";
const SCHEDULED_STATUSES_EXPAND_SUCCESS = "SCHEDULED_STATUSES_EXPAND_SUCCESS";
const SCHEDULED_STATUSES_EXPAND_FAIL = "SCHEDULED_STATUSES_EXPAND_FAIL";

const SCHEDULED_STATUS_CANCEL_REQUEST = "SCHEDULED_STATUS_CANCEL_REQUEST";
const SCHEDULED_STATUS_CANCEL_SUCCESS = "SCHEDULED_STATUS_CANCEL_SUCCESS";
const SCHEDULED_STATUS_CANCEL_FAIL = "SCHEDULED_STATUS_CANCEL_FAIL";

const fetchScheduledStatuses =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();

    if (state.status_lists.get("scheduled_statuses")?.isLoading) {
      return;
    }

    dispatch(fetchScheduledStatusesRequest());

    api(getState)
      .get("/api/scheduled_statuses")
      .then(async (response) => {
        const next = response.next();
        const data = await response.json();
        dispatch(fetchScheduledStatusesSuccess(data, next));
      })
      .catch((error) => {
        dispatch(fetchScheduledStatusesFail(error));
      });
  };

const cancelScheduledStatus =
  (id: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: SCHEDULED_STATUS_CANCEL_REQUEST, id });
    api(getState)
      .delete(`/api/scheduled_statuses/${id}`)
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: SCHEDULED_STATUS_CANCEL_SUCCESS, id, data });
      })
      .catch((error) => {
        dispatch({ type: SCHEDULED_STATUS_CANCEL_FAIL, id, error });
      });
  };

const fetchScheduledStatusesRequest = () => ({
  type: SCHEDULED_STATUSES_FETCH_REQUEST,
});

const fetchScheduledStatusesSuccess = (
  statuses: APIEntity[],
  next: string | null
) => ({
  type: SCHEDULED_STATUSES_FETCH_SUCCESS,
  statuses,
  next,
});

const fetchScheduledStatusesFail = (error: unknown) => ({
  type: SCHEDULED_STATUSES_FETCH_FAIL,
  error,
});

const expandScheduledStatuses =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    const url = getState().status_lists.get("scheduled_statuses")?.next || null;

    if (
      url === null ||
      getState().status_lists.get("scheduled_statuses")?.isLoading
    ) {
      return;
    }

    dispatch(expandScheduledStatusesRequest());

    api(getState)
      .get(url)
      .then(async (response) => {
        const next = response.next();
        const data = await response.json();
        dispatch(expandScheduledStatusesSuccess(data, next));
      })
      .catch((error) => {
        dispatch(expandScheduledStatusesFail(error));
      });
  };
const expandScheduledStatusesRequest = () => ({
  type: SCHEDULED_STATUSES_EXPAND_REQUEST,
});

const expandScheduledStatusesSuccess = (
  statuses: APIEntity[],
  next: string | null
) => ({
  type: SCHEDULED_STATUSES_EXPAND_SUCCESS,
  statuses,
  next,
});

const expandScheduledStatusesFail = (error: unknown) => ({
  type: SCHEDULED_STATUSES_EXPAND_FAIL,
  error,
});

export {
  SCHEDULED_STATUSES_FETCH_REQUEST,
  SCHEDULED_STATUSES_FETCH_SUCCESS,
  SCHEDULED_STATUSES_FETCH_FAIL,
  SCHEDULED_STATUSES_EXPAND_REQUEST,
  SCHEDULED_STATUSES_EXPAND_SUCCESS,
  SCHEDULED_STATUSES_EXPAND_FAIL,
  SCHEDULED_STATUS_CANCEL_REQUEST,
  SCHEDULED_STATUS_CANCEL_SUCCESS,
  SCHEDULED_STATUS_CANCEL_FAIL,
  fetchScheduledStatuses,
  cancelScheduledStatus,
  fetchScheduledStatusesRequest,
  fetchScheduledStatusesSuccess,
  fetchScheduledStatusesFail,
  expandScheduledStatuses,
  expandScheduledStatusesRequest,
  expandScheduledStatusesSuccess,
  expandScheduledStatusesFail,
};
