import { fetchRelationships } from 'src/actions/accounts';
import { importFetchedAccount, importFetchedAccounts, importFetchedStatuses } from 'src/actions/importer';
import { filterBadges, getTagDiff } from 'src/utils/badges';

import api, { getLinks } from '../api';

import type { AxiosResponse } from 'axios';
import type { AppDispatch, RootState } from 'src/store';
import type { APIEntity } from 'src/types/entities';

const ADMIN_CONFIG_FETCH_REQUEST = 'ADMIN_CONFIG_FETCH_REQUEST';
const ADMIN_CONFIG_FETCH_SUCCESS = 'ADMIN_CONFIG_FETCH_SUCCESS';
const ADMIN_CONFIG_FETCH_FAIL = 'ADMIN_CONFIG_FETCH_FAIL';

const ADMIN_CONFIG_UPDATE_REQUEST = 'ADMIN_CONFIG_UPDATE_REQUEST';
const ADMIN_CONFIG_UPDATE_SUCCESS = 'ADMIN_CONFIG_UPDATE_SUCCESS';
const ADMIN_CONFIG_UPDATE_FAIL = 'ADMIN_CONFIG_UPDATE_FAIL';

const ADMIN_REPORTS_FETCH_REQUEST = 'ADMIN_REPORTS_FETCH_REQUEST';
const ADMIN_REPORTS_FETCH_SUCCESS = 'ADMIN_REPORTS_FETCH_SUCCESS';
const ADMIN_REPORTS_FETCH_FAIL = 'ADMIN_REPORTS_FETCH_FAIL';

const ADMIN_REPORTS_PATCH_REQUEST = 'ADMIN_REPORTS_PATCH_REQUEST';
const ADMIN_REPORTS_PATCH_SUCCESS = 'ADMIN_REPORTS_PATCH_SUCCESS';
const ADMIN_REPORTS_PATCH_FAIL = 'ADMIN_REPORTS_PATCH_FAIL';

const ADMIN_USERS_FETCH_REQUEST = 'ADMIN_USERS_FETCH_REQUEST';
const ADMIN_USERS_FETCH_SUCCESS = 'ADMIN_USERS_FETCH_SUCCESS';
const ADMIN_USERS_FETCH_FAIL = 'ADMIN_USERS_FETCH_FAIL';

const ADMIN_USERS_DELETE_REQUEST = 'ADMIN_USERS_DELETE_REQUEST';
const ADMIN_USERS_DELETE_SUCCESS = 'ADMIN_USERS_DELETE_SUCCESS';
const ADMIN_USERS_DELETE_FAIL = 'ADMIN_USERS_DELETE_FAIL';

const ADMIN_USERS_APPROVE_REQUEST = 'ADMIN_USERS_APPROVE_REQUEST';
const ADMIN_USERS_APPROVE_SUCCESS = 'ADMIN_USERS_APPROVE_SUCCESS';
const ADMIN_USERS_APPROVE_FAIL = 'ADMIN_USERS_APPROVE_FAIL';

const ADMIN_USERS_DEACTIVATE_REQUEST = 'ADMIN_USERS_DEACTIVATE_REQUEST';
const ADMIN_USERS_DEACTIVATE_SUCCESS = 'ADMIN_USERS_DEACTIVATE_SUCCESS';
const ADMIN_USERS_DEACTIVATE_FAIL = 'ADMIN_USERS_DEACTIVATE_FAIL';

const ADMIN_STATUS_DELETE_REQUEST = 'ADMIN_STATUS_DELETE_REQUEST';
const ADMIN_STATUS_DELETE_SUCCESS = 'ADMIN_STATUS_DELETE_SUCCESS';
const ADMIN_STATUS_DELETE_FAIL = 'ADMIN_STATUS_DELETE_FAIL';

const ADMIN_STATUS_TOGGLE_SENSITIVITY_REQUEST = 'ADMIN_STATUS_TOGGLE_SENSITIVITY_REQUEST';
const ADMIN_STATUS_TOGGLE_SENSITIVITY_SUCCESS = 'ADMIN_STATUS_TOGGLE_SENSITIVITY_SUCCESS';
const ADMIN_STATUS_TOGGLE_SENSITIVITY_FAIL = 'ADMIN_STATUS_TOGGLE_SENSITIVITY_FAIL';

