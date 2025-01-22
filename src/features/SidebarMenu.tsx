import atIcon from "@tabler/icons/outline/at.svg";
import banIcon from "@tabler/icons/outline/ban.svg";
import bookmarkIcon from "@tabler/icons/outline/bookmark.svg";
import calendarEventIcon from "@tabler/icons/outline/calendar-event.svg";
import chevronDownIcon from "@tabler/icons/outline/chevron-down.svg";
import circleXIcon from "@tabler/icons/outline/circle-x.svg";
import circlesIcon from "@tabler/icons/outline/circles.svg";
import codeIcon from "@tabler/icons/outline/code.svg";
import bellIcon from "@tabler/icons/outline/bell.svg";
import controllerIcon from "@tabler/icons/outline/device-gamepad-2.svg";
import filterIcon from "@tabler/icons/outline/filter.svg";
import hashIcon from "@tabler/icons/outline/hash.svg";
import listIcon from "@tabler/icons/outline/list.svg";
import logoutIcon from "@tabler/icons/outline/logout.svg";
import planetIcon from "@tabler/icons/outline/planet.svg";
import plusIcon from "@tabler/icons/outline/plus.svg";
import settingsIcon from "@tabler/icons/outline/settings.svg";
import userPlusIcon from "@tabler/icons/outline/user-plus.svg";
import userIcon from "@tabler/icons/outline/user.svg";
import worldIcon from "@tabler/icons/outline/world.svg";
import xIcon from "@tabler/icons/outline/x.svg";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { defineMessages, useIntl, FormattedMessage } from "react-intl";
import { Link, NavLink } from "react-router-dom";

import { fetchOwnAccounts, logOut, switchAccount } from "src/actions/auth";
import { getSettings } from "src/actions/settings";
import { closeSidebar } from "src/actions/sidebar";
import { useAccount } from "src/api/hooks";
import Account from "src/components/Account";
import Divider from "src/components/Divider";
import HStack from "src/components/HStack";
import IconButton from "src/components/IconButton";
import Icon from "src/components/Icon";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import ProfileStats from "src/features/ProfileStats";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useAppSelector } from "src/hooks/useAppSelector";
import { makeGetOtherAccounts } from "src/selectors/index";

import type { Account as AccountEntity } from "src/schemas/account";

const messages = defineMessages({
  followers: { id: "account.followers", defaultMessage: "Followers" },
  follows: { id: "account.follows", defaultMessage: "Following" },
  profile: { id: "account.profile", defaultMessage: "Profile" },
  preferences: {
    id: "navigation_bar.preferences",
    defaultMessage: "Settings",
  },
  blocks: { id: "navigation_bar.blocks", defaultMessage: "Blocks" },
  domainBlocks: {
    id: "navigation_bar.domain_blocks",
    defaultMessage: "Domain blocks",
  },
  mutes: { id: "navigation_bar.mutes", defaultMessage: "Mutes" },
  filters: { id: "navigation_bar.filters", defaultMessage: "Filters" },
  followedTags: {
    id: "navigation_bar.followed_tags",
    defaultMessage: "Followed hashtags",
  },
  esports: {
    id: "navigation_bar.esports",
    defaultMessage: "Esports",
  },

  accountMigration: {
    id: "navigation_bar.account_migration",
    defaultMessage: "Move account",
  },
  accountAliases: {
    id: "navigation_bar.account_aliases",
    defaultMessage: "Account aliases",
  },
  logout: { id: "navigation_bar.logout", defaultMessage: "Logout" },
  bookmarks: { id: "column.bookmarks", defaultMessage: "Bookmarks" },
  lists: { id: "column.lists", defaultMessage: "Lists" },
  groups: { id: "column.groups", defaultMessage: "Groups" },
  events: { id: "column.events", defaultMessage: "Events" },
  invites: { id: "navigation_bar.invites", defaultMessage: "Invites" },
  developers: { id: "navigation.developers", defaultMessage: "Developers" },
  addAccount: {
    id: "profile_dropdown.add_account",
    defaultMessage: "Add an existing account",
  },
  followRequests: {
    id: "navigation_bar.follow_requests",
    defaultMessage: "Follow requests",
  },
  close: { id: "lightbox.close", defaultMessage: "Close" },
  notifications: {
    id: "tabs_bar.notifications",
    defaultMessage: "Notificatons",
  },
});

