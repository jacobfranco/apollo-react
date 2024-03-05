import { normalizeApolloConfig } from 'src/normalizers';
import { createSelector } from 'reselect';
import { AppDispatch, RootState } from 'src/store';
import KVStore from 'src/storage/kv-store';
import { staticClient } from 'src/api';
import { APIEntity } from 'src/types/entities';
import { getAuthUserUrl, getMeUrl } from 'src/utils/auth';

const APOLLO_CONFIG_REMEMBER_REQUEST =  'APOLLO_CONFIG_REMEMBER_REQUEST';
const APOLLO_CONFIG_REMEMBER_SUCCESS =  'APOLLO_CONFIG_REMEMBER_SUCCESS';
const APOLLO_CONFIG_REMEMBER_FAIL    =  'APOLLO_CONFIG_REMEMBER_FAIL';

const APOLLO_CONFIG_REQUEST_SUCCESS = 'APOLLO_CONFIG_REQUEST_SUCCESS';
const APOLLO_CONFIG_REQUEST_FAIL    = 'APOLLO_CONFIG_REQUEST_FAIL';

// https://stackoverflow.com/a/46663081
const isObject = (o: any) => o instanceof Object && o.constructor === Object;

export const getHost = (state: RootState) => {
  const accountUrl = getMeUrl(state) || getAuthUserUrl(state) as string;

  try {
    return new URL(accountUrl).host;
  } catch {
    return null;
  }
};

const getApolloConfig = createSelector((state: RootState) => state.apollo, (apollo) => {
    return normalizeApolloConfig(apollo)
  }
);

// TODO: This stuff might not be necessary
const loadApolloConfig = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const host = getHost(getState());

    return dispatch(rememberApolloConfig(host)).then(() =>
      dispatch(fetchApolloConfig(host)),
    );
  };

  const rememberApolloConfig = (host: string | null) =>
  (dispatch: AppDispatch) => {
    dispatch({ type: APOLLO_CONFIG_REMEMBER_REQUEST, host });
    return KVStore.getItemOrError(`apollo_config:${host}`).then(apolloConfig => {
      dispatch({ type: APOLLO_CONFIG_REMEMBER_SUCCESS, host, apolloConfig });
      return apolloConfig;
    }).catch(error => {
      dispatch({ type: APOLLO_CONFIG_REMEMBER_FAIL, host, error, skipAlert: true });
    });
  };

const fetchApolloConfig = (host: string | null) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    return dispatch(fetchApolloJson(host));
  };

  const fetchApolloJson = (host: string | null) =>
  (dispatch: AppDispatch) =>
    staticClient.get('/instance/apollo.json').then(({ data }) => {
      if (!isObject(data)) throw 'apollo.json failed';
      dispatch(importApolloConfig(data, host));
      return data;
    }).catch(error => {
      dispatch(apolloConfigFail(error, host));
    });

    const importApolloConfig = (apolloConfig: APIEntity, host: string | null) => {
      if (!apolloConfig.brandColor) {
        apolloConfig.brandColor = '#A981FC';
      }
      return {
        type: APOLLO_CONFIG_REQUEST_SUCCESS,
        apolloConfig,
        host,
      };
    };
    
    const apolloConfigFail = (error: unknown, host: string | null) => ({
      type: APOLLO_CONFIG_REQUEST_FAIL,
      error,
      skipAlert: true,
      host,
    });

export {
  APOLLO_CONFIG_REQUEST_SUCCESS,
  APOLLO_CONFIG_REQUEST_FAIL,
  APOLLO_CONFIG_REMEMBER_REQUEST,
  APOLLO_CONFIG_REMEMBER_SUCCESS,
  APOLLO_CONFIG_REMEMBER_FAIL,
  getApolloConfig,
  rememberApolloConfig,
  fetchApolloConfig,
  loadApolloConfig,
  fetchApolloJson,
  importApolloConfig,
  apolloConfigFail,
}