const ADMIN_LOG_FETCH_REQUEST = 'ADMIN_LOG_FETCH_REQUEST';
const ADMIN_LOG_FETCH_SUCCESS = 'ADMIN_LOG_FETCH_SUCCESS';
const ADMIN_LOG_FETCH_FAIL = 'ADMIN_LOG_FETCH_FAIL';

const ADMIN_USERS_TAG_REQUEST = 'ADMIN_USERS_TAG_REQUEST';
const ADMIN_USERS_TAG_SUCCESS = 'ADMIN_USERS_TAG_SUCCESS';
const ADMIN_USERS_TAG_FAIL = 'ADMIN_USERS_TAG_FAIL';

const ADMIN_USERS_UNTAG_REQUEST = 'ADMIN_USERS_UNTAG_REQUEST';
const ADMIN_USERS_UNTAG_SUCCESS = 'ADMIN_USERS_UNTAG_SUCCESS';
const ADMIN_USERS_UNTAG_FAIL = 'ADMIN_USERS_UNTAG_FAIL';

const ADMIN_USERS_SPACE_REQUEST = 'ADMIN_USERS_SPACE_REQUEST';
const ADMIN_USERS_SPACE_SUCCESS = 'ADMIN_USERS_SPACE_SUCCESS';
const ADMIN_USERS_SPACE_FAIL = 'ADMIN_USERS_SPACE_FAIL';

const ADMIN_USERS_UNSPACE_REQUEST = 'ADMIN_USERS_UNSPACE_REQUEST';
const ADMIN_USERS_UNSPACE_SUCCESS = 'ADMIN_USERS_UNSPACE_SUCCESS';
const ADMIN_USERS_UNSPACE_FAIL = 'ADMIN_USERS_UNSPACE_FAIL';

const ADMIN_ADD_PERMISSION_GROUP_REQUEST = 'ADMIN_ADD_PERMISSION_GROUP_REQUEST';
const ADMIN_ADD_PERMISSION_GROUP_SUCCESS = 'ADMIN_ADD_PERMISSION_GROUP_SUCCESS';
const ADMIN_ADD_PERMISSION_GROUP_FAIL = 'ADMIN_ADD_PERMISSION_GROUP_FAIL';

const ADMIN_REMOVE_PERMISSION_GROUP_REQUEST = 'ADMIN_REMOVE_PERMISSION_GROUP_REQUEST';
const ADMIN_REMOVE_PERMISSION_GROUP_SUCCESS = 'ADMIN_REMOVE_PERMISSION_GROUP_SUCCESS';
const ADMIN_REMOVE_PERMISSION_GROUP_FAIL = 'ADMIN_REMOVE_PERMISSION_GROUP_FAIL';

const ADMIN_USER_INDEX_EXPAND_FAIL = 'ADMIN_USER_INDEX_EXPAND_FAIL';
const ADMIN_USER_INDEX_EXPAND_REQUEST = 'ADMIN_USER_INDEX_EXPAND_REQUEST';
const ADMIN_USER_INDEX_EXPAND_SUCCESS = 'ADMIN_USER_INDEX_EXPAND_SUCCESS';

const ADMIN_USER_INDEX_FETCH_FAIL = 'ADMIN_USER_INDEX_FETCH_FAIL';
const ADMIN_USER_INDEX_FETCH_REQUEST = 'ADMIN_USER_INDEX_FETCH_REQUEST';
const ADMIN_USER_INDEX_FETCH_SUCCESS = 'ADMIN_USER_INDEX_FETCH_SUCCESS';

const ADMIN_USER_INDEX_QUERY_SET = 'ADMIN_USER_INDEX_QUERY_SET';


const fetchConfig = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: ADMIN_CONFIG_FETCH_REQUEST });
    return api(getState)
      .get('/api/admin/config')
      .then(({ data }) => {
        dispatch({ type: ADMIN_CONFIG_FETCH_SUCCESS, configs: data.configs, needsReboot: data.need_reboot });
      }).catch(error => {
        dispatch({ type: ADMIN_CONFIG_FETCH_FAIL, error });
      });
  };

