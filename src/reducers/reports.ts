import { Record as ImmutableRecord, Set as ImmutableSet } from 'immutable';

import {
  REPORT_INIT,
  REPORT_SUBMIT_REQUEST,
  REPORT_SUBMIT_SUCCESS,
  REPORT_SUBMIT_FAIL,
  REPORT_CANCEL,
  REPORT_STATUS_TOGGLE,
  REPORT_COMMENT_CHANGE,
  REPORT_FORWARD_CHANGE,
  REPORT_BLOCK_CHANGE,
  REPORT_RULE_CHANGE,
  ReportableEntities,
} from 'src/actions/reports';

import type { AnyAction } from 'redux';
import type { /* ChatMessage,*/  Group } from 'src/types/entities';

const NewReportRecord = ImmutableRecord({
  isSubmitting: false,
  entityType: '' as ReportableEntities,
  account_id: null as string | null,
  status_ids: ImmutableSet<string>(),
  // chat_message: null as null | ChatMessage,
  group: null as null | Group,
  comment: '',
  forward: false,
  block: false,
  rule_ids: ImmutableSet<string>(),
});

const ReducerRecord = ImmutableRecord({
  new: NewReportRecord(),
});

type State = ReturnType<typeof ReducerRecord>;

export default function reports(state: State = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case REPORT_INIT:
      return state.withMutations(map => {
        map.setIn(['new', 'isSubmitting'], false);
        map.setIn(['new', 'account_id'], action.account.id);
        map.setIn(['new', 'entityType'], action.entityType);

        /* 
        if (action.chatMessage) {
          map.setIn(['new', 'chat_message'], action.chatMessage);
        }
        */

        if (action.group) {
          map.setIn(['new', 'group'], action.group);
        }

        if (state.new.account_id !== action.account.id) {
          map.setIn(['new', 'status_ids'], action.status ? ImmutableSet([action.status.repost?.id || action.status.id]) : ImmutableSet());
          map.setIn(['new', 'comment'], '');
        } else if (action.status) {
          map.updateIn(['new', 'status_ids'], set => (set as ImmutableSet<string>).add(action.status.repost?.id || action.status.id));
        }
      });
    case REPORT_STATUS_TOGGLE:
      return state.updateIn(['new', 'status_ids'], set => {
        if (action.checked) {
          return (set as ImmutableSet<string>).add(action.statusId);
        }

        return (set as ImmutableSet<string>).remove(action.statusId);
      });
    case REPORT_COMMENT_CHANGE:
      return state.setIn(['new', 'comment'], action.comment);
    case REPORT_FORWARD_CHANGE:
      return state.setIn(['new', 'forward'], action.forward);
    case REPORT_BLOCK_CHANGE:
      return state.setIn(['new', 'block'], action.block);
    case REPORT_RULE_CHANGE:
      return state.updateIn(['new', 'rule_ids'], (set) => {
        if ((set as ImmutableSet<string>).includes(action.rule_id)) {
          return (set as ImmutableSet<string>).remove(action.rule_id);
        }

        return (set as ImmutableSet<string>).add(action.rule_id);
      });
    case REPORT_SUBMIT_REQUEST:
      return state.setIn(['new', 'isSubmitting'], true);
    case REPORT_SUBMIT_FAIL:
      return state.setIn(['new', 'isSubmitting'], false);
    case REPORT_CANCEL:
    case REPORT_SUBMIT_SUCCESS:
      return state.withMutations(map => {
        map.setIn(['new', 'account_id'], null);
        map.setIn(['new', 'status_ids'], ImmutableSet());
       //  map.setIn(['new', 'chat_message'], null);
        map.setIn(['new', 'comment'], '');
        map.setIn(['new', 'isSubmitting'], false);
        map.setIn(['new', 'rule_ids'], ImmutableSet());
        map.setIn(['new', 'block'], false);
      });
    default:
      return state;
  }
}