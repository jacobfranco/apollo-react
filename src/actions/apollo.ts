import { normalizeApolloConfig } from 'src/normalizers';
import { createSelector } from 'reselect';
import { AppDispatch, RootState } from 'src/store';

const getApolloConfig = createSelector((state: RootState) => state.apollo, (apollo) => {
    return normalizeApolloConfig(apollo)
  }
);

// TODO: Other stuff

export {
    getApolloConfig
}
