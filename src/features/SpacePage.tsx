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
import { List, ListItem, Spinner, Tabs } from "src/components";
import { useAppDispatch, useAppSelector, useLoggedIn } from "src/hooks";
import { fetchSpace, followSpace, unfollowSpace } from "src/actions/spaces";
import { Column } from "src/components/Column";
import SpaceTimeline from "./SpaceTimeline";
import SpaceGallery from "./SpaceGallery";
import Button from "src/components/Button";
import plusIcon from "@tabler/icons/outline/plus.svg";

const messages = defineMessages({
  community: { id: "spaces_page.community", defaultMessage: "Community" },
  media: { id: "spaces_page.media", defaultMessage: "Media" },
  loading: { id: "spaces_page.loading", defaultMessage: "Loading space..." },
  follow: { id: "space.follow", defaultMessage: "Follow" },
  unfollow: { id: "space.unfollow", defaultMessage: "Unfollow" },
});

const SpacePage: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { spaceName } = useParams<{ spaceName: string }>();
  const { isLoggedIn } = useLoggedIn();
  const space = useAppSelector((state) => state.spaces.get(spaceName));

  const [activeTab, setActiveTab] = useState<"community" | "media">(
    "community"
  );
  const [tabKey, setTabKey] = useState(0);

  const handleTabChange = useCallback((tabName: "community" | "media") => {
    setActiveTab(tabName);
    setTabKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (spaceName && !space) {
      dispatch(fetchSpace(spaceName));
    }
  }, [dispatch, spaceName, space]);

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

  if (!space) {
    return (
      <div className="text-center text-gray-500">
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

  return (
    <Column transparent={false} withHeader>
      <div className="flex flex-col space-y-2">
        {/* Header with backdrop image */}
        <div className="relative overflow-hidden -mt-16 -mx-4 rounded-lg">
          {/* Backdrop Image */}
          {space.get("imageUrl") && (
            <div className="absolute inset-0">
              <img
                src={space.get("imageUrl")}
                alt=""
                className="w-full h-64 object-cover"
              />
              {/* Gradient overlay - lighter for more image visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 rounded-t-lg" />
            </div>
          )}

          {/* Content */}
          <div className="relative px-6 pb-2 pt-28">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-baseline space-x-2 px-4 py-2 rounded-lg bg-primary-400/20 dark:bg-secondary-800/40 backdrop-blur-sm">
                <h1 className="text-2xl font-bold text-white">
                  {space.get("name")}
                </h1>
                <span className="text-md font-bold text-gray-300">
                  /s/{spaceName}
                </span>
              </div>

              {isLoggedIn && (
                <Button
                  theme={space.get("following") ? "secondary" : "primary"}
                  size="sm"
                  icon={!space.get("following") ? plusIcon : undefined}
                  onClick={handleFollow}
                >
                  {space.get("following")
                    ? intl.formatMessage(messages.unfollow)
                    : intl.formatMessage(messages.follow)}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs items={tabItems} activeItem={activeTab} />

        {/* Tab content */}
        <div>
          {activeTab === "community" && (
            <Suspense fallback={<Spinner />} key={`community-${tabKey}`}>
              <SpaceTimeline spacePath={spaceName} />
            </Suspense>
          )}
          {activeTab === "media" && (
            <Suspense fallback={<Spinner />} key={`media-${tabKey}`}>
              <SpaceGallery spacePath={spaceName} />
            </Suspense>
          )}
        </div>
      </div>
    </Column>
  );
};

export default SpacePage;
