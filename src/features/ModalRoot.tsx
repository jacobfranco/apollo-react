import { PureComponent, Suspense } from "react";

import Base from "src/components/ModalRoot";
import {
  AccountModerationModal,
  ActionsModal,
  BoostModal,
  // CaptchaModal,
  ComposeModal,
  ConfirmationModal,
  // EditRuleModal,
  // EmbedModal,
  EmojiPickerModal,
  FamiliarFollowersModal,
  LikesModal,
  LolRegionFilterModal,
  HotkeysModal,
  // CreateGroupModal,
  MediaModal,
  MentionsModal,
  MissingDescriptionModal,
  MuteModal,
  OnboardingFlowModal,
  RepostsModal,
  ReplyMentionsModal,
  ReportModal,
  UnauthorizedModal,
  VideoModal,
} from "src/features/AsyncComponents";

import ModalLoading from "src/components/ModalLoading";

/* eslint sort-keys: "error" */
const MODAL_COMPONENTS: Record<string, React.ExoticComponent<any>> = {
  ACCOUNT_MODERATION: AccountModerationModal,
  ACTIONS: ActionsModal,
  BOOST: BoostModal,
  // 'CAPTCHA': CaptchaModal,
  COMPOSE: ComposeModal,
  CONFIRM: ConfirmationModal,
  // 'CREATE_GROUP': CreateGroupModal,
  // 'EDIT_RULE': EditRuleModal,
  // 'EMBED': EmbedModal,
  EMOJI_PICKER: EmojiPickerModal,
  FAMILIAR_FOLLOWERS: FamiliarFollowersModal,
  HOTKEYS: HotkeysModal,
  LIKES: LikesModal,
  LOL_REGION: LolRegionFilterModal,
  MEDIA: MediaModal,
  MENTIONS: MentionsModal,
  MISSING_DESCRIPTION: MissingDescriptionModal,
  MUTE: MuteModal,
  ONBOARDING_FLOW: OnboardingFlowModal,
  REPOSTS: RepostsModal,
  REPLY_MENTIONS: ReplyMentionsModal,
  REPORT: ReportModal,
  UNAUTHORIZED: UnauthorizedModal,
  VIDEO: VideoModal,
};

export type ModalType = keyof typeof MODAL_COMPONENTS | null;

interface IModalRoot {
  type: ModalType;
  props?: Record<string, any> | null;
  onClose: (type?: ModalType) => void;
}

export default class ModalRoot extends PureComponent<IModalRoot> {
  getSnapshotBeforeUpdate() {
    return { visible: !!this.props.type };
  }

  componentDidUpdate(prevProps: IModalRoot, prevState: any, { visible }: any) {
    if (visible) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }

  renderLoading = (modalId: string) => {
    return !["MEDIA", "VIDEO", "BOOST", "CONFIRM", "ACTIONS"].includes(
      modalId
    ) ? (
      <ModalLoading />
    ) : null;
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
        {Component && !!type && (
          <Suspense fallback={this.renderLoading(type)}>
            <Component {...props} onClose={this.onClickClose} />
          </Suspense>
        )}
      </Base>
    );
  }
}
