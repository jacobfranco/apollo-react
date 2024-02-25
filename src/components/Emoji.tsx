import React from 'react';

import { removeVS16s, toCodePoints } from 'src/utils/emoji';
import { joinPublicPath } from 'src/utils/static';

interface IEmoji extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Unicode emoji character. */
  emoji?: string;
}

/** A single emoji image. */
const Emoji: React.FC<IEmoji> = (props): JSX.Element | null => {
  const { emoji, alt, src, ...rest } = props;

  let filename;

  if (emoji) {
    const codepoints = toCodePoints(removeVS16s(emoji));
    filename = codepoints.join('-');
  }

  if (!filename && !src) return null;

  return (
    <img
      draggable='false'
      alt={alt || emoji}
      src={src || joinPublicPath(`packs/emoji/${filename}.svg`)}
      {...rest}
    />
  );
};

export default Emoji;