/* TODO: Implement promo panel
import React from 'react';

import ForkAwesomeIcon from 'src/components/fork-awesome-icon';
import { Widget, Stack, Text } from 'src/components';
import { useSettings, useApolloConfig } from 'src/hooks';

const PromoPanel: React.FC = () => {
  const { promoPanel } = useApolloConfig();
  const settings = useSettings();

  const promoItems = promoPanel.get('items');
  const locale = settings.get('locale');

  if (!promoItems || promoItems.isEmpty()) return null;

  return (
    <Widget title={'Apollo'}>
      <Stack space={2}>
        {promoItems.map((item, i) => (
          <Text key={i}>
            <a className='flex items-center' href={item.url} target='_blank'>
              <ForkAwesomeIcon id={item.icon} className='mr-2 flex-none text-lg rtl:ml-2 rtl:mr-0' fixedWidth />
              {item.textLocales.get(locale) || item.text}
            </a>
          </Text>
        ))}
      </Stack>
    </Widget>
  );
};

export default PromoPanel;
*/