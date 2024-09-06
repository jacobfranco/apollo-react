import React from 'react';

import { generateText, randomIntFromInterval } from 'src/utils/placeholder';

/** Fake space to display while data is loading. */
const PlaceholderSpace: React.FC = () => {
  const length = randomIntFromInterval(15, 30);

  return (
    <div className='animate-pulse text-primary-200 dark:text-primary-700'>
      <p>{generateText(length)}</p>
    </div>
  );
};

export default PlaceholderSpace;