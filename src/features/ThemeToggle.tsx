import React from 'react';

import { changeSetting } from 'src/actions/settings';
import { useAppDispatch, useSettings } from 'src/hooks';

import ThemeSelector from 'src/features/ThemeSelector';

/** Stateful theme selector. */
const ThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const { themeMode } = useSettings();

  const handleChange = (themeMode: string) => {
    dispatch(changeSetting(['themeMode'], themeMode));
  };

  return (
    <ThemeSelector
      value={themeMode}
      onChange={handleChange}
    />
  );
};

export default ThemeToggle;