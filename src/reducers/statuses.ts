import { Map as ImmutableMap } from 'immutable'
import { AnyAction } from 'redux';
import type { Status } from 'src/schemas/status'

export interface ReducerStatus extends Status {} // TODO: Maybe fix ?

type State = ImmutableMap<string, ReducerStatus>;

const initialState: State = ImmutableMap();

export default function statuses(state = initialState, action: AnyAction): State {
    switch (action.type) {
      default:
        return state;
    }
}