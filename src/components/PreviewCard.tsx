import externalLinkIcon from "@tabler/icons/outline/external-link.svg";
import linkIcon from "@tabler/icons/outline/link.svg";
import playerPlayIcon from "@tabler/icons/outline/player-play.svg";
import zoomInIcon from "@tabler/icons/outline/zoom-in.svg";
import clsx from "clsx";
import { useState, useEffect, useRef } from "react";

import Blurhash from "src/components/Blurhash";
import HStack from "src/components/HStack";
import Stack from "src/components/Stack";
import SvgIcon from "src/components/SvgIcon";
import Text from "src/components/Text";
import { normalizeAttachment } from "src/normalizers";
import { Attachment } from "src/schemas/index";
import { addAutoPlay } from "src/utils/media";
import { getTextDirection } from "src/utils/rtl";

import type { Card as CardEntity } from "src/types/entities";

/** Props for `PreviewCard`. */
interface IPreviewCard {
  card: CardEntity;
  maxTitle?: number;
  maxDescription?: number;
  onOpenMedia: (attachments: readonly Attachment[], index: number) => void;
  compact?: boolean;
  defaultWidth?: number;
  cacheWidth?: (width: number) => void;
  horizontal?: boolean;
}

/** Displays a Mastodon link preview. Similar to OEmbed. */
const PreviewCard: React.FC<IPreviewCard> = ({
  card,
  defaultWidth = 467,
  maxTitle = 120,
  maxDescription = 200,
  compact = false,
  cacheWidth,
  onOpenMedia,
  horizontal,
}): JSX.Element => {
  const ref = useRef<HTMLElement>(null);

  const [width, setWidth] = useState(defaultWidth);
  const [embedded, setEmbedded] = useState(false);

  useEffect(() => {
    setEmbedded(false);
  }, [card.url]);

  const direction = getTextDirection(card.title + card.description);

  const trimmedTitle = trim(card.title, maxTitle);
  const trimmedDescription = trim(card.description, maxDescription);

  useEffect(() => {
    if (ref.current) {
      const { offsetWidth } = ref.current;
      cacheWidth?.(offsetWidth);
      setWidth(offsetWidth);
    }
  }, [ref.current]);

  const handlePhotoClick = () => {
    const attachment = normalizeAttachment({
      type: "image",
      url: card.embed_url,
      description: trimmedTitle,
      meta: {
        original: {
          width: card.width,
          height: card.height,
        },
      },
    }).toJS();

    onOpenMedia(
      [
        {
          ...attachment,
          blurhash:
            attachment.blurhash === undefined ? null : attachment.blurhash,
        } as Attachment,
      ],
      0
    );
  };

  const handleEmbedClick: React.MouseEventHandler = (e) => {
    e.stopPropagation();

    if (card.type === "photo") {
      handlePhotoClick();
    } else {
      setEmbedded(true);
    }
  };

  const renderVideo = () => {
    const content = { __html: addAutoPlay(card.html) };
    const ratio = getRatio(card);
    const height = width / ratio;

    return (
      <div
        className="relative w-full flex-none overflow-hidden"
        dangerouslySetInnerHTML={content}
        style={{ height }}
      />
    );
  };

  const getRatio = (card: CardEntity): number => {
    const ratio = card.width / card.height || 16 / 9;

    // Constrain to a sane limit
    // https://en.wikipedia.org/wiki/Aspect_ratio_(image)
    return Math.min(Math.max(9 / 16, ratio), 4);
  };

  const interactive = card.type !== "link";
  horizontal =
    typeof horizontal === "boolean" ? horizontal : interactive || embedded;
  const className = clsx(
    "flex overflow-hidden rounded-lg border border-solid border-gray-200 text-sm text-gray-800 no-underline dark:border-gray-800 dark:text-gray-200",
    {
      "!block": horizontal,
      "border-gray-200 dark:border-gray-800": compact,
      interactive,
      "flex flex-col md:flex-row": card.type === "link",
    }
  );
  const ratio = getRatio(card);
  const height = compact && !embedded ? width / (16 / 9) : width / ratio;

  const title = interactive ? (
    <a
      onClick={(e) => e.stopPropagation()}
      href={card.url}
      title={trimmedTitle}
      rel="noopener"
      target="_blank"
      dir={direction}
    >
      <span dir={direction}>{trimmedTitle}</span>
    </a>
  ) : (
    <span title={trimmedTitle} dir={direction}>
      {trimmedTitle}
    </span>
  );

  const description = (
    <Stack space={2} className="flex-1 overflow-hidden p-4">
      {trimmedTitle && (
        <Text weight="bold" direction={direction}>
          {title}
        </Text>
      )}
      {trimmedDescription && (
        <Text direction={direction}>{trimmedDescription}</Text>
      )}
      <HStack space={1} alignItems="center">
        <Text tag="span" theme="muted">
          <SvgIcon src={linkIcon} />
        </Text>
        <Text tag="span" theme="muted" size="sm" direction={direction}>
          {card.provider_name}
        </Text>
      </HStack>
    </Stack>
  );

  let embed: React.ReactNode = null;

  const canvas = (
    <Blurhash
      className="absolute inset-0 -z-10 size-full"
      hash={card.blurhash}
    />
  );

  const thumbnail = (
    <div
      style={{
        backgroundImage: `url(${card.image})`,
        width: horizontal ? width : undefined,
        height: horizontal ? height : undefined,
      }}
      className="block size-full bg-cover bg-center object-cover"
    />
  );

  if (interactive) {
    if (embedded) {
      embed = renderVideo();
    } else {
      let iconVariant = playerPlayIcon;

      if (card.type === "photo") {
        iconVariant = zoomInIcon;
      }

      embed = (
        <div
          className="relative w-full flex-none overflow-hidden"
          style={{ flex: "0 0 40%" }}
        >
          {canvas}
          {thumbnail}

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center justify-center rounded-full bg-gray-500/90 px-4 py-3 shadow-md dark:bg-gray-700/90">
              <HStack space={3} alignItems="center">
                <button
                  onClick={handleEmbedClick}
                  className="appearance-none text-gray-700 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-100"
                >
                  <SvgIcon
                    src={iconVariant}
                    className=" size-6  text-inherit"
                  />
                </button>

                {horizontal && (
                  <a
                    onClick={(e) => e.stopPropagation()}
                    href={card.url}
                    target="_blank"
                    rel="noopener"
                    className="text-gray-700 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-100"
                  >
                    <SvgIcon
                      src={externalLinkIcon}
                      className="size-6 text-inherit"
                    />
                  </a>
                )}
              </HStack>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={className} ref={ref as React.RefObject<HTMLDivElement>}>
        {embed}
        {description}
      </div>
    );
  } else if (card.image) {
    embed = (
      <div
        className={clsx(
          "relative overflow-hidden",
          "w-full flex-none rounded-l md:size-auto md:flex-auto",
          {
            "h-auto": horizontal,
            "h-[200px]": !horizontal,
          }
        )}
      >
        {canvas}
        {thumbnail}
      </div>
    );
  }

  return (
    <a
      href={card.url}
      className={clsx(
        className,
        "cursor-pointer hover:bg-gray-100 hover:no-underline dark:hover:bg-primary-800/30"
      )}
      target="_blank"
      rel="noopener"
      ref={ref as React.RefObject<HTMLAnchorElement>}
      onClick={(e) => e.stopPropagation()}
    >
      {embed}
      {description}
    </a>
  );
};

/** Trim the text, adding ellipses if it's too long. */
function trim(text: string, len: number): string {
  const cut = text.indexOf(" ", len);

  if (cut === -1) {
    return text;
  }

  return text.substring(0, cut) + (text.length > len ? "…" : "");
}

export default PreviewCard;
