import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { setFilter } from "src/actions/search";
import Space from "src/components/Space";
import { Text, Widget } from "src/components/";
import PlaceholderSidebarTrends from "src/components/PlaceholderSidebarTrends";
import { useAppDispatch } from "src/hooks";
import useTrendingSpaces from "src/queries/trending-spaces";

interface ITrendingSpacesPanel {
  limit: number;
}

const messages = defineMessages({
  viewAll: {
    id: "trends_panel.view_all",
    defaultMessage: "View all",
  },
});

const TrendingSpacesPanel = ({ limit }: ITrendingSpacesPanel) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const { data: trends, isFetching } = useTrendingSpaces();

  const setSpacesFilter = () => {
    dispatch(setFilter("spaces"));
  };

  if (!isFetching && !trends?.length) {
    return null;
  }

  return (
    <Widget
      title={
        <FormattedMessage id="trending_spaces.title" defaultMessage="Spaces" />
      }
      action={
        <Link className="text-right" to="/search" onClick={setSpacesFilter}>
          <Text
            tag="span"
            theme="primary"
            size="sm"
            className="hover:underline"
          >
            {intl.formatMessage(messages.viewAll)}
          </Text>
        </Link>
      }
    >
      {isFetching ? (
        <PlaceholderSidebarTrends limit={limit} />
      ) : (
        trends
          ?.slice(0, limit)
          .map((space) => <Space key={space.id} space={space} />)
      )}
    </Widget>
  );
};

export default TrendingSpacesPanel;
