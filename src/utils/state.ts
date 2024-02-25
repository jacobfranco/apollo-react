import * as BuildConfig from 'src/build-config';
import { selectOwnAccount } from 'src/selectors';
import { isURL } from 'src/utils/auth';

import type { RootState } from 'src/store';

const getHost = (url: any): string => {
    try {
      return new URL(url).origin;
    } catch {
      return '';
    }
  };

export const getBaseURL = (state: RootState): string => {
    const account = selectOwnAccount(state);
    return isURL(BuildConfig.BACKEND_URL) ? BuildConfig.BACKEND_URL : getHost(account?.url);
  };