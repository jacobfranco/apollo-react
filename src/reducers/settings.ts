import { Map as ImmutableMap, fromJS } from "immutable";
import { AnyAction } from "redux";
import { ME_FETCH_SUCCESS } from "src/actions/me";
import { EMOJI_CHOOSE } from "../actions/emojis";
import { NOTIFICATIONS_FILTER_SET } from "../actions/notifications";
import { SEARCH_FILTER_SET } from "../actions/search";
import { SETTING_CHANGE, SETTING_SAVE } from "../actions/settings";
import type { Emoji } from "src/features/emoji";
import type { APIEntity } from "src/types/entities";

type State = ImmutableMap<string, any>;

// Key for localStorage
const LOCAL_STORAGE_KEY = "appSettings";

// Load settings from localStorage
const loadSettingsFromLocalStorage = (): State => {
  const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
  return savedSettings
    ? ImmutableMap(fromJS(JSON.parse(savedSettings)))
    : ImmutableMap({ saved: true });
};

// Save settings to localStorage
const saveSettingsToLocalStorage = (settings: State) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings.toJS()));
};

const updateFrequentEmojis = (state: State, emoji: Emoji) =>
  state
    .update("frequentlyUsedEmojis", ImmutableMap(), (map) =>
      map.update(emoji.id, 0, (count: number) => count + 1)
    )
    .set("saved", false);

const importSettings = (state: State, account: APIEntity) => {
  account = fromJS(account);
  const prefs = account.get("settings", ImmutableMap());
  return state.merge(prefs) as State;
};

export default function settings(
  state: State = loadSettingsFromLocalStorage(), // Initialize with saved settings
  action: AnyAction
): State {
  let newState = state;

  switch (action.type) {
    case ME_FETCH_SUCCESS:
      newState = importSettings(state, action.me);
      break;
    case NOTIFICATIONS_FILTER_SET:
    case SEARCH_FILTER_SET:
    case SETTING_CHANGE:
      newState = state.setIn(action.path, action.value).set("saved", false);
      break;
    case EMOJI_CHOOSE:
      newState = updateFrequentEmojis(state, action.emoji);
      break;
    case SETTING_SAVE:
      newState = state.set("saved", true);
      break;
    default:
      return state;
  }

  // Save settings to localStorage whenever they change
  saveSettingsToLocalStorage(newState);
  return newState;
}
