import api from "../api";

import type { AppDispatch, RootState } from "src/store";
import type { APIEntity } from "src/types/entities";

const SPACE_FETCH_REQUEST = "SPACE_FETCH_REQUEST";
const SPACE_FETCH_SUCCESS = "SPACE_FETCH_SUCCESS";
const SPACE_FETCH_FAIL = "SPACE_FETCH_FAIL";

const ALL_SPACES_FETCH_REQUEST = "ALL_SPACES_FETCH_REQUEST";
const ALL_SPACES_FETCH_SUCCESS = "ALL_SPACES_FETCH_SUCCESS";
const ALL_SPACES_FETCH_FAIL = "ALL_SPACES_FETCH_FAIL";

const SPACE_FOLLOW_REQUEST = "SPACE_FOLLOW_REQUEST";
const SPACE_FOLLOW_SUCCESS = "SPACE_FOLLOW_SUCCESS";
const SPACE_FOLLOW_FAIL = "SPACE_FOLLOW_FAIL";

const SPACE_UNFOLLOW_REQUEST = "SPACE_UNFOLLOW_REQUEST";
const SPACE_UNFOLLOW_SUCCESS = "SPACE_UNFOLLOW_SUCCESS";
const SPACE_UNFOLLOW_FAIL = "SPACE_UNFOLLOW_FAIL";

const fetchSpace =
  (id: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(fetchSpaceRequest());

    api(getState)
      .get(`/api/spaces/${id}`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(fetchSpaceSuccess(id, data));
      })
      .catch((err) => {
        dispatch(fetchSpaceFail(err));
      });
  };

const fetchSpaceRequest = () => ({
  type: SPACE_FETCH_REQUEST,
});

const fetchSpaceSuccess = (id: string, space: APIEntity) => ({
  type: SPACE_FETCH_SUCCESS,
  id,
  space,
});

const fetchSpaceFail = (error: unknown) => ({
  type: SPACE_FETCH_FAIL,
  error,
});

const fetchAllSpaces =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(fetchAllSpacesRequest());

    api(getState)
      .get("/api/spaces")
      .then(async (response) => {
        const next = response.next();
        const data = await response.json();
        console.log("Spaces API response:", data); // Add this
        dispatch(fetchAllSpacesSuccess(data, next));
      })
      .catch((err) => {
        dispatch(fetchAllSpacesFail(err));
      });
  };

const fetchAllSpacesRequest = () => ({
  type: ALL_SPACES_FETCH_REQUEST,
});

const fetchAllSpacesSuccess = (spaces: APIEntity[], next: string | null) => ({
  type: ALL_SPACES_FETCH_SUCCESS,
  spaces,
  next,
});

const fetchAllSpacesFail = (error: unknown) => ({
  type: ALL_SPACES_FETCH_FAIL,
  error,
});

const followSpace =
  (id: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(followSpaceRequest(id));

    api(getState)
      .post(`/api/spaces/${id}/follow`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(followSpaceSuccess(id, data));
      })
      .catch((err) => {
        dispatch(followSpaceFail(id, err));
      });
  };

const followSpaceRequest = (id: string) => ({
  type: SPACE_FOLLOW_REQUEST,
  id,
});

const followSpaceSuccess = (id: string, space: APIEntity) => ({
  type: SPACE_FOLLOW_SUCCESS,
  id,
  space,
});

const followSpaceFail = (id: string, error: unknown) => ({
  type: SPACE_FOLLOW_FAIL,
  id,
  error,
});

const unfollowSpace =
  (id: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(unfollowSpaceRequest(id));

    api(getState)
      .post(`/api/spaces/${id}/unfollow`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(unfollowSpaceSuccess(id, data));
      })
      .catch((err) => {
        dispatch(unfollowSpaceFail(id, err));
      });
  };

const unfollowSpaceRequest = (id: string) => ({
  type: SPACE_UNFOLLOW_REQUEST,
  id,
});

const unfollowSpaceSuccess = (id: string, space: APIEntity) => ({
  type: SPACE_UNFOLLOW_SUCCESS,
  id,
  space,
});

const unfollowSpaceFail = (id: string, error: unknown) => ({
  type: SPACE_UNFOLLOW_FAIL,
  id,
  error,
});

export {
  SPACE_FETCH_REQUEST,
  SPACE_FETCH_SUCCESS,
  SPACE_FETCH_FAIL,
  ALL_SPACES_FETCH_REQUEST,
  ALL_SPACES_FETCH_SUCCESS,
  ALL_SPACES_FETCH_FAIL,
  SPACE_FOLLOW_REQUEST,
  SPACE_FOLLOW_SUCCESS,
  SPACE_FOLLOW_FAIL,
  SPACE_UNFOLLOW_REQUEST,
  SPACE_UNFOLLOW_SUCCESS,
  SPACE_UNFOLLOW_FAIL,
  fetchSpace,
  fetchSpaceRequest,
  fetchSpaceSuccess,
  fetchSpaceFail,
  fetchAllSpaces,
  fetchAllSpacesRequest,
  fetchAllSpacesSuccess,
  fetchAllSpacesFail,
  followSpace,
  followSpaceRequest,
  followSpaceSuccess,
  followSpaceFail,
  unfollowSpace,
  unfollowSpaceRequest,
  unfollowSpaceSuccess,
  unfollowSpaceFail,
};
