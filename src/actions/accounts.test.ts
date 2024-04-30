import { Map as ImmutableMap } from 'immutable';

import { __stub } from 'src/api';
import { buildRelationship } from 'src/jest/factory';
import { mockStore, rootState } from 'src/jest/test-helpers';
import { normalizeAccount } from 'src/normalizers';
import { ListRecord, ReducerRecord } from 'src/reducers/user-lists';

import {
  authorizeFollowRequest,
  blockAccount,
  createAccount,
  expandFollowers,
  expandFollowing,
  expandFollowRequests,
  fetchAccount,
  fetchAccountByUsername,
  fetchFollowers,
  fetchFollowing,
  fetchFollowRequests,
  fetchRelationships,
  muteAccount,
  removeFromFollowers,
  unblockAccount,
  unmuteAccount,
} from './accounts';

let store: ReturnType<typeof mockStore>;

describe('createAccount()', () => {
  const params = {
    email: 'foo@bar.com',
  };

  describe('with a successful API request', () => {
    beforeEach(() => {
      const state = rootState;
      store = mockStore(state);

      __stub((mock) => {
        mock.onPost('/api/accounts').reply(200, { token: '123 ' });
      });
    });

    it('dispatches the correct actions', async() => {
      const expectedActions = [
        { type: 'ACCOUNT_CREATE_REQUEST', params },
        {
          type: 'ACCOUNT_CREATE_SUCCESS',
          params,
          token: { token: '123 ' },
        },
      ];
      await store.dispatch(createAccount(params));
      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });
});

describe('fetchAccount()', () => {
  const id = '123';

  describe('when the account has "should_refetch" set to false', () => {
    beforeEach(() => {
      const account = normalizeAccount({
        id,
        acct: 'justin-username',
        display_name: 'Justin L',
        avatar: 'test.jpg',
      });

      const state = rootState
        .set('entities', {
          'ACCOUNTS': {
            store: {
              [id]: account,
            },
            lists: {},
          },
        });

      store = mockStore(state);

      __stub((mock) => {
        mock.onGet(`/api/accounts${id}`).reply(200, account);
      });
    });

    it('should do nothing', async() => {
      await store.dispatch(fetchAccount(id));
      const actions = store.getActions();

      expect(actions).toEqual([]);
    });
  });

  describe('with a successful API request', async () => {
    const account = await import('src/__fixtures__/pleroma-account.json');

    beforeEach(() => {
      const state = rootState;
      store = mockStore(state);

      __stub((mock) => {
        mock.onGet(`/api/accounts${id}`).reply(200, account);
      });
    });

    it('should dispatch the correct actions', async() => {
      const expectedActions = [
        { type: 'ACCOUNT_FETCH_REQUEST', id: '123' },
        { type: 'ACCOUNTS_IMPORT', accounts: [account] },
        {
          type: 'ACCOUNT_FETCH_SUCCESS',
          account,
        },
      ];

      await store.dispatch(fetchAccount(id));
      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });

  describe('with an unsuccessful API request', () => {
    beforeEach(() => {
      const state = rootState;
      store = mockStore(state);

      __stub((mock) => {
        mock.onGet(`/api/accounts${id}`).networkError();
      });
    });

    it('should dispatch the correct actions', async() => {
      const expectedActions = [
        { type: 'ACCOUNT_FETCH_REQUEST', id: '123' },
        {
          type: 'ACCOUNT_FETCH_FAIL',
          id,
          error: new Error('Network Error'),
          skipAlert: true,
        },
      ];

      await store.dispatch(fetchAccount(id));
      const actions = store.getActions();

      expect(actions).toEqual(expectedActions);
    });
  });
});

describe('fetchAccountByUsername()', () => {
  const id = '123';
  const username = 'tiger';
  let state, account: any;

  beforeEach(() => {
    account = normalizeAccount({
      id,
      acct: username,
      display_name: 'Tiger',
      avatar: 'test.jpg',
      birthday: undefined,
    });

    state = rootState
      .set('entities', {
        'ACCOUNTS': {
          store: {
            [id]: account,
          },
          lists: {},
        },
      });

    store = mockStore(state);

    __stub((mock) => {
      mock.onGet(`/api/accounts${id}`).reply(200, account);
    });
  });

  describe('when "accountByUsername" feature is enabled', () => {
    beforeEach(() => {
      const state = rootState
        .set('me', '123');
      store = mockStore(state);
    });

    describe('with a successful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet(`/api/accounts${username}`).reply(200, account);
          mock.onGet(`/api/accountsrelationships?${[account.id].map(id => `id[]=${id}`).join('&')}`);
        });
      });

      it('should return dispatch the proper actions', async() => {
        await store.dispatch(fetchAccountByUsername(username));
        const actions = store.getActions();

        expect(actions[0]).toEqual({
          type: 'RELATIONSHIPS_FETCH_REQUEST',
          ids: ['123'],
          skipLoading: true,
        });
        expect(actions[1].type).toEqual('ACCOUNTS_IMPORT');
        expect(actions[2].type).toEqual('ACCOUNT_FETCH_SUCCESS');
      });
    });

    describe('with an unsuccessful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet(`/api/accounts${username}`).networkError();
        });
      });

      it('should return dispatch the proper actions', async() => {
        const expectedActions = [
          {
            type: 'ACCOUNT_FETCH_FAIL',
            id: null,
            error: new Error('Network Error'),
            skipAlert: true,
          },
          { type: 'ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP', username: 'tiger' },
        ];

        await store.dispatch(fetchAccountByUsername(username));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });

  describe('when "accountLookup" feature is enabled', () => {
    beforeEach(() => {
      const state = rootState
        .set('me', '123');
      store = mockStore(state);
    });

    describe('with a successful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('/api/accountslookup').reply(200, account);
        });
      });

      it('should return dispatch the proper actions', async() => {
        await store.dispatch(fetchAccountByUsername(username));
        const actions = store.getActions();

        expect(actions[0]).toEqual({
          type: 'ACCOUNT_LOOKUP_REQUEST',
          acct: username,
        });
        expect(actions[1].type).toEqual('ACCOUNTS_IMPORT');
        expect(actions[2].type).toEqual('ACCOUNT_LOOKUP_SUCCESS');
        expect(actions[3].type).toEqual('RELATIONSHIPS_FETCH_REQUEST');
        expect(actions[4].type).toEqual('ACCOUNT_FETCH_SUCCESS');
      });
    });

    describe('with an unsuccessful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('/api/accountslookup').networkError();
        });
      });

      it('should return dispatch the proper actions', async() => {
        const expectedActions = [
          { type: 'ACCOUNT_LOOKUP_REQUEST', acct: 'tiger' },
          { type: 'ACCOUNT_LOOKUP_FAIL' },
          {
            type: 'ACCOUNT_FETCH_FAIL',
            id: null,
            error: new Error('Network Error'),
            skipAlert: true,
          },
          { type: 'ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP', username },
        ];

        await store.dispatch(fetchAccountByUsername(username));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });

  describe('when using the accountSearch function', () => {
    beforeEach(() => {
      const state = rootState.set('me', '123');
      store = mockStore(state);
    });

    describe('with a successful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('/api/accountssearch').reply(200, [account]);
        });
      });

      it('should return dispatch the proper actions', async() => {
        await store.dispatch(fetchAccountByUsername(username));
        const actions = store.getActions();

        expect(actions[0]).toEqual({
          type: 'ACCOUNT_SEARCH_REQUEST',
          params: { q: username, limit: 5, resolve: true },
        });
        expect(actions[1].type).toEqual('ACCOUNTS_IMPORT');
        expect(actions[2].type).toEqual('ACCOUNT_SEARCH_SUCCESS');
        expect(actions[3]).toEqual({
          type: 'RELATIONSHIPS_FETCH_REQUEST',
          ids: [ '123' ],
          skipLoading: true,
        });
        expect(actions[4].type).toEqual('ACCOUNT_FETCH_SUCCESS');
      });
    });

    describe('with an unsuccessful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('/api/accountssearch').networkError();
        });
      });

      it('should return dispatch the proper actions', async() => {
        const expectedActions = [
          {
            type: 'ACCOUNT_SEARCH_REQUEST',
            params: { q: username, limit: 5, resolve: true },
          },
          { type: 'ACCOUNT_SEARCH_FAIL', skipAlert: true },
          {
            type: 'ACCOUNT_FETCH_FAIL',
            id: null,
            error: new Error('Network Error'),
            skipAlert: true,
          },
          { type: 'ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP', username },
        ];

        await store.dispatch(fetchAccountByUsername(username));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });
});