interface ISidebarLink {
  href?: string;
  to?: string;
  icon: string;
  text: string | JSX.Element;
  onClick: React.EventHandler<React.MouseEvent>;
  count?: number;
}

const SidebarLink: React.FC<ISidebarLink> = ({
  href,
  to,
  icon,
  text,
  onClick,
  count,
}) => {
  const body = (
    <HStack space={2} alignItems="center">
      <div className="relative inline-flex rounded-full bg-transparent p-2">
        <Icon src={icon} className="size-5 text-primary-500" count={count} />
      </div>

      <Text tag="span" weight="medium" theme="inherit">
        {text}
      </Text>
    </HStack>
  );

  if (to) {
    return (
      <NavLink
        className="group rounded-5px text-gray-900 hover:bg-primary-100/40 dark:text-gray-100 dark:hover:bg-secondary-800"
        to={to}
        onClick={onClick}
      >
        {body}
      </NavLink>
    );
  }

  return (
    <a
      className="group rounded-full text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800"
      href={href}
      target="_blank"
      onClick={onClick}
    >
      {body}
    </a>
  );
};

const SidebarMenu: React.FC = (): JSX.Element | null => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const getOtherAccounts = useCallback(makeGetOtherAccounts(), []);
  const me = useAppSelector((state) => state.me);
  const { account } = useAccount(me || undefined);
  const otherAccounts = useAppSelector((state) => getOtherAccounts(state));
  const sidebarOpen = useAppSelector((state) => state.sidebar.sidebarOpen);
  const settings = useAppSelector((state) => getSettings(state));
  const followRequestsCount = useAppSelector((state) =>
    state.user_lists.follow_requests.items.count()
  );
  const dashboardCount = useAppSelector(
    (state) =>
      state.admin.openReports.count() + state.admin.awaitingApproval.count()
  );

  const closeButtonRef = useRef(null);

  const [switcher, setSwitcher] = useState(false);

  const onClose = () => dispatch(closeSidebar());

  const handleClose = () => {
    setSwitcher(false);
    onClose();
  };

  const handleSwitchAccount = (
    account: AccountEntity
  ): React.MouseEventHandler => {
    return (e) => {
      e.preventDefault();
      dispatch(switchAccount(account.id));
    };
  };

  const onClickLogOut: React.MouseEventHandler = (e) => {
    e.preventDefault();
    dispatch(logOut());
  };

  const handleSwitcherClick: React.MouseEventHandler = (e) => {
    e.preventDefault();

    setSwitcher((prevState) => !prevState);
  };

  const renderAccount = (account: AccountEntity) => (
    <Link to={"/"} className="inline-flex">
      <button
        className="!block space-x-2 !border-none !p-0 !py-2 !text-primary-600 hover:!underline  focus:!ring-transparent focus:!ring-offset-0 dark:!text-accent-blue rtl:space-x-reverse"
        onClick={handleSwitchAccount(account)}
        key={account.id}
      >
        <div className="pointer-events-none max-w-[288px]">
          <Account
            account={account}
            showProfileHoverCard={false}
            withRelationship={false}
            withLinkToProfile={false}
          />
        </div>
      </button>
    </Link>
  );

  useEffect(() => {
    dispatch(fetchOwnAccounts());
  }, []);

  if (!account) return null;

  return (
    <div
      aria-expanded={sidebarOpen}
      className={clsx({
        "z-[1000]": sidebarOpen,
        hidden: !sidebarOpen,
      })}
    >
      <button
        className="fixed inset-0 bg-gray-500/90 black:bg-gray-900/90 dark:bg-secondary-800/90"
        onClick={handleClose}
      />

      <div className="fixed inset-0 z-[1000] flex">
        <div
          className={clsx({
            "flex flex-col flex-1 bg-primary-200 black:bg-black dark:bg-secondary-900 -translate-x-full rtl:translate-x-full w-full max-w-xs":
              true,
            "!translate-x-0": sidebarOpen,
          })}
        >
          <IconButton
            title={intl.formatMessage(messages.close)}
            onClick={handleClose}
            src={xIcon}
            ref={closeButtonRef}
            iconClassName="h-6 w-6"
            className="absolute right-0 top-0 -mr-11 mt-2 text-gray-600 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
          />

          <div className="relative size-full overflow-auto overflow-y-scroll">
            <div className="p-4">
              <Stack space={4}>
                <Link to={`/@${account.username}`} onClick={onClose}>
                  <Account
                    account={account}
                    showProfileHoverCard={false}
                    withLinkToProfile={false}
                  />
                </Link>

                <ProfileStats account={account} onClickHandler={handleClose} />

                <Stack space={4}>
                  <Divider />

                  <SidebarLink
                    to={`/@${account.username}`}
                    icon={userIcon}
                    text={intl.formatMessage(messages.profile)}
                    onClick={onClose}
                  />

                  {(account.locked || followRequestsCount > 0) && (
                    <SidebarLink
                      to="/follow_requests"
                      icon={userPlusIcon}
                      text={intl.formatMessage(messages.followRequests)}
                      onClick={onClose}
                    />
                  )}

                  <SidebarLink
                    to="/notifications"
                    icon={bellIcon}
                    text={intl.formatMessage(messages.notifications)}
                    onClick={onClose}
                  />

                  <SidebarLink
                    to="/settings/preferences"
                    icon={settingsIcon}
                    text={intl.formatMessage(messages.preferences)}
                    onClick={onClose}
                  />

                  <SidebarLink
                    to="/bookmarks"
                    icon={bookmarkIcon}
                    text={intl.formatMessage(messages.bookmarks)}
                    onClick={onClose}
                  />

                  {/*
                    <SidebarLink
                      to="/groups"
                      icon={circlesIcon}
                      text={intl.formatMessage(messages.groups)}
                      onClick={onClose}
                    />
                  */}

                  {settings.get("isDeveloper") && (
                    <SidebarLink
                      to="/developers"
                      icon={codeIcon}
                      text={intl.formatMessage(messages.developers)}
                      onClick={onClose}
                    />
                  )}

                  <Divider />

                  <SidebarLink
                    to="/blocks"
                    icon={banIcon}
                    text={intl.formatMessage(messages.blocks)}
                    onClick={onClose}
                  />

                  <SidebarLink
                    to="/mutes"
                    icon={circleXIcon}
                    text={intl.formatMessage(messages.mutes)}
                    onClick={onClose}
                  />

                  <SidebarLink
                    to="/filters"
                    icon={filterIcon}
                    text={intl.formatMessage(messages.filters)}
                    onClick={onClose}
                  />

                  <SidebarLink
                    to="/followed_tags"
                    icon={hashIcon}
                    text={intl.formatMessage(messages.followedTags)}
                    onClick={onClose}
                  />

                  {account.admin && (
                    <SidebarLink
                      to="/admin"
                      icon={planetIcon}
                      count={dashboardCount}
                      onClick={onClose}
                      text={
                        <FormattedMessage
                          id="tabs_bar.dashboard"
                          defaultMessage="Dashboard"
                        />
                      }
                    />
                  )}

                  <Divider />

                  <SidebarLink
                    to="/logout"
                    icon={logoutIcon}
                    text={intl.formatMessage(messages.logout)}
                    onClick={onClickLogOut}
                  />

                  <Divider />

                  <Stack space={4}>
                    <button
                      type="button"
                      onClick={handleSwitcherClick}
                      className="py-1"
                    >
                      <HStack alignItems="center" justifyContent="between">
                        <Text tag="span">
                          <FormattedMessage
                            id="profile_dropdown.switch_account"
                            defaultMessage="Switch accounts"
                          />
                        </Text>

                        <Icon
                          src={chevronDownIcon}
                          className={clsx(
                            "size-4 text-gray-900 transition-transform dark:text-gray-100",
                            {
                              "rotate-180": switcher,
                            }
                          )}
                        />
                      </HStack>
                    </button>

                    {switcher && (
                      <div className="border-t-2 border-solid border-gray-100 black:border-t dark:border-gray-800">
                        {otherAccounts.map((account) => renderAccount(account))}

                        <NavLink
                          className="flex items-center space-x-1 py-2"
                          to="/login/add"
                          onClick={handleClose}
                        >
                          <Icon
                            className="size-4 text-primary-500"
                            src={plusIcon}
                          />
                          <Text size="sm" weight="medium">
                            {intl.formatMessage(messages.addAccount)}
                          </Text>
                        </NavLink>
                      </div>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            </div>
          </div>
        </div>

        {/* Dummy element to keep Close Icon visible */}
        <div aria-hidden className="w-14 shrink-0" onClick={handleClose} />
      </div>
    </div>
  );
};

export default SidebarMenu;
