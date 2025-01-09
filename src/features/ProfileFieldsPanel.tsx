import React from "react";
import { FormattedMessage } from "react-intl";

import { ProfileField, Widget, Stack } from "src/components";

import type { Account } from "src/schemas";

interface IProfileFieldsPanel {
  account: Account;
}

/** Custom profile fields for sidebar. */
const ProfileFieldsPanel: React.FC<IProfileFieldsPanel> = ({ account }) => {
  return (
    <Widget
      title={
        <FormattedMessage
          id="profile_fields_panel.title"
          defaultMessage="Notes"
        />
      }
    >
      <Stack space={4}>
        {account.fields.map((field, i) => (
          <ProfileField field={field} key={i} />
        ))}
      </Stack>
    </Widget>
  );
};

export default ProfileFieldsPanel;
