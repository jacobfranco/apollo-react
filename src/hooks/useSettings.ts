import { useMemo } from 'react';

import { getSettings } from 'src/actions/settings';
import { settingsSchema } from 'src/schemas/settings';

import { useAppSelector } from './useAppSelector';

/** Get the user settings from the store */
export const useSettings = () => {
  const data = useAppSelector((state) => getSettings(state));
  return useMemo(() => settingsSchema.parse(data.toJS()), [data]);
};