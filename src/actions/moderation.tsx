import React from 'react';
import { defineMessages, IntlShape } from 'react-intl';

import { fetchAccountByUsername } from 'src/actions/accounts';
import { deactivateUsers, deleteStatus, toggleStatusSensitivity } from 'src/actions/admin';
import { openModal } from 'src/actions/modals';
import { OutlineBox, Stack, Text } from 'src/components';
import AccountContainer from 'src/containers/AccountContainer';
import { selectAccount } from 'src/selectors';
import toast from 'src/toast';

import type { AppDispatch, RootState } from 'src/store';

const messages = defineMessages({
  deactivateUserHeading: { id: 'confirmations.admin.deactivate_user.heading', defaultMessage: 'Deactivate @{id}' },
  deactivateUserPrompt: { id: 'confirmations.admin.deactivate_user.message', defaultMessage: 'You are about to deactivate @{id}. Deactivating a user is a reversible action.' },
  deactivateUserConfirm: { id: 'confirmations.admin.deactivate_user.confirm', defaultMessage: 'Deactivate @{name}' },
  userDeactivated: { id: 'admin.users.user_deactivated_message', defaultMessage: '@{id} was deactivated' },
  deleteUserHeading: { id: 'confirmations.admin.delete_user.heading', defaultMessage: 'Delete @{id}' },
  deleteUserPrompt: { id: 'confirmations.admin.delete_user.message', defaultMessage: 'You are about to delete @{id}. THIS IS A DESTRUCTIVE ACTION THAT CANNOT BE UNDONE.' },
  deleteUserConfirm: { id: 'confirmations.admin.delete_user.confirm', defaultMessage: 'Delete @{name}' },
  deleteLocalUserCheckbox: { id: 'confirmations.admin.delete_local_user.checkbox', defaultMessage: 'I understand that I am about to delete a local user.' },
  userDeleted: { id: 'admin.users.user_deleted_message', defaultMessage: '@{id} was deleted' },
  deleteStatusHeading: { id: 'confirmations.admin.delete_status.heading', defaultMessage: 'Delete post' },
  deleteStatusPrompt: { id: 'confirmations.admin.delete_status.message', defaultMessage: 'You are about to delete a post by @{id}. This action cannot be undone.' },
  deleteStatusConfirm: { id: 'confirmations.admin.delete_status.confirm', defaultMessage: 'Delete post' },
  rejectUserHeading: { id: 'confirmations.admin.reject_user.heading', defaultMessage: 'Reject @{id}' },
  rejectUserPrompt: { id: 'confirmations.admin.reject_user.message', defaultMessage: 'You are about to reject @{id} registration request. This action cannot be undone.' },
  rejectUserConfirm: { id: 'confirmations.admin.reject_user.confirm', defaultMessage: 'Reject @{name}' },
  statusDeleted: { id: 'admin.statuses.status_deleted_message', defaultMessage: 'Post by @{id} was deleted' },
  markStatusSensitiveHeading: { id: 'confirmations.admin.mark_status_sensitive.heading', defaultMessage: 'Mark post sensitive' },
  markStatusNotSensitiveHeading: { id: 'confirmations.admin.mark_status_not_sensitive.heading', defaultMessage: 'Mark post not sensitive.' },
  markStatusSensitivePrompt: { id: 'confirmations.admin.mark_status_sensitive.message', defaultMessage: 'You are about to mark a post by @{id} sensitive.' },
  markStatusNotSensitivePrompt: { id: 'confirmations.admin.mark_status_not_sensitive.message', defaultMessage: 'You are about to mark a post by @{id} not sensitive.' },
  markStatusSensitiveConfirm: { id: 'confirmations.admin.mark_status_sensitive.confirm', defaultMessage: 'Mark post sensitive' },
  markStatusNotSensitiveConfirm: { id: 'confirmations.admin.mark_status_not_sensitive.confirm', defaultMessage: 'Mark post not sensitive' },
  statusMarkedSensitive: { id: 'admin.statuses.status_marked_message_sensitive', defaultMessage: 'Post by @{id} was marked sensitive' },
  statusMarkedNotSensitive: { id: 'admin.statuses.status_marked_message_not_sensitive', defaultMessage: 'Post by @{id} was marked not sensitive' },
});

const deactivateUserModal = (intl: IntlShape, accountId: string, afterConfirm = () => {}) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const id = selectAccount(state, accountId)!.id;
    const name = selectAccount(state, accountId)!.username;

    const message = (
      <Stack space={4}>
        <OutlineBox>
          <AccountContainer id={accountId} hideActions />
        </OutlineBox>

        <Text>
          {intl.formatMessage(messages.deactivateUserPrompt, { id })}
        </Text>
      </Stack>
    );

    dispatch(openModal('CONFIRM', {
      icon: require('@tabler/icons/outline/user-off.svg'),
      heading: intl.formatMessage(messages.deactivateUserHeading, { id }),
      message,
      confirm: intl.formatMessage(messages.deactivateUserConfirm, { name }),
      onConfirm: () => {
        dispatch(deactivateUsers([accountId])).then(() => {
          const message = intl.formatMessage(messages.userDeactivated, { id });
          toast.success(message);
          afterConfirm();
        }).catch(() => {});
      },
    }));
  };

const toggleStatusSensitivityModal = (intl: IntlShape, statusId: string, sensitive: boolean, afterConfirm = () => {}) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const id = state.statuses.get(statusId)!.account.id;

    dispatch(openModal('CONFIRM', {
      icon: require('@tabler/icons/outline/alert-triangle.svg'),
      heading: intl.formatMessage(sensitive === false ? messages.markStatusSensitiveHeading : messages.markStatusNotSensitiveHeading),
      message: intl.formatMessage(sensitive === false ? messages.markStatusSensitivePrompt : messages.markStatusNotSensitivePrompt, { id }),
      confirm: intl.formatMessage(sensitive === false ? messages.markStatusSensitiveConfirm : messages.markStatusNotSensitiveConfirm),
      onConfirm: () => {
        dispatch(toggleStatusSensitivity(statusId, sensitive)).then(() => {
          const message = intl.formatMessage(sensitive === false ? messages.statusMarkedSensitive : messages.statusMarkedNotSensitive, { id });
          toast.success(message);
        }).catch(() => {});
        afterConfirm();
      },
    }));
  };

const deleteStatusModal = (intl: IntlShape, statusId: string, afterConfirm = () => {}) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const id = state.statuses.get(statusId)!.account.id;

    dispatch(openModal('CONFIRM', {
      icon: require('@tabler/icons/outline/trash.svg'),
      heading: intl.formatMessage(messages.deleteStatusHeading),
      message: intl.formatMessage(messages.deleteStatusPrompt, { id: <strong className='break-words'>{id}</strong> }),
      confirm: intl.formatMessage(messages.deleteStatusConfirm),
      onConfirm: () => {
        dispatch(deleteStatus(statusId)).then(() => {
          const message = intl.formatMessage(messages.statusDeleted, { id });
          toast.success(message);
        }).catch(() => {});
        afterConfirm();
      },
    }));
  };

export {
  deactivateUserModal,
  toggleStatusSensitivityModal,
  deleteStatusModal,
};