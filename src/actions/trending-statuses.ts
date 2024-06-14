import api from '../api';

import { importFetchedStatuses } from './importer';

import type { AppDispatch, RootState } from 'src/store';

const TRENDING_STATUSES_FETCH_REQUEST = 'TRENDING_STATUSES_FETCH_REQUEST';
const TRENDING_STATUSES_FETCH_SUCCESS = 'TRENDING_STATUSES_FETCH_SUCCESS';
const TRENDING_STATUSES_FETCH_FAIL    = 'TRENDING_STATUSES_FETCH_FAIL';

const fetchTrendingStatuses = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();

    dispatch({ type: TRENDING_STATUSES_FETCH_REQUEST });
    return api(getState).get('/api/trends/statuses').then(({ data: statuses }) => {
      dispatch(importFetchedStatuses(statuses));
      dispatch({ type: TRENDING_STATUSES_FETCH_SUCCESS, statuses });
      return statuses;
    }).catch(error => {
      dispatch({ type: TRENDING_STATUSES_FETCH_FAIL, error });
    });
  };

export {
  TRENDING_STATUSES_FETCH_REQUEST,
  TRENDING_STATUSES_FETCH_SUCCESS,
  TRENDING_STATUSES_FETCH_FAIL,
  fetchTrendingStatuses,
};