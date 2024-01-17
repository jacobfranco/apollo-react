import { Map as ImmutableMap } from 'immutable';
import type { UnknownAction } from 'redux';
import type { Account } from 'src/schemas/account'

export interface ReducerAccount extends Account {}

type State = ImmutableMap<any, ReducerAccount>;

const initialState: State = ImmutableMap();

export default function accounts(state: State = initialState, action: UnknownAction): State {
  switch (action.type) {
    default:
      return state;
  }
}
