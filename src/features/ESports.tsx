import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import esportsConfig from 'src/esports-config';
import ESportLink from 'src/components/ESportLink';
import { getImage } from 'src/utils/media';
import { Column } from 'src/components/Column';

const messages = defineMessages({
  title: { id: 'esports.title', defaultMessage: 'Esports' },
});

const ESports: React.FC = () => {
  const intl = useIntl();
  return (
    <Column
      label={intl.formatMessage(messages.title)}
      transparent={false} // Adjust as needed
      withHeader={true} // Adjust as needed
    >
      <div className="pt-2">
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
    </Column>
  );
};

export default ESports;