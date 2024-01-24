import { AppDispatch, RootState } from 'src/store'

import { defineMessage } from 'react-intl';
import { Map as ImmutableMap } from 'immutable'
import { createSelector } from 'reselect';

import messages from 'src/messages';
import toast from 'src/toast';
import { isLoggedIn } from 'src/utils/auth';

const SETTING_CHANGE = 'SETTING_CHANGE' as const;
const SETTING_SAVE   = 'SETTING_SAVE' as const;

const saveSuccessMessage = defineMessage({ id: 'settings.save.success', defaultMessage: 'Your preferences have been saved!' });

/** Options when changing/saving settings. */
type SettingOpts = {
  /** Whether to display an alert when settings are saved. */
  showAlert?: boolean;
}

// TODO: Impelement more default settings
const defaultSettings = ImmutableMap({
  themeMode: 'system',
  locale: navigator.language || 'en',
});

interface SettingChangeAction {
  type: typeof SETTING_CHANGE;
  path: string[];
  value: any;
}

const getSettings = createSelector([
  (state: RootState) => state.apollo.get('defaultSettings'),
  (state: RootState) => state.settings,
], (apolloSettings, settings) => {
  return defaultSettings
    .mergeDeep(apolloSettings)
    .mergeDeep(settings);
});

const saveSettingsImmediate = (opts?: SettingOpts) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    const state = getState();
    if (getSettings(state).getIn(['saved'])) return;

    // Dispatch SETTING_SAVE directly
    dispatch({ type: SETTING_SAVE });

    if (opts?.showAlert) {
      toast.success(saveSuccessMessage);
    }
  };


const saveSettings = (opts?: SettingOpts) =>
  (dispatch: AppDispatch) => dispatch(saveSettingsImmediate(opts));

const getLocale = (state: RootState, fallback = 'en') => {
  const localeWithVariant = (getSettings(state).get('locale') as string).replace('_', '-');
  const locale = localeWithVariant.split('-')[0];
  return Object.keys(messages).includes(localeWithVariant) ? localeWithVariant : Object.keys(messages).includes(locale) ? locale : fallback;
};

const changeSetting = (path: string[], value: any, opts?: SettingOpts) =>
  (dispatch: AppDispatch) => {
    const action: SettingChangeAction = {
      type: SETTING_CHANGE,
      path,
      value,
    };

    dispatch(action);
    return dispatch(saveSettings(opts));
  };

export {
  SETTING_CHANGE,
  SETTING_SAVE,
  defaultSettings,
  getSettings,
  changeSetting,
  saveSettingsImmediate,
  saveSettings,
  getLocale,
}
