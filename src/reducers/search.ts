import { AnyAction } from 'redux';
import { 
    Record as ImmutableRecord,
    OrderedSet as ImmutableOrderedSet
} from 'immutable'
import {
    SEARCH_CHANGE,
    SEARCH_CLEAR,
    SEARCH_FETCH_REQUEST,
    SEARCH_FETCH_SUCCESS,
    SEARCH_SHOW,
    SEARCH_ACCOUNT_SET,
    SEARCH_RESULTS_CLEAR,
  } from 'src/actions/search';
import { APIEntity } from 'src/types/entities';

  const ResultsRecord = ImmutableRecord({ 
    accounts: ImmutableOrderedSet<string>(),
    statuses: ImmutableOrderedSet<string>(),
    groups: ImmutableOrderedSet<string>(),
    hashtags: ImmutableOrderedSet<Tag>(), // it's a list of maps
    accountsHasMore: false,
    statusesHasMore: false,
    groupsHasMore: false,
    hashtagsHasMore: false,
    accountsLoaded: false,
    statusesLoaded: false,
    groupsLoaded: false,
    hashtagsLoaded: false,
  });

  const ReducerRecord = ImmutableRecord({
    value: '',
    submitted: false,
    submittedValue: '',
    hidden: false,
    results: ResultsRecord(),
    filter: 'accounts' as SearchFilter,
    accountId: null as string | null,
    next: null as string | null,
  });

  type State = ReturnType<typeof ReducerRecord>;
  type APIEntities = Array<APIEntity>;
export type SearchFilter = 'accounts' | 'statuses' | 'groups' | 'hashtags'; 

const toIds = (items: APIEntities = []) => {
    return ImmutableOrderedSet(items.map(item => item.id));
  };

const importResults = (state: State, results: APIEntity, searchTerm: string, searchType: SearchFilter, next: string | null) => { 
    return state.withMutations(state => {
      if (state.value === searchTerm && state.filter === searchType) {
        state.set('results', ResultsRecord({
          accounts: toIds(results.accounts),
          statuses: toIds(results.statuses),
          groups: toIds(results.groups),
          hashtags: ImmutableOrderedSet(results.hashtags.map(normalizeTag)), // it's a list of records
          accountsHasMore: results.accounts.length >= 20,
          statusesHasMore: results.statuses.length >= 20,
          groupsHasMore: results.groups?.length >= 20,
          hashtagsHasMore: results.hashtags.length >= 20,
          accountsLoaded: true,
          statusesLoaded: true,
          groupsLoaded: true,
          hashtagsLoaded: true,
        }));
  
        state.set('submitted', true);
        state.set('next', next);
      }
    });
  };

const handleSubmitted = (state: State, value: string) => {
    return state.withMutations(state => {
      state.set('results', ResultsRecord());
      state.set('submitted', true);
      state.set('submittedValue', value);
    });
  };

export default function search(state = ReducerRecord(), action: AnyAction) {
    switch (action.type) {
      case SEARCH_CHANGE:
        return state.set('value', action.value);
      case SEARCH_CLEAR:
        return ReducerRecord();
      case SEARCH_RESULTS_CLEAR:
        return state.merge({
          value: '',
          results: ResultsRecord(),
          submitted: false,
          submittedValue: '',
        });
      case SEARCH_SHOW:
        return state.set('hidden', false);
      case SEARCH_FETCH_REQUEST:
        return handleSubmitted(state, action.value);
      case SEARCH_FETCH_SUCCESS:
        return importResults(state, action.results, action.searchTerm, action.searchType, action.next);
      case SEARCH_ACCOUNT_SET:
        if (!action.accountId) return state.merge({
          results: ResultsRecord(),
          submitted: false,
          submittedValue: '',
          filter: 'accounts',
          accountId: null,
        });
        return ReducerRecord({ accountId: action.accountId, filter: 'statuses' });
      default:
        return state;
    }
  }