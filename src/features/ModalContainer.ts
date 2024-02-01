import { connect } from 'react-redux';

import { cancelReplyCompose } from 'src/actions/compose';
import { cancelEventCompose } from 'src/actions/events';
import { closeModal } from 'src/actions/modals';
import { cancelReport } from 'src/actions/reports';

import ModalRoot, { ModalType } from '../components/modal-root';

import type { AppDispatch, RootState } from 'src/store';

const mapStateToProps = (state: RootState) => {
  const modal = state.modals.last({
    modalType: null,
    modalProps: {},
  });

  return {
    type: modal.modalType as ModalType,
    props: modal.modalProps,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  onClose(type?: ModalType) {
    switch (type) {
      case 'COMPOSE':
        dispatch(cancelReplyCompose());
        break;
      case 'COMPOSE_EVENT':
        dispatch(cancelEventCompose());
        break;
      case 'REPORT':
        dispatch(cancelReport());
        break;
      default:
        break;
    }

    dispatch(closeModal(type));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalRoot);