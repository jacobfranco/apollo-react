import { verifyCredentials } from './auth';
import { importFetchedAccounts } from './importer';

import type { AppDispatch } from 'src/store';

const APOLLO_PRELOAD_IMPORT = 'APOLLO_PRELOAD_IMPORT';

// This will throw if it fails.
// Should be called inside a try-catch.
const decodeFromMarkup = (elementId: string, decoder: (json: string) => Record<string, any>) => {
  const { textContent } = document.getElementById(elementId)!;
  return decoder(textContent as string);
};

const preloadFromMarkup = (elementId: string, decoder: (json: string) => Record<string, any>, action: (data: Record<string, any>) => any) =>
  (dispatch: AppDispatch) => {
    try {
      console.log(`[preloadFromMarkup] Attempting to decode from markup for elementId: ${elementId}`);
      const data = decodeFromMarkup(elementId, decoder);
      console.log(`[preloadFromMarkup] Decoded data from markup for elementId: ${elementId}`, data);
      dispatch(action(data));
      console.log(`[preloadFromMarkup] Dispatched action for decoded data from elementId: ${elementId}`);
    } catch (error) {
      console.error(`[preloadFromMarkup] Failed to decode from markup for elementId: ${elementId}`, error);
    }
  };

const preload = () =>
  (dispatch: AppDispatch) => {
     console.log("[preload] Starting preload process...");
    dispatch(preloadFromMarkup('initial-state', JSON.parse, preloadApollo));
  };

const preloadApollo = (data: Record<string, any>) =>
  (dispatch: AppDispatch) => {
    const { me, access_token } = data.meta;
    const { url } = data.accounts[me];

    dispatch(importFetchedAccounts(Object.values(data.accounts)));
    dispatch(verifyCredentials(access_token, url));
    dispatch({ type: APOLLO_PRELOAD_IMPORT, data });
  };

export {
  APOLLO_PRELOAD_IMPORT,
  preload,
  preloadApollo
};