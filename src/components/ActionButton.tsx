import banIcon from "@tabler/icons/outline/ban.svg";
import plusIcon from "@tabler/icons/outline/plus.svg";
import { defineMessages, useIntl } from "react-intl";

import {
  blockAccount,
  unblockAccount,
  muteAccount,
  unmuteAccount,
  authorizeFollowRequest,
  rejectFollowRequest,
} from "src/actions/accounts";
import { openModal } from "src/actions/modals";
import { useFollow } from "src/api/hooks/index";
import Button from "src/components/Button";
import HStack from "src/components/HStack";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useLoggedIn } from "src/hooks/useLoggedIn";

import type { Account } from "src/schemas/index";

const messages = defineMessages({
  block: { id: "account.block", defaultMessage: "Block @{name}" },
  blocked: { id: "account.blocked", defaultMessage: "Blocked" },
  edit_profile: { id: "account.edit_profile", defaultMessage: "Edit profile" },
  follow: { id: "account.follow", defaultMessage: "Follow" },
  mute: { id: "account.mute", defaultMessage: "Mute @{name}" },
  remote_follow: {
    id: "account.remote_follow",
    defaultMessage: "Remote follow",
  },
  requested: {
    id: "account.requested",
    defaultMessage: "Awaiting approval. Click to cancel follow request",
  },
  requested_small: {
    id: "account.requested_small",
    defaultMessage: "Awaiting approval",
  },
  unblock: { id: "account.unblock", defaultMessage: "Unblock @{name}" },
  unfollow: { id: "account.unfollow", defaultMessage: "Unfollow" },
  unmute: { id: "account.unmute", defaultMessage: "Unmute @{name}" },
  authorize: { id: "follow_request.authorize", defaultMessage: "Authorize" },
  reject: { id: "follow_request.reject", defaultMessage: "Reject" },
});

interface IActionButton {
  /** Target account for the action. */
  account: Account;
  /** Type of action to prioritize, eg on Blocks and Mutes pages. */
  actionType?: "muting" | "blocking" | "follow_request";
  /** Displays shorter text on the "Awaiting approval" button. */
  small?: boolean;
}

/**
 * Circumstantial action button (usually "Follow") to display on accounts.
 * May say "Unblock" or something else, depending on the relationship and
 * `actionType` prop.
 */
const ActionButton: React.FC<IActionButton> = ({
  account,
  actionType,
  small,
}) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const { isLoggedIn, me } = useLoggedIn();
  const { follow, unfollow } = useFollow();

  const handleFollow = () => {
    if (account.relationship?.following || account.relationship?.requested) {
      unfollow(account.id);
    } else {
      follow(account.id);
    }
  };

  const handleBlock = () => {
    if (account.relationship?.blocking) {
      dispatch(unblockAccount(account.id));
    } else {
      dispatch(blockAccount(account.id));
    }
  };

  const handleMute = () => {
    if (account.relationship?.muting) {
      dispatch(unmuteAccount(account.id));
    } else {
      dispatch(muteAccount(account.id));
    }
  };

  const handleAuthorize = () => {
    dispatch(authorizeFollowRequest(account.id));
  };

  const handleReject = () => {
    dispatch(rejectFollowRequest(account.id));
  };

  /** Handles actionType='muting' */
  const mutingAction = () => {
    const isMuted = account.relationship?.muting;
    const messageKey = isMuted ? messages.unmute : messages.mute;
    const text = intl.formatMessage(messageKey, { name: account.username });

    return (
      <Button
        theme={isMuted ? "danger" : "secondary"}
        size="sm"
        text={text}
        onClick={handleMute}
      />
    );
  };

  /** Handles actionType='blocking' */
  const blockingAction = () => {
    const isBlocked = account.relationship?.blocking;
    const messageKey = isBlocked ? messages.unblock : messages.block;
    const text = intl.formatMessage(messageKey, { name: account.username });

    return (
      <Button
        theme={isBlocked ? "danger" : "secondary"}
        size="sm"
        text={text}
        onClick={handleBlock}
      />
    );
  };

  const followRequestAction = () => {
    if (account.relationship?.followed_by) return null;

    return (
      <HStack space={2}>
        <Button
          theme="secondary"
          size="sm"
          text={intl.formatMessage(messages.authorize)}
          onClick={handleAuthorize}
        />
        <Button
          theme="danger"
          size="sm"
          text={intl.formatMessage(messages.reject)}
          onClick={handleReject}
        />
      </HStack>
    );
  };

  /** Render remote follow if federating, otherwise hide the button. */
  const renderLoggedOut = () => {
    return null;
  };

  if (!isLoggedIn) {
    return renderLoggedOut();
  }

  if (me !== account.id) {
    const isFollowing = account.relationship?.following;
    const blockedBy = account.relationship?.blocked_by as boolean;

    if (actionType) {
      if (actionType === "muting") {
        return mutingAction();
      } else if (actionType === "blocking") {
        return blockingAction();
      } else if (actionType === "follow_request") {
        return followRequestAction();
      }
    }

    if (!account.relationship) {
      // Wait until the relationship is loaded
      return null;
    } else if (account.relationship?.requested) {
      // Awaiting acceptance
      return (
        <Button
          size="sm"
          theme="tertiary"
          text={
            small
              ? intl.formatMessage(messages.requested_small)
              : intl.formatMessage(messages.requested)
          }
          onClick={handleFollow}
        />
      );
    } else if (
      !account.relationship?.blocking &&
      !account.relationship?.muting
    ) {
      // Follow & Unfollow

      let icon: string | undefined;

      if (blockedBy) {
        icon = banIcon;
      } else if (!isFollowing) {
        icon = plusIcon;
      }

      return (
        <Button
          size="sm"
          disabled={blockedBy}
          theme={isFollowing ? "secondary" : "primary"}
          icon={icon}
          onClick={handleFollow}
        >
          {isFollowing
            ? intl.formatMessage(messages.unfollow)
            : intl.formatMessage(
                blockedBy ? messages.blocked : messages.follow
              )}
        </Button>
      );
    } else if (account.relationship?.blocking) {
      // Unblock
      return (
        <Button
          theme="danger"
          size="sm"
          text={intl.formatMessage(messages.unblock, {
            name: account.username,
          })}
          onClick={handleBlock}
        />
      );
    }
  } else {
    // Edit profile
    return (
      <Button
        theme="tertiary"
        size="sm"
        text={intl.formatMessage(messages.edit_profile)}
        to="/settings/profile"
      />
    );
  }

  return null;
};

export default ActionButton;
