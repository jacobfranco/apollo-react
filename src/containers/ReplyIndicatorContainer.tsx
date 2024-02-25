import { connect } from 'react-redux';

import { cancelReplyCompose } from 'src/actions/compose';
import { makeGetStatus } from 'src/selectors';

import ReplyIndicator from 'src/features/compose/components/ReplyIndicator';

import type { AppDispatch, RootState } from 'src/store';
import type { Status } from 'src/types/entities';

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  const mapStateToProps = (state: RootState, { composeId }: { composeId: string }) => {
    const statusId = state.compose.get(composeId)?.in_reply_to!;
    const editing = !!state.compose.get(composeId)?.id;

    return {
      status: getStatus(state, { id: statusId }) as Status,
      hideActions: editing,
    };
  };

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch: AppDispatch) => ({

  onCancel() {
    dispatch(cancelReplyCompose());
  },

});

export default connect(makeMapStateToProps, mapDispatchToProps)(ReplyIndicator);