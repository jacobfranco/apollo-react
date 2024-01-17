import {
    AUTH_LOGGED_OUT
} from 'src/actions/auth'

import type { AnyAction } from 'redux';

import type { Me } from 'src/types/apollo';

const initialState: Me = null;

export default function me(state: Me = initialState, action: AnyAction): Me {
    switch (action.type) {
      case AUTH_LOGGED_OUT:
        return false;
      default:
        return state;
    }
  }