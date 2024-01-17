import { EntityAction } from './actions'

import type { EntityCache } from './types';


/** Entity reducer state. */
interface State {
    [entityType: string]: EntityCache | undefined;
  }

/** Stores various entity data and lists in a one reducer. */
function reducer(state: Readonly<State> = {}, action: EntityAction): State {
    switch (action.type) {
      default:
        return state;
    }
  }
  
  export default reducer;
  export type { State };