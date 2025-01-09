import alertTriangleIcon from "@tabler/icons/outline/alert-triangle.svg";
import trashIcon from "@tabler/icons/outline/trash.svg";
import userMinusIcon from "@tabler/icons/outline/user-minus.svg";
import userOffIcon from "@tabler/icons/outline/user-off.svg";
import { defineMessages, IntlShape } from "react-intl";

import { fetchAccountByUsername } from "src/actions/accounts";
import {
  deactivateUsers,
  deleteUser,
  deleteStatus,
  toggleStatusSensitivity,
} from "src/actions/admin";
import { openModal } from "src/actions/modals";
import OutlineBox from "src/components/OutlineBox";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import AccountContainer from "src/containers/AccountContainer";
import { selectAccount } from "src/selectors/index";
import toast from "src/toast";

import type { AppDispatch, RootState } from "src/store";

const messages = defineMessages({
  deactivateUserHeading: {
    id: "confirmations.admin.deactivate_user.heading",
    defaultMessage: "Deactivate @{username}",
  },
  deactivateUserPrompt: {
    id: "confirmations.admin.deactivate_user.message",
    defaultMessage:
      "You are about to deactivate @{username}. Deactivating a user is a reversible action.",
  },
  deactivateUserConfirm: {
    id: "confirmations.admin.deactivate_user.confirm",
    defaultMessage: "Deactivate @{username}",
  },
  userDeactivated: {
    id: "admin.users.user_deactivated_message",
    defaultMessage: "@{username} was deactivated",
  },
  deleteUserHeading: {
    id: "confirmations.admin.delete_user.heading",
    defaultMessage: "Delete @{username}",
  },
  deleteUserPrompt: {
    id: "confirmations.admin.delete_user.message",
    defaultMessage:
      "You are about to delete @{username}. THIS IS A DESTRUCTIVE ACTION THAT CANNOT BE UNDONE.",
  },
  deleteUserConfirm: {
    id: "confirmations.admin.delete_user.confirm",
    defaultMessage: "Delete @{username}",
  },
  deleteLocalUserCheckbox: {
    id: "confirmations.admin.delete_local_user.checkbox",
    defaultMessage: "I understand that I am about to delete a local user.",
  },
  userDeleted: {
    id: "admin.users.user_deleted_message",
    defaultMessage: "@{username} was deleted",
  },
  deleteStatusHeading: {
    id: "confirmations.admin.delete_status.heading",
    defaultMessage: "Delete post",
  },
  deleteStatusPrompt: {
    id: "confirmations.admin.delete_status.message",
    defaultMessage:
      "You are about to delete a post by @{username}. This action cannot be undone.",
  },
  deleteStatusConfirm: {
    id: "confirmations.admin.delete_status.confirm",
    defaultMessage: "Delete post",
  },
  rejectUserHeading: {
    id: "confirmations.admin.reject_user.heading",
    defaultMessage: "Reject @{username}",
  },
  rejectUserPrompt: {
    id: "confirmations.admin.reject_user.message",
    defaultMessage:
      "You are about to reject @{username} registration request. This action cannot be undone.",
  },
  rejectUserConfirm: {
    id: "confirmations.admin.reject_user.confirm",
    defaultMessage: "Reject @{username}",
  },
  statusDeleted: {
    id: "admin.statuses.status_deleted_message",
    defaultMessage: "Post by @{username} was deleted",
  },
  markStatusSensitiveHeading: {
    id: "confirmations.admin.mark_status_sensitive.heading",
    defaultMessage: "Mark post sensitive",
  },
  markStatusNotSensitiveHeading: {
    id: "confirmations.admin.mark_status_not_sensitive.heading",
    defaultMessage: "Mark post not sensitive.",
  },
  markStatusSensitivePrompt: {
    id: "confirmations.admin.mark_status_sensitive.message",
    defaultMessage: "You are about to mark a post by @{username} sensitive.",
  },
  markStatusNotSensitivePrompt: {
    id: "confirmations.admin.mark_status_not_sensitive.message",
    defaultMessage:
      "You are about to mark a post by @{username} not sensitive.",
  },
  markStatusSensitiveConfirm: {
    id: "confirmations.admin.mark_status_sensitive.confirm",
    defaultMessage: "Mark post sensitive",
  },
  markStatusNotSensitiveConfirm: {
    id: "confirmations.admin.mark_status_not_sensitive.confirm",
    defaultMessage: "Mark post not sensitive",
  },
  statusMarkedSensitive: {
    id: "admin.statuses.status_marked_message_sensitive",
    defaultMessage: "Post by @{username} was marked sensitive",
  },
  statusMarkedNotSensitive: {
    id: "admin.statuses.status_marked_message_not_sensitive",
    defaultMessage: "Post by @{username} was marked not sensitive",
  },
});

