import { __stub } from 'src/api';
import { mockStore, rootState } from 'src/jest/test-helpers';

import { fetchRules, RULES_FETCH_REQUEST, RULES_FETCH_SUCCESS } from './rules';

describe('fetchRules()', () => {
  it('sets the rules', async () => {
    const rules = await import('src/__fixtures__/rules.json');

    __stub((mock) => {
      mock.onGet('/api/instance/rules').reply(200, rules);
    });

    const store = mockStore(rootState);
    await store.dispatch(fetchRules());

    const actions = store.getActions();

    expect(actions[0].type).toEqual(RULES_FETCH_REQUEST);
    expect(actions[1].type).toEqual(RULES_FETCH_SUCCESS);
    expect(actions[1].payload[0].id).toEqual('1');
  });
});