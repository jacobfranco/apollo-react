// reducers/matchesReducer.ts

import { Match } from 'src/schemas/match';
import {
  ADD_OR_UPDATE_MATCH,
  REMOVE_MATCH,
  FETCH_MATCH_SUCCESS,
} from 'src/actions/matches';

type MatchesState = {
  [matchId: number]: Match;
};

const initialState: MatchesState = {};

export default function matchesReducer(
  state = initialState,
  action: any
): MatchesState {
  switch (action.type) {
    case ADD_OR_UPDATE_MATCH:
    case FETCH_MATCH_SUCCESS: {
      const match = action.payload as Match;
      return {
        ...state,
        [match.id]: match,
      };
    }
    case REMOVE_MATCH: {
      const matchId = action.payload as number;
      const { [matchId]: removed, ...rest } = state;
      return rest;
    }
    default:
      return state;
  }
}
