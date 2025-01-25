type CursorMatch = [tokenStart: number | null, token: string | null];

const textAtCursorMatchesToken = (
  str: string,
  caretPosition: number,
  searchTokens: string[]
): [number | null, string | null] => {
  let word;

  const left = str.slice(0, caretPosition).search(/\S+$/);
  const right = str.slice(caretPosition).search(/\s/);

  if (right < 0) {
    word = str.slice(left);
  } else {
    word = str.slice(left, right + caretPosition);
  }

  if (!word) return [null, null];
  word = word.trim().toLowerCase();

  // Add console.log to debug
  console.log("Word:", word, "SearchTokens:", searchTokens);

  // Make sure s/ is in searchTokens
  if (word.startsWith("s/")) {
    return [left + 1, word];
  }

  if (!searchTokens.includes(word[0])) {
    return [null, null];
  }

  return [left + 1, word];
};

export { textAtCursorMatchesToken };