describe('blockAccount()', () => {
  const id = '1';

  describe('when logged out', () => {
    beforeEach(() => {
      const state = rootState.set('me', null);
      store = mockStore(state);
    });

    it('should do nothing', async() => {
      await store.dispatch(blockAccount(id));
      const actions = store.getActions();

      expect(actions).toEqual([]);
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      const state = rootState.set('me', '123');
      store = mockStore(state);
    });

    describe('with a successful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onPost(`/api/accounts${id}/block`).reply(200, {});
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'ACCOUNT_BLOCK_REQUEST', id },
          {
            type: 'ACCOUNT_BLOCK_SUCCESS',
            relationship: {},
            statuses: ImmutableMap({}),
          },
        ];
        await store.dispatch(blockAccount(id));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });

    describe('with an unsuccessful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onPost(`/api/accounts${id}/block`).networkError();
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'ACCOUNT_BLOCK_REQUEST', id },
          { type: 'ACCOUNT_BLOCK_FAIL', error: new Error('Network Error') },
        ];
        await store.dispatch(blockAccount(id));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });
});

describe('unblockAccount()', () => {
  const id = '1';

  describe('when logged out', () => {
    beforeEach(() => {
      const state = rootState.set('me', null);
      store = mockStore(state);
    });

    it('should do nothing', async() => {
      await store.dispatch(unblockAccount(id));
      const actions = store.getActions();

      expect(actions).toEqual([]);
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      const state = rootState.set('me', '123');
      store = mockStore(state);
    });

    describe('with a successful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onPost(`/api/accounts${id}/unblock`).reply(200, {});
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'ACCOUNT_UNBLOCK_REQUEST', id },
          {
            type: 'ACCOUNT_UNBLOCK_SUCCESS',
            relationship: {},
          },
        ];
        await store.dispatch(unblockAccount(id));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });

    describe('with an unsuccessful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onPost(`/api/accounts${id}/unblock`).networkError();
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'ACCOUNT_UNBLOCK_REQUEST', id },
          { type: 'ACCOUNT_UNBLOCK_FAIL', error: new Error('Network Error') },
        ];
        await store.dispatch(unblockAccount(id));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });
});

