import { UnknownAction } from 'redux';
import { TOGGLE_THEME } from 'src/types/settings';

interface SettingsState {
  darkMode: boolean;
}

const initialState: SettingsState = {
  darkMode: false,
};

const settingsReducer = (state = initialState, action: UnknownAction): SettingsState => {
  switch (action.type) {
    case TOGGLE_THEME: {
      const isDarkMode = typeof action.payload === 'boolean' ? action.payload : !state.darkMode;
      return {
        ...state,
        darkMode: isDarkMode,
      };
    }
    default:
      return state;
  }
};

export default settingsReducer;
