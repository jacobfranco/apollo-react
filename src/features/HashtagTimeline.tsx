import React, { useEffect } from "react";
import { defineMessages, useIntl, FormattedMessage } from "react-intl";
import { fetchHashtag, followHashtag, unfollowHashtag } from "src/actions/tags";
import { expandHashtagTimeline, clearTimeline } from "src/actions/timelines";
import { useHashtagStream } from "src/api/hooks";
import Button from "src/components/Button";
import plusIcon from "@tabler/icons/outline/plus.svg";
import { Column } from "src/components/Column";
import Timeline from "src/features/Timeline";
import {
  useAppDispatch,
  useAppSelector,
  useLoggedIn,
  useIsMobile,
  useTheme,
} from "src/hooks";

const messages = defineMessages({
  follow: { id: "hashtag.follow", defaultMessage: "Follow" },
  unfollow: { id: "hashtag.unfollow", defaultMessage: "Unfollow" },
});

interface IHashtagTimeline {
  params?: {
    id?: string;
  };
}

export const HashtagTimeline: React.FC<IHashtagTimeline> = ({ params }) => {
  const id = params?.id || "";
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const tag = useAppSelector((state) => state.tags.get(id));
  const next = useAppSelector(
    (state) => state.timelines.get(`hashtag:${id}`)?.next
  );
  const { isLoggedIn } = useLoggedIn();
  const theme = useTheme();
  const isMobile = useIsMobile();

  const handleLoadMore = (maxId: string) => {
    dispatch(expandHashtagTimeline(id, { url: next, maxId }));
  };

  const handleFollow = () => {
    if (tag?.following) {
      dispatch(unfollowHashtag(id));
    } else {
      dispatch(followHashtag(id));
    }
  };

  useHashtagStream(id);

  useEffect(() => {
    dispatch(expandHashtagTimeline(id));
    dispatch(fetchHashtag(id));
  }, [id]);

  useEffect(() => {
    dispatch(clearTimeline(`hashtag:${id}`));
    dispatch(expandHashtagTimeline(id));
  }, [id]);

  return (
    <Column label={`#${id}`} transparent={!isMobile}>
      {isLoggedIn && (
        <div className="px-4 py-2">
          <Button
            theme={tag?.following ? "secondary" : "primary"}
            size="sm"
            icon={!tag?.following ? plusIcon : undefined}
            onClick={handleFollow}
          >
            {tag?.following
              ? intl.formatMessage(messages.unfollow)
              : intl.formatMessage(messages.follow)}
          </Button>
        </div>
      )}
      <Timeline
        scrollKey="hashtag_timeline"
        timelineId={`hashtag:${id}`}
        onLoadMore={handleLoadMore}
        emptyMessage={
          <FormattedMessage
            id="empty_column.hashtag"
            defaultMessage="There is nothing in this hashtag yet."
          />
        }
        divideType={theme === "dark" || isMobile ? "border" : "space"}
      />
    </Column>
  );
};

export default HashtagTimeline;
