import { debounce } from "es-toolkit";
import React, { useEffect } from "react";
import { defineMessages, useIntl, FormattedMessage } from "react-intl";

import {
  fetchFollowedHashtags,
  expandFollowedHashtags,
} from "src/actions/tags";
import { Hashtag, PlaceholderHashtag, ScrollableList } from "src/components";
import { Column } from "src/components/Column";
import { useAppDispatch, useAppSelector } from "src/hooks";

const messages = defineMessages({
  heading: { id: "column.followed_tags", defaultMessage: "Followed hashtags" },
});

const handleLoadMore = debounce(
  (dispatch) => {
    dispatch(expandFollowedHashtags());
  },
  300,
  { edges: ["leading"] }
);

const FollowedTags = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchFollowedHashtags());
  }, []);

  const tags = useAppSelector((state) => state.followed_tags.items);
  const isLoading = useAppSelector((state) => state.followed_tags.isLoading);
  const hasMore = useAppSelector((state) => !!state.followed_tags.next);

  const emptyMessage = (
    <FormattedMessage
      id="empty_column.followed_tags"
      defaultMessage="You haven't followed any hashtag yet."
    />
  );

  return (
    <Column label={intl.formatMessage(messages.heading)}>
      <ScrollableList
        scrollKey="followed_tags"
        emptyMessage={emptyMessage}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={() => handleLoadMore(dispatch)}
        placeholderComponent={PlaceholderHashtag}
        placeholderCount={5}
        itemClassName="pb-3"
      >
        {tags.map((tag) => (
          <Hashtag key={tag.name} hashtag={tag} />
        ))}
      </ScrollableList>
    </Column>
  );
};

export default FollowedTags;
