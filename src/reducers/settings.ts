import { Map as ImmutableMap, fromJS } from 'immutable'
import { AnyAction } from 'redux';

import { ME_FETCH_SUCCESS } from 'src/actions/me';

import type { APIEntity } from 'src/types/entities';

type State = ImmutableMap<string, any>;

const importSettings = (state: State, account: APIEntity) => {
  account = fromJS(account);
  const prefs = account.getIn(['settings_store'], ImmutableMap()); // TODO: Maybe remove
  return state.merge(prefs) as State;
};

export default function settings(state: State = ImmutableMap<string, any>({ saved: true }), action: AnyAction): State {
  switch (action.type) {
    case ME_FETCH_SUCCESS:
      return importSettings(state, action.me);
    default:
      return state;
  }
}