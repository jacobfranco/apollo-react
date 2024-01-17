import { AnyAction, configureStore } from '@reduxjs/toolkit';
import { type ThunkDispatch } from 'redux-thunk';

import appReducer from './reducers';

export const store = configureStore({
  reducer: appReducer,
});

export type Store = typeof store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, Record<string, never>, AnyAction>;
