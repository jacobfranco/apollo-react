import { $applyNodeReplacement, DecoratorNode } from "lexical";
import React from "react";

import { Emoji as Component } from "src/components";
import { isNativeEmoji, type Emoji } from "src/features/emoji";

import type {
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";

type SerializedEmojiNode = Spread<
  {
    data: Emoji;
    type: "emoji";
    version: 1;
  },
  SerializedLexicalNode
>;

class EmojiNode extends DecoratorNode<JSX.Element> {
  __emoji: Emoji;

  static getType(): "emoji" {
    return "emoji";
  }

  static clone(node: EmojiNode): EmojiNode {
    return new EmojiNode(node.__emoji, node.__key);
  }

  constructor(emoji: Emoji, key?: NodeKey) {
    super(key);
    this.__emoji = emoji;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    const theme = config.theme;
    const className = theme.emoji;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  static importJSON({ data }: SerializedEmojiNode): EmojiNode {
    return $createEmojiNode(data);
  }

  exportJSON(): SerializedEmojiNode {
    return {
      data: this.__emoji,
      type: "emoji",
      version: 1,
    };
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  isTextEntity(): boolean {
    return true;
  }

  getTextContent(): string {
    const emoji = this.__emoji;
    return emoji.native;
  }

  decorate(): JSX.Element {
    const emoji = this.__emoji;
    return <Component emoji={emoji.native} />;
  }
}

function $createEmojiNode(emoji: Emoji): EmojiNode {
  const node = new EmojiNode(emoji);
  return $applyNodeReplacement(node);
}

const $isEmojiNode = (
  node: LexicalNode | null | undefined
): node is EmojiNode => node instanceof EmojiNode;

export { EmojiNode, $createEmojiNode, $isEmojiNode };
