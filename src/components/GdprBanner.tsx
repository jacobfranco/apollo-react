import clsx from 'clsx';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Banner, HStack, Stack, Text } from 'src/components';
import { useApolloConfig } from 'src/hooks';
import Button from './Button';

const acceptedGdpr = !!localStorage.getItem('apollo:gdpr');

/** Displays a cookie consent banner. */
const GdprBanner: React.FC = () => {
  /** Track whether the banner has already been displayed once. */
  const [shown, setShown] = useState<boolean>(acceptedGdpr);
  const [slideout, setSlideout] = useState(false);

  const { gdprUrl } = useApolloConfig();

  const handleAccept = () => {
    localStorage.setItem('apollo:gdpr', 'true');
    setSlideout(true);
    setTimeout(() => setShown(true), 200);
  };

  if (shown) {
    return null;
  }

  return (
    <Banner theme='opaque' className={clsx('transition-transform', { 'translate-y-full': slideout })}>
      <div className='flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-x-4 lg:space-y-0 rtl:space-x-reverse'>
        <Stack space={2}>
          <Text size='xl' weight='bold'>
            <FormattedMessage id='gdpr.title' defaultMessage='{siteTitle} uses cookies' values={{ siteTitle: 'Apollo' }} />
          </Text>

          <Text weight='medium' className='opacity-60'>
            <FormattedMessage
              id='gdpr.message'
              defaultMessage="{siteTitle} uses session cookies, which are essential to the website's functioning."
              values={{ siteTitle: 'Apollo' }}
            />
          </Text>
        </Stack>

        <HStack space={2} alignItems='center' className='flex-none'>
          {gdprUrl && (
            <a href={gdprUrl} tabIndex={-1} className='inline-flex'>
              <Button theme='secondary'>
                <FormattedMessage id='gdpr.learn_more' defaultMessage='Learn more' />
              </Button>
            </a>
          )}

          <Button theme='accent' onClick={handleAccept}>
            <FormattedMessage id='gdpr.accept' defaultMessage='Accept' />
          </Button>
        </HStack>
      </div>
    </Banner>
  );
};

export default GdprBanner;