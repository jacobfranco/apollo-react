import chevronRightIcon from "@tabler/icons/outline/chevron-right.svg";
import clsx from "clsx";
import { useState, useRef, useLayoutEffect, useMemo, memo } from "react";
import { FormattedMessage } from "react-intl";

import Icon from "src/components/Icon";
import { Status as StatusEntity } from "src/schemas/index";
import { getTextDirection } from "src/utils/rtl";

import Markup from "./Markup";
import Poll from "./Poll";

import type { Sizes } from "src/components/Text";

const MAX_HEIGHT = 642; // 20px * 32 (+ 2px padding at the top)

interface IReadMoreButton {
  onClick: React.MouseEventHandler;
}

/** Button to expand a truncated status (due to too much content) */
const ReadMoreButton: React.FC<IReadMoreButton> = ({ onClick }) => (
  <button
    className="flex items-center border-0 bg-transparent p-0 pt-2 text-gray-900 hover:underline active:underline dark:text-gray-300"
    onClick={onClick}
  >
    <FormattedMessage id="status.read_more" defaultMessage="Read more" />
    <Icon className="inline-block size-5" src={chevronRightIcon} />
  </button>
);

interface IPureStatusContent {
  status: StatusEntity;
  onClick?: () => void;
  collapsable?: boolean;
  translatable?: boolean;
  textSize?: Sizes;
}

/** Renders the text content of a status */
const PureStatusContent: React.FC<IPureStatusContent> = ({
  status,
  onClick,
  collapsable = false,
  translatable,
  textSize = "md",
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const node = useRef<HTMLDivElement>(null);

  const maybeSetCollapsed = (): void => {
    if (!node.current) return;

    if (collapsable && onClick && !collapsed) {
      if (node.current.clientHeight > MAX_HEIGHT) {
        setCollapsed(true);
      }
    }
  };

  useLayoutEffect(() => {
    maybeSetCollapsed();
  });

  const parsedHtml = useMemo((): string => {
    return translatable && status.translation
      ? status.translation.content
      : status.content;
  }, [status.content, status.translation]);

  if (status.content.length === 0) {
    return null;
  }

  const withSpoiler = status.spoiler_text.length > 0;

  const baseClassName =
    "text-gray-900 dark:text-gray-100 break-words text-ellipsis overflow-hidden relative focus:outline-none";

  const direction = getTextDirection(status.search_index);
  const className = clsx(baseClassName, {
    "cursor-pointer": onClick,
    "whitespace-normal": withSpoiler,
    "max-h-[300px]": collapsed,
  });

  if (onClick) {
    const output = [
      <Markup
        ref={node}
        tabIndex={0}
        key="content"
        className={className}
        direction={direction}
        lang={status.language || undefined}
        size={textSize}
        mentions={status.mentions}
        html={{ __html: parsedHtml }}
      />,
    ];

    if (collapsed) {
      output.push(<ReadMoreButton onClick={onClick} key="read-more" />);
    }

    const hasPoll = !!status.poll && typeof status.poll.id === "string";
    if (hasPoll) {
      output.push(<Poll id={status.poll!.id} key="poll" status={status.url} />);
    }

    return (
      <div
        className={clsx({
          "bg-gray-100 dark:bg-primary-800 rounded-md p-4": hasPoll,
        })}
      >
        {output}
      </div>
    );
  } else {
    const output = [
      <Markup
        ref={node}
        tabIndex={0}
        key="content"
        className={clsx(baseClassName)}
        direction={direction}
        lang={status.language || undefined}
        size={textSize}
        mentions={status.mentions}
        html={{ __html: parsedHtml }}
      />,
    ];

    if (status.poll && typeof status.poll === "string") {
      output.push(<Poll id={status.poll} key="poll" status={status.url} />);
    }

    return <>{output}</>;
  }
};

export default memo(PureStatusContent);
