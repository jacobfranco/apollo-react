import React, { useState, useEffect, lazy } from "react";
import { defineMessages, useIntl, FormattedMessage } from "react-intl";
import { useParams, Link } from "react-router-dom";
import { Tabs, List, ListItem, Toggle } from "src/components";
import { useAppDispatch, useAppSelector, useLoggedIn } from "src/hooks";
import { fetchSpace, followSpace, unfollowSpace } from "src/actions/spaces";
import SpaceTimeline from "./SpaceTimeline";
import { Column } from "src/components/Column";

const MediaTab = lazy(() => import("./MediaTab"));

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
  const [selectedTab, setSelectedTab] = useState("community");
  const { isLoggedIn } = useLoggedIn();

  const space = useAppSelector(
    (state) =>
      state.spaces.byUrl.get(spaceName) || state.spaces.byName.get(spaceName)
  );

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
    if (!space) return;
    const spaceUrl = space.get("url").replace(/^\/s\//, "");
    if (!spaceUrl) return;

    if (space.get("following")) {
      dispatch(unfollowSpace(spaceUrl));
    } else {
      dispatch(followSpace(spaceUrl));
    }
  };

  {
    /* TODO: Need to fix this and put it back in
  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
 <span className="ml-2 text-sm text-gray-500">/s/{spaceName}</span>
      </div>
      {isLoggedIn && (
        <List>
          <ListItem
            label={<FormattedMessage id='space.follow' defaultMessage='Follow space' />}
          >
            <Toggle
              checked={space.get('following')}
              onChange={handleFollow}
            />
          </ListItem>
        </List>
      )}
    </div>
  );
  */
  }

  const renderTabBar = () => {
    const items = [
      {
        text: intl.formatMessage(messages.community),
        action: () => setSelectedTab("community"),
        name: "community",
      },
      {
        text: intl.formatMessage(messages.media),
        action: () => setSelectedTab("media"),
        name: "media",
      },
    ];
    return <Tabs items={items} activeItem={selectedTab} />;
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "community":
        return <SpaceTimeline spacePath={spaceName} />;
      case "media":
        return <MediaTab />;
      default:
        return null;
    }
  };

  // TODO: Put render header back in

  return (
    <Column label={`${space.get("name")}`}>
      {/* renderHeader() */}
      {renderTabBar()}
      <div className="tab-content">{renderTabContent()}</div>
    </Column>
  );
};

export default SpacePage;
