import arrowLeftIcon from "@tabler/icons/outline/arrow-left.svg";
import clsx from "clsx";
import { forwardRef } from "react";
import { defineMessages, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import SvgIcon from "src/components/SvgIcon";

import HStack from "src/components/HStack";
import Text from "src/components/Text";

const sizes = {
  md: "p-4 sm:rounded-xl",
  lg: "p-4 sm:p-6 sm:rounded-xl",
  xl: "p-4 sm:p-10 sm:rounded-3xl",
};

const messages = defineMessages({
  back: { id: "card.back.label", defaultMessage: "Back" },
});

export type CardSizes = keyof typeof sizes;

interface ICard {
  /** The type of card. */
  variant?: "default" | "rounded" | "slim";
  /** Card size preset. */
  size?: CardSizes;
  /** Extra classnames for the <div> element. */
  className?: string;
  /** Elements inside the card. */
  children: React.ReactNode;
  tabIndex?: number;
}

/** An opaque backdrop to hold a collection of related elements. */
const Card = forwardRef<HTMLDivElement, ICard>(
  (
    { children, variant = "default", size = "md", className, ...filteredProps },
    ref
  ): JSX.Element => (
    <div
      ref={ref}
      {...filteredProps}
      className={clsx(
        {
          "bg-primary-200 dark:bg-secondary-900 black:bg-black text-gray-900 dark:text-gray-100 shadow-lg dark:shadow-none":
            variant === "rounded",
          [sizes[size]]: variant === "rounded",
          "py-4": variant === "slim",
          "black:rounded-none": size !== "xl",
        },
        className
      )}
    >
      {children}
    </div>
  )
);

interface ICardHeader {
  backHref?: string;
  onBackClick?: (event: React.MouseEvent) => void;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Card header container with back button.
 * Typically holds a CardTitle.
 */
const CardHeader: React.FC<ICardHeader> = ({
  className,
  children,
  backHref,
  onBackClick,
}): JSX.Element => {
  const intl = useIntl();

  const renderBackButton = () => {
    if (!backHref && !onBackClick) {
      return null;
    }

    const Comp: React.ElementType = backHref ? Link : "button";
    const backAttributes = backHref
      ? { to: backHref }
      : { onClick: onBackClick };

    return (
      <Comp
        {...backAttributes}
        className="rounded-5px text-gray-900 focus:ring-2 focus:ring-primary-500 dark:text-gray-100"
        aria-label={intl.formatMessage(messages.back)}
      >
        <SvgIcon src={arrowLeftIcon} className="size-6 rtl:rotate-180" />
        <span className="sr-only" data-testid="back-button">
          {intl.formatMessage(messages.back)}
        </span>
      </Comp>
    );
  };

  return (
    <HStack alignItems="center" space={2} className={className}>
      {renderBackButton()}

      {children}
    </HStack>
  );
};

interface ICardTitle {
  title: React.ReactNode;
}

/** A card's title. */
const CardTitle: React.FC<ICardTitle> = ({ title }): JSX.Element => (
  <Text size="xl" weight="bold" tag="h1" data-testid="card-title" truncate>
    {title}
  </Text>
);

interface ICardBody {
  /** Classnames for the <div> element. */
  className?: string;
  /** Children to appear inside the card. */
  children: React.ReactNode;
}

/** A card's body. */
const CardBody: React.FC<ICardBody> = ({
  className,
  children,
}): JSX.Element => (
  <div data-testid="card-body" className={className}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardBody };
