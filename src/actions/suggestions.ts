import { isLoggedIn } from "src/utils/auth";

import api from "../api";

import { fetchRelationships } from "./accounts";
import { importFetchedAccounts } from "./importer";
import { insertSuggestionsIntoTimeline } from "./timelines";

import type { AppDispatch, RootState } from "src/store";
import { APIEntity } from "src/types/entities";

const SUGGESTIONS_DISMISS = "SUGGESTIONS_DISMISS";

const SUGGESTIONS_FETCH_REQUEST = "SUGGESTIONS_FETCH_REQUEST";
const SUGGESTIONS_FETCH_SUCCESS = "SUGGESTIONS_FETCH_SUCCESS";
const SUGGESTIONS_FETCH_FAIL = "SUGGESTIONS_FETCH_FAIL";

// Define the fetchSuggestions action creator
const fetchSuggestions =
  (params: Record<string, any> = {}) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const next = getState().suggestions.next;

    dispatch({ type: SUGGESTIONS_FETCH_REQUEST, skipLoading: true });

    return api(getState)
      .get(next ?? "/api/suggestions", next ? {} : { searchParams: params })
      .then(async (response) => {
        const suggestions: APIEntity[] = await response.json();
        const accounts = suggestions.map(({ account }) => account);
        const next = response.next();

        dispatch(importFetchedAccounts(accounts));
        dispatch({
          type: SUGGESTIONS_FETCH_SUCCESS,
          suggestions,
          next,
          skipLoading: true,
        });
        return suggestions;
      })
      .catch((error) => {
        dispatch({
          type: SUGGESTIONS_FETCH_FAIL,
          error,
          skipLoading: true,
          skipAlert: true,
        });
        throw error;
      });
  };

const fetchSuggestionsForTimeline =
  () => (dispatch: AppDispatch, _getState: () => RootState) => {
    dispatch(fetchSuggestions({ limit: 20 }))?.then(() =>
      dispatch(insertSuggestionsIntoTimeline())
    );
  };

const dismissSuggestion =
  (accountId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch({
      type: SUGGESTIONS_DISMISS,
      id: accountId,
    });

    api(getState).delete(`/api/suggestions/${accountId}`);
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
