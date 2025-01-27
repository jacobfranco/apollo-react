/**
 * This source code is derived from code from Meta Platforms, Inc.
 * and affiliates, licensed under the MIT license located in the
 * LICENSE file in the /src/features/compose/editor directory.
 */

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import clsx from "clsx";
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  KEY_TAB_COMMAND,
  LexicalEditor,
  LexicalNode,
  RangeSelection,
  TextNode,
} from "lexical";
import {
  MutableRefObject,
  ReactPortal,
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";

import {
  clearComposeSuggestions,
  fetchComposeSuggestions,
} from "src/actions/compose";
import { chooseEmoji } from "src/actions/emojis";
import AutosuggestEmoji from "src/components/AutosuggestEmoji";
import { isNativeEmoji } from "src/features/emoji/index";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useCompose } from "src/hooks/useCompose";
import { selectAccount } from "src/selectors/index";
import { textAtCursorMatchesToken } from "src/utils/suggestions";

import AutosuggestAccount from "../../components/AutosuggestAccount";
import { $createEmojiNode } from "../nodes/EmojiNode";
import { $createMentionNode } from "../nodes/MentionNode";

import type { AutoSuggestion } from "src/components/AutosuggestInput";
import AutosuggestSpace from "src/components/AutosuggestSpace";
import { $createSpaceNode } from "../nodes/SpaceNode";

type QueryMatch = {
  leadOffset: number;
  matchingString: string;
};

type Resolution = {
  match: QueryMatch;
  getRect: () => DOMRect;
};

type MenuRenderFn = (
  anchorElementRef: MutableRefObject<HTMLElement | null>
) => ReactPortal | JSX.Element | null;

const tryToPositionRange = (leadOffset: number, range: Range): boolean => {
  const domSelection = window.getSelection();
  if (domSelection === null || !domSelection.isCollapsed) {
    return false;
  }
  const anchorNode = domSelection.anchorNode;
  const startOffset = leadOffset;
  const endOffset = domSelection.anchorOffset;

  if (!anchorNode || !endOffset) {
    return false;
  }

  try {
    range.setStart(anchorNode, startOffset);
    range.setEnd(anchorNode, endOffset);
  } catch (error) {
    return false;
  }

  return true;
};

const isSelectionOnEntityBoundary = (
  editor: LexicalEditor,
  offset: number
): boolean => {
  if (offset !== 0) {
    return false;
  }
  return editor.getEditorState().read(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchor = selection.anchor;
      const anchorNode = anchor.getNode();
      const prevSibling = anchorNode.getPreviousSibling();
      return $isTextNode(prevSibling) && prevSibling.isTextEntity();
    }
    return false;
  });
};

// Got from https://stackoverflow.com/a/42543908/2013580
const getScrollParent = (
  element: HTMLElement,
  includeHidden: boolean
): HTMLElement | HTMLBodyElement => {
  let style = getComputedStyle(element);
  const excludeStaticParent = style.position === "absolute";
  const overflowRegex = includeHidden
    ? /(auto|scroll|hidden)/
    : /(auto|scroll)/;
  if (style.position === "fixed") {
    return document.body;
  }
  for (
    let parent: HTMLElement | null = element;
    (parent = parent.parentElement);

  ) {
    style = getComputedStyle(parent);
    if (excludeStaticParent && style.position === "static") {
      continue;
    }
    if (
      overflowRegex.test(style.overflow + style.overflowY + style.overflowX)
    ) {
      return parent;
    }
  }
  return document.body;
};

const isTriggerVisibleInNearestScrollContainer = (
  targetElement: HTMLElement,
  containerElement: HTMLElement
): boolean => {
  const tRect = targetElement.getBoundingClientRect();
  const cRect = containerElement.getBoundingClientRect();
  return tRect.top > cRect.top && tRect.top < cRect.bottom;
};

