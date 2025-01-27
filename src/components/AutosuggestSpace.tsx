import React from "react";
import { useAppSelector } from "src/hooks/useAppSelector";
import { selectSpace } from "src/selectors";
import type { RootState } from "src/store";

interface Props {
  id: string;
  disabled?: boolean;
}

const AutosuggestSpace: React.FC<Props> = ({ id, disabled }) => {
  const space = useAppSelector((state: RootState) => selectSpace(state, id));
  if (!space) return null;

  const imageUrl = space.get("imageUrl") || "/src/assets/placeholder-team.png";
  const name = space.get("name") || "";
  const spaceId = space.get("id") || "";

  return (
    <div className="flex items-center space-x-2">
      <img
        src={imageUrl}
        alt=""
        className="h-12 w-12 rounded-5px object-cover"
        aria-hidden={disabled}
      />
      <div className="flex flex-col">
        {/* Force text color for name, adjusting for light/dark mode */}
        <span className="font-bold text-black dark:text-white">{name}</span>
        <span className="text-sm text-primary-500 dark:text-primary-400">
          s/{spaceId}
        </span>
      </div>
    </div>
  );
};

export default AutosuggestSpace;
