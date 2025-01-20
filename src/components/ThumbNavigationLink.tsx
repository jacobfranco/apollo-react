import clsx from "clsx";
import { NavLink, useLocation } from "react-router-dom";

import IconWithCounter from "src/components/IconWithCounter";
import Icon from "src/components/Icon";
import Text from "src/components/Text";

interface IThumbNavigationLink {
  count?: number;
  countMax?: number;
  src: string;
  activeSrc?: string;
  text?: string | React.ReactElement;
  to: string;
  exact?: boolean;
  paths?: Array<string>;
}

const ThumbNavigationLink: React.FC<IThumbNavigationLink> = ({
  count,
  countMax,
  src,
  activeSrc,
  text,
  to,
  exact,
  paths,
}): JSX.Element => {
  const { pathname } = useLocation();

  const isActive = (): boolean => {
    if (paths) {
      return paths.some((path) => pathname.startsWith(path));
    } else {
      return exact ? pathname === to : pathname.startsWith(to);
    }
  };

  const active = isActive();

  const icon = (active && activeSrc) || src;

  return (
    <NavLink
      to={to}
      exact={exact}
      className={clsx({
        "flex flex-1 flex-col items-center space-y-1 px-2 py-3.5": true,
        "bg-primary-500/5 dark:bg-secondary-500/5 rounded-5px": active,
      })}
    >
      {count !== undefined ? (
        <IconWithCounter
          src={icon}
          className={clsx({
            "h-5 w-5": true,
            "text-gray-700 dark:text-gray-600": !active,
            "text-primary-600": active,
          })}
          count={count}
          countMax={countMax}
        />
      ) : (
        <Icon
          src={icon}
          className={clsx({
            "h-5 w-5": true,
            "text-gray-700 dark:text-gray-600": !active,
            "text-primary-600": active,
          })}
        />
      )}

      <Text
        tag="span"
        size="xs"
        weight="medium"
        className={clsx({
          "text-black": active,
        })}
      >
        {text}
      </Text>
    </NavLink>
  );
};

export default ThumbNavigationLink;