const updateConfig = (configs: Record<string, any>[]) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: ADMIN_CONFIG_UPDATE_REQUEST, configs });
    return api(getState)
      .post('/api/admin/config', { configs })
      .then(({ data }) => {
        dispatch({ type: ADMIN_CONFIG_UPDATE_SUCCESS, configs: data.configs, needsReboot: data.need_reboot });
      }).catch(error => {
        dispatch({ type: ADMIN_CONFIG_UPDATE_FAIL, error, configs });
      });
  };

// TODO: Maybe change
const updateApolloConfig = (data: Record<string, any>) =>
  (dispatch: AppDispatch, _getState: () => RootState) => {
    const params = [{
      group: ':pleroma',
      key: ':frontend_configurations',
      value: [{
        tuple: [':apollo_fe', data],
      }],
    }];

    return dispatch(updateConfig(params));
  };

const fetchApolloReports = (params: Record<string, any>) =>
  (dispatch: AppDispatch, getState: () => RootState) =>
    api(getState)
      .get('/api/admin/reports', { params })
      .then(({ data: reports }) => {
        reports.forEach((report: APIEntity) => {
          dispatch(importFetchedAccount(report.account?.account));
          dispatch(importFetchedAccount(report.target_account?.account));
          dispatch(importFetchedStatuses(report.statuses));
        });
        dispatch({ type: ADMIN_REPORTS_FETCH_SUCCESS, reports, params });
      }).catch(error => {
        dispatch({ type: ADMIN_REPORTS_FETCH_FAIL, error, params });
      });


const fetchReports = (params: Record<string, any> = {}) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: ADMIN_REPORTS_FETCH_REQUEST, params });
    return dispatch(fetchApolloReports(params));
  };

const patchApolloReports = (reports: { id: string; state: string }[]) =>
  (dispatch: AppDispatch, getState: () => RootState) =>
    Promise.all(reports.map(({ id, state }) => api(getState)
      .post(`/api/admin/reports/${id}/${state === 'resolved' ? 'reopen' : 'resolve'}`)
      .then(() => {
        dispatch({ type: ADMIN_REPORTS_PATCH_SUCCESS, reports });
      }).catch(error => {
        dispatch({ type: ADMIN_REPORTS_PATCH_FAIL, error, reports });
      }),
    ));

const patchReports = (ids: string[], reportState: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();

    const reports = ids.map(id => ({ id, state: reportState }));

    dispatch({ type: ADMIN_REPORTS_PATCH_REQUEST, reports });
    return dispatch(patchApolloReports(reports));
  };

const closeReports = (ids: string[]) =>
  patchReports(ids, 'closed');

const fetchApolloUsers = (filters: string[], page: number, query: string | null | undefined, pageSize: number, next?: string | null) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const params: Record<string, any> = {
      username: query,
    };

    if (filters.includes('local')) params.local = true;
    if (filters.includes('active')) params.active = true;
    if (filters.includes('need_approval')) params.pending = true;

    return api(getState)
      .get(next || '/api/admin/accounts', { params })
      .then(({ data: accounts, ...response }) => {
        const next = getLinks(response as AxiosResponse<any, any>).refs.find(link => link.rel === 'next');

        const count = next
          ? page * pageSize + 1
          : (page - 1) * pageSize + accounts.length;

        dispatch(importFetchedAccounts(accounts.map(({ account }: APIEntity) => account)));
        dispatch(fetchRelationships(accounts.map((account: APIEntity) => account.id)));
        dispatch({ type: ADMIN_USERS_FETCH_SUCCESS, users: accounts, count, pageSize, filters, page, next: next?.uri || false });
        return { users: accounts, count, pageSize, next: next?.uri || false };
      }).catch(error =>
        dispatch({ type: ADMIN_USERS_FETCH_FAIL, error, filters, page, pageSize }),
      );
  };

const fetchUsers = (filters: string[] = [], page = 1, query?: string | null, pageSize = 50, next?: string | null) =>
  (dispatch: AppDispatch, getState: () => RootState) => {

    dispatch({ type: ADMIN_USERS_FETCH_REQUEST, filters, page, pageSize });
    return dispatch(fetchApolloUsers(filters, page, query, pageSize, next));
  };

