import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Card, CardBody, Stack, Text } from 'src/components';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';

const CompletedStep = ({ onComplete }: { onComplete: () => void }) => (
  <Card variant='rounded' size='xl'>
    <CardBody>
      <Stack space={2}>
        <Icon strokeWidth={1} src={require('@tabler/icons/outline/confetti.svg')} className='mx-auto h-16 w-16 text-primary-600 dark:text-primary-400' />

        <Text size='2xl' align='center' weight='bold'>
          <FormattedMessage id='onboarding.finished.title' defaultMessage='Onboarding complete' />
        </Text>

        <Text theme='muted' align='center'>
          <FormattedMessage
            id='onboarding.finished.message'
            defaultMessage='We are very excited to welcome you to our community! Tap the button below to get started.'
          />
        </Text>
      </Stack>

      <div className='mx-auto pt-10 sm:w-2/3 md:w-1/2'>
        <Stack justifyContent='center' space={2}>
          <Button
            block
            theme='primary'
            onClick={onComplete}
          >
            <FormattedMessage id='onboarding.view_feed' defaultMessage='View Feed' />
          </Button>
        </Stack>
      </div>
    </CardBody>
  </Card>
);

export default CompletedStep;