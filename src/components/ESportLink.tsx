import React from "react";
import { Link } from "react-router-dom";
import type { Space } from "src/types/entities";
import SpaceFollowButton from "./SpaceFollowButton";
import clsx from "clsx";

interface ESportLinkProps {
  space: Space;
  isFollowed: boolean;
  onToggleFollow: () => void;
}

const ESportLink: React.FC<ESportLinkProps> = ({
  space,
  isFollowed,
  onToggleFollow,
}) => {
  const name = space.get("name").replace(" Esports", "");
  const esportPath = space.get("id").replace("esports", "");

  return (
    <div
      className={clsx(
        "relative overflow-hidden",
        "bg-primary-100 dark:bg-secondary-500",
        "text-gray-900 dark:text-gray-100",
        "shadow-lg shadow-gray-500 dark:shadow-secondary-900",
        "sm:rounded-xl",
        "transition-transform hover:scale-105"
      )}
    >
      <Link to={`/esports/${esportPath}`} className="block">
        <img
          src={space.get("imageUrl")}
          alt={name}
          className="w-full h-64 object-cover sm:rounded-xl"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center sm:rounded-xl">
          <h2 className="text-2xl font-bold text-white text-center">{name}</h2>
        </div>
      </Link>
      <SpaceFollowButton
        isFollowed={isFollowed}
        onToggleFollow={onToggleFollow}
        className="absolute top-2 right-2"
      />
    </div>
  );
};

export default ESportLink;
