import { saveSettings } from './settings';

import type { Emoji } from 'src/features/emoji';
import type { AppDispatch } from 'src/store';

const EMOJI_CHOOSE = 'EMOJI_CHOOSE';

const chooseEmoji = (emoji: Emoji) =>
  (dispatch: AppDispatch) => {
    dispatch({
      type: EMOJI_CHOOSE,
      emoji,
    });

    dispatch(saveSettings());
  };

export {
  EMOJI_CHOOSE,
  chooseEmoji,
};