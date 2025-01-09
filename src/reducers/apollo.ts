import { List as ImmutableList, Map as ImmutableMap, fromJS } from "immutable";

import {
  APOLLO_CONFIG_REMEMBER_SUCCESS,
  APOLLO_CONFIG_REQUEST_SUCCESS,
  APOLLO_CONFIG_REQUEST_FAIL,
} from "src/actions/apollo";

const initialState = ImmutableMap<string, any>();

const fallbackState = ImmutableMap<string, any>({
  brandColor: "#a981fc", // Brand
  accentColor: "#110132", // Accent
});

const importApolloConfig = (
  state: ImmutableMap<string, any>,
  apolloConfig: ImmutableMap<string, any>,
  host: string
) => {
  return apolloConfig;
};

export default function apollo(
  state = initialState,
  action: Record<string, any>
) {
  switch (action.type) {
    case APOLLO_CONFIG_REMEMBER_SUCCESS:
      return fromJS(action.apolloConfig);
    case APOLLO_CONFIG_REQUEST_SUCCESS:
      return importApolloConfig(
        state,
        fromJS(action.apolloConfig) as ImmutableMap<string, any>,
        action.host
      );
    case APOLLO_CONFIG_REQUEST_FAIL:
      return fallbackState.mergeDeep(state);
    default:
      return state;
  }
}
