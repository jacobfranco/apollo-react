import { useMemo } from "react";

import { useSettings } from "src/hooks/useSettings";

/** Return a sorted list of most used emoji **shortcodes** from settings. */
export function useFrequentlyUsedEmojis(): string[] {
  const { frequentlyUsedEmojis } = useSettings();

  return useMemo(() => {
    return Object.entries(frequentlyUsedEmojis)
      .sort((a, b) => b[1] - a[1])
      .map(([emoji]) => emoji);
  }, [frequentlyUsedEmojis]);
}
