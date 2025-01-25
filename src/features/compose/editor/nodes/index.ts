/**
 * This source code is derived from code from Meta Platforms, Inc.
 * and affiliates, licensed under the MIT license located in the
 * LICENSE file in the /src/features/compose/editor directory.
 */

import { HashtagNode } from "@lexical/hashtag";
import { AutoLinkNode } from "@lexical/link";

import { EmojiNode } from "./EmojiNode";
import { MentionNode } from "./MentionNode";
import { SpaceNode } from "./SpaceNode";

import type { Klass, LexicalNode } from "lexical";

const useNodes = () => {
  const nodes: Array<Klass<LexicalNode>> = [
    AutoLinkNode,
    HashtagNode,
    EmojiNode,
    MentionNode,
    SpaceNode,
  ];

  return nodes;
};

export { useNodes };
