import React from 'react';

import { HStack } from 'src/components';

import PlaceholderAvatar from './PlaceholderAvatar';
import PlaceholderDisplayName from './PlaceholderDisplayName';

/** Fake account to display while data is loading. */
const PlaceholderAccount: React.FC = () => (
  <HStack space={3} alignItems='center'>
    <div className='shrink-0'>
      <PlaceholderAvatar size={42} />
    </div>

    <div className='min-w-0 flex-1'>
      <PlaceholderDisplayName minLength={3} maxLength={25} />
    </div>
  </HStack>
);

export default React.memo(PlaceholderAccount);