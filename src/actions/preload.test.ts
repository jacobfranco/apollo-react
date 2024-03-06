import { Map as ImmutableMap } from 'immutable';

import { __stub } from 'src/api';
import { mockStore } from 'src/jest/test-helpers';

import { VERIFY_CREDENTIALS_REQUEST } from './auth';
import { ACCOUNTS_IMPORT } from './importer';
import {
  APOLLO_PRELOAD_IMPORT,
  preloadApollo,
} from './preload';

describe('preloadMastodon()', () => {
  it('creates the expected actions', async () => {
    const data = await import('src/__fixtures__/apollo_initial_state.json');

    __stub(mock => {
      mock.onGet('/api/v1/accounts/verify_credentials')
        .reply(200, {});
    });

    const store = mockStore(ImmutableMap());
    store.dispatch(preloadApollo(data));
    const actions = store.getActions();

    expect(actions[0].type).toEqual(ACCOUNTS_IMPORT);
    expect(actions[0].accounts[0].username).toEqual('Gargron');
    expect(actions[0].accounts[1].username).toEqual('benis911');

    expect(actions[1]).toEqual({
      type: VERIFY_CREDENTIALS_REQUEST,
      token: 'Nh15V9JWyY5Fshf2OJ_feNvOIkTV7YGVfEJFr0Y0D6Q',
    });

    expect(actions[2]).toEqual({ type: APOLLO_PRELOAD_IMPORT, data });
  });
});