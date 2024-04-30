import { defineMessages } from 'react-intl';

import toast from 'src/toast';
import { isLoggedIn } from 'src/utils/auth';

import api, { getLinks } from '../api';

import { fetchRelationships } from './accounts';
import { importFetchedAccounts, importFetchedStatus } from './importer';
import { expandGroupFeaturedTimeline } from './timelines';

import type { AppDispatch, RootState } from 'src/store';
import type { APIEntity, Group, Status as StatusEntity } from 'src/types/entities';

const REPOST_REQUEST = 'REPOST_REQUEST';
const REPOST_SUCCESS = 'REPOST_SUCCESS';
const REPOST_FAIL    = 'REPOST_FAIL';

const LIKE_REQUEST = 'LIKE_REQUEST';
const LIKE_SUCCESS = 'LIKE_SUCCESS';
const LIKE_FAIL    = 'LIKE_FAIL';

const UNREPOST_REQUEST = 'UNREPOST_REQUEST';
const UNREPOST_SUCCESS = 'UNREPOST_SUCCESS';
const UNREPOST_FAIL    = 'UNREPOST_FAIL';

const UNLIKE_REQUEST = 'UNLIKE_REQUEST';
const UNLIKE_SUCCESS = 'UNLIKE_SUCCESS';
const UNLIKE_FAIL    = 'UNLIKE_FAIL';

const REPOSTS_FETCH_REQUEST = 'REPOSTS_FETCH_REQUEST';
const REPOSTS_FETCH_SUCCESS = 'REPOSTS_FETCH_SUCCESS';
const REPOSTS_FETCH_FAIL    = 'REPOSTS_FETCH_FAIL';

const LIKES_FETCH_REQUEST = 'LIKES_FETCH_REQUEST';
const LIKES_FETCH_SUCCESS = 'LIKES_FETCH_SUCCESS';
const LIKES_FETCH_FAIL    = 'LIKES_FETCH_FAIL';

const PIN_REQUEST = 'PIN_REQUEST';
const PIN_SUCCESS = 'PIN_SUCCESS';
const PIN_FAIL    = 'PIN_FAIL';

const UNPIN_REQUEST = 'UNPIN_REQUEST';
const UNPIN_SUCCESS = 'UNPIN_SUCCESS';
const UNPIN_FAIL    = 'UNPIN_FAIL';

const BOOKMARK_REQUEST = 'BOOKMARK_REQUEST';
const BOOKMARK_SUCCESS = 'BOOKMARKED_SUCCESS';
const BOOKMARK_FAIL    = 'BOOKMARKED_FAIL';

const UNBOOKMARK_REQUEST = 'UNBOOKMARKED_REQUEST';
const UNBOOKMARK_SUCCESS = 'UNBOOKMARKED_SUCCESS';
const UNBOOKMARK_FAIL    = 'UNBOOKMARKED_FAIL';

const LIKES_EXPAND_SUCCESS = 'LIKES_EXPAND_SUCCESS';
const LIKES_EXPAND_FAIL = 'LIKES_EXPAND_FAIL';

const REPOSTS_EXPAND_SUCCESS = 'REPOSTS_EXPAND_SUCCESS';
const REPOSTS_EXPAND_FAIL = 'REPOSTS_EXPAND_FAIL';

const messages = defineMessages({
  bookmarkAdded: { id: 'status.bookmarked', defaultMessage: 'Bookmark added.' },
  bookmarkRemoved: { id: 'status.unbookmarked', defaultMessage: 'Bookmark removed.' },
  view: { id: 'toast.view', defaultMessage: 'View' },
});

const repost = (status: StatusEntity) =>
  function(dispatch: AppDispatch, getState: () => RootState) {
    if (!isLoggedIn(getState)) return;

    dispatch(repostRequest(status));

    api(getState).post(`/api/statuses/${status.id}/repost`).then(function(response) {
      // The repost API method returns a new status wrapped around the original. In this case we are only
      // interested in how the original is modified, hence passing it skipping the wrapper
      dispatch(importFetchedStatus(response.data.repost));
      dispatch(repostSuccess(status));
    }).catch(error => {
      dispatch(repostFail(status, error));
    });
  };