const deactivateApolloUsers = (accountIds: string[], reportId?: string) =>
  (dispatch: AppDispatch, getState: () => RootState) =>
    Promise.all(accountIds.map(accountId => {
      api(getState)
        .post(`/api/admin/accounts/${accountId}/action`, {
          type: 'disable',
          report_id: reportId,
        })
        .then(() => {
          dispatch({ type: ADMIN_USERS_DEACTIVATE_SUCCESS, accountIds: [accountId] });
        }).catch(error => {
          dispatch({ type: ADMIN_USERS_DEACTIVATE_FAIL, error, accountIds: [accountId] });
        });
    }));

const deactivateUsers = (accountIds: string[], reportId?: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();

    dispatch({ type: ADMIN_USERS_DEACTIVATE_REQUEST, accountIds });
    return dispatch(deactivateApolloUsers(accountIds, reportId));
  };

const approveApolloUsers = (accountIds: string[]) =>
  (dispatch: AppDispatch, getState: () => RootState) =>
    Promise.all(accountIds.map(accountId => {
      api(getState)
        .post(`/api/admin/accounts/${accountId}/approve`)
        .then(({ data: user }) => {
          dispatch({ type: ADMIN_USERS_APPROVE_SUCCESS, users: [user], accountIds: [accountId] });
        }).catch(error => {
          dispatch({ type: ADMIN_USERS_APPROVE_FAIL, error, accountIds: [accountId] });
        });
    }));

const approveUsers = (accountIds: string[]) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();

    dispatch({ type: ADMIN_USERS_APPROVE_REQUEST, accountIds });

    return dispatch(approveApolloUsers(accountIds));
  };

const deleteStatus = (id: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: ADMIN_STATUS_DELETE_REQUEST, id });
    return api(getState)
      .delete(`/api/admin/statuses/${id}`)
      .then(() => {
        dispatch({ type: ADMIN_STATUS_DELETE_SUCCESS, id });
      }).catch(error => {
        dispatch({ type: ADMIN_STATUS_DELETE_FAIL, error, id });
      });
  };

const toggleStatusSensitivity = (id: string, sensitive: boolean) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: ADMIN_STATUS_TOGGLE_SENSITIVITY_REQUEST, id });
    return api(getState)
      .put(`/api/admin/statuses/${id}`, { sensitive: !sensitive })
      .then(() => {
        dispatch({ type: ADMIN_STATUS_TOGGLE_SENSITIVITY_SUCCESS, id });
      }).catch(error => {
        dispatch({ type: ADMIN_STATUS_TOGGLE_SENSITIVITY_FAIL, error, id });
      });
  };

const fetchModerationLog = (params?: Record<string, any>) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: ADMIN_LOG_FETCH_REQUEST });
    return api(getState)
      .get('/api/admin/moderation_log', { params })
      .then(({ data }) => {
        dispatch({ type: ADMIN_LOG_FETCH_SUCCESS, items: data.items, total: data.total });
        return data;
      }).catch(error => {
        dispatch({ type: ADMIN_LOG_FETCH_FAIL, error });
      });
  };


const setUserIndexQuery = (query: string) => ({ type: ADMIN_USER_INDEX_QUERY_SET, query });

const fetchUserIndex = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const { filters, page, query, pageSize, isLoading } = getState().admin_user_index;

    if (isLoading) return;

    dispatch({ type: ADMIN_USER_INDEX_FETCH_REQUEST });

    dispatch(fetchUsers(filters.toJS() as string[], page + 1, query, pageSize))
      .then((data: any) => {
        if (data.error) {
          dispatch({ type: ADMIN_USER_INDEX_FETCH_FAIL });
        } else {
          const { users, count, next } = (data);
          dispatch({ type: ADMIN_USER_INDEX_FETCH_SUCCESS, users, count, next });
        }
      }).catch(() => {
        dispatch({ type: ADMIN_USER_INDEX_FETCH_FAIL });
      });
  };

const expandUserIndex = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const { filters, page, query, pageSize, isLoading, next, loaded } = getState().admin_user_index;

    if (!loaded || isLoading) return;

    dispatch({ type: ADMIN_USER_INDEX_EXPAND_REQUEST });

    dispatch(fetchUsers(filters.toJS() as string[], page + 1, query, pageSize, next))
      .then((data: any) => {
        if (data.error) {
          dispatch({ type: ADMIN_USER_INDEX_EXPAND_FAIL });
        } else {
          const { users, count, next } = (data);
          dispatch({ type: ADMIN_USER_INDEX_EXPAND_SUCCESS, users, count, next });
        }
      }).catch(() => {
        dispatch({ type: ADMIN_USER_INDEX_EXPAND_FAIL });
      });
  };



