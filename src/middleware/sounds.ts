
import { play, soundCache } from 'src/utils/sounds';

import type { AnyAction, Middleware } from 'redux';
import type { Sounds } from 'src/utils/sounds';

interface Action extends AnyAction {
  meta: {
    sound: Sounds;
  };
}

/** Middleware to play sounds in response to certain Redux actions. */
export default function soundsMiddleware(): Middleware {
  return () => next => anyAction => {
    const action = anyAction as Action;
    if (action.meta?.sound && soundCache[action.meta.sound]) {
      play(soundCache[action.meta.sound]);
    }

    return next(action);
  };
}