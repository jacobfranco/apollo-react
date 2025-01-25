import React, { useEffect, useCallback, useMemo, useState } from "react";
import { defineMessages, useIntl, FormattedMessage } from "react-intl";
import searchIcon from "@tabler/icons/outline/search.svg";
import xIcon from "@tabler/icons/outline/x.svg";
import { useAppDispatch, useAppSelector } from "src/hooks";
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
import { unfollowSpace, followSpace } from "src/actions/spaces";

const messages = defineMessages({
  heading: { id: "column.spaces", defaultMessage: "Spaces" },
  placeholder: { id: "search.placeholder", defaultMessage: "Search Spaces" },
});

const Spaces: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  // The list of all spaces from Redux
  const allSpaces = useAppSelector((state) =>
    state.spaces.valueSeq().toArray()
  ) as Space[];

  // Fetch trending spaces
  const { data: trendingSpaces = [], isLoading: isTrendingLoading } =
    useTrendingSpaces();

  // Trending weights
  const trendingWeights = useMemo(() => {
    return trendingSpaces.reduce((acc, space, index) => {
      acc[space.id] = trendingSpaces.length - index;
      return acc;
    }, {} as Record<string, number>);
  }, [trendingSpaces]);

  // Local "initialOrder" state
  const [initialOrder, setInitialOrder] = useState<string[]>([]);

  // Local search logic
  const searchValue = useAppSelector((state) => state.search.value);
  const submitted = useAppSelector((state) => state.search.submitted);

  // Sort allSpaces only once when allSpaces and trendingSpaces are loaded
  useEffect(() => {
    if (
      allSpaces.length > 0 &&
      !isTrendingLoading &&
      initialOrder.length === 0
    ) {
      const sortedSpaces = [...allSpaces].sort((a, b) => {
        const aFollowing = a.get("following");
        const bFollowing = b.get("following");

        // Sort by follow status
        if (aFollowing !== bFollowing) {
          return aFollowing ? -1 : 1;
        }

        // Then by trending weight
        const aWeight = trendingWeights[a.get("id")] || 0;
        const bWeight = trendingWeights[b.get("id")] || 0;
        if (aWeight !== bWeight) {
          return bWeight - aWeight;
        }

        // Finally, alphabetical
        const aName = (a.get("name") || "").toLowerCase();
        const bName = (b.get("name") || "").toLowerCase();
        return aName.localeCompare(bName);
      });

      setInitialOrder(sortedSpaces.map((space) => space.get("id")));
    }
  }, [allSpaces, trendingWeights, isTrendingLoading, initialOrder.length]);

  // Filter spaces based on search text
  const filteredSpaces = useMemo(() => {
    if (initialOrder.length === 0) {
      return [];
    }
    // Create a map for O(1) lookups
    const spacesMap = allSpaces.reduce((acc, space) => {
      acc[space.get("id")] = space;
      return acc;
    }, {} as Record<string, Space>);

    return initialOrder
      .map((id) => spacesMap[id])
      .filter((space) => {
        if (!space) return false;
        const searchTerm = searchValue.toLowerCase();
        const name = (space.get("name") || "").toLowerCase();
        const sid = (space.get("id") || "").toLowerCase();
        if (name.includes("esports")) return false;
        return name.includes(searchTerm) || sid.includes(searchTerm);
      });
  }, [allSpaces, initialOrder, searchValue]);

  // UI handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeSearch(e.target.value));
  };

  const handleClear = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (searchValue.length > 0 || submitted) {
      dispatch(clearSearchResults());
    }
  };

  const handleFocus = () => {
    dispatch(showSearch());
  };

  const handleToggleFollow = useCallback(
    (space: Space, isFollowed: boolean) => {
      const spaceId = space.get("id");
      if (!spaceId) return;
      dispatch(isFollowed ? unfollowSpace(spaceId) : followSpace(spaceId));
    },
    [dispatch]
  );

  // Don't render anything until initialOrder is set and trendingSpaces are loaded
  if (initialOrder.length === 0 || isTrendingLoading) {
    return (
      <div className="flex justify-center items-center min-h-48">
        <Spinner size={40} />
      </div>
    );
  }

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
          />
        </div>
      </div>

      {filteredSpaces.length === 0 ? (
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