describe('muteAccount()', () => {
  const id = '1';

  describe('when logged out', () => {
    beforeEach(() => {
      const state = rootState.set('me', null);
      store = mockStore(state);
    });

    it('should do nothing', async() => {
      await store.dispatch(unblockAccount(id));
      const actions = store.getActions();

      expect(actions).toEqual([]);
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      const state = rootState.set('me', '123');
      store = mockStore(state);
    });

    describe('with a successful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onPost(`/api/accounts${id}/mute`).reply(200, {});
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'ACCOUNT_MUTE_REQUEST', id },
          {
            type: 'ACCOUNT_MUTE_SUCCESS',
            relationship: {},
            statuses: ImmutableMap({}),
          },
        ];
        await store.dispatch(muteAccount(id));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });

    describe('with an unsuccessful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onPost(`/api/accounts${id}/mute`).networkError();
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'ACCOUNT_MUTE_REQUEST', id },
          { type: 'ACCOUNT_MUTE_FAIL', error: new Error('Network Error') },
        ];
        await store.dispatch(muteAccount(id));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });
});

describe('unmuteAccount()', () => {
  const id = '1';

  describe('when logged out', () => {
    beforeEach(() => {
      const state = rootState.set('me', null);
      store = mockStore(state);
    });

    it('should do nothing', async() => {
      await store.dispatch(unblockAccount(id));
      const actions = store.getActions();

      expect(actions).toEqual([]);
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      const state = rootState.set('me', '123');
      store = mockStore(state);
    });

    describe('with a successful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onPost(`/api/accounts${id}/unmute`).reply(200, {});
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'ACCOUNT_UNMUTE_REQUEST', id },
          {
            type: 'ACCOUNT_UNMUTE_SUCCESS',
            relationship: {},
          },
        ];
        await store.dispatch(unmuteAccount(id));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });

    describe('with an unsuccessful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onPost(`/api/accounts${id}/unmute`).networkError();
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'ACCOUNT_UNMUTE_REQUEST', id },
          { type: 'ACCOUNT_UNMUTE_FAIL', error: new Error('Network Error') },
        ];
        await store.dispatch(unmuteAccount(id));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });
});

