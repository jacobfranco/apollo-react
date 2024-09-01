import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import esportsConfig from 'src/esports-config';
import ESportLink from 'src/components/ESportLink';
import { getImage } from 'src/utils/media';

const messages = defineMessages({
  title: { id: 'esports.title', defaultMessage: 'Esports' },
});

const ESports: React.FC = () => {
  const intl = useIntl();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{intl.formatMessage(messages.title)}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {esportsConfig.map((esport) => (
          <ESportLink
            key={esport.path}
            name={esport.name}
            path={esport.path}
            imageUrl={getImage(esport.path)}
          />
        ))}
      </div>
    </div>
  );
};

export default ESports;