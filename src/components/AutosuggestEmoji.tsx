import React from "react";

import unicodeMapping from "src/features/emoji/mapping";

import type { Emoji } from "src/features/emoji";

interface IAutosuggestEmoji {
  emoji: Emoji;
}

const AutosuggestEmoji: React.FC<IAutosuggestEmoji> = ({ emoji }) => {
  let url, alt;

  const mapping =
    unicodeMapping[emoji.native] ||
    unicodeMapping[emoji.native.replace(/\uFE0F$/, "")];

  if (!mapping) {
    return null;
  }

  url = `packs/emoji/${mapping.unified}.svg`;
  alt = emoji.native;

  return (
    <div className="autosuggest-emoji" data-testid="emoji">
      <img className="emojione" src={url} alt={alt} />

      {emoji.colons}
    </div>
  );
};

export default AutosuggestEmoji;