const unrepost = (status: StatusEntity) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(unrepostRequest(status));

    api(getState).post(`/api/statuses/${status.id}/unrepost`).then(() => {
      dispatch(unrepostSuccess(status));
    }).catch(error => {
      dispatch(unrepostFail(status, error));
    });
  };

const toggleRepost = (status: StatusEntity) =>
  (dispatch: AppDispatch) => {
    if (status.reposted) {
      dispatch(unrepost(status));
    } else {
      dispatch(repost(status));
    }
  };

const repostRequest = (status: StatusEntity) => ({
  type: REPOST_REQUEST,
  status: status,
  skipLoading: true,
});

const repostSuccess = (status: StatusEntity) => ({
  type: REPOST_SUCCESS,
  status: status,
  skipLoading: true,
});

const repostFail = (status: StatusEntity, error: unknown) => ({
  type: REPOST_FAIL,
  status: status,
  error: error,
  skipLoading: true,
});

const unrepostRequest = (status: StatusEntity) => ({
  type: UNREPOST_REQUEST,
  status: status,
  skipLoading: true,
});

const unrepostSuccess = (status: StatusEntity) => ({
  type: UNREPOST_SUCCESS,
  status: status,
  skipLoading: true,
});

const unrepostFail = (status: StatusEntity, error: unknown) => ({
  type: UNREPOST_FAIL,
  status: status,
  error: error,
  skipLoading: true,
});

const like = (status: StatusEntity) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(likeRequest(status));

    api(getState).post(`/api/statuses/${status.id}/like`).then(function(response) {
      dispatch(likeSuccess(status));
    }).catch(function(error) {
      dispatch(likeFail(status, error));
    });
  };

const unlike = (status: StatusEntity) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(unlikeRequest(status));

    api(getState).post(`/api/statuses/${status.id}/unlike`).then(() => {
      dispatch(unlikeSuccess(status));
    }).catch(error => {
      dispatch(unlikeFail(status, error));
    });
  };

const toggleLike = (status: StatusEntity) =>
  (dispatch: AppDispatch) => {
    if (status.liked) {
      dispatch(unlike(status));
    } else {
      dispatch(like(status));
    }
  };

const likeRequest = (status: StatusEntity) => ({
  type: LIKE_REQUEST,
  status: status,
  skipLoading: true,
});

const likeSuccess = (status: StatusEntity) => ({
  type: LIKE_SUCCESS,
  status: status,
  skipLoading: true,
});

const likeFail = (status: StatusEntity, error: unknown) => ({
  type: LIKE_FAIL,
  status: status,
  error: error,
  skipLoading: true,
});

const unlikeRequest = (status: StatusEntity) => ({
  type: UNLIKE_REQUEST,
  status: status,
  skipLoading: true,
});

const unlikeSuccess = (status: StatusEntity) => ({
  type: UNLIKE_SUCCESS,
  status: status,
  skipLoading: true,
});

const unlikeFail = (status: StatusEntity, error: unknown) => ({
  type: UNLIKE_FAIL,
  status: status,
  error: error,
  skipLoading: true,
});

const bookmark = (status: StatusEntity) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(bookmarkRequest(status));

    api(getState).post(`/api/statuses/${status.id}/bookmark`).then(function(response) {
      dispatch(importFetchedStatus(response.data));
      dispatch(bookmarkSuccess(status, response.data));
      toast.success(messages.bookmarkAdded, {
        actionLabel: messages.view,
        actionLink: '/bookmarks',
      });
    }).catch(function(error) {
      dispatch(bookmarkFail(status, error));
    });
  };

const unbookmark = (status: StatusEntity) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(unbookmarkRequest(status));

    api(getState).post(`/api/statuses/${status.id}/unbookmark`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(unbookmarkSuccess(status, response.data));
      toast.success(messages.bookmarkRemoved);
    }).catch(error => {
      dispatch(unbookmarkFail(status, error));
    });
  };

const toggleBookmark = (status: StatusEntity) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (status.bookmarked) {
      dispatch(unbookmark(status));
    } else {
      dispatch(bookmark(status));
    }
  };

