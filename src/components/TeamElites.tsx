import React from "react";
import { CreepsKills } from "src/schemas/creeps";
import classNames from "classnames";

interface TeamElitesProps {
  creepsKills: CreepsKills;
  teamSide: "left" | "right";
  theme: "light" | "dark";
  className?: string; // Added to allow padding from parent
}

const TeamElites: React.FC<TeamElitesProps> = ({
  creepsKills,
  teamSide,
  theme,
  className, // Destructure className
}) => {
  // Define the drake types (excluding Elder Dragon)
  const drakeNames = [
    "Infernal Drake",
    "Cloud Drake",
    "Ocean Drake",
    "Hextech Drake",
    "Chemtech Drake",
    "Mountain Drake",
  ];

  // Define other elite types
  const allElites = ["Voidgrub", "Rift Herald", "Baron Nashor", "Elder Dragon"];

  // Extract drakes from the data
  const drakes =
    creepsKills.kills.perEliteType?.filter((eliteKill) =>
      drakeNames.includes(eliteKill.elite.name)
    ) || [];

  // Limit to five drakes
  const displayedDrakes = drakes.slice(0, 5);

  // Extract other elites from the data
  const otherElites =
    creepsKills.kills.perEliteType?.filter((eliteKill) =>
      allElites.includes(eliteKill.elite.name)
    ) || [];

  // Function to render drake circles
  const renderDrakeCircles = () => {
    const circles = [];
    const maxDrakes = 5;

    for (let i = 0; i < maxDrakes; i++) {
      const drake = displayedDrakes[i];
      const filled = drake ? true : false;
      const drakeImageUrl = drake?.elite.images[0]?.url || null;
      const drakeName = drake?.elite.name || "";

      circles.push(
        <div
          key={i}
          className={classNames(
            "w-8 h-8 rounded-full border-2 flex items-center justify-center overflow-hidden",
            {
              "border-gray-500": true,
              "bg-primary-500": filled,
              "bg-transparent": !filled,
            }
          )}
        >
          {filled && drakeImageUrl && (
            <img
              src={drakeImageUrl}
              alt={drakeName}
              className="w-full h-full object-cover rounded-full"
              loading="lazy"
            />
          )}
        </div>
      );
    }

    // Reverse the circles for the right team
    const orderedCircles = teamSide === "right" ? circles.reverse() : circles;

    return <div className="flex space-x-2">{orderedCircles}</div>;
  };

  // Function to render other elites
  const renderOtherElites = () => {
    // Check if any other elites have been recorded
    const hasOtherElites = otherElites.length > 0;

    if (hasOtherElites) {
      // Render only the recorded elites without placeholders
      return (
        <div className="flex space-x-2 mt-2">
          {otherElites.map((eliteKill) => {
            const { elite, total } = eliteKill;
            if (total === 0 || !elite.images[0]?.url) return null;

            return (
              <div key={elite.id} className="relative">
                <img
                  src={elite.images[0].url}
                  alt={elite.name}
                  className="w-8 h-8 object-contain"
                  loading="lazy"
                />
                {total > 1 && (
                  <span className="absolute -top-1 -left-1 bg-secondary-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {total}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      );
    } else {
      // No elites recorded, render placeholders to maintain spacing
      return (
        <div className="flex space-x-2 mt-2">
          {allElites.map((eliteName) => (
            <div key={eliteName} className="w-8 h-8" />
          ))}
        </div>
      );
    }
  };

  return (
    <div className={classNames("flex flex-col items-center", className)}>
      {/* Drake Circles */}
      {renderDrakeCircles()}
      {/* Other Elites */}
      {renderOtherElites()}
    </div>
  );
};

export default TeamElites;
