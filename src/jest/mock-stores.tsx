import alexJson from 'src/__fixtures__/pleroma-account.json';

import { buildAccount } from './factory';

/** Store with a logged-in user. */
const storeLoggedIn = {
  me: alexJson.id,
  accounts: {
    [alexJson.id]: buildAccount(alexJson as any),
  },
};

export {
  storeLoggedIn,
};