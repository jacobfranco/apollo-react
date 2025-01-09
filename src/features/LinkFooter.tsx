import clsx from "clsx";
import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { logOut } from "src/actions/auth";
import { Text } from "src/components";
import emojify from "src/features/emoji";
import { useOwnAccount, useAppDispatch, useApolloConfig } from "src/hooks";

interface IFooterLink {
  to: string;
  className?: string;
  onClick?: React.EventHandler<React.MouseEvent>;
  children: React.ReactNode;
}

const FooterLink: React.FC<IFooterLink> = ({
  children,
  className,
  ...rest
}): JSX.Element => {
  return (
    <div>
      <Link
        className={clsx(
          "text-gray-700 hover:text-gray-800 hover:underline dark:text-gray-600 dark:hover:text-gray-500",
          className
        )}
        {...rest}
      >
        {children}
      </Link>
    </div>
  );
};

const LinkFooter: React.FC = (): JSX.Element => {
  const { account } = useOwnAccount();

  const dispatch = useAppDispatch();
  const apolloConfig = useApolloConfig();

  const onClickLogOut: React.EventHandler<React.MouseEvent> = (e) => {
    dispatch(logOut());
    e.preventDefault();
  };

  return (
    <div className="space-y-2">
      <div className="divide-x-dot flex flex-wrap items-center text-gray-600">
        {account && (
          <>
            <FooterLink to="/blocks">
              <FormattedMessage
                id="navigation_bar.blocks"
                defaultMessage="Blocks"
              />
            </FooterLink>
            <FooterLink to="/mutes">
              <FormattedMessage
                id="navigation_bar.mutes"
                defaultMessage="Mutes"
              />
            </FooterLink>
            <FooterLink to="/filters">
              <FormattedMessage
                id="navigation_bar.filters"
                defaultMessage="Filters"
              />
            </FooterLink>
            <FooterLink to="/followed_tags">
              <FormattedMessage
                id="navigation_bar.followed_tags"
                defaultMessage="Followed hashtags"
              />
            </FooterLink>
            {account.locked && (
              <FooterLink to="/follow_requests">
                <FormattedMessage
                  id="navigation_bar.follow_requests"
                  defaultMessage="Follow requests"
                />
              </FooterLink>
            )}
            <FooterLink to="/logout" onClick={onClickLogOut}>
              <FormattedMessage
                id="navigation_bar.logout"
                defaultMessage="Logout"
              />
            </FooterLink>
          </>
        )}
      </div>

      <Text theme="muted" size="sm">
        <span
          className="inline-block align-middle"
          dangerouslySetInnerHTML={{
            __html: emojify(apolloConfig.linkFooterMessage),
          }}
        />
      </Text>
    </div>
  );
};

export default LinkFooter;
