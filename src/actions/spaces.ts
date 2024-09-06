import api, { getLinks } from '../api';

import type { AppDispatch, RootState } from 'src/store';
import type { APIEntity } from 'src/types/entities';

const SPACE_FETCH_REQUEST = 'SPACE_FETCH_REQUEST';
const SPACE_FETCH_SUCCESS = 'SPACE_FETCH_SUCCESS';
const SPACE_FETCH_FAIL = 'SPACE_FETCH_FAIL';

const ALL_SPACES_FETCH_REQUEST = 'ALL_SPACES_FETCH_REQUEST';
const ALL_SPACES_FETCH_SUCCESS = 'ALL_SPACES_FETCH_SUCCESS';
const ALL_SPACES_FETCH_FAIL = 'ALL_SPACES_FETCH_FAIL';

const SPACE_FOLLOW_REQUEST = 'SPACE_FOLLOW_REQUEST';
const SPACE_FOLLOW_SUCCESS = 'SPACE_FOLLOW_SUCCESS';
const SPACE_FOLLOW_FAIL = 'SPACE_FOLLOW_FAIL';

const SPACE_UNFOLLOW_REQUEST = 'SPACE_UNFOLLOW_REQUEST';
const SPACE_UNFOLLOW_SUCCESS = 'SPACE_UNFOLLOW_SUCCESS';
const SPACE_UNFOLLOW_FAIL = 'SPACE_UNFOLLOW_FAIL';

const FOLLOWED_SPACES_FETCH_REQUEST = 'FOLLOWED_SPACES_FETCH_REQUEST';
const FOLLOWED_SPACES_FETCH_SUCCESS = 'FOLLOWED_SPACES_FETCH_SUCCESS';
const FOLLOWED_SPACES_FETCH_FAIL = 'FOLLOWED_SPACES_FETCH_FAIL';

const FOLLOWED_SPACES_EXPAND_REQUEST = 'FOLLOWED_SPACES_EXPAND_REQUEST';
const FOLLOWED_SPACES_EXPAND_SUCCESS = 'FOLLOWED_SPACES_EXPAND_SUCCESS';
const FOLLOWED_SPACES_EXPAND_FAIL = 'FOLLOWED_SPACES_EXPAND_FAIL';

const fetchSpace = (name: string) => (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(fetchSpaceRequest());

  api(getState).get(`/api/spaces/${name}`).then(({ data }) => {
    dispatch(fetchSpaceSuccess(name, data));
  }).catch(err => {
    dispatch(fetchSpaceFail(err));
  });
};

const fetchSpaceRequest = () => ({
  type: SPACE_FETCH_REQUEST,
});

const fetchSpaceSuccess = (name: string, space: APIEntity) => ({
  type: SPACE_FETCH_SUCCESS,
  name,
  space,
});

const fetchSpaceFail = (error: unknown) => ({
  type: SPACE_FETCH_FAIL,
  error,
});


const fetchAllSpaces = () => (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(fetchAllSpacesRequest());

  api(getState).get('/api/spaces').then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next');
    dispatch(fetchAllSpacesSuccess(response.data, next ? next.uri : null));
  }).catch(err => {
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

const followSpace = (name: string) => (dispatch: AppDispatch, getState: () => RootState) => {
  console.log('followSpace action creator called with name:', name);
  dispatch(followSpaceRequest(name));

  api(getState).post(`/api/spaces/${name}/follow`).then(({ data }) => {
    console.log('followSpace API call successful, data:', data);
    dispatch(followSpaceSuccess(name, data));
  }).catch(err => {
    console.error('followSpace API call failed, error:', err);
    dispatch(followSpaceFail(name, err));
  });
};

const followSpaceRequest = (name: string) => ({
  type: SPACE_FOLLOW_REQUEST,
  name,
});

const followSpaceSuccess = (name: string, space: APIEntity) => ({
  type: SPACE_FOLLOW_SUCCESS,
  name,
  space,
});

const followSpaceFail = (name: string, error: unknown) => ({
  type: SPACE_FOLLOW_FAIL,
  name,
  error,
});

const unfollowSpace = (name: string) => (dispatch: AppDispatch, getState: () => RootState) => {
  console.log('unfollowSpace action creator called with name:', name);
  dispatch(unfollowSpaceRequest(name));

  api(getState).post(`/api/spaces/${name}/unfollow`).then(({ data }) => {
    console.log('unfollowSpace API call successful, data:', data);
    dispatch(unfollowSpaceSuccess(name, data));
  }).catch(err => {
    console.error('unfollowSpace API call failed, error:', err);
    dispatch(unfollowSpaceFail(name, err));
  });
};

const unfollowSpaceRequest = (name: string) => ({
  type: SPACE_UNFOLLOW_REQUEST,
  name,
});

const unfollowSpaceSuccess = (name: string, space: APIEntity) => ({
  type: SPACE_UNFOLLOW_SUCCESS,
  name,
  space,
});

const unfollowSpaceFail = (name: string, error: unknown) => ({
  type: SPACE_UNFOLLOW_FAIL,
  name,
  error,
});

const fetchFollowedSpaces = () => (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(fetchFollowedSpacesRequest());

  api(getState).get('/api/followed_spaces').then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next');
    dispatch(fetchFollowedSpacesSuccess(response.data, next ? next.uri : null));
  }).catch(err => {
    dispatch(fetchFollowedSpacesFail(err));
  });
};

const fetchFollowedSpacesRequest = () => ({
  type: FOLLOWED_SPACES_FETCH_REQUEST,
});

const fetchFollowedSpacesSuccess = (followed_spaces: APIEntity[], next: string | null) => ({
  type: FOLLOWED_SPACES_FETCH_SUCCESS,
  followed_spaces,
  next,
});

const fetchFollowedSpacesFail = (error: unknown) => ({
  type: FOLLOWED_SPACES_FETCH_FAIL,
  error,
});

const expandFollowedSpaces = () => (dispatch: AppDispatch, getState: () => RootState) => {
  const url = getState().followed_spaces.next;

  if (url === null) {
    return;
  }

  dispatch(expandFollowedSpacesRequest());

  api(getState).get(url).then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next');
    dispatch(expandFollowedSpacesSuccess(response.data, next ? next.uri : null));
  }).catch(error => {
    dispatch(expandFollowedSpacesFail(error));
  });
};

const expandFollowedSpacesRequest = () => ({
  type: FOLLOWED_SPACES_EXPAND_REQUEST,
});

const expandFollowedSpacesSuccess = (followed_spaces: APIEntity[], next: string | null) => ({
  type: FOLLOWED_SPACES_EXPAND_SUCCESS,
  followed_spaces,
  next,
});

const expandFollowedSpacesFail = (error: unknown) => ({
  type: FOLLOWED_SPACES_EXPAND_FAIL,
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
  FOLLOWED_SPACES_FETCH_REQUEST,
  FOLLOWED_SPACES_FETCH_SUCCESS,
  FOLLOWED_SPACES_FETCH_FAIL,
  FOLLOWED_SPACES_EXPAND_REQUEST,
  FOLLOWED_SPACES_EXPAND_SUCCESS,
  FOLLOWED_SPACES_EXPAND_FAIL,
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
  fetchFollowedSpaces,
  fetchFollowedSpacesRequest,
  fetchFollowedSpacesSuccess,
  fetchFollowedSpacesFail,
  expandFollowedSpaces,
  expandFollowedSpacesRequest,
  expandFollowedSpacesSuccess,
  expandFollowedSpacesFail,
};