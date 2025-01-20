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
  actionType?: "info" | "success" | "danger" | "misc";
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

    // Map action types to Tailwind color classes
    const getActionColorClass = () => {
      if (!actionType) return undefined;

      const colorClassMap = {
        info: currentTheme === "dark" ? "text-info-400" : "text-info-500",
        success:
          currentTheme === "dark" ? "text-success-400" : "text-success-500",
        danger:
          currentTheme === "dark"
            ? "text-danger-400 !text-danger-400"
            : "text-danger-500 !text-danger-500",
        misc: "text-misc-400",
      };

      return colorClassMap[actionType];
    };

    // Map action types to RGB values for particles
    const getParticleColor = () => {
      if (!actionType) return undefined;

      const rgbMap = {
        info: {
          light: { r: 0, g: 149, b: 255 },
          dark: { r: 69, g: 202, b: 255 },
        },
        success: {
          light: { r: 0, g: 208, b: 133 },
          dark: { r: 61, g: 255, b: 158 },
        },
        danger: {
          light: { r: 255, g: 59, b: 153 },
          dark: { r: 255, g: 95, b: 179 },
        },
        misc: {
          light: { r: 123, g: 77, b: 255 },
          dark: { r: 123, g: 77, b: 255 },
        },
      };

      const color = rgbMap[actionType][currentTheme];
      return `rgb(${color.r}, ${color.g}, ${color.b})`;
    };

    const buttonClasses = clsx(
      "relative flex items-center space-x-1 rounded-full p-1 rtl:space-x-reverse",
      "group hover:scale-105 transition-all duration-300",
      {
        "text-gray-600 bg-transparent": theme === "default",
        "text-white/80 bg-transparent": theme === "inverse",
      },
      active && actionType && getActionColorClass(),
      className
    );

    const renderParticles = () => {
      const particleColor = getParticleColor();
      if (!particleColor) return null;

      return (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
          {/* Top-left particle */}
          <div
            className="absolute w-1 h-1 rounded-full animate-shimmer"
            style={{
              top: "10%",
              left: "15%",
              backgroundColor: particleColor,
              animationDelay: "700ms",
            }}
          />
          {/* Top-right particle */}
          <div
            className="absolute w-1 h-1 rounded-full animate-shimmer"
            style={{
              top: "10%",
              right: "25%",
              backgroundColor: particleColor,
              animationDelay: "400ms",
            }}
          />
          {/* Bottom-right particle */}
          <div
            className="absolute w-1 h-1 rounded-full animate-shimmer"
            style={{
              bottom: "15%",
              right: "20%",
              backgroundColor: particleColor,
              animationDelay: "0ms",
            }}
          />
          {/* Bottom-left particle */}
          <div
            className="absolute w-1 h-1 rounded-full animate-shimmer"
            style={{
              bottom: "10%",
              left: "20%",
              backgroundColor: particleColor,
              animationDelay: "100ms",
            }}
          />
          {/* Center particle */}
          <div
            className="absolute w-1 h-1 rounded-full animate-shimmer"
            style={{
              bottom: "55%",
              right: "55%",
              backgroundColor: particleColor,
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
