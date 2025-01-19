import React, { useEffect, useCallback, useMemo, useState } from "react";
import { defineMessages, useIntl, FormattedMessage } from "react-intl";
import searchIcon from "@tabler/icons/outline/search.svg";
import xIcon from "@tabler/icons/outline/x.svg";
import { useAppDispatch, useAppSelector, useLoggedIn } from "src/hooks";
import { fetchAllSpaces, followSpace, unfollowSpace } from "src/actions/spaces";
import {
  changeSearch,
  clearSearchResults,
  showSearch,
} from "src/actions/search";
import SpaceImageLink from "src/components/SpaceImageLink";
import Input from "src/components/Input";
import { SvgIcon } from "src/components";
import { Column } from "src/components/Column";
import Spinner from "src/components/Spinner";
import type { Space } from "src/types/entities";
import useTrendingSpaces from "src/queries/trending-spaces";

const messages = defineMessages({
  heading: { id: "column.spaces", defaultMessage: "Spaces" },
  placeholder: { id: "search.placeholder", defaultMessage: "Search Spaces" },
});

const Spaces: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useLoggedIn();
  const [isLoading, setIsLoading] = useState(true);
  const { data: trendingSpaces = [] } = useTrendingSpaces();
  const [initialOrder, setInitialOrder] = useState<string[]>([]);

  const allSpaces = useAppSelector((state) =>
    state.spaces.valueSeq().toArray()
  ) as Space[];

  const searchValue = useAppSelector((state) => state.search.value);
  const submitted = useAppSelector((state) => state.search.submitted);

  // Create initial trending weights
  const trendingWeights = useMemo(() => {
    return trendingSpaces.reduce((acc, space, index) => {
      acc[space.id] = trendingSpaces.length - index;
      return acc;
    }, {} as Record<string, number>);
  }, [trendingSpaces]);

  // Set initial order once when spaces and trending data are loaded
  useEffect(() => {
    if (initialOrder.length === 0 && allSpaces.length > 0) {
      const sortedSpaces = [...allSpaces].sort((a, b) => {
        const aFollowing = a.get("following");
        const bFollowing = b.get("following");

        // First sort by follow status
        if (aFollowing !== bFollowing) {
          return aFollowing ? -1 : 1;
        }

        const aId = a.get("id");
        const bId = b.get("id");

        // Then by trending weight
        const aWeight = trendingWeights[aId] || 0;
        const bWeight = trendingWeights[bId] || 0;

        if (aWeight !== bWeight) {
          return bWeight - aWeight;
        }

        // Finally alphabetically
        const aName = (a.get("name") || "").toLowerCase();
        const bName = (b.get("name") || "").toLowerCase();
        return aName.localeCompare(bName);
      });

      setInitialOrder(sortedSpaces.map((space) => space.get("id")));
    }
  }, [allSpaces, trendingWeights, initialOrder.length]);

  useEffect(() => {
    const loadSpaces = async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchAllSpaces());
      } finally {
        setIsLoading(false);
      }
    };
    loadSpaces();
  }, [dispatch, isLoggedIn]);

  const handleToggleFollow = useCallback(
    (space: Space, isFollowed: boolean) => {
      const spaceId = space.get("id");
      if (!spaceId) return;
      if (isFollowed) {
        dispatch(unfollowSpace(spaceId));
      } else {
        dispatch(followSpace(spaceId));
      }
    },
    [dispatch]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeSearch(event.target.value));
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

  const filteredSpaces = useMemo(() => {
    // Create a map for efficient lookup
    const spacesMap = allSpaces.reduce((acc, space) => {
      acc[space.get("id")] = space;
      return acc;
    }, {} as Record<string, Space>);

    // Filter spaces based on search and maintain initial order
    return initialOrder
      .map((id) => spacesMap[id])
      .filter((space) => {
        if (!space) return false;
        const searchTerm = searchValue.toLowerCase();
        const name = (space.get("name") || "").toLowerCase();
        const id = (space.get("id") || "").toLowerCase();
        if (name.includes("esports")) return false;
        return name.includes(searchTerm) || id.includes(searchTerm);
      });
  }, [allSpaces, initialOrder, searchValue]);

  return (
    <Column
      label={intl.formatMessage(messages.heading)}
      transparent={false}
      withHeader={true}
    >
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
            src={searchIcon}
            className={`h-4 w-4 text-gray-600 ${
              searchValue.length > 0 ? "hidden" : ""
            }`}
          />
          <SvgIcon
            src={xIcon}
            className={`h-4 w-4 text-gray-600 ${
              searchValue.length > 0 ? "" : "hidden"
            }`}
            aria-label={intl.formatMessage(messages.placeholder)}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-48">
          <Spinner size={40} />
        </div>
      ) : filteredSpaces.length === 0 ? (
        <p className="text-center text-gray-500">
          <FormattedMessage
            id="empty_column.spaces"
            defaultMessage="No spaces found matching your search."
          />
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 bg:primary-300">
          {filteredSpaces.map((space) => {
            const isFollowed = space.get("following");
            return (
              <SpaceImageLink
                key={space.get("id")}
                space={space}
                isFollowed={isFollowed}
                onToggleFollow={() => handleToggleFollow(space, isFollowed)}
              />
            );
          })}
        </div>
      )}
    </Column>
  );
};

export default Spaces;
