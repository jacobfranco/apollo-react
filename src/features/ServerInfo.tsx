import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Column, Divider, Stack, Text } from 'src/components';

import LinkFooter from './LinkFooter';

const messages = defineMessages({
  heading: { id: 'column.info', defaultMessage: 'Server information' },
});

const ServerInfo = () => {
  const intl = useIntl();

  return (
    <Column label={intl.formatMessage(messages.heading)}>
      <Stack space={4}>
        <Stack>
          <Text size='lg' weight='medium'>{'Apollo'}</Text>
          <Text theme='muted'>{'Description of Apollo, etc, etc'}</Text>
        </Stack>

        <Divider />

        <Divider />

        <LinkFooter />
      </Stack>
    </Column>
  );
};

export default ServerInfo;