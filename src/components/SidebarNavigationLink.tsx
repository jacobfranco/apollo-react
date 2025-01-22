import clsx from "clsx";
import React from "react";
import { NavLink } from "react-router-dom";

import { Text } from "src/components";
import Icon from "./Icon";

interface ISidebarNavigationLink {
  /** Notification count, if any. */
  count?: number;
  /** Optional max to cap count (ie: N+) */
  countMax?: number;
  /** URL to an SVG icon. */
  icon: string;
  /** URL to an SVG icon for active state. */
  activeIcon?: string;
  /** Link label. */
  text: React.ReactNode;
  /** Route to an internal page. */
  to?: string;
  /** Callback when the link is clicked. */
  onClick?: React.EventHandler<React.MouseEvent>;
}

/** Desktop sidebar navigation link. */
const SidebarNavigationLink = React.forwardRef(
  (
    props: ISidebarNavigationLink,
    ref: React.ForwardedRef<HTMLAnchorElement>
  ): JSX.Element => {
    const { icon, activeIcon, text, to = "", count, countMax, onClick } = props;
    const isActive = location.pathname === to;

    const handleClick: React.EventHandler<React.MouseEvent> = (e) => {
      if (onClick) {
        onClick(e);
        e.preventDefault();
        e.stopPropagation();
      }
    };

    return (
      <NavLink
        exact
        to={to}
        ref={ref}
        onClick={handleClick}
        className={clsx({
          "flex items-center px-4 py-3.5 text-base font-semibold space-x-4 rtl:space-x-reverse rounded-md group text-black hover:text-gray-900 dark:text-gray-500 dark:hover:text-primary-500 hover:bg-primary-100 dark:hover:bg-secondary-900":
            true,
          "text-black dark:text-primary-500 bg-primary-200 dark:bg-secondary-800 shadow-md":
            isActive,
        })}
      >
        <span className="relative">
          <Icon
            src={(isActive && activeIcon) || icon}
            count={count}
            countMax={countMax}
            className={clsx("h-5 w-5", {
              "text-gray-600 dark:text-gray-700 group-hover:text-primary-500 dark:group-hover:text-primary-500":
                !isActive,
              "text-primary-500": isActive,
            })}
          />
        </span>

        <Text weight="medium" theme="inherit">
          {text}
        </Text>
      </NavLink>
    );
  }
);

export default SidebarNavigationLink;
