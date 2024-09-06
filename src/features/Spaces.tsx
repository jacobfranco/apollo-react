import React, { useEffect, useCallback } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import debounce from 'lodash/debounce';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { fetchAllSpaces, fetchFollowedSpaces, followSpace, unfollowSpace } from 'src/actions/spaces';
import { changeSearch, clearSearch, clearSearchResults, showSearch } from 'src/actions/search';
import SpaceImageLink from 'src/components/SpaceImageLink';
import Input from 'src/components/Input';
import { SvgIcon } from 'src/components';
import { Space } from 'src/types/entities';

const messages = defineMessages({
  heading: { id: 'column.spaces', defaultMessage: 'Spaces' },
  placeholder: { id: 'search.placeholder', defaultMessage: 'Search Spaces' },
});

const Spaces: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('Spaces component mounted');
    dispatch(fetchAllSpaces());
    dispatch(fetchFollowedSpaces());
  }, [dispatch]);

  const allSpaces = useAppSelector((state) => {
    console.log('All spaces from state:', state.spaces.byName.valueSeq().toList().toJS());
    return state.spaces.byName.valueSeq().toList();
  });
  const followedSpaces = useAppSelector((state) => {
    console.log('Followed spaces from state:', state.followed_spaces.items.toJS());
    return state.followed_spaces.items;
  });
  const searchValue = useAppSelector((state) => state.search.value);
  const submitted = useAppSelector((state) => state.search.submitted);

  const getProperty = (obj: any, prop: string) => {
    if (!obj) {
      console.error(`Object is undefined when trying to access property: ${prop}`);
      return undefined;
    }
    return typeof obj.get === 'function' ? obj.get(prop) : obj[prop];
  };

  const handleToggleFollow = useCallback((space: Space, isFollowed: boolean) => {
    console.log('handleToggleFollow called with space:', space, 'isFollowed:', isFollowed);
    const spaceUrl = getProperty(space, 'url');
    console.log('spaceUrl:', spaceUrl);
    if (!spaceUrl) {
      console.error('Space URL is undefined');
      return;
    }
    const cleanSpaceUrl = spaceUrl.replace(/^\/s\//, '');
    console.log('Dispatching action for space:', cleanSpaceUrl, 'isFollowed:', isFollowed);
    if (isFollowed) {
      dispatch(unfollowSpace(cleanSpaceUrl));
    } else {
      dispatch(followSpace(cleanSpaceUrl));
    }
  }, [dispatch]);

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

  const filteredSpaces = allSpaces
    .filter((space: Space) => {
      const name = getProperty(space, 'name');
      return name && name.toLowerCase().includes(searchValue.toLowerCase());
    })
    .sort((a: Space, b: Space) => {
      const aName = getProperty(a, 'name');
      const bName = getProperty(b, 'name');
      const aFollowed = followedSpaces.some(space => getProperty(space, 'name') === aName);
      const bFollowed = followedSpaces.some(space => getProperty(space, 'name') === bName);
      if (aFollowed && !bFollowed) return -1;
      if (!aFollowed && bFollowed) return 1;
      return aName.localeCompare(bName);
    })
    .toArray();

  console.log('Filtered spaces:', filteredSpaces);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{intl.formatMessage(messages.heading)}</h1>
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
          {filteredSpaces.map((space: Space) => {
            const name = getProperty(space, 'name');
            const isFollowed = followedSpaces.some(followedSpace => getProperty(followedSpace, 'name') === name);
            console.log('Rendering space:', name, 'isFollowed:', isFollowed);
            return (
              <SpaceImageLink
                key={name}
                space={space}
                isFollowed={isFollowed}
                onToggleFollow={() => handleToggleFollow(space, isFollowed)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Spaces;