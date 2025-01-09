import { connect } from "react-redux";

import { cancelReplyCompose } from "src/actions/compose";
import { Status as StatusEntity } from "src/schemas";
import { makeGetStatus } from "src/selectors";

import ReplyIndicator from "src/features/compose/components/ReplyIndicator";

import type { AppDispatch, RootState } from "src/store";
import type { Status as LegacyStatus } from "src/types/entities";

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  const mapStateToProps = (
    state: RootState,
    { composeId }: { composeId: string }
  ) => {
    const statusId = state.compose.get(composeId)?.in_reply_to!;
    const editing = !!state.compose.get(composeId)?.id;

    return {
      status: (
        getStatus(state, { id: statusId }) as LegacyStatus
      )?.toJS() as StatusEntity,
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
