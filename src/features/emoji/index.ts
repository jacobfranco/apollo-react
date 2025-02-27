import split from 'graphemesplit';

import unicodeMapping from 'src/features/emoji/mapping';

import type { Emoji as EmojiMart } from 'src/features/emoji/data';

/*
 * TODO: Consolate emoji object types
 *
 * There are five different emoji objects currently
 *  - emoji-mart's "onPickEmoji" handler
 *  - emoji-mart's custom emoji types
 *  - an Emoji type that is either NativeEmoji or CustomEmoji
 *  - a type inside redux's `store.custom_emoji` immutablejs
 *
 * there needs to be one type for the picker handler callback
 * and one type for the emoji-mart data
 * and one type that is used everywhere that the above two are converted into
 */


export interface NativeEmoji {
  id: string;
  colons: string;
  custom?: false;
  unified: string;
  native: string;
}

export type Emoji = NativeEmoji;

export function isNativeEmoji(emoji: Emoji): emoji is NativeEmoji {
  return (emoji as NativeEmoji).native !== undefined;
}

const isAlphaNumeric = (c: string) => {
  const code = c.charCodeAt(0);

  if (!(code > 47 && code < 58) &&  // numeric (0-9)
      !(code > 64 && code < 91) &&  // upper alpha (A-Z)
      !(code > 96 && code < 123)) { // lower alpha (a-z)
    return false;
  } else {
    return true;
  }
};

const validEmojiChar = (c: string) => {
  return isAlphaNumeric(c)
    || c === '_'
    || c === '-'
    || c === '.';
};;

const convertUnicode = (c: string) => {
  const { unified, shortcode } = unicodeMapping[c];

  return `<img draggable="false" class="emojione" alt="${c}" title=":${shortcode}:" src="/packs/emoji/${unified}.svg" />`;
};

/* TODO: I dont think this is needed
const convertEmoji = (str: string, customEmojis: any) => {
  if (str.length < 3) return str;
  if (str in customEmojis) {
    const emoji = customEmojis[str];
    const filename = emoji.static_url;

    if (filename?.length > 0) {
      return convertCustom(str, filename);
    }
  }

  return str;
};

*/ 
export const emojifyText = (str: string) => {
  let buf = '';
  let stack = '';
  let open = false;

  const clearStack = () => {
    buf += stack;
    open = false;
    stack = '';
  };

  for (let c of split(str)) {
    // convert FE0E selector to FE0F so it can be found in unimap
    if (c.codePointAt(c.length - 1) === 65038) {
      c = c.slice(0, -1) + String.fromCodePoint(65039);
    }

    // unqualified emojis aren't in emoji-mart's mappings so we just add FEOF
    const unqualified = c + String.fromCodePoint(65039);

    if (c in unicodeMapping) {
      if (open) { // unicode emoji inside colon
        clearStack();
      }

      buf += convertUnicode(c);
    } else if (unqualified in unicodeMapping) {
      if (open) { // unicode emoji inside colon
        clearStack();
      }

      buf += convertUnicode(unqualified);
    } else if (c === ':') {
      stack += ':';

      open = !open;
    } else {
      if (open) {
        stack += c;

        // if the stack is non-null and we see invalid chars it's a string not emoji
        // so we push it to the return result and clear it
        if (!validEmojiChar(c)) {
          clearStack();
        }
      } else {
        buf += c;
      }
    }
  }

  // never found a closing colon so it's just a raw string
  if (open) {
    buf += stack;
  }

  return buf;
};

export const parseHTML = (str: string): { text: boolean; data: string }[] => {
  const tokens = [];
  let buf = '';
  let stack = '';
  let open = false;

  for (const c of str) {
    if (c === '<') {
      if (open) {
        tokens.push({ text: true, data: stack });
        stack = '<';
      } else {
        tokens.push({ text: true, data: buf });
        stack = '<';
        open = true;
      }
    } else if (c === '>') {
      if (open) {
        open = false;
        tokens.push({ text: false, data: stack + '>' });
        stack = '';
        buf = '';
      } else {
        buf += '>';
      }

    } else {
      if (open) {
        stack += c;
      } else {
        buf += c;
      }
    }
  }

  if (open) {
    tokens.push({ text: true, data: buf + stack });
  } else if (buf !== '') {
    tokens.push({ text: true, data: buf });
  }

  return tokens;
};

const emojify = (str: string) => {
  return parseHTML(str)
    .map(({ text, data }) => {
      if (!text) return data;
      if (data.length === 0 || data === ' ') return data;

      return emojifyText(data);
    })
    .join('');
};

export default emojify;