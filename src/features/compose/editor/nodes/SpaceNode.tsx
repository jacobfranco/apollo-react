/**
 * This source code is derived from code from Meta Platforms, Inc.
 * and affiliates, licensed under the MIT license located in the
 * LICENSE file in the /src/features/compose/editor directory.
 */
import { $applyNodeReplacement, DecoratorNode } from "lexical";
import React from "react";
import type {
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";

// The serialized structure for our space node
type SerializedSpaceNode = Spread<
  {
    spaceId: string;
    type: "space";
    version: 1;
  },
  SerializedLexicalNode
>;

class SpaceNode extends DecoratorNode<JSX.Element> {
  __spaceId: string;

  static getType(): string {
    return "space";
  }

  static clone(node: SpaceNode): SpaceNode {
    return new SpaceNode(node.__spaceId, node.__key);
  }

  constructor(spaceId: string, key?: NodeKey) {
    super(key);
    this.__spaceId = spaceId;
  }

  // On creation, we have a <span> in the DOM
  createDOM(config: EditorConfig): HTMLElement {
    // If you want to apply a theme-based class, do so here:
    const dom = document.createElement("span");
    // e.g. add a class to style via your theme:
    // dom.className = config.theme.space ?? "";
    return dom;
  }

  updateDOM(): false {
    // Nothing dynamic to update
    return false;
  }

  static importJSON(serializedNode: SerializedSpaceNode): SpaceNode {
    const node = $createSpaceNode(serializedNode.spaceId);
    return node;
  }

  exportJSON(): SerializedSpaceNode {
    return {
      type: "space",
      spaceId: this.__spaceId,
      version: 1,
    };
  }

  getTextContent(): string {
    // For text extraction, show "s/spaceId"
    return `s/${this.__spaceId}`;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  isTextEntity(): true {
    return true;
  }

  /**
   * The final inline element rendered in the editor,
   * e.g. "s/lol" in a primary color, just like mentions.
   */
  decorate(): JSX.Element {
    return (
      <span className="hover:underline text-primary-600 dark:text-accent-blue hover:text-primary-800 dark:hover:text-accent-blue">
        s/{this.__spaceId}
      </span>
    );
  }
}

export function $createSpaceNode(spaceId: string): SpaceNode {
  const node = new SpaceNode(spaceId);
  return $applyNodeReplacement(node);
}

export function $isSpaceNode(
  node: LexicalNode | null | undefined
): node is SpaceNode {
  return node instanceof SpaceNode;
}

export { SpaceNode };
