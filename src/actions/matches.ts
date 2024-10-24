// actions/matches.ts

import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';
import { RootState } from 'src/store';
import api from 'src/api';
import { matchSchema, Match } from 'src/schemas/match';
import { ZodError } from 'zod';

// Action Types
export const ADD_OR_UPDATE_MATCH = 'matches/ADD_OR_UPDATE_MATCH';
export const REMOVE_MATCH = 'matches/REMOVE_MATCH';

export const FETCH_MATCH_REQUEST = 'matches/FETCH_MATCH_REQUEST';
export const FETCH_MATCH_SUCCESS = 'matches/FETCH_MATCH_SUCCESS';
export const FETCH_MATCH_FAILURE = 'matches/FETCH_MATCH_FAILURE';

// Action Creators
export const addOrUpdateMatch = (match: Match) => ({
  type: ADD_OR_UPDATE_MATCH,
  payload: match,
});

export const removeMatch = (matchId: number) => ({
  type: REMOVE_MATCH,
  payload: matchId,
});

export const fetchMatchRequest = (matchId: number) => ({
  type: FETCH_MATCH_REQUEST,
  payload: matchId,
});

export const fetchMatchSuccess = (match: Match) => ({
  type: FETCH_MATCH_SUCCESS,
  payload: match,
});

export const fetchMatchFailure = (error: string, matchId: number) => ({
  type: FETCH_MATCH_FAILURE,
  payload: { error, matchId },
});

// Thunk Action to Fetch a Match
export const fetchMatch = (
  matchId: number
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    dispatch(fetchMatchRequest(matchId));
    try {
      const client = api(getState);
      const response = await client.get(`/api/matches/${matchId}`);
      console.log('API Response Data:', response.data);
      const parsedData = matchSchema.parse(response.data);
      dispatch(fetchMatchSuccess(parsedData));
    } catch (error: any) {
      if (error instanceof ZodError) {
        console.error('Zod Validation Errors:', error.errors);
        dispatch(fetchMatchFailure('Invalid data format from API', matchId));
      } else {
        dispatch(fetchMatchFailure(error.message, matchId));
      }
    }
  };
};
