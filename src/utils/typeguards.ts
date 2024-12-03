// src/utils/typeGuards.ts

import { PlayerAggStats } from "src/schemas/player-agg-stats";

/**
 * Type guard to check if a key is a valid key of PlayerAggStats.
 * @param key - The key to check.
 * @returns True if key is a valid PlayerAggStats key, false otherwise.
 */
export function isPlayerAggStatsKey(key: string): key is keyof PlayerAggStats {
  return [
    "id",
    "totalMatches",
    "totalKills",
    "totalDeaths",
    "totalAssists",
    "averageKills",
    "averageDeaths",
    "averageAssists",
  ].includes(key);
}
