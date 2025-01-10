import { FormattedNumber } from "react-intl";
import { Link } from "react-router-dom";
import Text from "src/components/Text";
import Spinner from "src/components/Spinner";
import { isNumber } from "src/utils/numbers";
import React from "react";

interface IDashCounter {
  count: number | undefined;
  label: React.ReactNode;
  to?: string;
  percent?: boolean;
  isLoading?: boolean;
}

const DashCounter: React.FC<IDashCounter> = ({
  count,
  label,
  to = "#",
  percent = false,
  isLoading = false,
}) => {
  const displayCount = isNumber(count) ? count : 0;
  const content = isLoading ? (
    <div className="flex h-14 items-center justify-center">
      <Spinner size={4} />
    </div>
  ) : (
    <Text align="center" size="2xl" weight="medium">
      <FormattedNumber
        value={displayCount}
        style={percent ? "unit" : undefined}
        unit={percent ? "percent" : undefined}
      />
    </Text>
  );
  return (
    <Link
      className="flex flex-col items-center space-y-2 rounded bg-primary-300 dark:bg-secondary-700 p-4 transition-transform"
      to={to}
    >
      {content}
      <Text theme="muted" align="center">
        {label}
      </Text>
    </Link>
  );
};

interface IDashCounters {
  children: React.ReactNode;
}

const DashCounters: React.FC<IDashCounters> = ({ children }) => {
  // Count the number of children
  const childCount = React.Children.count(children);

  // Use different grid layouts based on child count
  const gridClass =
    childCount === 3
      ? "grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-3"
      : "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-2";

  return <div className={gridClass}>{children}</div>;
};

export { DashCounter, DashCounters };
