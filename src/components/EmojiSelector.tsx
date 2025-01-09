import {
  shift,
  useFloating,
  Placement,
  offset,
  OffsetOptions,
} from "@floating-ui/react";
import dotsIcon from "@tabler/icons/outline/dots.svg";
import clsx from "clsx";
import { useEffect, useState } from "react";

import { chooseEmoji } from "src/actions/emojis";
import { closeModal, openModal } from "src/actions/modals";
import EmojiComponent from "src/components/Emoji";
import HStack from "src/components/HStack";
import IconButton from "src/components/IconButton";
import EmojiPickerDropdown from "src/features/emoji/components/EmojiPickerDropdown";
import emojiData from "src/features/emoji/data";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useClickOutside } from "src/hooks/useClickOutside";
import { useFrequentlyUsedEmojis } from "src/hooks/useFrequentlyUsedEmojis";
import { useApolloConfig } from "src/hooks/useApolloConfig";
import { userTouching } from "src/is-mobile";

import type { Emoji } from "src/features/emoji/index";

interface IEmojiButton {
  /** Unicode emoji character. */
  emoji: string;
  /** Event handler when the emoji is clicked. */
  onClick(emoji: string): void;
  /** Extra class name on the <button> element. */
  className?: string;
  /** Tab order of the button. */
  tabIndex?: number;
}

/** Clickable emoji button that scales when hovered. */
const EmojiButton: React.FC<IEmojiButton> = ({
  emoji,
  className,
  onClick,
  tabIndex,
}): JSX.Element => {
  const handleClick: React.EventHandler<React.MouseEvent> = (event) => {
    event.preventDefault();
    event.stopPropagation();

    onClick(emoji);
  };

  return (
    <button
      className={clsx(className)}
      onClick={handleClick}
      tabIndex={tabIndex}
    >
      <div className="flex items-center justify-center duration-100 hover:scale-110">
        <EmojiComponent size={24} emoji={emoji} />
      </div>
    </button>
  );
};

interface IEmojiSelector {
  onClose?(): void;
  /** Event handler when an emoji is clicked. */
  onReact(emoji: string, custom?: string): void;
  /** Element that triggers the EmojiSelector Popper */
  referenceElement: HTMLElement | null;
  placement?: Placement;
  /** Whether the selector should be visible. */
  visible?: boolean;
  offsetOptions?: OffsetOptions;
  /** Whether to allow any emoji to be chosen. */
  all?: boolean;
}

/** Panel with a row of emoji buttons. */
const EmojiSelector: React.FC<IEmojiSelector> = ({
  referenceElement,
  onClose,
  onReact,
  placement = "top",
  visible = false,
  offsetOptions,
  all = true,
}): JSX.Element => {
  const { allowedEmoji } = useApolloConfig();
  const frequentlyUsedEmojis = useFrequentlyUsedEmojis();

  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState(false);

  const { x, y, strategy, refs, update } = useFloating<HTMLElement>({
    placement,
    middleware: [offset(offsetOptions), shift()],
  });

  const handleExpand: React.MouseEventHandler = () => {
    if (userTouching.matches) {
      dispatch(
        openModal("EMOJI_PICKER", {
          onPickEmoji: (emoji: Emoji) => {
            handlePickEmoji(emoji);
            dispatch(closeModal("EMOJI_PICKER"));
          },
        })
      );

      onClose?.();
    } else {
      setExpanded(true);
    }
  };

  const handleReact = (emoji: string) => {
    // Reverse lookup...
    // This is hell.
    const data = Object.values(emojiData.emojis).find((e) =>
      e.skins.some((s) => s.native === emoji)
    );
    const skin = data?.skins.find((s) => s.native === emoji);

    if (data && skin) {
      dispatch(
        chooseEmoji({
          id: data.id,
          colons: `:${data.id}:`,
          custom: false,
          native: skin.native,
          unified: skin.unified,
        })
      );
    }

    onReact(emoji);
  };

  const handlePickEmoji = (emoji: Emoji) => {
    onReact(emoji.native, undefined);
  };

  useEffect(() => {
    refs.setReference(referenceElement);
  }, [referenceElement]);

  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    []
  );

  useEffect(() => {
    setExpanded(false);
  }, [visible]);

  useClickOutside(refs, () => {
    onClose?.();
  });

  /** Frequently used emojis converted from shortcodes to native. */
  const frequentNative = frequentlyUsedEmojis.reduce<string[]>(
    (results, shortcode) => {
      const emoji = emojiData.emojis[shortcode]?.skins[0]?.native;
      if (emoji) {
        results.push(emoji);
      }
      return results;
    },
    []
  );

  /** Set of native emojis to display in the selector. */
  const emojis = new Set([...frequentNative, ...allowedEmoji]);

  return (
    <div
      className={clsx("z-[101] transition-opacity duration-100", {
        "opacity-0 pointer-events-none": !visible,
      })}
      ref={refs.setFloating}
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
        width: "max-content",
      }}
    >
      {expanded ? (
        <EmojiPickerDropdown
          visible={expanded}
          setVisible={setExpanded}
          update={update}
          onPickEmoji={handlePickEmoji}
        />
      ) : (
        <HStack
          className={clsx(
            "z-[999] flex w-max max-w-[100vw] flex-wrap space-x-3 rounded-5px bg-white px-3 py-2.5 shadow-lg focus:outline-none dark:bg-gray-900 dark:ring-2 dark:ring-primary-700"
          )}
        >
          {[...emojis].slice(0, 6).map((emoji, i) => (
            <EmojiButton
              key={i}
              emoji={emoji}
              onClick={handleReact}
              tabIndex={visible ? 0 : -1}
            />
          ))}

          {all && (
            <IconButton
              className="text-gray-600 hover:text-gray-600 dark:hover:text-white"
              src={dotsIcon}
              onClick={handleExpand}
            />
          )}
        </HStack>
      )}
    </div>
  );
};

export default EmojiSelector;