const bookmarkRequest = (status: StatusEntity) => ({
  type: BOOKMARK_REQUEST,
  status: status,
});

const bookmarkSuccess = (status: StatusEntity, response: APIEntity) => ({
  type: BOOKMARK_SUCCESS,
  status: status,
  response: response,
});

const bookmarkFail = (status: StatusEntity, error: unknown) => ({
  type: BOOKMARK_FAIL,
  status: status,
  error: error,
});

const unbookmarkRequest = (status: StatusEntity) => ({
  type: UNBOOKMARK_REQUEST,
  status: status,
});

const unbookmarkSuccess = (status: StatusEntity, response: APIEntity) => ({
  type: UNBOOKMARK_SUCCESS,
  status: status,
  response: response,
});

const unbookmarkFail = (status: StatusEntity, error: unknown) => ({
  type: UNBOOKMARK_FAIL,
  status: status,
  error,
});

const fetchReposts = (id: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(fetchRepostsRequest(id));

    api(getState).get(`/api/statuses/${id}/reposted_by`).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchRelationships(response.data.map((item: APIEntity) => item.id)));
      dispatch(fetchRepostsSuccess(id, response.data, next ? next.uri : null));
    }).catch(error => {
      dispatch(fetchRepostsFail(id, error));
    });
  };

const fetchRepostsRequest = (id: string) => ({
  type: REPOSTS_FETCH_REQUEST,
  id,
});

const fetchRepostsSuccess = (id: string, accounts: APIEntity[], next: string | null) => ({
  type: REPOSTS_FETCH_SUCCESS,
  id,
  accounts,
  next,
});

const fetchRepostsFail = (id: string, error: unknown) => ({
  type: REPOSTS_FETCH_FAIL,
  id,
  error,
});

const expandReposts = (id: string, path: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    api(getState).get(path).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchRelationships(response.data.map((item: APIEntity) => item.id)));
      dispatch(expandRepostsSuccess(id, response.data, next ? next.uri : null));
    }).catch(error => {
      dispatch(expandRepostsFail(id, error));
    });
  };

const expandRepostsSuccess = (id: string, accounts: APIEntity[], next: string | null) => ({
  type: REPOSTS_EXPAND_SUCCESS,
  id,
  accounts,
  next,
});

const expandRepostsFail = (id: string, error: unknown) => ({
  type: REPOSTS_EXPAND_FAIL,
  id,
  error,
});

const fetchLikes = (id: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(fetchLikesRequest(id));

    api(getState).get(`/api/statuses/${id}/liked_by`).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchRelationships(response.data.map((item: APIEntity) => item.id)));
      dispatch(fetchLikesSuccess(id, response.data, next ? next.uri : null));
    }).catch(error => {
      dispatch(fetchLikesFail(id, error));
    });
  };

const fetchLikesRequest = (id: string) => ({
  type: LIKES_FETCH_REQUEST,
  id,
});

const fetchLikesSuccess = (id: string, accounts: APIEntity[], next: string | null) => ({
  type: LIKES_FETCH_SUCCESS,
  id,
  accounts,
  next,
});

const fetchLikesFail = (id: string, error: unknown) => ({
  type: LIKES_FETCH_FAIL,
  id,
  error,
});

const expandLikes = (id: string, path: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    api(getState).get(path).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchRelationships(response.data.map((item: APIEntity) => item.id)));
      dispatch(expandLikesSuccess(id, response.data, next ? next.uri : null));
    }).catch(error => {
      dispatch(expandLikesFail(id, error));
    });
  };

const expandLikesSuccess = (id: string, accounts: APIEntity[], next: string | null) => ({
  type: LIKES_EXPAND_SUCCESS,
  id,
  accounts,
  next,
});

const expandLikesFail = (id: string, error: unknown) => ({
  type: LIKES_EXPAND_FAIL,
  id,
  error,
});

const pin = (status: StatusEntity) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(pinRequest(status));

    api(getState).post(`/api/statuses/${status.id}/pin`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(pinSuccess(status));
    }).catch(error => {
      dispatch(pinFail(status, error));
    });
  };

