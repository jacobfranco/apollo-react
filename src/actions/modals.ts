import type { ModalType } from 'src/features/ModalRoot';

export const MODAL_CLOSE = 'MODAL_CLOSE';

/** Close the modal */
export function closeModal(type?: ModalType) {
    return {
      type: MODAL_CLOSE,
      modalType: type,
    };
  }