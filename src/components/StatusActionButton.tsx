import clsx from "clsx";
import { forwardRef } from "react";
import Icon from "src/components/Icon";
import Text from "src/components/Text";
import { shortNumberFormat } from "src/utils/numbers";

interface IStatusActionCounter {
  count: number;
}

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
  actionType?: "reply" | "repost" | "like";
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
      actionType,
      filled = false,
      count = 0,
      theme = "default",
      ...filteredProps
    } = props;

    // Get the color based on action type
    const getActionColor = () => {
      switch (actionType) {
        case "reply":
          return "#5B98F1";
        case "repost":
          return "#A981FC";
        case "like":
          return "#FC81B1";
        default:
          return undefined;
      }
    };

    const actionColor = getActionColor();

    const renderIcon = () => (
      <Icon
        src={icon}
        className={clsx(
          "transition-all duration-300",
          { "scale-110": active },
          iconClassName
        )}
      />
    );

    const renderText = () => {
      if (count) {
        return <StatusActionCounter count={count} />;
      }
    };

    const renderParticles = () => {
      if (!active || !actionColor) return null;

      return (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div
            className="absolute top-0 left-1/4 w-1 h-1 rounded-full animate-ping"
            style={{ backgroundColor: actionColor }}
          />
          <div
            className="absolute bottom-1/4 right-0 w-1 h-1 rounded-full animate-ping delay-100"
            style={{ backgroundColor: actionColor }}
          />
        </div>
      );
    };

    const buttonClasses = clsx(
      // Base styles
      "relative flex items-center space-x-1 rounded-full p-1 rtl:space-x-reverse",
      "group hover:scale-105",
      "transition-all duration-300",

      // Theme variations
      {
        "text-gray-600 dark:hover:text-white bg-white dark:bg-transparent":
          theme === "default",
        "text-white/80 hover:text-white bg-transparent dark:bg-transparent":
          theme === "inverse",
      },

      // Active state
      active && actionColor && "group", // Add group class for particle effects

      className
    );

    return (
      <button
        ref={ref}
        type="button"
        className={buttonClasses}
        style={active && actionColor ? { color: actionColor } : undefined}
        {...filteredProps}
      >
        {renderParticles()}
        {renderIcon()}
        {renderText()}
      </button>
    );
  }
);

export default StatusActionButton;
