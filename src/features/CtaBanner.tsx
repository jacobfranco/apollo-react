import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Banner, HStack, Stack, Text } from 'src/components';
import Button from 'src/components/Button';
import { useAppSelector, useRegistrationStatus, useApolloConfig } from 'src/hooks';

const CtaBanner = () => {
  const { isOpen } = useRegistrationStatus();
  const { displayCta } = useApolloConfig();
  const me = useAppSelector((state) => state.me);

  if (me || !displayCta || !isOpen) return null;

  return (
    <div data-testid='cta-banner' className='hidden lg:block'>
      <Banner theme='frosted'>
        <HStack alignItems='center' justifyContent='between'>
          <Stack>
            <Text size='lg' weight='bold'>
              <FormattedMessage id='cta_banner.title' defaultMessage='Tap In' />
            </Text>

            <Text theme='muted' size='sm'>
              <FormattedMessage id='cta_banner.subtitle' defaultMessage="From Elden Ring to Animal Crossing, we've got you covered" />
            </Text>
          </Stack>

          <HStack space={2} alignItems='center'>
            <Button theme='secondary' to='/login'>
              <FormattedMessage id='account.login' defaultMessage='Log In' />
            </Button>

            <Button theme='primary' to='/signup'>
              <FormattedMessage id='account.register' defaultMessage='Sign Up' />
            </Button>
          </HStack>
        </HStack>
      </Banner>
    </div>
  );
};

export default CtaBanner;