describe('removeFromFollowers()', () => {
  const id = '1';

  describe('when logged out', () => {
    beforeEach(() => {
      const state = rootState.set('me', null);
      store = mockStore(state);
    });

    it('should do nothing', async() => {
      await store.dispatch(removeFromFollowers(id));
      const actions = store.getActions();

      expect(actions).toEqual([]);
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      const state = rootState.set('me', '123');
      store = mockStore(state);
    });

    describe('with a successful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onPost(`/api/accounts${id}/remove_from_followers`).reply(200, {});
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'ACCOUNT_REMOVE_FROM_FOLLOWERS_REQUEST', id },
          {
            type: 'ACCOUNT_REMOVE_FROM_FOLLOWERS_SUCCESS',
            relationship: {},
          },
        ];
        await store.dispatch(removeFromFollowers(id));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });

    describe('with an unsuccessful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onPost(`/api/accounts${id}/remove_from_followers`).networkError();
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'ACCOUNT_REMOVE_FROM_FOLLOWERS_REQUEST', id },
          { type: 'ACCOUNT_REMOVE_FROM_FOLLOWERS_FAIL', id, error: new Error('Network Error') },
        ];
        await store.dispatch(removeFromFollowers(id));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });
});

describe('fetchFollowers()', () => {
  const id = '1';

  describe('when logged in', () => {
    beforeEach(() => {
      const state = rootState.set('me', '123');
      store = mockStore(state);
    });

    describe('with a successful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet(`/api/accounts${id}/followers`).reply(200, [], {
            link: `<https://example.com/api/accounts${id}/followers?since_id=1>; rel='prev'`,
          });
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'FOLLOWERS_FETCH_REQUEST', id },
          { type: 'ACCOUNTS_IMPORT', accounts: [] },
          {
            type: 'FOLLOWERS_FETCH_SUCCESS',
            id,
            accounts: [],
            next: null,
          },
        ];
        await store.dispatch(fetchFollowers(id));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });

    describe('with an unsuccessful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet(`/api/accounts${id}/followers`).networkError();
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'FOLLOWERS_FETCH_REQUEST', id },
          { type: 'FOLLOWERS_FETCH_FAIL', id, error: new Error('Network Error') },
        ];
        await store.dispatch(fetchFollowers(id));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });
});

describe('expandFollowers()', () => {
  const id = '1';

  describe('when logged out', () => {
    beforeEach(() => {
      const state = rootState.set('me', null);
      store = mockStore(state);
    });

    it('should do nothing', async() => {
      await store.dispatch(expandFollowers(id));
      const actions = store.getActions();

      expect(actions).toEqual([]);
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      const state = rootState
        .set('user_lists', ReducerRecord({
          followers: ImmutableMap({
            [id]: ListRecord({
              next: 'next_url',
            }),
          }),
        }))
        .set('me', '123');
      store = mockStore(state);
    });

    describe('when the url is null', () => {
      beforeEach(() => {
        const state = rootState
          .set('user_lists', ReducerRecord({
            followers: ImmutableMap({
              [id]: ListRecord({
                next: null,
              }),
            }),
          }))
          .set('me', '123');
        store = mockStore(state);
      });

      it('should do nothing', async() => {
        await store.dispatch(expandFollowers(id));
        const actions = store.getActions();

        expect(actions).toEqual([]);
      });
    });

    describe('with a successful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('next_url').reply(200, [], {
            link: `<https://example.com/api/accounts${id}/followers?since_id=1>; rel='prev'`,
          });
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'FOLLOWERS_EXPAND_REQUEST', id },
          { type: 'ACCOUNTS_IMPORT', accounts: [] },
          {
            type: 'FOLLOWERS_EXPAND_SUCCESS',
            id,
            accounts: [],
            next: null,
          },
        ];
        await store.dispatch(expandFollowers(id));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });

    describe('with an unsuccessful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('next_url').networkError();
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'FOLLOWERS_EXPAND_REQUEST', id },
          { type: 'FOLLOWERS_EXPAND_FAIL', id, error: new Error('Network Error') },
        ];
        await store.dispatch(expandFollowers(id));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });
});

describe('fetchFollowing()', () => {
  const id = '1';

  describe('when logged in', () => {
    beforeEach(() => {
      const state = rootState.set('me', '123');
      store = mockStore(state);
    });

    describe('with a successful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet(`/api/accounts${id}/following`).reply(200, [], {
            link: `<https://example.com/api/accounts${id}/following?since_id=1>; rel='prev'`,
          });
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'FOLLOWING_FETCH_REQUEST', id },
          { type: 'ACCOUNTS_IMPORT', accounts: [] },
          {
            type: 'FOLLOWING_FETCH_SUCCESS',
            id,
            accounts: [],
            next: null,
          },
        ];
        await store.dispatch(fetchFollowing(id));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });

    describe('with an unsuccessful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet(`/api/accounts${id}/following`).networkError();
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'FOLLOWING_FETCH_REQUEST', id },
          { type: 'FOLLOWING_FETCH_FAIL', id, error: new Error('Network Error') },
        ];
        await store.dispatch(fetchFollowing(id));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });
});

