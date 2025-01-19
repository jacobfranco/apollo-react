import React, {
  useEffect,
  lazy,
  Suspense,
  useState,
  useMemo,
  useCallback,
} from "react";
import { defineMessages, useIntl, FormattedMessage } from "react-intl";
import { useParams } from "react-router-dom";
import { Tabs, List, ListItem, Toggle, Spinner } from "src/components";
import { useAppDispatch, useAppSelector, useLoggedIn } from "src/hooks";
import { fetchSpace, followSpace, unfollowSpace } from "src/actions/spaces";
import { Column } from "src/components/Column";
import SpaceTimeline from "./SpaceTimeline";

const messages = defineMessages({
  community: { id: "spaces_page.community", defaultMessage: "Community" },
  media: { id: "spaces_page.media", defaultMessage: "Media" },
  loading: { id: "spaces_page.loading", defaultMessage: "Loading space..." },
  follow: { id: "space.follow", defaultMessage: "Follow space" },
});

const SpacePage: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { spaceName } = useParams<{ spaceName: string }>();
  const { isLoggedIn } = useLoggedIn();
  const space = useAppSelector((state) => state.spaces.get(spaceName));

  // Default tab is "community"
  const [activeTab, setActiveTab] = useState<"community" | "media">(
    "community"
  );

  // This key increments every time we switch tabs, forcing <Suspense> to remount
  const [tabKey, setTabKey] = useState(0);

  const handleTabChange = useCallback((tabName: "community" | "media") => {
    setActiveTab(tabName);
    setTabKey((prev) => prev + 1);
  }, []);

  // Fetch space data once on mount or if spaceName changes
  useEffect(() => {
    if (spaceName && !space) {
      dispatch(fetchSpace(spaceName));
    }
  }, [dispatch, spaceName, space]);

  if (!space) {
    return (
      <div className="text-center text-red-500">
        {intl.formatMessage(messages.loading)}
      </div>
    );
  }

  const handleFollow = () => {
    const shortId = space.get("id");
    if (!shortId) return;
    if (space.get("following")) {
      dispatch(unfollowSpace(shortId));
    } else {
      dispatch(followSpace(shortId));
    }
  };

  // Build out the tab items
  const tabItems = useMemo(
    () => [
      {
        name: "community",
        text: intl.formatMessage(messages.community),
        title: intl.formatMessage(messages.community),
        action: () => handleTabChange("community"),
      },
      {
        name: "media",
        text: intl.formatMessage(messages.media),
        title: intl.formatMessage(messages.media),
        action: () => handleTabChange("media"),
      },
    ],
    [intl, handleTabChange]
  );

  return (
    <Column label={space.get("name")} transparent={false} withHeader>
      <div className="space-y-6">
        {/* Header with follow toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="ml-2 text-sm text-gray-500">/s/{spaceName}</span>
          </div>
          {isLoggedIn && (
            <List>
              <ListItem
                label={
                  <FormattedMessage
                    id="space.follow"
                    defaultMessage="Follow space"
                  />
                }
              >
                <Toggle
                  checked={space.get("following")}
                  onChange={handleFollow}
                />
              </ListItem>
            </List>
          )}
        </div>

        {/* Tabs */}
        <Tabs items={tabItems} activeItem={activeTab} />

        {/* Render each tab with Suspense */}
        {activeTab === "community" && (
          <Suspense fallback={<Spinner />} key={`community-${tabKey}`}>
            <SpaceTimeline spacePath={spaceName} />
          </Suspense>
        )}
        {activeTab === "media" && (
          <Suspense fallback={<Spinner />} key={`media-${tabKey}`}>
            <SpaceTimeline spacePath={spaceName} />
          </Suspense>
        )}
      </div>
    </Column>
  );
};

export default SpacePage;
