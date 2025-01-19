import React from "react";
import { SvgIcon } from "src/components";
import filledStarIcon from "@tabler/icons/filled/star.svg";
import clsx from "clsx";

interface SpaceFollowButtonProps {
  isFollowed: boolean;
  onToggleFollow: () => void;
  className?: string;
}

const SpaceFollowButton: React.FC<SpaceFollowButtonProps> = ({
  isFollowed,
  onToggleFollow,
  className,
}) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleFollow();
      }}
      className={clsx(
        "p-2 rounded-full",
        "transition-all duration-300",
        "group hover:scale-105",
        isFollowed
          ? [
              "bg-gradient-to-br from-blue-700 via-primary-500 to-primary-400",
              "hover:from-blue-700 hover:via-primary-500 hover:to-primary-400",
              "text-white",
              "shadow-lg shadow-primary-500/50",
            ]
          : [
              "bg-gradient-to-br from-secondary-800 to-secondary-900",
              "hover:from-blue-600 hover:via-primary-600 hover:to-primary-500",
              "text-secondary-400 hover:text-white",
              "shadow-lg shadow-secondary-900/50",
            ],
        "backdrop-blur-sm",
        isFollowed ? "ring-primary-500/50" : "ring-transparent",
        className
      )}
    >
      {/* Star particle effects */}
      <div
        className={clsx(
          "absolute inset-0 opacity-0 group-hover:opacity-100",
          "transition-opacity duration-300",
          "pointer-events-none"
        )}
      >
        <div className="absolute top-0 left-1/4 w-1 h-1 bg-white rounded-full animate-ping" />
        <div className="absolute bottom-1/4 right-0 w-1 h-1 bg-white rounded-full animate-ping delay-100" />
      </div>
      <SvgIcon
        src={filledStarIcon}
        className={clsx(
          "h-5 w-5 relative z-10",
          "transition-transform duration-300"
        )}
      />
    </button>
  );
};

export default SpaceFollowButton;
