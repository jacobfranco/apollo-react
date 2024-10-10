import { Map as ImmutableMap } from 'immutable';
import {
  SPACE_FETCH_SUCCESS,
  SPACE_FOLLOW_REQUEST,
  SPACE_FOLLOW_SUCCESS,
  SPACE_FOLLOW_FAIL,
  SPACE_UNFOLLOW_REQUEST,
  SPACE_UNFOLLOW_SUCCESS,
  SPACE_UNFOLLOW_FAIL,
  ALL_SPACES_FETCH_SUCCESS,
} from 'src/actions/spaces';
import { normalizeSpace } from 'src/normalizers';
import type { AnyAction } from 'redux';
import type { Space, APIEntity } from 'src/types/entities';

interface SpacesState {
  byName: ImmutableMap<string, Space>;
  byUrl: ImmutableMap<string, Space>;
}

const initialState: SpacesState = {
  byName: ImmutableMap<string, Space>(),
  byUrl: ImmutableMap<string, Space>(),
};

const getUrlPath = (url: string) => url.split('/').pop() || '';

export default function spaces(state: SpacesState = initialState, action: AnyAction): SpacesState {

  switch (action.type) {
    case SPACE_FETCH_SUCCESS:
      const normalizedSpace = normalizeSpace(action.space);
      const spaceName = normalizedSpace.get('name');
      const spaceUrl = getUrlPath(normalizedSpace.get('url'));
      return {
        byName: state.byName.set(spaceName, normalizedSpace),
        byUrl: state.byUrl.set(spaceUrl, normalizedSpace),
      };

    case SPACE_FOLLOW_REQUEST:
    case SPACE_FOLLOW_SUCCESS:
      return {
        ...state,
        byName: state.byName.updateIn([action.name, 'following'], () => true),
        byUrl: state.byUrl.updateIn([getUrlPath(action.name), 'following'], () => true),
      };

    case SPACE_UNFOLLOW_REQUEST:
    case SPACE_UNFOLLOW_SUCCESS:
      return {
        ...state,
        byName: state.byName.updateIn([action.name, 'following'], () => false),
        byUrl: state.byUrl.updateIn([getUrlPath(action.name), 'following'], () => false),
      };

    case SPACE_FOLLOW_FAIL:
    case SPACE_UNFOLLOW_FAIL:
      // Revert the state change if the action fails
      return {
        ...state,
        byName: state.byName.updateIn([action.name, 'following'], (following) => !following),
        byUrl: state.byUrl.updateIn([getUrlPath(action.name), 'following'], (following) => !following),
      };

    case ALL_SPACES_FETCH_SUCCESS:
      console.log('ALL_SPACES_FETCH_SUCCESS reducer:', action.spaces);
      return (action.spaces as APIEntity[]).reduce((newState: SpacesState, space: APIEntity) => {
        const normalizedSpace = normalizeSpace(space);
        const spaceName = normalizedSpace.get('name');
        const spaceUrl = getUrlPath(normalizedSpace.get('url'));
        return {
          byName: newState.byName.set(spaceName, normalizedSpace),
          byUrl: newState.byUrl.set(spaceUrl, normalizedSpace),
        };
      }, state);

    default:
      return state;
  }
}