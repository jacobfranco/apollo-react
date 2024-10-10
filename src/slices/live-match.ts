import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LiveMatch } from 'src/types/entities'; // Adjust the import path as necessary

interface LiveMatchState {
  liveMatches: Record<number, LiveMatch>;
}

const initialState: LiveMatchState = {
  liveMatches: {},
};

const liveMatchSlice = createSlice({
  name: 'liveMatch',
  initialState,
  reducers: {
    addOrUpdateLiveMatch(state, action: PayloadAction<LiveMatch>) {
      const liveMatch = action.payload;
      state.liveMatches[liveMatch.id] = liveMatch;
    },
    removeLiveMatch(state, action: PayloadAction<number>) {
      const matchId = action.payload;
      delete state.liveMatches[matchId];
    },
  },
});

export const { addOrUpdateLiveMatch, removeLiveMatch } = liveMatchSlice.actions;

export default liveMatchSlice.reducer;
