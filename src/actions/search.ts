import api, { getLinks } from 'src/api';
import { AppDispatch, RootState } from 'src/store'

import type { SearchFilter } from 'src/reducers/search';
import { APIEntity } from 'src/types/entities';
import { importFetchedAccounts } from './importer';

const SEARCH_CHANGE = 'SEARCH_CHANGE';
const SEARCH_CLEAR = 'SEARCH_CLEAR';
const SEARCH_SHOW = 'SEARCH_SHOW';
const SEARCH_RESULTS_CLEAR = 'SEARCH_RESULTS_CLEAR';

const SEARCH_FETCH_REQUEST = 'SEARCH_FETCH_REQUEST';
const SEARCH_FETCH_SUCCESS = 'SEARCH_FETCH_SUCCESS';
const SEARCH_FETCH_FAIL    = 'SEARCH_FETCH_FAIL';

const SEARCH_ACCOUNT_SET = 'SEARCH_ACCOUNT_SET';

const SEARCH_FILTER_SET = 'SEARCH_FILTER_SET';

const changeSearch = (value: string) =>
  (dispatch: AppDispatch) => {
    // If backspaced all the way, clear the search
    if (value.length === 0) {
      dispatch(clearSearchResults());
      return dispatch({
        type: SEARCH_CHANGE,
        value,
      });
    } else {
      return dispatch({
        type: SEARCH_CHANGE,
        value,
      });
    }
  };

const clearSearch = () => ({
  type: SEARCH_CLEAR,
});

const clearSearchResults = () => ({
  type: SEARCH_RESULTS_CLEAR,
});

const submitSearch = (filter?: SearchFilter) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const value = getState().search.value;
    const type = filter || getState().search.filter || 'accounts';
    const accountId = getState().search.accountId;

    // An empty search doesn't return any results
    if (value.length === 0) {
      return;
    }

    dispatch(fetchSearchRequest(value));

    const params: Record<string, any> = {
      q: value,
      resolve: true,
      limit: 20,
      type,
    };

    if (accountId) params.account_id = accountId;

    api(getState).get('/api/v2/search', { //TODO: get rid of v2 from api
      params,
    }).then(response => {
      if (response.data.accounts) {
        dispatch(importFetchedAccounts(response.data.accounts));
      }
      /* TODO: Implement statuses
      if (response.data.statuses) {
        dispatch(importFetchedStatuses(response.data.statuses));
      }
      */

      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(fetchSearchSuccess(response.data, value, type, next ? next.uri : null));
      // dispatch(fetchRelationships(response.data.accounts.map((item: APIEntity) => item.id))); // TODO: Implement relationships
    }).catch(error => {
      dispatch(fetchSearchFail(error));
    });
  };

  const fetchSearchRequest = (value: string) => ({
    type: SEARCH_FETCH_REQUEST,
    value,
  });
  
  const fetchSearchSuccess = (results: APIEntity[], searchTerm: string, searchType: SearchFilter, next: string | null) => ({
    type: SEARCH_FETCH_SUCCESS,
    results,
    searchTerm,
    searchType,
    next,
  });
  
  const fetchSearchFail = (error: unknown) => ({
    type: SEARCH_FETCH_FAIL,
    error,
  });

  const showSearch = () => ({
    type: SEARCH_SHOW,
  });
  
  const setSearchAccount = (accountId: string | null) => ({
    type: SEARCH_ACCOUNT_SET,
    accountId,
  });

  const setFilter = (filterType: SearchFilter) =>
  (dispatch: AppDispatch) => {
    dispatch(submitSearch(filterType));

    dispatch({
      type: SEARCH_FILTER_SET,
      path: ['search', 'filter'],
      value: filterType,
    });
  };

  export {
    SEARCH_CHANGE,
    SEARCH_CLEAR,
    SEARCH_SHOW,
    SEARCH_RESULTS_CLEAR,
    SEARCH_FETCH_REQUEST,
    SEARCH_FETCH_SUCCESS,
    SEARCH_FETCH_FAIL,
    SEARCH_ACCOUNT_SET,
    SEARCH_FILTER_SET,
    changeSearch,
    clearSearch,
    clearSearchResults,
    submitSearch,
    fetchSearchRequest,
    fetchSearchSuccess,
    fetchSearchFail,
    showSearch,
    setSearchAccount,
    setFilter,
  };