const deactivateUserModal =
  (intl: IntlShape, accountId: string, afterConfirm = () => {}) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const username = selectAccount(state, accountId)!.username;

    const message = (
      <Stack space={4}>
        <OutlineBox>
          <AccountContainer id={accountId} hideActions />
        </OutlineBox>

        <Text>
          {intl.formatMessage(messages.deactivateUserPrompt, { username })}
        </Text>
      </Stack>
    );

    dispatch(
      openModal("CONFIRM", {
        icon: userOffIcon,
        heading: intl.formatMessage(messages.deactivateUserHeading, {
          username,
        }),
        message,
        confirm: intl.formatMessage(messages.deactivateUserConfirm, {
          username,
        }),
        onConfirm: () => {
          dispatch(deactivateUsers([accountId]))
            .then(() => {
              const message = intl.formatMessage(messages.userDeactivated, {
                username,
              });
              toast.success(message);
              afterConfirm();
            })
            .catch(() => {});
        },
      })
    );
  };

const deleteUserModal =
  (intl: IntlShape, accountId: string, afterConfirm = () => {}) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const account = selectAccount(state, accountId)!;
    const username = account.username;

    const message = (
      <Stack space={4}>
        <OutlineBox>
          <AccountContainer id={accountId} hideActions />
        </OutlineBox>

        <Text>
          {intl.formatMessage(messages.deleteUserPrompt, { username })}
        </Text>
      </Stack>
    );

    const confirm = intl.formatMessage(messages.deleteUserConfirm, {
      username,
    });
    const checkbox = intl.formatMessage(messages.deleteLocalUserCheckbox);

    dispatch(
      openModal("CONFIRM", {
        icon: userMinusIcon,
        heading: intl.formatMessage(messages.deleteUserHeading, { username }),
        message,
        confirm,
        checkbox,
        onConfirm: () => {
          dispatch(deleteUser(accountId))
            .then(() => {
              const message = intl.formatMessage(messages.userDeleted, {
                username,
              });
              dispatch(fetchAccountByUsername(username));
              toast.success(message);
              afterConfirm();
            })
            .catch(() => {});
        },
      })
    );
  };

const toggleStatusSensitivityModal =
  (
    intl: IntlShape,
    statusId: string,
    sensitive: boolean,
    afterConfirm = () => {}
  ) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const username = state.statuses.get(statusId)!.account.username;

    dispatch(
      openModal("CONFIRM", {
        icon: alertTriangleIcon,
        heading: intl.formatMessage(
          sensitive === false
            ? messages.markStatusSensitiveHeading
            : messages.markStatusNotSensitiveHeading
        ),
        message: intl.formatMessage(
          sensitive === false
            ? messages.markStatusSensitivePrompt
            : messages.markStatusNotSensitivePrompt,
          { username }
        ),
        confirm: intl.formatMessage(
          sensitive === false
            ? messages.markStatusSensitiveConfirm
            : messages.markStatusNotSensitiveConfirm
        ),
        onConfirm: () => {
          dispatch(toggleStatusSensitivity(statusId, sensitive))
            .then(() => {
              const message = intl.formatMessage(
                sensitive === false
                  ? messages.statusMarkedSensitive
                  : messages.statusMarkedNotSensitive,
                { username }
              );
              toast.success(message);
            })
            .catch(() => {});
          afterConfirm();
        },
      })
    );
  };

const deleteStatusModal =
  (intl: IntlShape, statusId: string, afterConfirm = () => {}) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const username = state.statuses.get(statusId)!.account.username;

    dispatch(
      openModal("CONFIRM", {
        icon: trashIcon,
        heading: intl.formatMessage(messages.deleteStatusHeading),
        message: intl.formatMessage(messages.deleteStatusPrompt, {
          username: <strong className="break-words">{username}</strong>,
        }),
        confirm: intl.formatMessage(messages.deleteStatusConfirm),
        onConfirm: () => {
          dispatch(deleteStatus(statusId))
            .then(() => {
              const message = intl.formatMessage(messages.statusDeleted, {
                username,
              });
              toast.success(message);
            })
            .catch(() => {});
          afterConfirm();
        },
      })
    );
  };

export {
  deactivateUserModal,
  deleteUserModal,
  toggleStatusSensitivityModal,
  deleteStatusModal,
};