// Reposition the menu on scroll, window resize, and element resize.
const useDynamicPositioning = (
  resolution: Resolution | null,
  targetElement: HTMLElement | null,
  onReposition: () => void,
  onVisibilityChange?: (isInView: boolean) => void
) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (targetElement && resolution) {
      const rootElement = editor.getRootElement();
      const rootScrollParent = rootElement
        ? getScrollParent(rootElement, false)
        : document.body;
      let ticking = false;
      let previousIsInView = isTriggerVisibleInNearestScrollContainer(
        targetElement,
        rootScrollParent
      );
      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            onReposition();
            ticking = false;
          });
          ticking = true;
        }
        const isInView = isTriggerVisibleInNearestScrollContainer(
          targetElement,
          rootScrollParent
        );
        if (isInView !== previousIsInView) {
          previousIsInView = isInView;
          if (onVisibilityChange) {
            onVisibilityChange(isInView);
          }
        }
      };
      const resizeObserver = new ResizeObserver(onReposition);
      window.addEventListener("resize", onReposition);
      document.addEventListener("scroll", handleScroll, {
        capture: true,
        passive: true,
      });
      resizeObserver.observe(targetElement);
      return () => {
        resizeObserver.unobserve(targetElement);
        window.removeEventListener("resize", onReposition);
        document.removeEventListener("scroll", handleScroll);
      };
    }
  }, [targetElement, editor, onVisibilityChange, onReposition, resolution]);
};

const LexicalPopoverMenu = ({
  anchorElementRef,
  menuRenderFn,
}: {
  anchorElementRef: MutableRefObject<HTMLElement>;
  menuRenderFn: MenuRenderFn;
}): JSX.Element | null => menuRenderFn(anchorElementRef);

const useMenuAnchorRef = (
  resolution: Resolution | null,
  setResolution: (r: Resolution | null) => void
): MutableRefObject<HTMLElement> => {
  const [editor] = useLexicalComposerContext();
  const anchorElementRef = useRef<HTMLElement>(document.createElement("div"));
  const positionMenu = useCallback(() => {
    const rootElement = editor.getRootElement();
    const containerDiv = anchorElementRef.current;

    if (rootElement !== null && resolution !== null) {
      const { left, top, width, height } = resolution.getRect();
      containerDiv.style.top = `${top + window.scrollY}px`;
      containerDiv.style.left = `${left + window.scrollX}px`;
      containerDiv.style.height = `${height}px`;
      containerDiv.style.width = `${width}px`;

      if (!containerDiv.isConnected) {
        containerDiv.setAttribute("aria-label", "Typeahead menu");
        containerDiv.setAttribute("id", "typeahead-menu");
        containerDiv.setAttribute("role", "listbox");
        containerDiv.style.display = "block";
        containerDiv.style.position = "absolute";
        document.body.append(containerDiv);
      }
      anchorElementRef.current = containerDiv;
      rootElement.setAttribute("aria-controls", "typeahead-menu");
    }
  }, [editor, resolution]);

  useEffect(() => {
    const rootElement = editor.getRootElement();
    if (resolution !== null) {
      positionMenu();
      return () => {
        if (rootElement !== null) {
          rootElement.removeAttribute("aria-controls");
        }

        const containerDiv = anchorElementRef.current;
        if (containerDiv !== null && containerDiv.isConnected) {
          containerDiv.remove();
        }
      };
    }
  }, [editor, positionMenu, resolution]);

  const onVisibilityChange = useCallback(
    (isInView: boolean) => {
      if (resolution !== null) {
        if (!isInView) {
          setResolution(null);
        }
      }
    },
    [resolution, setResolution]
  );

  useDynamicPositioning(
    resolution,
    anchorElementRef.current,
    positionMenu,
    onVisibilityChange
  );

  return anchorElementRef;
};

type AutosuggestPluginProps = {
  composeId: string;
  suggestionsHidden: boolean;
  setSuggestionsHidden: (value: boolean) => void;
};

