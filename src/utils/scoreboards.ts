import { Series } from "src/schemas/series";
import { Match } from "src/schemas/match";

/**
 * Combines tournament and series titles while omitting specified words
 * @param series The series object containing title and tournament information
 * @param wordsToOmit Array of words to remove from the series title (default: ['Bracket'])
 * @returns Formatted combined title
 */
export function formatScoreboardTitle(
  series: Series,
  wordsToOmit: string[] = ["Bracket"]
): string {
  if (!series.tournament?.title) {
    return series.title;
  }

  // Clean up the series title by removing specified words
  let cleanedSeriesTitle = series.title;
  wordsToOmit.forEach((word) => {
    cleanedSeriesTitle = cleanedSeriesTitle.replace(word, "").trim();
  });

  // Remove any leading or trailing dashes and clean up extra spaces
  cleanedSeriesTitle = cleanedSeriesTitle
    .replace(/^\s*-\s*|\s*-\s*$/g, "")
    .trim();

  // Combine the titles
  return `${series.tournament.title} - ${cleanedSeriesTitle}`;
}

/**
 * Formats a gold value into a string with one decimal followed by 'K'.
 * For example, 40200 becomes '40.2K', and 17000 becomes '17.0K'.
 * If the gold is less than 1000, it returns the original number as a string.
 *
 * @param gold - The gold value to format.
 * @returns The formatted gold string.
 */
export function formatGold(gold: number): string {
  if (gold >= 1000) {
    const formattedGold = (gold / 1000).toFixed(1);
    return `${formattedGold}K`;
  }
  return gold.toString();
}

export const getCoverageFact = (match: Match | undefined): string => {
  return match?.coverage?.data?.live?.cv?.fact || "unknown";
};

/**
 * Formats a numerical stat to one decimal place.
 * If the input is null or undefined, returns a fallback string.
 *
 * @param value - The numerical value to format.
 * @param fallback - The fallback string if value is null or undefined.
 * @returns The formatted string or fallback.
 */
export const formatStat = (
  value: number | null | undefined,
  fallback: string = "-"
): string => {
  if (value === null || value === undefined) {
    return fallback;
  }
  return value.toFixed(1);
};

/**
 * Converts a discrete number into a formatted streak string.
 *
 * @param streak - The number representing the streak. Positive for wins, negative for losses.
 * @returns A string formatted as "W<number>" for wins or "L<number>" for losses.
 *          Returns "W0" if the streak is zero.
 */
export function formatStreak(streak: number): string {
  if (streak > 0) {
    return `W${streak}`;
  } else if (streak < 0) {
    return `L${Math.abs(streak)}`;
  } else {
    return "W0"; // Represents no current streak
  }
}
