import { Map as ImmutableMap, List as ImmutableList, OrderedSet as ImmutableOrderedSet } from 'immutable';
import { defineMessage } from 'react-intl';
import { createSelector } from 'reselect';
import { v4 as uuid } from 'uuid';

import { patchMe } from 'src/actions/me';
import messages from 'src/messages';
import toast from 'src/toast';
import { isLoggedIn } from 'src/utils/auth';

import type { AppDispatch, RootState } from 'src/store';

const SETTING_CHANGE = 'SETTING_CHANGE' as const;
const SETTING_SAVE   = 'SETTING_SAVE' as const;
const SETTINGS_UPDATE = 'SETTINGS_UPDATE' as const;

const FE_NAME = 'apollo_fe'; // TODO: Maybe change

/** Options when changing/saving settings. */
type SettingOpts = {
  /** Whether to display an alert when settings are saved. */
  showAlert?: boolean;
}

const saveSuccessMessage = defineMessage({ id: 'settings.save.success', defaultMessage: 'Your preferences have been saved!' });

const defaultSettings = ImmutableMap({
  onboarded: false,
  skinTone: 1,
  reduceMotion: false,
  underlineLinks: false,
  autoPlayGif: true,
  displayMedia: 'default',
  expandSpoilers: false,
  unfollowModal: false,
  boostModal: false,
  deleteModal: true,
  missingDescriptionModal: false,
  defaultPrivacy: 'public',
  defaultContentType: 'text/plain',
  themeMode: 'system',
  locale: navigator.language || 'en',
  showExplanationBox: true,
  explanationBox: true,
  autoloadTimelines: true,
  autoloadMore: true,
  preserveSpoilers: false,

  systemFont: false,
  demetricator: false,

  isDeveloper: false,

  /* TODO: Implement chats
  chats: ImmutableMap({
    panes: ImmutableList(),
    mainWindow: 'minimized',
    sound: true,
  }),
  */

  home: ImmutableMap({
    shows: ImmutableMap({
      reblog: true,
      reply: true,
      direct: false,
    }),

    regex: ImmutableMap({
      body: '',
    }),
  }),

  notifications: ImmutableMap({
    alerts: ImmutableMap({
      follow: true,
      follow_request: false,
      like: true,
      repost: true,
      mention: true,
      poll: true,
      move: true,
    }),

    quickFilter: ImmutableMap({
      active: 'all',
      show: true,
      advanced: false,
    }),

    shows: ImmutableMap({
      follow: true,
      follow_request: true,
      like: true,
      repost: true,
      mention: true,
      poll: true,
      move: true,
    }),

    /*  TODO: Implement sounds
    sounds: ImmutableMap({
      follow: false,
      follow_request: false,
      like: false,
      repost: false,
      mention: false,
      poll: false,
      move: false,
    }),
    */ 
  }),

  community: ImmutableMap({
    shows: ImmutableMap({
      repost: false,
      reply: true,
      direct: false,
    }),
    other: ImmutableMap({
      onlyMedia: false,
    }),
    regex: ImmutableMap({
      body: '',
    }),
  }),

  public: ImmutableMap({
    shows: ImmutableMap({
      repost: true,
      reply: true,
      direct: false,
    }),
    other: ImmutableMap({
      onlyMedia: false,
    }),
    regex: ImmutableMap({
      body: '',
    }),
  }),

  direct: ImmutableMap({
    regex: ImmutableMap({
      body: '',
    }),
  }),

  account_timeline: ImmutableMap({
    shows: ImmutableMap({
      repost: true,
      pinned: true,
      direct: false,
    }),
  }),

  groups: ImmutableMap({}),

  trends: ImmutableMap({
    show: true,
  }),

  columns: ImmutableList([
    ImmutableMap({ id: 'COMPOSE', uuid: uuid(), params: {} }),
    ImmutableMap({ id: 'HOME', uuid: uuid(), params: {} }),
    ImmutableMap({ id: 'NOTIFICATIONS', uuid: uuid(), params: {} }),
  ]),

  remote_timeline: ImmutableMap({
    pinnedHosts: ImmutableOrderedSet(),
  }),
});

const getSettings = createSelector([
  (state: RootState) => state.apollo.get('defaultSettings'),
  (state: RootState) => state.settings,
], (apolloSettings, settings) => {
  return defaultSettings
    .mergeDeep(apolloSettings)
    .mergeDeep(settings);
});

interface SettingChangeAction {
  type: typeof SETTING_CHANGE;
  path: string[];
  value: any;
}

const changeSettingImmediate = (path: string[], value: any, opts?: SettingOpts) =>
  (dispatch: AppDispatch) => {
    const action: SettingChangeAction = {
      type: SETTING_CHANGE,
      path,
      value,
    };

    dispatch(action);
    dispatch(saveSettingsImmediate(opts));
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

const saveSettingsImmediate = (opts?: SettingOpts) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    const state = getState();
    if (getSettings(state).getIn(['saved'])) return;

    const data = state.settings.delete('saved').toJS();

    dispatch(patchMe({
      pleroma_settings_store: {
        [FE_NAME]: data,
      },
    })).then(() => {
      dispatch({ type: SETTING_SAVE });

      if (opts?.showAlert) {
        toast.success(saveSuccessMessage);
      }
    }).catch(error => {
      toast.showAlertForError(error);
    });
  };

const saveSettings = (opts?: SettingOpts) =>
  (dispatch: AppDispatch) => dispatch(saveSettingsImmediate(opts));

const getLocale = (state: RootState, fallback = 'en') => {
  const localeWithVariant = (getSettings(state).get('locale') as string).replace('_', '-');
  const locale = localeWithVariant.split('-')[0];
  return Object.keys(messages).includes(localeWithVariant) ? localeWithVariant : Object.keys(messages).includes(locale) ? locale : fallback;
};

type SettingsAction =
  | SettingChangeAction
  | { type: typeof SETTING_SAVE }

export {
  SETTING_CHANGE,
  SETTING_SAVE,
  SETTINGS_UPDATE,
  FE_NAME,
  defaultSettings,
  getSettings,
  changeSettingImmediate,
  changeSetting,
  saveSettingsImmediate,
  saveSettings,
  getLocale,
  type SettingsAction,
};