import { List as ImmutableList, Map as ImmutableMap, fromJS } from 'immutable';

import KVStore from 'src/storage/kv-store';
import { ConfigDB } from 'src/utils/config-db';

import { ADMIN_CONFIG_UPDATE_SUCCESS } from '../actions/admin';
import {
  APOLLO_CONFIG_REMEMBER_SUCCESS,
  APOLLO_CONFIG_REQUEST_SUCCESS,
  APOLLO_CONFIG_REQUEST_FAIL,
} from 'src/actions/apollo';

const initialState = ImmutableMap<string, any>();

const fallbackState = ImmutableMap<string, any>({
  brandColor: '#a981fc', // Brand
  accentColor: '#a981fc' // Accent
});

const persistApolloConfig = (apolloConfig: ImmutableMap<string, any>, host: string) => {
  if (host) {
    KVStore.setItem(`apollo_config:${host}`, apolloConfig.toJS()).catch(console.error);
  }
};

const importApolloConfig = (state: ImmutableMap<string, any>, apolloConfig: ImmutableMap<string, any>, host: string) => {
  persistApolloConfig(apolloConfig, host);
  return apolloConfig;
};

export default function soapbox(state = initialState, action: Record<string, any>) {
  switch (action.type) {
    case APOLLO_CONFIG_REMEMBER_SUCCESS:
      return fromJS(action.soapboxConfig);
    case APOLLO_CONFIG_REQUEST_SUCCESS:
      return importApolloConfig(state, fromJS(action.soapboxConfig) as ImmutableMap<string, any>, action.host);
    case APOLLO_CONFIG_REQUEST_FAIL:
      return fallbackState.mergeDeep(state);
    default:
      return state;
  }
}