const AutosuggestPlugin = ({
  composeId,
  suggestionsHidden,
  setSuggestionsHidden,
}: AutosuggestPluginProps): JSX.Element | null => {
  const { suggestions } = useCompose(composeId);
  const dispatch = useAppDispatch();

  const [editor] = useLexicalComposerContext();
  const [resolution, setResolution] = useState<Resolution | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const anchorElementRef = useMenuAnchorRef(resolution, setResolution);

  const handleSelectSuggestion: React.MouseEventHandler<HTMLDivElement> = (
    e
  ) => {
    e.preventDefault();
    const index = Number(e.currentTarget.getAttribute("data-index"));
    return onSelectSuggestion(index);
  };

  const onSelectSuggestion = (index: number) => {
    // Grab the chosen suggestion
    const suggestion = suggestions.get(index) as AutoSuggestion | undefined;
    if (!suggestion) return;

    editor.update(() => {
      dispatch((dispatch, getState) => {
        const state = editor.getEditorState();
        // This is the current text selection
        const rangeSelection = state._selection as RangeSelection | null;
        if (!rangeSelection) return;

        // The node at the anchor (cursor) position
        const node = rangeSelection.anchor.getNode();
        // Ensure it's a TextNode, otherwise splitText won't exist
        if (!node || !$isTextNode(node)) return;

        // Info about how many chars to replace, etc.
        const { leadOffset, matchingString } = resolution!.match;
        // The typed token is preceded by an offset of -1 for the trigger (e.g. "@", "s/", etc.)
        const offset = leadOffset - 1;

        // Helper to replace the typed substring with a new LexicalNode or text
        function replaceMatch(replaceWith: LexicalNode) {
          // 1. Split out the substring (e.g. "s/lol") from the text node
          const result = (node as TextNode).splitText(
            offset,
            offset + matchingString.length
          );
          // 2. We get back up to two text nodes: [0] is pre-split, [1] is the matched portion
          const textNode = result[1] ?? result[0];
          // 3. Replace the matched portion with our new node
          const replacedNode = textNode.replace(replaceWith);
          // 4. Insert a space after the new node and move the cursor
          replacedNode.insertAfter(new TextNode(" "));
          replacedNode.selectNext();
        }

        // Distinguish between emoji objects, space suggestions, hashtags, or mention
        if (typeof suggestion === "object") {
          // It's an emoji
          if (!suggestion.id) return;
          dispatch(chooseEmoji(suggestion));

          if (isNativeEmoji(suggestion)) {
            // Insert raw text for native emoji
            replaceMatch(new TextNode(suggestion.native));
          } else {
            // Insert a specialized emoji node
            replaceMatch($createEmojiNode(suggestion));
          }
        } else if (suggestion.startsWith("s/")) {
          // It's a space: "s/lol", "s/smite", etc.
          const spaceId = suggestion.slice(2);
          replaceMatch($createSpaceNode(spaceId));
        } else if (suggestion[0] === "#") {
          // It's a hashtag => just replace with plain text
          node.setTextContent(`${suggestion} `);
          node.select();
        } else {
          // It's a mention => an account ID
          const account = selectAccount(getState(), suggestion);
          if (!account) return;
          replaceMatch($createMentionNode(account));
        }

        // Finally, hide the suggestions
        dispatch(clearComposeSuggestions(composeId));
      });
    });
  };

  const getQueryTextForSearch = (editor: LexicalEditor) => {
    const state = editor.getEditorState();
    const node = (state._selection as RangeSelection)?.anchor?.getNode();

    if (!node) return null;

    if (node.getType() === "text") {
      const [leadOffset, matchingString] = textAtCursorMatchesToken(
        node.getTextContent(),
        (state._selection as RangeSelection)?.anchor?.offset,
        [":", "@", "s/"]
      );

      if (!leadOffset || !matchingString) return null;
      return { leadOffset, matchingString };
    }

    return null;
  };

  const renderSuggestion = (suggestion: AutoSuggestion, i: number) => {
    let inner: string | JSX.Element;
    let key: React.Key;

    if (typeof suggestion === "object") {
      inner = <AutosuggestEmoji emoji={suggestion} />;
      key = suggestion.id;
    } else if (suggestion.startsWith("s/")) {
      // Enhanced space suggestion rendering
      const spaceId = suggestion.slice(2);
      inner = (
        <div className="flex items-center w-full">
          <AutosuggestSpace id={spaceId} />
        </div>
      );
      key = suggestion;
    } else if (suggestion[0] === "#") {
      inner = suggestion;
      key = suggestion;
    } else {
      inner = <AutosuggestAccount id={suggestion} />;
      key = suggestion;
    }

    return (
      <div
        role="button"
        tabIndex={0}
        key={key}
        data-index={i}
        className={clsx({
          "flex px-4 py-2.5 text-sm text-gray-700 dark:text-gray-500 hover:bg-primary-200 dark:hover:bg-secondary-800 cursor-pointer":
            true,
          "bg-primary-200 dark:bg-secondary-800": i === selectedSuggestion,
        })}
        onMouseDown={handleSelectSuggestion}
      >
        {inner}
      </div>
    );
  };

  const closeTypeahead = useCallback(() => {
    setResolution(null);
  }, [resolution]);

  const openTypeahead = useCallback(
    (res: Resolution) => {
      setResolution(res);
    },
    [resolution]
  );

  useEffect(() => {
    const updateListener = () => {
      editor.getEditorState().read(() => {
        const range = document.createRange();
        const match = getQueryTextForSearch(editor);
        const nativeSelection = window.getSelection();

        if (
          !match ||
          nativeSelection?.anchorOffset !== nativeSelection?.focusOffset
        ) {
          closeTypeahead();
          return;
        }

        dispatch(
          fetchComposeSuggestions(composeId, match.matchingString.trim())
        );

        if (!isSelectionOnEntityBoundary(editor, match.leadOffset)) {
          const isRangePositioned = tryToPositionRange(match.leadOffset, range);
          if (isRangePositioned !== null) {
            startTransition(() =>
              openTypeahead({
                getRect: () => range.getBoundingClientRect(),
                match,
              })
            );
            return;
          }
        }
        closeTypeahead();
      });
    };

    const removeUpdateListener = editor.registerUpdateListener(updateListener);

    return () => {
      removeUpdateListener();
    };
  }, [editor, resolution, closeTypeahead, openTypeahead]);

  useEffect(() => {
    if (suggestions && suggestions.size > 0) setSuggestionsHidden(false);
  }, [suggestions]);

  useEffect(() => {
    if (resolution !== null && !suggestionsHidden && !suggestions.isEmpty()) {
      const handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        if (
          !editor._rootElement?.contains(target) &&
          !anchorElementRef.current.contains(target)
        ) {
          setResolution(null);
        }
      };
      document.addEventListener("click", handleClick);

      return () => document.removeEventListener("click", handleClick);
    }
  }, [resolution, suggestionsHidden, suggestions.isEmpty()]);

  useEffect(() => {
    if (resolution === null) return;

    return mergeRegister(
      editor.registerCommand<KeyboardEvent>(
        KEY_ARROW_UP_COMMAND,
        (payload) => {
          const event = payload;
          if (
            suggestions !== null &&
            suggestions.size &&
            selectedSuggestion !== null
          ) {
            const newSelectedSuggestion =
              selectedSuggestion !== 0
                ? selectedSuggestion - 1
                : suggestions.size - 1;
            setSelectedSuggestion(newSelectedSuggestion);
            event.preventDefault();
            event.stopImmediatePropagation();
          }
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<KeyboardEvent>(
        KEY_ARROW_DOWN_COMMAND,
        (payload) => {
          const event = payload;
          if (
            suggestions !== null &&
            suggestions.size &&
            selectedSuggestion !== null
          ) {
            const newSelectedSuggestion =
              selectedSuggestion !== suggestions.size - 1
                ? selectedSuggestion + 1
                : 0;
            setSelectedSuggestion(newSelectedSuggestion);
            event.preventDefault();
            event.stopImmediatePropagation();
          }
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<KeyboardEvent>(
        KEY_TAB_COMMAND,
        (payload) => {
          const event = payload;
          event.preventDefault();
          event.stopImmediatePropagation();
          onSelectSuggestion(selectedSuggestion);
          setResolution(null);
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<KeyboardEvent>(
        KEY_ENTER_COMMAND,
        (payload) => {
          const event = payload;
          event.preventDefault();
          event.stopImmediatePropagation();
          onSelectSuggestion(selectedSuggestion);
          setResolution(null);
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<KeyboardEvent>(
        KEY_ESCAPE_COMMAND,
        (payload) => {
          const event = payload;
          event.preventDefault();
          event.stopImmediatePropagation();
          setResolution(null);
          return true;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, suggestions, selectedSuggestion, resolution]);

  return resolution === null || editor === null ? null : (
    <LexicalPopoverMenu
      anchorElementRef={anchorElementRef}
      menuRenderFn={(anchorElementRef) =>
        anchorElementRef.current
          ? ReactDOM.createPortal(
              <div
                className={clsx({
                  "fixed z-[1001] w-68 rounded-md bg-primary-100 py-1 shadow-lg transition-opacity duration-100 focus:outline-none black:bg-black dark:bg-secondary-900 dark:ring-2 dark:ring-primary-700":
                    true,
                  hidden: suggestionsHidden || suggestions.isEmpty(),
                  block: !suggestionsHidden && !suggestions.isEmpty(),
                })}
              >
                {suggestions.map(renderSuggestion)}
              </div>,
              anchorElementRef.current
            )
          : null
      }
    />
  );
};

export default AutosuggestPlugin;
