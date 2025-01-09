import React from "react";

import { useState, useEffect } from "react";
import { defineMessages, useIntl } from "react-intl";

import { fetchReports } from "src/actions/admin";
import ScrollableList from "src/components/ScrollableList";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useAppSelector } from "src/hooks/useAppSelector";

import Report from "src/components/Report";

const messages = defineMessages({
  heading: { id: "column.admin.reports", defaultMessage: "Reports" },
  modlog: {
    id: "column.admin.reports.menu.moderation_log",
    defaultMessage: "Moderation Log",
  },
  emptyMessage: {
    id: "admin.reports.empty_message",
    defaultMessage:
      "There are no open reports. If a user gets reported, they will show up here.",
  },
});

const Reports: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const [isLoading, setLoading] = useState(true);

  const reports = useAppSelector((state) => {
    console.log("Full admin state:", state.admin.toJS()); // Add this
    console.log("OpenReports:", state.admin.openReports.toJS()); // Add this
    return state.admin.openReports.toList();
  });

  useEffect(() => {
    dispatch(fetchReports())
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error in fetchReports:", err);
      });
  }, []);

  const showLoading = isLoading && reports.count() === 0;

  return (
    <ScrollableList
      isLoading={isLoading}
      showLoading={showLoading}
      scrollKey="admin-reports"
      emptyMessage={intl.formatMessage(messages.emptyMessage)}
      listClassName="divide-y divide-solid divide-gray-200 dark:divide-gray-800"
    >
      {reports.map((report) => report && <Report id={report} key={report} />)}
    </ScrollableList>
  );
};

export default Reports;
