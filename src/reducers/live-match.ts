import { LiveMatch } from 'src/types/entities';
import {
  ADD_OR_UPDATE_LIVE_MATCH,
  REMOVE_LIVE_MATCH,
} from 'src/actions/live-match';

type LiveMatchState = {
  [matchId: number]: LiveMatch;
};

const initialState: LiveMatchState = {};

export default function liveMatchReducer(
  state = initialState,
  action: any
): LiveMatchState {
  switch (action.type) {
    case ADD_OR_UPDATE_LIVE_MATCH: {
      const liveMatch = action.payload as LiveMatch;
      return {
        ...state,
        [liveMatch.id]: liveMatch,
      };
    }
    case REMOVE_LIVE_MATCH: {
      const matchId = action.payload as number;
      const { [matchId]: removed, ...rest } = state;
      return rest;
    }
    default:
      return state;
  }
}