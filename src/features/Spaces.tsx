import React, { useCallback } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import debounce from 'lodash/debounce';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { changeSearch, clearSearch, clearSearchResults, showSearch } from 'src/actions/search';
import Input from 'src/components/Input';
import { SvgIcon } from 'src/components';
import spacesConfig from 'src/spaces-config';
import SpaceLink from 'src/components/SpaceLink';
import { getImage } from 'src/utils/media';

const messages = defineMessages({
  placeholder: { id: 'search.placeholder', defaultMessage: 'Search Spaces' },
});

const Spaces: React.FC = () => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const searchValue = useAppSelector((state) => state.search.value);
  const submitted = useAppSelector((state) => state.search.submitted);

  const debouncedSearch = useCallback(debounce(() => {
    // You can dispatch any additional actions here if needed
  }, 300), []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    dispatch(changeSearch(value));
    debouncedSearch();
  };

  const handleClear = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (searchValue.length > 0 || submitted) {
      dispatch(clearSearchResults());
    }
  };

  const handleFocus = () => {
    dispatch(showSearch());
  };

  const filteredSpaces = spacesConfig.filter(space =>
    space.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Spaces</h1>

      <div className="mb-6 relative">
        <Input
          type="text"
          id="search"
          placeholder={intl.formatMessage(messages.placeholder)}
          value={searchValue}
          onChange={handleChange}
          onFocus={handleFocus}
          theme="search"
          className="w-full pr-10 rtl:pl-10 rtl:pr-3"
        />
        <div
          role="button"
          tabIndex={0}
          className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3 rtl:left-0 rtl:right-auto"
          onClick={handleClear}
        >
          <SvgIcon
            src={require('@tabler/icons/outline/search.svg')}
            className={`h-4 w-4 text-gray-600 ${searchValue.length > 0 ? 'hidden' : ''}`}
          />
          <SvgIcon
            src={require('@tabler/icons/outline/x.svg')}
            className={`h-4 w-4 text-gray-600 ${searchValue.length > 0 ? '' : 'hidden'}`}
            aria-label={intl.formatMessage(messages.placeholder)}
          />
        </div>
      </div>

      {filteredSpaces.length === 0 ? (
        <p className="text-center text-gray-500">No spaces found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpaces.map((space) => (
            <SpaceLink
              key={space.path}
              name={space.name}
              path={space.path}
              imageUrl={getImage(space.path)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Spaces;