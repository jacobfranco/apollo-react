import React, { useEffect } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

// import { fetchMfa } from 'src/actions/mfa';
import List, { ListItem } from "src/components/List";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  MessagesSettings,
} from "src/components";
import Text from "src/components/Text";
import { Column } from "src/components/Column";
import { useAppDispatch, useOwnAccount } from "src/hooks";

import Preferences from "src/features/Preferences";

const messages = defineMessages({
  accountAliases: {
    id: "navigation_bar.account_aliases",
    defaultMessage: "Account aliases",
  },
  accountMigration: {
    id: "settings.account_migration",
    defaultMessage: "Move Account",
  },
  backups: { id: "column.backups", defaultMessage: "Backups" },
  blocks: { id: "settings.blocks", defaultMessage: "Blocks" },
  changeEmail: { id: "settings.change_email", defaultMessage: "Change Email" },
  changePassword: {
    id: "settings.change_password",
    defaultMessage: "Change Password",
  },
  configureMfa: {
    id: "settings.configure_mfa",
    defaultMessage: "Configure MFA",
  },
  deleteAccount: {
    id: "settings.delete_account",
    defaultMessage: "Delete Account",
  },
  editProfile: { id: "settings.edit_profile", defaultMessage: "Edit Profile" },
  editIdentity: { id: "settings.edit_identity", defaultMessage: "Identity" },
  editRelays: { id: "nostr_relays.title", defaultMessage: "Relays" },
  exportData: { id: "column.export_data", defaultMessage: "Export data" },
  importData: {
    id: "navigation_bar.import_data",
    defaultMessage: "Import data",
  },
  mfaDisabled: { id: "mfa.disabled", defaultMessage: "Disabled" },
  mfaEnabled: { id: "mfa.enabled", defaultMessage: "Enabled" },
  mutes: { id: "settings.mutes", defaultMessage: "Mutes" },
  other: { id: "settings.other", defaultMessage: "Other Options" },
  preferences: { id: "settings.preferences", defaultMessage: "Preferences" },
  privacy: { id: "settings.privacy", defaultMessage: "Privacy" },
  profile: { id: "settings.profile", defaultMessage: "Profile" },
  security: { id: "settings.security", defaultMessage: "Security" },
  sessions: { id: "settings.sessions", defaultMessage: "Active sessions" },
  settings: { id: "settings.settings", defaultMessage: "Settings" },
});

/** User settings page. */
const Settings = () => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  // const mfa = useAppSelector((state) => state.security.get('mfa'));
  const { account } = useOwnAccount();

  // const isMfaEnabled = mfa.getIn(['settings', 'totp']);

  /* TODO: Implement mfa
  useEffect(() => {
    if (features.security) dispatch(fetchMfa());
  }, [dispatch]);

  */

  if (!account) return null;

  const displayName = account.display_name || account.username;

  return (
    <Column
      label={intl.formatMessage(messages.settings)}
      transparent
      withHeader={false}
    >
      <Card className="space-y-4" variant="rounded">
        <CardHeader>
          <CardTitle title={intl.formatMessage(messages.profile)} />
        </CardHeader>

        <CardBody>
          <List>
            <ListItem
              label={intl.formatMessage(messages.editProfile)}
              to="/settings/profile"
            >
              <span className="max-w-full truncate">{displayName}</span>
            </ListItem>
          </List>
        </CardBody>

        <CardHeader>
          <CardTitle title={intl.formatMessage(messages.security)} />
        </CardHeader>

        <CardBody>
          <List>
            <ListItem
              label={intl.formatMessage(messages.changeEmail)}
              to="/settings/email"
            />
            <ListItem
              label={intl.formatMessage(messages.changePassword)}
              to="/settings/password"
            />
          </List>
        </CardBody>

        <CardHeader>
          <CardTitle title={intl.formatMessage(messages.privacy)} />
        </CardHeader>

        <CardBody>
          <List>
            <ListItem label={intl.formatMessage(messages.mutes)} to="/mutes" />
            <ListItem
              label={intl.formatMessage(messages.blocks)}
              to="/blocks"
            />
          </List>
        </CardBody>

        {/* <>
         TODO: Implement chats
          <CardHeader>
            <CardTitle title={<FormattedMessage id='column.chats' defaultMessage='Chats' />} />
          </CardHeader>

          <CardBody>
            <MessagesSettings />
          </CardBody>
        </>
*/}
        <CardHeader>
          <CardTitle title={intl.formatMessage(messages.preferences)} />
        </CardHeader>

        <CardBody>
          <Preferences />
        </CardBody>

        <>
          <CardBody>
            <List>
              <ListItem
                label={
                  <Text theme="danger">
                    {intl.formatMessage(messages.deleteAccount)}
                  </Text>
                }
                to="/settings/account"
              />
            </List>
          </CardBody>
        </>
      </Card>
    </Column>
  );
};

export default Settings;
