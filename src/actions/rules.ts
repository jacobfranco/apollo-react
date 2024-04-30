import api from '../api';

import type { Rule } from 'src/reducers/rules';
import type { RootState } from 'src/store';

const RULES_FETCH_REQUEST = 'RULES_FETCH_REQUEST';
const RULES_FETCH_SUCCESS = 'RULES_FETCH_SUCCESS';

type RulesFetchRequestAction = {
  type: typeof RULES_FETCH_REQUEST;
}

type RulesFetchRequestSuccessAction = {
  type: typeof RULES_FETCH_SUCCESS;
  payload: Rule[];
}

export type RulesActions = RulesFetchRequestAction | RulesFetchRequestSuccessAction

const fetchRules = () => (dispatch: React.Dispatch<RulesActions>, getState: () => RootState) => {
  dispatch({ type: RULES_FETCH_REQUEST });

  return api(getState)
    .get('/api/instance/rules')
    .then((response) => dispatch({ type: RULES_FETCH_SUCCESS, payload: response.data }));
};

export {
  fetchRules,
  RULES_FETCH_REQUEST,
  RULES_FETCH_SUCCESS,
};