import { Map as ImmutableMap } from 'immutable'
import { AnyAction } from 'redux';
import { normalizeStatus } from 'src/normalizers';

type StatusRecord = ReturnType<typeof normalizeStatus>;

type State = ImmutableMap<string, ReducerStatus>;

export interface ReducerStatus extends StatusRecord {
    repost: string | null;
    poll: string | null;
    quote: string | null;
  }

const initialState: State = ImmutableMap();

export default function statuses(state = initialState, action: AnyAction): State {
    switch (action.type) {
      default:
        return state;
    }
}