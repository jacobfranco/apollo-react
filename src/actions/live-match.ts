import { LiveMatch } from 'src/types/entities';

export const ADD_OR_UPDATE_LIVE_MATCH = 'liveMatch/ADD_OR_UPDATE_LIVE_MATCH';
export const REMOVE_LIVE_MATCH = 'liveMatch/REMOVE_LIVE_MATCH';

export const addOrUpdateLiveMatch = (liveMatch: LiveMatch) => ({
  type: ADD_OR_UPDATE_LIVE_MATCH,
  payload: liveMatch,
});

export const removeLiveMatch = (matchId: number) => ({
  type: REMOVE_LIVE_MATCH,
  payload: matchId,
});
