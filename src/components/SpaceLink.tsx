import React from 'react';

import Link from './Link';

interface ISpaceLink {
  space: string;
}

const SpaceLink: React.FC<ISpaceLink> = ({ space }) => (
  // eslint-disable-next-line formatjs/no-literal-string-in-jsx
  <Link to={`/s/${space}`} onClick={(e) => e.stopPropagation()}>
    ############{space}
  </Link>
);

export default SpaceLink;