describe('expandFollowing()', () => {
  const id = '1';

  describe('when logged out', () => {
    beforeEach(() => {
      const state = rootState.set('me', null);
      store = mockStore(state);
    });

    it('should do nothing', async() => {
      await store.dispatch(expandFollowing(id));
      const actions = store.getActions();

      expect(actions).toEqual([]);
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      const state = rootState
        .set('user_lists', ReducerRecord({
          following: ImmutableMap({
            [id]: ListRecord({
              next: 'next_url',
            }),
          }),
        }))
        .set('me', '123');
      store = mockStore(state);
    });

    describe('when the url is null', () => {
      beforeEach(() => {
        const state = rootState
          .set('user_lists', ReducerRecord({
            following: ImmutableMap({
              [id]: ListRecord({
                next: null,
              }),
            }),
          }))
          .set('me', '123');
        store = mockStore(state);
      });

      it('should do nothing', async() => {
        await store.dispatch(expandFollowing(id));
        const actions = store.getActions();

        expect(actions).toEqual([]);
      });
    });

    describe('with a successful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('next_url').reply(200, [], {
            link: `<https://example.com/api/accounts${id}/following?since_id=1>; rel='prev'`,
          });
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'FOLLOWING_EXPAND_REQUEST', id },
          { type: 'ACCOUNTS_IMPORT', accounts: [] },
          {
            type: 'FOLLOWING_EXPAND_SUCCESS',
            id,
            accounts: [],
            next: null,
          },
        ];
        await store.dispatch(expandFollowing(id));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });

    describe('with an unsuccessful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('next_url').networkError();
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'FOLLOWING_EXPAND_REQUEST', id },
          { type: 'FOLLOWING_EXPAND_FAIL', id, error: new Error('Network Error') },
        ];
        await store.dispatch(expandFollowing(id));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });
});

