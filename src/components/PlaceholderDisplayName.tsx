import React from 'react';

import { randomIntFromInterval, generateText } from 'src/utils/placeholder';

interface IPlaceholderDisplayName {
  maxLength: number;
  minLength: number;
  withSuffix?: boolean;
}

/** Fake display name to show when data is loading. */
const PlaceholderDisplayName: React.FC<IPlaceholderDisplayName> = ({ minLength, maxLength, withSuffix = true }) => {
  const length = randomIntFromInterval(maxLength, minLength);
  const acctLength = randomIntFromInterval(maxLength, minLength); // TODO: Maybe change

  return (
    <div className='flex flex-col text-primary-50 dark:text-primary-800'>
      <p>{generateText(length)}</p>
      {withSuffix && <p>{generateText(acctLength)}</p>}
    </div>
  );
};

export default React.memo(PlaceholderDisplayName);