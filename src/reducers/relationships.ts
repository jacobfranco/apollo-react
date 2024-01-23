import { Map as ImmutableMap } from 'immutable';

import { type Relationship, relationshipSchema } from 'src/schemas';

import {
    ACCOUNT_BLOCK_SUCCESS,
    ACCOUNT_UNBLOCK_SUCCESS,
    ACCOUNT_MUTE_SUCCESS,
    ACCOUNT_UNMUTE_SUCCESS,
    RELATIONSHIPS_FETCH_SUCCESS,
  } from '../actions/accounts';

  import type { APIEntity } from 'src/types/entities';
import { AnyAction } from 'redux';

  type State = ImmutableMap<string, Relationship>;
  type APIEntities = Array<APIEntity>;

  const normalizeRelationships = (state: State, relationships: APIEntities) => {
    relationships.forEach(relationship => {
      try {
        state = state.set(relationship.id, relationshipSchema.parse(relationship));
      } catch (_e) {
        // do nothing
      }
    });
  
    return state;
  };

export default function relationships(state: State = ImmutableMap<string, Relationship>(), action: AnyAction) {
    switch (action.type) {
      case ACCOUNT_BLOCK_SUCCESS:
      case ACCOUNT_UNBLOCK_SUCCESS:
      case ACCOUNT_MUTE_SUCCESS:
      case ACCOUNT_UNMUTE_SUCCESS:
      case RELATIONSHIPS_FETCH_SUCCESS:
        return normalizeRelationships(state, action.relationships);
      default:
        return state;
    }
  }

  