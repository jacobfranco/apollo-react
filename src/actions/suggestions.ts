import { isLoggedIn } from 'src/utils/auth';

import api, { getLinks } from '../api';

import { fetchRelationships } from './accounts';
import { importFetchedAccounts } from './importer';
import { insertSuggestionsIntoTimeline } from './timelines';

import type { AppDispatch, RootState } from 'src/store';
import { APIEntity } from 'src/types/entities';

const SUGGESTIONS_DISMISS = 'SUGGESTIONS_DISMISS';

const SUGGESTIONS_FETCH_REQUEST = 'SUGGESTIONS_FETCH_REQUEST';
const SUGGESTIONS_FETCH_SUCCESS = 'SUGGESTIONS_FETCH_SUCCESS';
const SUGGESTIONS_FETCH_FAIL = 'SUGGESTIONS_FETCH_FAIL';

// Define the fetchSuggestions action creator
const fetchSuggestions = (params: Record<string, any> = { limit: 50 }) =>
(dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  const me = state.me;
  const next = state.suggestions.next;

  // Early return if 'me' is not defined
  if (!me) return null;

  // Dispatch the request action
  dispatch({ type: SUGGESTIONS_FETCH_REQUEST, skipLoading: true });

  return api(getState).get(next ? next : '/api/suggestions', next ? {} : { params })
    .then(response => {
      const suggestions: APIEntity[] = response.data;
      const accounts = suggestions.map(({ account }) => account);
      const nextLink = getLinks(response).refs.find(link => link.rel === 'next')?.uri;

      // Dispatch actions for fetched accounts and success
      dispatch(importFetchedAccounts(accounts));
      dispatch({
        type: SUGGESTIONS_FETCH_SUCCESS,
        suggestions,
        next: nextLink,
        skipLoading: true
      });

      return suggestions;
    })
    .then(suggestions => {
      // Extract account IDs for fetching relationships
      const accountIds = suggestions.map(({ account }) => account.id);
      dispatch(fetchRelationships(accountIds));
    })
    .catch(error => {
      // Dispatch failure action on error
      dispatch({
        type: SUGGESTIONS_FETCH_FAIL,
        error,
        skipLoading: true,
        skipAlert: true
      });
      throw error;
    });
};



const fetchSuggestionsForTimeline = () => (dispatch: AppDispatch, _getState: () => RootState) => {
  dispatch(fetchSuggestions({ limit: 20 }))?.then(() => dispatch(insertSuggestionsIntoTimeline()));
};

const dismissSuggestion = (accountId: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch({
      type: SUGGESTIONS_DISMISS,
      id: accountId,
    });

    api(getState).delete(`/api/v1/suggestions/${accountId}`);
  };

export {
  SUGGESTIONS_FETCH_REQUEST,
  SUGGESTIONS_FETCH_SUCCESS,
  SUGGESTIONS_FETCH_FAIL,
  SUGGESTIONS_DISMISS,
  fetchSuggestions,
  fetchSuggestionsForTimeline,
  dismissSuggestion,
};