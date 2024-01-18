import { Map as ImmutableMap } from 'immutable'

const initialState = ImmutableMap<string, any>();

export default function apollo(state = initialState, action: Record<string, any>) {
    switch (action.type) {
      default:
        return state;
    }
  }