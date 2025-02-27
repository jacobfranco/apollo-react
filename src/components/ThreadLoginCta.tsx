import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Card, CardTitle, Text, Stack } from 'src/components';
import { useApolloConfig } from 'src/hooks';
import Button from './Button';

/** Prompts logged-out users to log in when viewing a thread. */
const ThreadLoginCta: React.FC = () => {
  const { displayCta } = useApolloConfig();

  if (!displayCta) return null;

  return (
    <Card className='space-y-6 px-6 py-12 text-center' variant='rounded'>
      <Stack>
        <CardTitle title={<FormattedMessage id='thread_login.title' defaultMessage='Continue the conversation' />} />
        <Text>
          <FormattedMessage
            id='thread_login.message'
            defaultMessage='Become a part of the {siteTitle} community.'
            values={{ siteTitle: "Apollo" }}
          />
        </Text>
      </Stack>

      <Stack space={4} className='mx-auto max-w-xs'>
        <Button theme='tertiary' to='/login' block>
          <FormattedMessage id='thread_login.login' defaultMessage='Log in' />
        </Button>
        <Button to='/signup' block>
          <FormattedMessage id='thread_login.signup' defaultMessage='Sign up' />
        </Button>
      </Stack>
    </Card>
  );
};

export default ThreadLoginCta;