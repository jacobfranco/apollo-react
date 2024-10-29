import React, { ChangeEventHandler, useState } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { deactivateUserModal } from "src/actions/moderation";
import { useAccount } from "src/api/hooks/useAccount";
import Account from "src/components/Account";
import List, { ListItem } from "src/components/List";
import {
  Text,
  HStack,
  MissingIndicator,
  Modal,
  OutlineBox,
  Stack,
  Toggle,
} from "src/components";
import { useAppDispatch, useOwnAccount } from "src/hooks";
import toast from "src/toast";
// import { getBadges } from 'src/utils/badges'; TODO: Implement

// TODO: Butchered this file, need to reimplement

import BadgeInput from "src/components/BadgeInput";

const messages = defineMessages({
  userVerified: {
    id: "admin.users.user_verified_message",
    defaultMessage: "@{username} was verified",
  },
  userUnverified: {
    id: "admin.users.user_unverified_message",
    defaultMessage: "@{username} was unverified",
  },
  setDonorSuccess: {
    id: "admin.users.set_donor_message",
    defaultMessage: "@{username} was set as a donor",
  },
  removeDonorSuccess: {
    id: "admin.users.remove_donor_message",
    defaultMessage: "@{username} was removed as a donor",
  },
  userSuggested: {
    id: "admin.users.user_suggested_message",
    defaultMessage: "@{username} was suggested",
  },
  userUnsuggested: {
    id: "admin.users.user_unsuggested_message",
    defaultMessage: "@{username} was unsuggested",
  },
  badgesSaved: {
    id: "admin.users.badges_saved_message",
    defaultMessage: "Custom badges updated.",
  },
});

interface IAccountModerationModal {
  /** Action to close the modal. */
  onClose: (type: string) => void;
  /** ID of the account to moderate. */
  accountId: string;
}

/** Moderator actions against accounts. */
const AccountModerationModal: React.FC<IAccountModerationModal> = ({
  onClose,
  accountId,
}) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const { account: ownAccount } = useOwnAccount();
  const { account } = useAccount(accountId);

  // const accountBadges = account ? getBadges(account) : [];
  // const [badges, setBadges] = useState<string[]>(accountBadges);

  const handleClose = () => onClose("ACCOUNT_MODERATION");

  if (!account || !ownAccount) {
    return (
      <Modal onClose={handleClose}>
        <MissingIndicator />
      </Modal>
    );
  }

  const handleDeactivate = () => {
    dispatch(deactivateUserModal(intl, account.id));
  };

  /*
  const handleSaveBadges = () => {
    dispatch(saveBadges(account.id, accountBadges, badges))
      .then(() => toast.success(intl.formatMessage(messages.badgesSaved)))
      .catch(() => {});
  };
  */

  return (
    <Modal
      title={
        <FormattedMessage
          id="account_moderation_modal.title"
          defaultMessage="Moderate @{username}"
          values={{ username: account.username }}
        />
      }
      onClose={handleClose}
    >
      <Stack space={4}>
        <OutlineBox>
          <Account
            account={account}
            showProfileHoverCard={false}
            withLinkToProfile={false}
            hideActions
          />
        </OutlineBox>

        <List>
          <ListItem
            label={
              <FormattedMessage
                id="account_moderation_modal.fields.deactivate"
                defaultMessage="Deactivate account"
              />
            }
            onClick={handleDeactivate}
          />
        </List>

        <Text theme="subtle" size="xs">
          <FormattedMessage
            id="account_moderation_modal.info.id"
            defaultMessage="ID: {id}"
            values={{ id: account.id }}
          />
        </Text>
      </Stack>
    </Modal>
  );
};

export default AccountModerationModal;
