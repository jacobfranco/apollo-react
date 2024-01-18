import { RootState } from 'src/store'

import { Map as ImmutableMap } from 'immutable'

import messages from 'src/messages';

import { createSelector } from 'reselect';

const defaultSettings = ImmutableMap({
  themeMode: 'system',
  locale: navigator.language || 'en',
});

const getSettings = createSelector([
  (state: RootState) => state.apollo.get('defaultSettings'),
  (state: RootState) => state.settings,
], (apolloSettings, settings) => {
  return defaultSettings
    .mergeDeep(apolloSettings)
    .mergeDeep(settings);
});

const getLocale = (state: RootState, fallback = 'en') => {
  const localeWithVariant = (getSettings(state).get('locale') as string).replace('_', '-');
  const locale = localeWithVariant.split('-')[0];
  return Object.keys(messages).includes(localeWithVariant) ? localeWithVariant : Object.keys(messages).includes(locale) ? locale : fallback;
};

export {
  getLocale
}
