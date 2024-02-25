import { Record as ImmutableRecord } from 'immutable';

import { SW_UPDATING } from 'src/actions/sw';

import type { AnyAction } from 'redux';

const ReducerRecord = ImmutableRecord({
  /** Whether the ServiceWorker is currently updating (and we should display a loading screen). */
  swUpdating: false,
});

export default function meta(state = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case SW_UPDATING:
      return state.set('swUpdating', action.isUpdating);
    default:
      return state;
  }
}