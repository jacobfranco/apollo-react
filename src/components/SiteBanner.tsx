import DOMPurify from 'isomorphic-dompurify';
import React from 'react';

import { LogoText, Markup, Stack } from 'src/components';
import { getTextDirection } from 'src/utils/rtl';

const SiteBanner: React.FC = () => {
  const description = DOMPurify.sanitize('Welcome to the Gaming Frontier'); // TODO: Change description if necessary

  return (
    <Stack space={3}>
      <LogoText dir={getTextDirection('APOLLO')}>
        {'APOLLO'}
      </LogoText>

      <Markup
        size='lg'
        dangerouslySetInnerHTML={{ __html: description }}
        direction={getTextDirection(description)}
      />
    </Stack>
  );
};

export { SiteBanner };