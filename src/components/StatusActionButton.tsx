import clsx from "clsx";
import { forwardRef } from "react";
import Icon from "src/components/Icon";
import Text from "src/components/Text";
import { useTheme } from "src/hooks";
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

    const currentTheme = useTheme();

    // Determine the action color based on the type and currentTheme.
    const getActionColor = () => {
      const colors = {
        light: {
          reply: "#0095FF",
          repost: "#00D085",
          like: "#FF3B99",
        },
        dark: {
          reply: "#45CAFF",
          repost: "#3DFF9E",
          like: "#FF5FB3",
        },
      };
      if (!actionType) return undefined;
      return colors[currentTheme][actionType];
    };

    const actionColor = getActionColor();

    const buttonClasses = clsx(
      "relative flex items-center space-x-1 rounded-full p-1 rtl:space-x-reverse",
      "group hover:scale-105 transition-all duration-300",
      {
        "text-gray-600 dark:hover:text-white bg-transparent":
          theme === "default",
        "text-white/80 hover:text-white bg-transparent": theme === "inverse",
      },
      actionType && "group",
      className
    );

    // Render four irregularly positioned particles that are only visible on hover.
    const renderParticles = () => {
      if (!actionColor) return null;
      return (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
          {/* Top-left particle */}
          <div
            className="absolute w-1 h-1 rounded-full animate-shimmer"
            style={{
              top: "10%",
              left: "15%",
              backgroundColor: actionColor,
              animationDelay: "700ms",
            }}
          />
          {/* Top-right particle */}
          <div
            className="absolute w-1 h-1 rounded-full animate-shimmer"
            style={{
              top: "10%",
              right: "25%",
              backgroundColor: actionColor,
              animationDelay: "400ms",
            }}
          />
          {/* Bottom-right particle */}
          <div
            className="absolute w-1 h-1 rounded-full animate-shimmer"
            style={{
              bottom: "15%",
              right: "20%",
              backgroundColor: actionColor,
              animationDelay: "0ms",
            }}
          />
          {/* Bottom-left particle */}
          <div
            className="absolute w-1 h-1 rounded-full animate-shimmer"
            style={{
              bottom: "10%",
              left: "20%",
              backgroundColor: actionColor,
              animationDelay: "100ms",
            }}
          />
          {/* Center particle */}
          <div
            className="absolute w-1 h-1 rounded-full animate-shimmer"
            style={{
              bottom: "55%",
              right: "55%",
              backgroundColor: actionColor,
              animationDelay: "200ms",
            }}
          />
        </div>
      );
    };

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
        return (
          <div className={clsx({ "text-current": active })}>
            <StatusActionCounter count={count} />
          </div>
        );
      }
      return null;
    };

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
