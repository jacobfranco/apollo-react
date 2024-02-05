import React from 'react';

import { Link } from 'src/components';

interface IHashtagLink {
  hashtag: string;
}

const HashtagLink: React.FC<IHashtagLink> = ({ hashtag }) => (
  <Link to={`/tags/${hashtag}`}>
    #{hashtag}
  </Link>
);

export default HashtagLink;