export {
  ADMIN_CONFIG_FETCH_REQUEST,
  ADMIN_CONFIG_FETCH_SUCCESS,
  ADMIN_CONFIG_FETCH_FAIL,
  ADMIN_CONFIG_UPDATE_REQUEST,
  ADMIN_CONFIG_UPDATE_SUCCESS,
  ADMIN_CONFIG_UPDATE_FAIL,
  ADMIN_REPORTS_FETCH_REQUEST,
  ADMIN_REPORTS_FETCH_SUCCESS,
  ADMIN_REPORTS_FETCH_FAIL,
  ADMIN_REPORTS_PATCH_REQUEST,
  ADMIN_REPORTS_PATCH_SUCCESS,
  ADMIN_REPORTS_PATCH_FAIL,
  ADMIN_USERS_FETCH_REQUEST,
  ADMIN_USERS_FETCH_SUCCESS,
  ADMIN_USERS_FETCH_FAIL,
  ADMIN_USERS_DELETE_REQUEST,
  ADMIN_USERS_DELETE_SUCCESS,
  ADMIN_USERS_DELETE_FAIL,
  ADMIN_USERS_APPROVE_REQUEST,
  ADMIN_USERS_APPROVE_SUCCESS,
  ADMIN_USERS_APPROVE_FAIL,
  ADMIN_USERS_DEACTIVATE_REQUEST,
  ADMIN_USERS_DEACTIVATE_SUCCESS,
  ADMIN_USERS_DEACTIVATE_FAIL,
  ADMIN_STATUS_DELETE_REQUEST,
  ADMIN_STATUS_DELETE_SUCCESS,
  ADMIN_STATUS_DELETE_FAIL,
  ADMIN_STATUS_TOGGLE_SENSITIVITY_REQUEST,
  ADMIN_STATUS_TOGGLE_SENSITIVITY_SUCCESS,
  ADMIN_STATUS_TOGGLE_SENSITIVITY_FAIL,
  ADMIN_LOG_FETCH_REQUEST,
  ADMIN_LOG_FETCH_SUCCESS,
  ADMIN_LOG_FETCH_FAIL,
  ADMIN_USERS_TAG_REQUEST,
  ADMIN_USERS_TAG_SUCCESS,
  ADMIN_USERS_TAG_FAIL,
  ADMIN_USERS_UNTAG_REQUEST,
  ADMIN_USERS_UNTAG_SUCCESS,
  ADMIN_USERS_UNTAG_FAIL,
  ADMIN_USERS_SPACE_REQUEST,
  ADMIN_USERS_SPACE_SUCCESS,
  ADMIN_USERS_SPACE_FAIL,
  ADMIN_USERS_UNSPACE_REQUEST,
  ADMIN_USERS_UNSPACE_SUCCESS,
  ADMIN_USERS_UNSPACE_FAIL,
  ADMIN_ADD_PERMISSION_GROUP_REQUEST,
  ADMIN_ADD_PERMISSION_GROUP_SUCCESS,
  ADMIN_ADD_PERMISSION_GROUP_FAIL,
  ADMIN_REMOVE_PERMISSION_GROUP_REQUEST,
  ADMIN_REMOVE_PERMISSION_GROUP_SUCCESS,
  ADMIN_REMOVE_PERMISSION_GROUP_FAIL,
  ADMIN_USER_INDEX_EXPAND_FAIL,
  ADMIN_USER_INDEX_EXPAND_REQUEST,
  ADMIN_USER_INDEX_EXPAND_SUCCESS,
  ADMIN_USER_INDEX_FETCH_FAIL,
  ADMIN_USER_INDEX_FETCH_REQUEST,
  ADMIN_USER_INDEX_FETCH_SUCCESS,
  ADMIN_USER_INDEX_QUERY_SET,
  fetchConfig,
  updateConfig,
  updateApolloConfig,
  fetchReports,
  closeReports,
  fetchUsers,
  deactivateUsers,
  approveUsers,
  deleteStatus,
  toggleStatusSensitivity,
  fetchModerationLog,
  setUserIndexQuery,
  fetchUserIndex,
  expandUserIndex,
};