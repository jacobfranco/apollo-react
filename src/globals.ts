/**
 * globals: do things through the console.
 * This feature is for developers.
 */
import { changeSettingImmediate } from 'src/actions/settings';

import type { Store } from 'src/store';

/** Add Soapbox globals to the window. */
export const createGlobals = (store: Store) => {
  const Apollo = {
    /** Become a developer with `Apollo.isDeveloper()` */
    isDeveloper: (bool = true): boolean => {
      if (![true, false].includes(bool)) {
        throw `Invalid option ${bool}. Must be true or false.`;
      }
      store.dispatch(changeSettingImmediate(['isDeveloper'], bool) as any);
      return bool;
    },
  };

  (window as any).Apollo = Apollo;
};