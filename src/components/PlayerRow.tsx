import React from "react";
import { Player } from "src/schemas/player";
import SvgIcon from "./SvgIcon";

interface PlayerRowProps {
  player: Player;
  team: "left" | "right";
}

const PlayerRow: React.FC<PlayerRowProps> = ({ player, team }) => {
  const isLeft = team === "left";

  const {
    kills = 0,
    deaths = 0,
    assists = 0,
    totalCreepScore = 0,
    champion,
    items = [],
    trinketSlot = [],
    summonerSpells = [],
  } = player.matchStats || {};

  const fullName = `${player.firstName || ""} ${player.lastName || ""}`.trim();

  const championImageUrl =
    champion?.champ.images?.[0]?.url || "/placeholder_champion.png";

  const itemImageUrls = items.map(
    (itemSlot) => itemSlot.item?.images?.[0]?.url || "/placeholder_item.png"
  );
  while (itemImageUrls.length < 6) {
    itemImageUrls.push("/placeholder_item.png");
  }

  const trinketImageUrl =
    trinketSlot[0]?.item?.images?.[0]?.url || "/placeholder_trinket.png";

  const summonerSpellUrls = summonerSpells.map(
    (spellSlot) => spellSlot.spell?.images?.[0]?.url || "/placeholder_spell.png"
  );
  while (summonerSpellUrls.length < 2) {
    summonerSpellUrls.push("/placeholder_spell.png");
  }

  const roleAbbreviations: { [key: string]: string } = {
    top: "top",
    jungle: "jng",
    mid: "mid",
    bottom: "bot",
    support: "sup",
    unassigned: "N/A",
  };

  const playerRole = player.role || "unassigned";

  return (
    <div
      className={`flex items-center py-2 ${
        isLeft ? "justify-start" : "justify-end"
      }`}
    >
      <div className="flex items-center w-full max-w-md p-2 mx-2 bg-secondary-500 rounded-lg">
        {isLeft ? (
          <>
            {/* Left edge - Player Portrait */}
            <img
              src={player.images?.[0]?.url || "/placeholder.png"}
              alt=""
              className="w-16 h-16 rounded shrink-0"
            />
            {/* Player Info - Flexible width */}
            <div className="ml-4 flex flex-col min-w-0 flex-shrink">
              <div className="flex items-center text-sm font-bold uppercase truncate">
                {player.nickName}
                <span className="ml-1 text-xs text-gray-400">
                  {roleAbbreviations[playerRole] || playerRole}
                </span>
              </div>
              <div className="text-xs text-gray-500 truncate">{fullName}</div>
            </div>
            {/* Fixed position elements */}
            <div className="flex items-center gap-4 ml-auto">
              {/* Stacked KDA and CS */}
              <div className="flex flex-col justify-center items-center">
                <div className="flex items-center">
                  <SvgIcon
                    src={require("@tabler/icons/outline/sword.svg")}
                    className="h-5 w-5 text-primary-500"
                  />
                  <div className="text-sm ml-1">{`${kills} / ${deaths} / ${assists}`}</div>
                </div>
                <div className="flex items-center mt-1">
                  <SvgIcon
                    src={require("@tabler/icons/outline/ghost.svg")}
                    className="h-5 w-5 text-primary-500"
                  />
                  <div className="text-sm ml-1">{totalCreepScore}</div>
                </div>
              </div>
              {/* Items Grid and Trinket */}
              <div className="flex flex-col gap-1">
                <div className="grid grid-cols-3 grid-rows-2 gap-1">
                  {itemImageUrls.map((url, index) => (
                    <img key={index} src={url} alt={``} className="w-5 h-5" />
                  ))}
                </div>
                <div className="flex justify-center">
                  <img src={trinketImageUrl} alt="" className="w-5 h-5" />
                </div>
              </div>
              {/* Summoner Spells */}
              <div className="flex flex-col gap-1">
                {summonerSpellUrls.map((url, index) => (
                  <img key={index} src={url} alt={``} className="w-5 h-5" />
                ))}
              </div>
              {/* Champion Portrait */}
              <img
                src={championImageUrl}
                alt=""
                className="w-16 h-16 rounded"
              />
            </div>
          </>
        ) : (
          <>
            {/* Right side - mirror of left side */}
            <div className="flex items-center gap-4 mr-auto">
              {/* Champion Portrait */}
              <img
                src={championImageUrl}
                alt=""
                className="w-16 h-16 rounded"
              />
              {/* Summoner Spells */}
              <div className="flex flex-col gap-1">
                {summonerSpellUrls.map((url, index) => (
                  <img key={index} src={url} alt={``} className="w-5 h-5" />
                ))}
              </div>
              {/* Items Grid and Trinket */}
              <div className="flex flex-col gap-1">
                <div className="grid grid-cols-3 grid-rows-2 gap-1">
                  {itemImageUrls.map((url, index) => (
                    <img key={index} src={url} alt={``} className="w-5 h-5" />
                  ))}
                </div>
                <div className="flex justify-center">
                  <img src={trinketImageUrl} alt="" className="w-5 h-5" />
                </div>
              </div>
              {/* Stacked KDA and CS */}
              <div className="flex flex-col justify-center items-center">
                <div className="flex items-center">
                  <div className="text-sm mr-1">{`${kills} / ${deaths} / ${assists}`}</div>
                  <SvgIcon
                    src={require("@tabler/icons/outline/sword.svg")}
                    className="h-5 w-5 text-primary-500"
                  />
                </div>
                <div className="flex items-center mt-1">
                  <div className="text-sm mr-1">{totalCreepScore}</div>
                  <SvgIcon
                    src={require("@tabler/icons/outline/ghost.svg")}
                    className="h-5 w-5 text-primary-500"
                  />
                </div>
              </div>
            </div>
            {/* Player Info - Flexible width */}
            <div className="mr-4 flex flex-col items-end min-w-0 flex-shrink">
              <div className="flex items-center text-sm font-bold uppercase truncate">
                <span className="text-gray-400 mr-1">
                  {roleAbbreviations[playerRole] || playerRole}
                </span>
                {player.nickName}
              </div>
              <div className="text-xs text-gray-500 truncate">{fullName}</div>
            </div>
            {/* Right edge - Player Portrait */}
            <img
              src={player.images?.[0]?.url || "/placeholder.png"}
              alt=""
              className="w-16 h-16 rounded shrink-0"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerRow;
