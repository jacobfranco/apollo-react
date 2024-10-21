import { Series } from 'src/schemas/series';

/**
 * Combines tournament and series titles while omitting specified words
 * @param series The series object containing title and tournament information
 * @param wordsToOmit Array of words to remove from the series title (default: ['Bracket'])
 * @returns Formatted combined title
 */
export function formatScoreboardTitle(
  series: Series,
  wordsToOmit: string[] = ['Bracket']
): string {
  if (!series.tournament?.title) {
    return series.title;
  }

  // Clean up the series title by removing specified words
  let cleanedSeriesTitle = series.title;
  wordsToOmit.forEach(word => {
    cleanedSeriesTitle = cleanedSeriesTitle.replace(word, '').trim();
  });

  // Remove any leading or trailing dashes and clean up extra spaces
  cleanedSeriesTitle = cleanedSeriesTitle.replace(/^\s*-\s*|\s*-\s*$/g, '').trim();

  // Combine the titles
  return `${series.tournament.title} - ${cleanedSeriesTitle}`;
}

// src/utils/scoreboards.ts

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
