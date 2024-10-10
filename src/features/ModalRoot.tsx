import React, { Suspense } from 'react';

import Base from 'src/components/ModalRoot';

import {
  AccountModerationModal,
  ActionsModal,
  BoostModal,
  ComposeModal,
  ConfirmationModal,
  // EmbedModal,
  // FamiliarFollowersModal,
  HotkeysModal,
  // LandingPageModal,
  LikesModal,
  // CreateGroupModal,
  MediaModal,
  MentionsModal,
  MissingDescriptionModal,
  MuteModal,
  RegionFilterModal,
  RepostsModal,
  ReplyMentionsModal,
  ReportModal,
  UnauthorizedModal,
  // VideoModal,
} from 'src/features/AsyncComponents';

import ModalLoading from 'src/components/ModalLoading';

/* eslint sort-keys: "error" */
const MODAL_COMPONENTS: Record<string, React.LazyExoticComponent<any>> = {
  'ACCOUNT_MODERATION': AccountModerationModal,
  'ACTIONS': ActionsModal,
  'BOOST': BoostModal,
  'COMPOSE': ComposeModal,
  'CONFIRM': ConfirmationModal,
  // 'EMBED': EmbedModal,
  // 'FAMILIAR_FOLLOWERS': FamiliarFollowersModal,
  'HOTKEYS': HotkeysModal,
  // 'LANDING_PAGE': LandingPageModal,
  'LIKES': LikesModal,
  'MEDIA': MediaModal,
  'MENTIONS': MentionsModal,
  'MISSING_DESCRIPTION': MissingDescriptionModal,
  'MUTE': MuteModal,
  'REGION_FILTER': RegionFilterModal,
  'REPOSTS': RepostsModal,
  'REPLY_MENTIONS': ReplyMentionsModal,
  'REPORT': ReportModal,
  'UNAUTHORIZED': UnauthorizedModal,
  // 'VIDEO': VideoModal,
};

export type ModalType = keyof typeof MODAL_COMPONENTS | null;

interface IModalRoot {
  type: ModalType;
  props?: Record<string, any> | null;
  onClose: (type?: ModalType) => void;
}

export default class ModalRoot extends React.PureComponent<IModalRoot> {

  getSnapshotBeforeUpdate() {
    return { visible: !!this.props.type };
  }

  componentDidUpdate(prevProps: IModalRoot, prevState: any, { visible }: any) {
    if (visible) {
      document.body.classList.add('with-modals');
    } else {
      document.body.classList.remove('with-modals');
    }
  }

  renderLoading = (modalId: string) => {
    return !['MEDIA', 'VIDEO', 'BOOST', 'CONFIRM', 'ACTIONS'].includes(modalId) ? <ModalLoading /> : null;
  };

  onClickClose = (_?: ModalType) => {
    const { onClose, type } = this.props;
    onClose(type);
  };

  render() {
    const { type, props } = this.props;
    const Component = type ? MODAL_COMPONENTS[type] : null;

    return (
      <Base onClose={this.onClickClose} type={type}>
        {(Component && !!type) && (
          <Suspense fallback={this.renderLoading(type)}>
            <Component {...props} onClose={this.onClickClose} />
          </Suspense>
        )}
      </Base>
    );
  }

}