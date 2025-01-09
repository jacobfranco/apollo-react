// @ts-ignore
import Index from "@akryum/flexsearch-es";

import { EmojiData, Emoji as EmojiMart } from "src/features/emoji/data";

import { type Emoji } from "./index.ts";

// @ts-ignore Wrong default export.
const index: Index.Index = new Index({
  tokenize: "full",
  optimize: true,
  context: true,
});

let data: EmojiData = {
  aliases: {},
  categories: [],
  emojis: {},
  sheet: { cols: 0, rows: 0 },
};

import("src/features/emoji/data")
  .then((mod) => {
    data = mod.default;

    const sortedEmojis = Object.entries(data.emojis).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
    for (const [key, emoji] of sortedEmojis) {
      index.add(
        "n" + key,
        `${emoji.id} ${emoji.name} ${emoji.keywords.join(" ")}`
      );
    }
  })
  .catch(console.warn);

export interface searchOptions {
  maxResults?: number;
  custom?: any;
}

// we can share an index by prefixing custom emojis with 'c' and native with 'n'
const search = (
  str: string,
  { maxResults = 5 }: searchOptions = {}
): Emoji[] => {
  return index
    .search(str, maxResults)
    .flatMap((id: any) => {
      if (typeof id !== "string") return;

      const skins = data.emojis[id.slice(1)]?.skins;

      if (skins) {
        return {
          id: id.slice(1),
          colons: ":" + id.slice(1) + ":",
          unified: skins[0].unified,
          native: skins[0].native,
        };
      }
    })
    .filter(Boolean) as Emoji[];
};

export default search;
