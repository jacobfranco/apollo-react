// src/components/PlayerRow.tsx

import React from "react";
import swordIcon from "@tabler/icons/outline/sword.svg";
import ghostIcon from "@tabler/icons/outline/ghost.svg";
import { Player } from "src/schemas/player";
import SvgIcon from "./SvgIcon";

interface PlayerRowProps {
  player: Player | null;
  team: "left" | "right";
}

const PlayerRow: React.FC<PlayerRowProps> = ({ player, team }) => {
  const isLeft = team === "left";

  const {
    kills = "-",
    deaths = "-",
    assists = "-",
    totalCreepScore = "-",
    champion,
    items = [],
    trinketSlot = [],
    summonerSpells = [],
  } = player?.matchStats || {};

  const fullName = `${player?.firstName || ""} ${
    player?.lastName || ""
  }`.trim();

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
    bot: "bot",
    support: "sup",
    unassigned: "N/A",
  };

  const playerRole = player?.role || "unassigned";

  return (
    <div
      className={`flex items-center w-full ${
        isLeft ? "justify-start" : "justify-end"
      }`}
    >
      <div className="flex items-center p-2 bg-primary-200 dark:bg-secondary-500 rounded-sm relative">
        {isLeft ? (
          <>
            {/* Player Portrait - Fixed width */}
            <div className="w-16 shrink-0">
              <img
                src={player?.images?.[0]?.url || "/placeholder.png"}
                alt=""
                className="w-16 h-16 rounded"
              />
            </div>
            {/* Player Info - Fixed width */}
            <div className="w-40 ml-4 flex flex-col min-w-0">
              <div className="flex items-center text-md font-bold text-black dark:text-white uppercase truncate">
                {player?.nickName || "Player"}
                <span className="ml-1 text-sm text-gray-400">
                  {roleAbbreviations[playerRole] || playerRole}
                </span>
              </div>
              <div className="text-xs text-gray-500 truncate mt-1">
                {fullName || "Full Name"}
              </div>
            </div>
            {/* KDA and CS - Fixed position in center */}
            <div className="flex flex-col items-center w-32">
              <div className="flex items-center text-xl">
                <SvgIcon src={swordIcon} className="h-6 w-6 text-primary-500" />
                <div className="ml-1 text-black dark:text-white">{`${kills} / ${deaths} / ${assists}`}</div>
              </div>
              <div className="flex items-center text-sm mt-1">
                <SvgIcon src={ghostIcon} className="h-5 w-5 text-primary-500" />
                <div className="ml-1 text-black dark:text-white">
                  {totalCreepScore}
                </div>
              </div>
            </div>
            {/* Items and Trinket - Reduced size and spacing */}
            <div className="flex items-center gap-1 w-28 ml-4">
              <div className="grid grid-cols-3 grid-rows-2 gap-0.5">
                {itemImageUrls.map((url, index) => (
                  <img key={index} src={url} alt="" className="w-6 h-6" />
                ))}
              </div>
              <img src={trinketImageUrl} alt="" className="w-6 h-6" />
            </div>
            {/* Summoner Spells - Reduced size */}
            <div className="flex flex-col gap-0.5 mx-2">
              {summonerSpellUrls.map((url, index) => (
                <img key={index} src={url} alt="" className="w-6 h-6" />
              ))}
            </div>
            {/* Champion Portrait - Fixed width */}
            <div className="w-16 shrink-0">
              <img
                src={championImageUrl}
                alt=""
                className="w-16 h-16 rounded"
              />
            </div>
          </>
        ) : (
          <>
            {/* Champion Portrait - Fixed width */}
            <div className="w-16 shrink-0">
              <img
                src={championImageUrl}
                alt=""
                className="w-16 h-16 rounded"
              />
            </div>
            {/* Summoner Spells - Reduced size */}
            <div className="flex flex-col gap-0.5 mx-2">
              {summonerSpellUrls.map((url, index) => (
                <img key={index} src={url} alt="" className="w-6 h-6" />
              ))}
            </div>
            {/* Items and Trinket - Reduced size and spacing */}
            <div className="flex items-center gap-1 w-28 mr-4">
              <div className="grid grid-cols-3 grid-rows-2 gap-0.5">
                {itemImageUrls.map((url, index) => (
                  <img key={index} src={url} alt="" className="w-6 h-6" />
                ))}
              </div>
              <img src={trinketImageUrl} alt="" className="w-6 h-6" />
            </div>
            {/* KDA and CS - Fixed position in center */}
            <div className="flex flex-col items-center w-32">
              <div className="flex items-center text-xl">
                <div className="mr-1 text-black dark:text-white">{`${kills} / ${deaths} / ${assists}`}</div>
                <SvgIcon src={swordIcon} className="h-6 w-6 text-primary-500" />
              </div>
              <div className="flex items-center text-md mt-1">
                <div className="mr-1 text-black dark:text-white">
                  {totalCreepScore}
                </div>
                <SvgIcon src={ghostIcon} className="h-5 w-5 text-primary-500" />
              </div>
            </div>
            {/* Player Info - Fixed width */}
            <div className="w-40 mr-4 flex flex-col items-end min-w-0">
              <div className="flex items-center text-md text-black dark:text-white font-bold uppercase truncate">
                <span className="text-gray-400 text-sm mr-1">
                  {roleAbbreviations[playerRole] || playerRole}
                </span>
                {player?.nickName || "Player"}
              </div>
              <div className="text-xs text-gray-500 truncate mt-1">
                {fullName || "Full Name"}
              </div>
            </div>
            {/* Player Portrait - Fixed width */}
            <div className="w-16 shrink-0">
              <img
                src={player?.images?.[0]?.url || "/placeholder.png"}
                alt=""
                className="w-16 h-16 rounded"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerRow;