const pinToGroup = (status: StatusEntity, group: Group) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    return api(getState)
      .post(`/api/groups/${group.id}/statuses/${status.id}/pin`)
      .then(() => dispatch(expandGroupFeaturedTimeline(group.id)));
  };

const unpinFromGroup = (status: StatusEntity, group: Group) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    return api(getState)
      .post(`/api/groups/${group.id}/statuses/${status.id}/unpin`)
      .then(() => dispatch(expandGroupFeaturedTimeline(group.id)));
  };

const pinRequest = (status: StatusEntity) => ({
  type: PIN_REQUEST,
  status,
  skipLoading: true,
});

const pinSuccess = (status: StatusEntity) => ({
  type: PIN_SUCCESS,
  status,
  skipLoading: true,
});

const pinFail = (status: StatusEntity, error: unknown) => ({
  type: PIN_FAIL,
  status,
  error,
  skipLoading: true,
});

const unpin = (status: StatusEntity) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(unpinRequest(status));

    api(getState).post(`/api/statuses/${status.id}/unpin`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(unpinSuccess(status));
    }).catch(error => {
      dispatch(unpinFail(status, error));
    });
  };

const togglePin = (status: StatusEntity) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (status.pinned) {
      dispatch(unpin(status));
    } else {
      dispatch(pin(status));
    }
  };

const unpinRequest = (status: StatusEntity) => ({
  type: UNPIN_REQUEST,
  status,
  skipLoading: true,
});

const unpinSuccess = (status: StatusEntity) => ({
  type: UNPIN_SUCCESS,
  status,
  skipLoading: true,
});

const unpinFail = (status: StatusEntity, error: unknown) => ({
  type: UNPIN_FAIL,
  status,
  error,
  skipLoading: true,
});

export {
  REPOST_REQUEST,
  REPOST_SUCCESS,
  REPOST_FAIL,
  LIKE_REQUEST,
  LIKE_SUCCESS,
  LIKE_FAIL,
  UNREPOST_REQUEST,
  UNREPOST_SUCCESS,
  UNREPOST_FAIL,
  UNLIKE_REQUEST,
  UNLIKE_SUCCESS,
  UNLIKE_FAIL,
  REPOSTS_FETCH_REQUEST,
  REPOSTS_FETCH_SUCCESS,
  REPOSTS_FETCH_FAIL,
  LIKES_FETCH_REQUEST,
  LIKES_FETCH_SUCCESS,
  LIKES_FETCH_FAIL,
  PIN_REQUEST,
  PIN_SUCCESS,
  PIN_FAIL,
  UNPIN_REQUEST,
  UNPIN_SUCCESS,
  UNPIN_FAIL,
  BOOKMARK_REQUEST,
  BOOKMARK_SUCCESS,
  BOOKMARK_FAIL,
  UNBOOKMARK_REQUEST,
  UNBOOKMARK_SUCCESS,
  UNBOOKMARK_FAIL,
  LIKES_EXPAND_SUCCESS,
  LIKES_EXPAND_FAIL,
  REPOSTS_EXPAND_SUCCESS,
  REPOSTS_EXPAND_FAIL,
  repost,
  unrepost,
  toggleRepost,
  repostRequest,
  repostSuccess,
  repostFail,
  unrepostRequest,
  unrepostSuccess,
  unrepostFail,
  like,
  unlike,
  toggleLike,
  likeRequest,
  likeSuccess,
  likeFail,
  unlikeRequest,
  unlikeSuccess,
  unlikeFail,
  bookmark,
  unbookmark,
  toggleBookmark,
  bookmarkRequest,
  bookmarkSuccess,
  bookmarkFail,
  unbookmarkRequest,
  unbookmarkSuccess,
  unbookmarkFail,
  fetchReposts,
  fetchRepostsRequest,
  fetchRepostsSuccess,
  fetchRepostsFail,
  expandReposts,
  fetchLikes,
  fetchLikesRequest,
  fetchLikesSuccess,
  fetchLikesFail,
  expandLikes,
  pin,
  pinRequest,
  pinSuccess,
  pinFail,
  unpin,
  unpinRequest,
  unpinSuccess,
  unpinFail,
  togglePin,
  pinToGroup,
  unpinFromGroup,
};