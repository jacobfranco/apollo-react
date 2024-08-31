import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Column } from 'src/components/Column';
import Search from 'src/features/compose/components/Search';
import SearchResults from 'src/features/compose/components/SearchResults';

const messages = defineMessages({
  heading: { id: 'column.search', defaultMessage: 'Discover' },
});

const SearchPage = () => {
  const intl = useIntl();

  return (
    <Column label={intl.formatMessage(messages.heading)}>
      <div className='space-y-4'>
        <Search autoFocus autoSubmit />
        <SearchResults />
      </div>
    </Column>
  );
};

export default SearchPage;