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