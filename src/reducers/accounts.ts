import { Map as ImmutableMap } from 'immutable';
import type { UnknownAction } from 'redux';
import { normalizeAccount } from 'src/normalizers/account';

type AccountRecord = ReturnType<typeof normalizeAccount>;

export interface ReducerAccount extends AccountRecord {}

type State = ImmutableMap<any, ReducerAccount>;
const initialState: State = ImmutableMap();

export default function accounts(state: State = initialState, action: UnknownAction): State {
  switch (action.type) {
    default:
      return state;
  }
}