describe('fetchRelationships()', () => {
  const id = '1';

  describe('when logged out', () => {
    beforeEach(() => {
      const state = rootState.set('me', null);
      store = mockStore(state);
    });

    it('should do nothing', async() => {
      await store.dispatch(fetchRelationships([id]));
      const actions = store.getActions();

      expect(actions).toEqual([]);
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      const state = rootState
        .set('me', '123');
      store = mockStore(state);
    });

    describe('without newAccountIds', () => {
      beforeEach(() => {
        const state = rootState
          .set('relationships', ImmutableMap({ [id]: buildRelationship() }))
          .set('me', '123');
        store = mockStore(state);
      });

      it('should do nothing', async() => {
        await store.dispatch(fetchRelationships([id]));
        const actions = store.getActions();

        expect(actions).toEqual([]);
      });
    });

    describe('with a successful API request', () => {
      beforeEach(() => {
        const state = rootState
          .set('relationships', ImmutableMap({}))
          .set('me', '123');
        store = mockStore(state);

        __stub((mock) => {
          mock
            .onGet(`/api/accountsrelationships?${[id].map(id => `id[]=${id}`).join('&')}`)
            .reply(200, []);
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'RELATIONSHIPS_FETCH_REQUEST', ids: [id], skipLoading: true },
          {
            type: 'RELATIONSHIPS_FETCH_SUCCESS',
            relationships: [],
            skipLoading: true,
          },
        ];
        await store.dispatch(fetchRelationships([id]));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });

    describe('with an unsuccessful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock
            .onGet(`/api/accountsrelationships?${[id].map(id => `id[]=${id}`).join('&')}`)
            .networkError();
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'RELATIONSHIPS_FETCH_REQUEST', ids: [id], skipLoading: true },
          { type: 'RELATIONSHIPS_FETCH_FAIL', skipLoading: true, error: new Error('Network Error') },
        ];
        await store.dispatch(fetchRelationships([id]));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });
});

describe('fetchFollowRequests()', () => {
  describe('when logged out', () => {
    beforeEach(() => {
      const state = rootState.set('me', null);
      store = mockStore(state);
    });

    it('should do nothing', async() => {
      await store.dispatch(fetchFollowRequests());
      const actions = store.getActions();

      expect(actions).toEqual([]);
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      const state = rootState
        .set('me', '123');
      store = mockStore(state);
    });

    describe('with a successful API request', () => {
      beforeEach(() => {
        const state = rootState
          .set('relationships', ImmutableMap({}))
          .set('me', '123');
        store = mockStore(state);

        __stub((mock) => {
          mock.onGet('/api/follow_requests').reply(200, [], {
            link: '<https://example.com/api/follow_requests?since_id=1>; rel=\'prev\'',
          });
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'FOLLOW_REQUESTS_FETCH_REQUEST' },
          { type: 'ACCOUNTS_IMPORT', accounts: [] },
          {
            type: 'FOLLOW_REQUESTS_FETCH_SUCCESS',
            accounts: [],
            next: null,
          },
        ];
        await store.dispatch(fetchFollowRequests());
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });

    describe('with an unsuccessful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('/api/follow_requests').networkError();
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'FOLLOW_REQUESTS_FETCH_REQUEST' },
          { type: 'FOLLOW_REQUESTS_FETCH_FAIL', error: new Error('Network Error') },
        ];
        await store.dispatch(fetchFollowRequests());
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });
});

describe('expandFollowRequests()', () => {
  describe('when logged out', () => {
    beforeEach(() => {
      const state = rootState.set('me', null);
      store = mockStore(state);
    });

    it('should do nothing', async() => {
      await store.dispatch(expandFollowRequests());
      const actions = store.getActions();

      expect(actions).toEqual([]);
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      const state = rootState
        .set('user_lists', ReducerRecord({
          follow_requests: ListRecord({
            next: 'next_url',
          }),
        }))
        .set('me', '123');
      store = mockStore(state);
    });

    describe('when the url is null', () => {
      beforeEach(() => {
        const state = rootState
          .set('user_lists', ReducerRecord({
            follow_requests: ListRecord({
              next: null,
            }),
          }))
          .set('me', '123');
        store = mockStore(state);
      });

      it('should do nothing', async() => {
        await store.dispatch(expandFollowRequests());
        const actions = store.getActions();

        expect(actions).toEqual([]);
      });
    });

    describe('with a successful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('next_url').reply(200, [], {
            link: '<next_url>; rel=\'prev\'',
          });
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'FOLLOW_REQUESTS_EXPAND_REQUEST' },
          { type: 'ACCOUNTS_IMPORT', accounts: [] },
          {
            type: 'FOLLOW_REQUESTS_EXPAND_SUCCESS',
            accounts: [],
            next: null,
          },
        ];
        await store.dispatch(expandFollowRequests());
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });

    describe('with an unsuccessful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('next_url').networkError();
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'FOLLOW_REQUESTS_EXPAND_REQUEST' },
          { type: 'FOLLOW_REQUESTS_EXPAND_FAIL', error: new Error('Network Error') },
        ];
        await store.dispatch(expandFollowRequests());
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });
});

describe('authorizeFollowRequest()', () => {
  const id = '1';

  describe('when logged out', () => {
    beforeEach(() => {
      const state = rootState.set('me', null);
      store = mockStore(state);
    });

    it('should do nothing', async() => {
      await store.dispatch(authorizeFollowRequest(id));
      const actions = store.getActions();

      expect(actions).toEqual([]);
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      const state = rootState.set('me', '123');
      store = mockStore(state);
    });

    describe('with a successful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onPost(`/api/follow_requests/${id}/authorize`).reply(200);
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'FOLLOW_REQUEST_AUTHORIZE_REQUEST', id },
          { type: 'FOLLOW_REQUEST_AUTHORIZE_SUCCESS', id },
        ];
        await store.dispatch(authorizeFollowRequest(id));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });

    describe('with an unsuccessful API request', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onPost(`/api/follow_requests/${id}/authorize`).networkError();
        });
      });

      it('should dispatch the correct actions', async() => {
        const expectedActions = [
          { type: 'FOLLOW_REQUEST_AUTHORIZE_REQUEST', id },
          { type: 'FOLLOW_REQUEST_AUTHORIZE_FAIL', id, error: new Error('Network Error') },
        ];
        await store.dispatch(authorizeFollowRequest(id));
        const actions = store.getActions();

        expect(actions).toEqual(expectedActions);
      });
    });
  });
});