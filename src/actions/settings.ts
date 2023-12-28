export const TOGGLE_THEME = 'TOGGLE_THEME';

export const toggleTheme = (darkMode: boolean) => {
  return {
    type: TOGGLE_THEME,
    payload: darkMode,
  };
};
