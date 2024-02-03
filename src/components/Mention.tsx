import React from 'react';
import { Link } from 'react-router-dom';

import { Tooltip } from 'src/components';

import type { Mention as MentionEntity } from 'src/schemas';

interface IMention {
  mention: Pick<MentionEntity, 'acct' | 'username'>;
  disabled?: boolean;
}

/** Mention for display in post content and the composer. */
const Mention: React.FC<IMention> = ({ mention: { acct, username }, disabled }) => {
  const handleClick: React.MouseEventHandler = (e) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <Tooltip text={`@${acct}`}>
      <Link
        to={`/@${acct}`}
        className='text-primary-600 hover:underline dark:text-accent-blue'
        onClick={handleClick}
        dir='ltr'
      >
        @{username}
      </Link>
    </Tooltip>
  );
};

export default Mention;