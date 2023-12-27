import { UnknownAction } from 'redux';
import { TOGGLE_THEME } from 'src/types/settings';

interface SettingsState {
  darkMode: boolean;
}

const initialState: SettingsState = {
  darkMode: false, // Or true, based on your default theme
};

const settingsReducer = (state = initialState, action: UnknownAction): SettingsState => {
  switch (action.type) {
    case TOGGLE_THEME:
      return {
        ...state,
        darkMode: !state.darkMode,
      };
    default:
      return state;
  }
};

export default settingsReducer;
