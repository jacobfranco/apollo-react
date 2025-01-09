import externalLinkIcon from "@tabler/icons/outline/external-link.svg";
import { ChangeEventHandler, useState } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { revokeName, setBadges as saveBadges } from "src/actions/admin";
import { deactivateUserModal, deleteUserModal } from "src/actions/moderation";
import { useSuggest, useVerify } from "src/api/hooks";
import { useAccount } from "src/api/hooks/index";
import Account from "src/components/Account";
import List, { ListItem } from "src/components/List";
import MissingIndicator from "src/components/MissingIndicator";
import OutlineBox from "src/components/OutlineBox";
import Button from "src/components/Button";
import HStack from "src/components/HStack";
import Modal from "src/components/Modal";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import Toggle from "src/components/Toggle";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useOwnAccount } from "src/hooks/useOwnAccount";
import toast from "src/toast";
import { getBadges } from "src/utils/badges";

import BadgeInput from "src/components/BadgeInput";
import StaffRolePicker from "src/components/StaffRolePicker";

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
  revokedName: {
    id: "admin.users.revoked_name_message",
    defaultMessage: "Name revoked.",
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

  const { suggest, unsuggest } = useSuggest();
  const { verify, unverify } = useVerify();
  const { account: ownAccount } = useOwnAccount();
  const { account } = useAccount(accountId);

  const accountBadges = account ? getBadges(account) : [];
  console.log("Initial accountBadges:", accountBadges);
  const [badges, setBadges] = useState<string[]>(accountBadges);

  const handleClose = () => onClose("ACCOUNT_MODERATION");

  if (!account || !ownAccount) {
    return (
      <Modal onClose={handleClose}>
        <MissingIndicator />
      </Modal>
    );
  }

  const handleVerifiedChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { checked } = e.target;

    const message = checked ? messages.userVerified : messages.userUnverified;
    const action = checked ? verify : unverify;

    action([account.id], {
      onSuccess: () =>
        toast.success(
          intl.formatMessage(message, { username: account.username })
        ),
    });
  };

  const handleSuggestedChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { checked } = e.target;

    const message = checked ? messages.userSuggested : messages.userUnsuggested;
    const action = checked ? suggest : unsuggest;

    action([account.id], {
      onSuccess: () =>
        toast.success(
          intl.formatMessage(message, { username: account.username })
        ),
    });
  };

  const handleDeactivate = () => {
    dispatch(deactivateUserModal(intl, account.id));
  };

  const handleRevokeName = () => {
    dispatch(revokeName(account.id))
      .then(() => toast.success(intl.formatMessage(messages.revokedName)))
      .catch(() => {});
  };

  const handleDelete = () => {
    dispatch(deleteUserModal(intl, account.id));
  };

  const handleSaveBadges = () => {
    console.log(
      "Saving badges - accountBadges:",
      accountBadges,
      "badges:",
      badges
    );
    dispatch(saveBadges(account.id, accountBadges, badges))
      .then(() => toast.success(intl.formatMessage(messages.badgesSaved)))
      .catch(() => {});
  };

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
          {ownAccount.admin && (
            <ListItem
              label={
                <FormattedMessage
                  id="account_moderation_modal.fields.account_role"
                  defaultMessage="Staff level"
                />
              }
            >
              <div className="w-auto">
                <StaffRolePicker account={account} />
              </div>
            </ListItem>
          )}

          <ListItem
            label={
              <FormattedMessage
                id="account_moderation_modal.fields.verified"
                defaultMessage="Verified account"
              />
            }
          >
            <Toggle
              checked={account.verified}
              onChange={handleVerifiedChange}
            />
          </ListItem>

          <ListItem
            label={
              <FormattedMessage
                id="account_moderation_modal.fields.suggested"
                defaultMessage="Suggested in people to follow"
              />
            }
          >
            <Toggle
              checked={account.is_suggested}
              onChange={handleSuggestedChange}
            />
          </ListItem>

          <ListItem
            label={
              <FormattedMessage
                id="account_moderation_modal.fields.badges"
                defaultMessage="Custom badges"
              />
            }
          >
            <div className="grow">
              <HStack className="w-full" alignItems="center" space={2}>
                <BadgeInput badges={badges} onChange={setBadges} />
                <Button onClick={handleSaveBadges}>
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Button>
              </HStack>
            </div>
          </ListItem>
        </List>

        <List>
          <ListItem
            label={
              <FormattedMessage
                id="account_moderation_modal.fields.revoke_name"
                defaultMessage="Revoke name"
              />
            }
            onClick={handleRevokeName}
          />

          <ListItem
            label={
              <FormattedMessage
                id="account_moderation_modal.fields.deactivate"
                defaultMessage="Deactivate account"
              />
            }
            onClick={handleDeactivate}
          />

          <ListItem
            label={
              <FormattedMessage
                id="account_moderation_modal.fields.delete"
                defaultMessage="Delete account"
              />
            }
            onClick={handleDelete}
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
