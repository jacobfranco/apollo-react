import clsx from 'clsx';
import React from 'react';
import { useIntl, defineMessages } from 'react-intl';

import { Icon } from 'src/components';

const messages = defineMessages({
  verified: { id: 'account.verified', defaultMessage: 'Verified Account' },
});

interface IVerificationBadge {
  className?: string;
}

const VerificationBadge: React.FC<IVerificationBadge> = ({ className }) => {
  const intl = useIntl();

  const icon = require('src/assets/icons/verified.svg'); // TODO: Add this in

  // Render component based on file extension
  const Element = icon.endsWith('.svg') ? Icon : 'img';

  return (
    <span className='verified-icon' data-testid='verified-badge'>
      <Element className={clsx('w-4 text-accent-500', className)} src={icon} alt={intl.formatMessage(messages.verified)} />
    </span>
  );
};

export default VerificationBadge;