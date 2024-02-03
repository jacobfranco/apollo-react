import { List as ImmutableList } from 'immutable';

import { normalizeFilter } from 'src/normalizers';

import { FILTERS_FETCH_SUCCESS } from 'src/actions/filters';

import type { AnyAction } from 'redux';
import type { APIEntity, Filter as FilterEntity } from 'src/types/entities';

type State = ImmutableList<FilterEntity>;

const importFilters = (_state: State, filters: APIEntity[]): State =>
  ImmutableList(filters.map((filter) => normalizeFilter(filter)));

export default function filters(state: State = ImmutableList(), action: AnyAction): State {
  switch (action.type) {
    case FILTERS_FETCH_SUCCESS:
      return importFilters(state, action.filters);
    default:
      return state;
  }
}