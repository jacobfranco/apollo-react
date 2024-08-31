import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Stack, Text } from 'src/components';
import Button from 'src/components/Button';
import { useAppSelector, useRegistrationStatus } from 'src/hooks';

const SignUpPanel = () => {
  const { isOpen } = useRegistrationStatus();
  const me = useAppSelector((state) => state.me);

  if (me || !isOpen) return null;

  return (
    <Stack space={2} data-testid='sign-up-panel'>
      <Stack>
        <Text size='lg' weight='bold'>
          <FormattedMessage id='signup_panel.title' defaultMessage='Ready to Get Started?' />
        </Text>

        <Text theme='muted' size='sm'>
          <FormattedMessage id='signup_panel.subtitle' defaultMessage="Sign up now and begin your adventure" />
        </Text>
      </Stack>

      <Button theme='primary' block to='/signup'>
        <FormattedMessage id='account.register' defaultMessage='Sign Up' />
      </Button>
    </Stack>
  );
};

export default SignUpPanel;