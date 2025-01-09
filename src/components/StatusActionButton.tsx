import clsx from "clsx";
import { forwardRef } from "react";

import Icon from "src/components/Icon";
import Text from "src/components/Text";
import { shortNumberFormat } from "src/utils/numbers";

const COLORS = {
  accent: "accent",
  success: "success",
};

type Color = keyof typeof COLORS;

interface IStatusActionCounter {
  count: number;
}

/** Action button numerical counter, eg "5" likes. */
const StatusActionCounter: React.FC<IStatusActionCounter> = ({
  count = 0,
}): JSX.Element => {
  return (
    <Text size="xs" weight="semibold" theme="inherit">
      {shortNumberFormat(count)}
    </Text>
  );
};

interface IStatusActionButton
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconClassName?: string;
  icon: string;
  count?: number;
  active?: boolean;
  color?: Color;
  filled?: boolean;
  theme?: "default" | "inverse";
}

const StatusActionButton = forwardRef<HTMLButtonElement, IStatusActionButton>(
  (props, ref): JSX.Element => {
    const {
      icon,
      className,
      iconClassName,
      active,
      color,
      filled = false,
      count = 0,
      theme = "default",
      ...filteredProps
    } = props;

    const renderIcon = () => {
      return (
        <Icon
          src={icon}
          className={clsx(
            {
              "fill-accent-300 text-accent-300 hover:fill-accent-300":
                active && filled && color === COLORS.accent,
            },
            iconClassName
          )}
        />
      );
    };

    const renderText = () => {
      if (count) {
        return <StatusActionCounter count={count} />;
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        className={clsx(
          "flex items-center space-x-1 rounded-full p-1 rtl:space-x-reverse",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:ring-offset-0",
          {
            "text-gray-600 hover:text-gray-600 dark:hover:text-white bg-white dark:bg-transparent":
              theme === "default",
            "text-white/80 hover:text-white bg-transparent dark:bg-transparent":
              theme === "inverse",
            "hover:text-gray-600 dark:hover:text-white":
              !filteredProps.disabled,
            "text-accent-300 hover:text-accent-300 dark:hover:text-accent-300":
              active && color === COLORS.accent,
            "text-success-600 hover:text-success-600 dark:hover:text-success-600":
              active && color === COLORS.success,
          },
          className
        )}
        {...filteredProps}
      >
        {renderIcon()}
        {renderText()}
      </button>
    );
  }
);

export default StatusActionButton;
