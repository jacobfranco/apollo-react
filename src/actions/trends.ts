import api from '../api';

import type { AppDispatch, RootState } from 'src/store';
import type { APIEntity } from 'src/types/entities';

const TRENDS_FETCH_REQUEST = 'TRENDS_FETCH_REQUEST';
const TRENDS_FETCH_SUCCESS = 'TRENDS_FETCH_SUCCESS';
const TRENDS_FETCH_FAIL    = 'TRENDS_FETCH_FAIL';

const fetchTrends = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(fetchTrendsRequest());

    api(getState).get('/api/trends').then(response => {
      dispatch(fetchTrendsSuccess(response.data));
    }).catch(error => dispatch(fetchTrendsFail(error)));
  };

const fetchTrendsRequest = () => ({
  type: TRENDS_FETCH_REQUEST,
  skipLoading: true,
});

const fetchTrendsSuccess = (tags: APIEntity[]) => ({
  type: TRENDS_FETCH_SUCCESS,
  tags,
  skipLoading: true,
});

const fetchTrendsFail = (error: unknown) => ({
  type: TRENDS_FETCH_FAIL,
  error,
  skipLoading: true,
  skipAlert: true,
});

export {
  TRENDS_FETCH_REQUEST,
  TRENDS_FETCH_SUCCESS,
  TRENDS_FETCH_FAIL,
  fetchTrends,
  fetchTrendsRequest,
  fetchTrendsSuccess,
  fetchTrendsFail,
};