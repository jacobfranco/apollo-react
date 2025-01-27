import clsx from "clsx";
import React, { Suspense, useEffect, useRef } from "react";
import { Switch, useHistory, useLocation, Redirect } from "react-router-dom";

import { fetchFollowRequests } from "src/actions/accounts";
import { fetchReports, fetchUsers } from "src/actions/admin";
import { fetchFilters } from "src/actions/filters";
import { fetchMarker } from "src/actions/markers";
import { expandNotifications } from "src/actions/notifications";
// import { register as registerPushNotifications } from 'src/actions/push-notifications';
import { fetchScheduledStatuses } from "src/actions/scheduled-statuses";
import { fetchSuggestionsForTimeline } from "src/actions/suggestions";
import { expandHomeTimeline } from "src/actions/timelines";
// import { useUserStream } from 'src/api/hooks';
import * as BuildConfig from "src/build-config";
import {
  SidebarNavigation,
  ThumbNavigation,
  Layout,
  BackgroundShapes,
  FloatingActionButton,
} from "src/components";
import {
  useAppDispatch,
  useAppSelector,
  useOwnAccount,
  useApolloConfig,
  useDraggedFiles,
  useLoggedIn,
} from "src/hooks";
import AdminPage from "src/pages/AdminPage";
import ChatsPage from "src/pages/ChatsPage";
import DefaultPage from "src/pages/DefaultPage";
import EmptyPage from "src/pages/EmptyPage";
import ESportsPage from "src/pages/ESportsPage";
// import GroupPage from 'src/pages/GroupPage'; TODO: Implement Groups (do after everything else is done though)
// import GroupsPage from 'src/pages/GroupsPage';
// import GroupsPendingPage from 'src/pages/GroupsPendingPage';
import HomePage from "src/pages/HomePage";
import LandingPage from "src/pages/LandingPage";
// import ManageGroupsPage from 'src/pages/ManageGroupsPage'; TODO: Implement groups
import ProfilePage from "src/pages/ProfilePage";
import SearchPage from "src/pages/SearchPage";
import StatusPage from "src/pages/StatusPage";
// import { getVapidKey } from 'src/utils/auth';

import Navbar from "./Navbar";
import {
  Status,
  AccountTimeline,
  AccountGallery,
  HomeTimeline,
  Followers,
  Following,
  DirectTimeline,
  Conversations,
  HashtagTimeline,
  SpaceTimeline,
  Notifications,
  FollowRequests,
  GenericNotFound,
  LikedStatuses,
  Blocks,
  Mutes,
  Filters,
  EditFilter,
  PinnedStatuses,
  Search,
  Bookmarks,
  Settings,
  EditProfile,
  EditEmail,
  EditPassword,
  EmailConfirmation,
  DeleteAccount,
  // MfaForm,
  // ChatIndex,
  ChatWidget,
  ServerInfo,
  Admin,
  ModerationLog,
  ScheduledStatuses,
  UserIndex,
  FollowRecommendations,
  SidebarMenu,
  ProfileHoverCard,
  StatusHoverCard,
  Share,
  NewStatus,
  // IntentionalError,
  // Developers,
  // CreateApp,
  // SettingsStore,
  // TestTimeline,
  Logout,
  AuthTokenList,
  Quotes,
  // ServiceWorkerInfo,
  // GroupGallery,
  // Groups,
  // GroupsDiscover,
  // GroupsPopular,
  // GroupsSuggested,
  // GroupsTag,
  // GroupsTags,
  // PendingGroupRequests,
  // GroupMembers,
  // GroupTags,
  // GroupTagTimeline,
  // GroupTimeline,
  // ManageGroup,
  // GroupBlockedMembers,
  // GroupMembershipRequests,
  // EditGroup,
  FollowedTags,
  AboutPage,
  ContactPage,
  TermsPage,
  PrivacyPage,
  Signup,
  Login,
  PasswordReset,
  PasswordResetConfirm,
  SignupInvite,
  Landing,
  SpacePage,
  Spaces,
  ESportPage,
  ESports,
  ScoreboardDetailsTab,
  TeamDetail,
  PlayerDetail,
  StreamPage,
  Reports,
  AdminSpaces,
} from "./AsyncComponents";
import GlobalHotkeys from "./GlobalHotkeys";
import { WrappedRoute } from "src/utils/react-router-helpers";

// Dummy import, to make sure that <Status /> ends up in the application bundle.
// Without this it ends up in ~8 very commonly used bundles.
import "src/components/Status";
import { useUserStream } from "src/api/hooks/useUserStream";
import DetailPage from "src/pages/DetailPage";

interface ISwitchingColumnsArea {
  children: React.ReactNode;
}

const SwitchingColumnsArea: React.FC<ISwitchingColumnsArea> = ({
  children,
}) => {
  const { search } = useLocation();
  const { isLoggedIn } = useLoggedIn();

  const { authenticatedProfile } = useApolloConfig();

  return (
    <Switch>
      <WrappedRoute
        path="/email-confirmation"
        page={EmptyPage}
        component={EmailConfirmation}
        publicRoute
        exact
      />
      <WrappedRoute
        path="/logout"
        page={EmptyPage}
        component={Logout}
        publicRoute
        exact
      />

      {isLoggedIn ? (
        <WrappedRoute
          path="/"
          exact
          page={HomePage}
          component={HomeTimeline}
          content={children}
        />
      ) : (
        <WrappedRoute
          path="/"
          exact
          page={LandingPage}
          component={Landing}
          content={children}
          publicRoute
        />
      )}

      {/*
        NOTE: we cannot nest routes in a fragment
        https://stackoverflow.com/a/68637108
      */}

      <WrappedRoute
        path="/conversations"
        page={DefaultPage}
        component={Conversations}
        content={children}
      />
      <WrappedRoute
        path="/messages"
        page={DefaultPage}
        component={DirectTimeline}
        content={children}
      />
      <WrappedRoute
        path="/messages"
        page={DefaultPage}
        component={Conversations}
        content={children}
      />

      <WrappedRoute
        path="/tags/:id"
        publicRoute
        page={DefaultPage}
        component={HashtagTimeline}
        content={children}
      />

      <WrappedRoute
        path="/bookmarks"
        page={DefaultPage}
        component={Bookmarks}
        content={children}
      />

      <WrappedRoute
        path="/notifications"
        page={DefaultPage}
        component={Notifications}
        content={children}
      />

      <WrappedRoute
        path="/search"
        page={SearchPage}
        component={Search}
        content={children}
        publicRoute
      />

      <WrappedRoute
        path="/s/:spaceName"
        page={DefaultPage}
        component={SpacePage}
        publicRoute
      />

      <WrappedRoute
        path="/s"
        page={DefaultPage}
        component={Spaces}
        content={children}
        publicRoute
      />

      <WrappedRoute
        path="/esports/:esportName/series/:seriesId"
        page={DetailPage}
        component={ScoreboardDetailsTab}
        content={children}
        publicRoute
      />

      <WrappedRoute
        path="/esports/:esportName/player/:playerId"
        page={DetailPage}
        component={PlayerDetail}
        content={children}
        publicRoute
      />

      <WrappedRoute
        path="/esports/:esportName/team/:teamId"
        page={DetailPage}
        component={TeamDetail}
        content={children}
        publicRoute
      />

      <WrappedRoute
        path="/streams/:seriesId"
        page={StreamPage}
        component={ESportPage}
        content={children}
        publicRoute
      />

      <WrappedRoute
        path="/esports/:esportName"
        page={ESportsPage}
        component={ESportPage}
        content={children}
        publicRoute
      />

      <WrappedRoute
        path="/esports"
        page={EmptyPage}
        component={ESports}
        content={children}
        publicRoute
      />

      <WrappedRoute
        path="/suggestions"
        publicRoute
        page={DefaultPage}
        component={FollowRecommendations}
        content={children}
      />

      {/*

      <WrappedRoute
        path="/chats"
        exact
        page={ChatsPage}
        component={ChatIndex}
        content={children}
      />
      <WrappedRoute
        path="/chats/new"
        page={ChatsPage}
        component={ChatIndex}
        content={children}
      />
      <WrappedRoute
        path="/chats/settings"
        page={ChatsPage}
        component={ChatIndex}
        content={children}
      />
      <WrappedRoute
        path="/chats/:chatId"
        page={ChatsPage}
        component={ChatIndex}
        content={children}
      />
      */}

      <WrappedRoute
        path="/follow_requests"
        page={DefaultPage}
        component={FollowRequests}
        content={children}
      />
      <WrappedRoute
        path="/blocks"
        page={DefaultPage}
        component={Blocks}
        content={children}
      />
      <WrappedRoute
        path="/mutes"
        page={DefaultPage}
        component={Mutes}
        content={children}
      />
      <WrappedRoute
        path="/filters/new"
        page={DefaultPage}
        component={EditFilter}
        content={children}
      />
      <WrappedRoute
        path="/filters/:id"
        page={DefaultPage}
        component={EditFilter}
        content={children}
      />
      <WrappedRoute
        path="/filters"
        page={DefaultPage}
        component={Filters}
        content={children}
      />
      <WrappedRoute
        path="/followed_tags"
        page={DefaultPage}
        component={FollowedTags}
        content={children}
      />

      <WrappedRoute
        path="/@:username"
        publicRoute
        exact
        component={AccountTimeline}
        page={ProfilePage}
        content={children}
      />
      <WrappedRoute
        path="/@:username/with_replies"
        publicRoute={!authenticatedProfile}
        component={AccountTimeline}
        page={ProfilePage}
        content={children}
        componentParams={{ withReplies: true }}
      />
      <WrappedRoute
        exact
        path="/@:username/followers"
        publicRoute={!authenticatedProfile}
        component={Followers}
        page={ProfilePage}
        content={children}
      />
      <WrappedRoute
        exact
        path="/@:username/following"
        publicRoute={!authenticatedProfile}
        component={Following}
        page={ProfilePage}
        content={children}
      />
      <WrappedRoute
        path="/@:username/media"
        publicRoute={!authenticatedProfile}
        component={AccountGallery}
        page={ProfilePage}
        content={children}
      />
      <WrappedRoute
        path="/@:username/tagged/:tag"
        exact
        component={AccountTimeline}
        page={ProfilePage}
        content={children}
      />
      <WrappedRoute
        path="/@:username/likes"
        component={LikedStatuses}
        page={ProfilePage}
        content={children}
      />
      <WrappedRoute
        path="/@:username/pins"
        component={PinnedStatuses}
        page={ProfilePage}
        content={children}
      />
      <WrappedRoute
        path="/@:username/posts/:statusId"
        publicRoute
        exact
        page={StatusPage}
        component={Status}
        content={children}
      />
      <WrappedRoute
        path="/@:username/posts/:statusId/quotes"
        publicRoute
        page={StatusPage}
        component={Quotes}
        content={children}
      />
      <Redirect from="/@:username/:statusId" to="/@:username/posts/:statusId" />

      {/* 
     <WrappedRoute path='/groups' exact page={GroupsPage} component={Groups} content={children} />
      <WrappedRoute path='/groups/discover' exact page={GroupsPage} component={GroupsDiscover} content={children} />
       <WrappedRoute path='/groups/popular' exact page={GroupsPendingPage} component={GroupsPopular} content={children} />
       <WrappedRoute path='/groups/suggested' exact page={GroupsPendingPage} component={GroupsSuggested} content={children} />
      <WrappedRoute path='/groups/tags' exact page={GroupsPendingPage} component={GroupsTags} content={children} />
     <WrappedRoute path='/groups/discover/tags/:id' exact page={GroupsPendingPage} component={GroupsTag} content={children} />
       <WrappedRoute path='/groups/pending-requests' exact page={GroupsPendingPage} component={PendingGroupRequests} content={children} />
       <WrappedRoute path='/groups/:groupId/tags' exact page={GroupPage} component={GroupTags} content={children} />
       <WrappedRoute path='/groups/:groupId/tag/:id' exact page={GroupsPendingPage} component={GroupTagTimeline} content={children} />
       <WrappedRoute path='/groups/:groupId' exact page={GroupPage} component={GroupTimeline} content={children} />
       <WrappedRoute path='/groups/:groupId/members' exact page={GroupPage} component={GroupMembers} content={children} />
      <WrappedRoute path='/groups/:groupId/media' publicRoute={!authenticatedProfile} component={GroupGallery} page={GroupPage} content={children} />
       <WrappedRoute path='/groups/:groupId/manage' exact page={ManageGroupsPage} component={ManageGroup} content={children} />
       <WrappedRoute path='/groups/:groupId/manage/edit' exact page={ManageGroupsPage} component={EditGroup} content={children} />
       <WrappedRoute path='/groups/:groupId/manage/blocks' exact page={ManageGroupsPage} component={GroupBlockedMembers} content={children} />
       <WrappedRoute path='/groups/:groupId/manage/requests' exact page={ManageGroupsPage} component={GroupMembershipRequests} content={children} />
      <WrappedRoute path='/groups/:groupId/posts/:statusId' exact page={StatusPage} component={Status} content={children} />

  */}

      <WrappedRoute
        path="/statuses/new"
        page={DefaultPage}
        component={NewStatus}
        content={children}
        exact
      />
      <WrappedRoute
        path="/statuses/:statusId"
        exact
        page={StatusPage}
        component={Status}
        content={children}
      />
      <WrappedRoute
        path="/scheduled_statuses"
        page={DefaultPage}
        component={ScheduledStatuses}
        content={children}
      />

      <WrappedRoute
        path="/settings/profile"
        page={DefaultPage}
        component={EditProfile}
        content={children}
      />
      <WrappedRoute
        path="/settings/email"
        page={DefaultPage}
        component={EditEmail}
        content={children}
      />
      <WrappedRoute
        path="/settings/password"
        page={DefaultPage}
        component={EditPassword}
        content={children}
      />
      <WrappedRoute
        path="/settings/account"
        page={DefaultPage}
        component={DeleteAccount}
        content={children}
      />
      {/* <WrappedRoute path='/settings/mfa' page={DefaultPage} component={MfaForm} exact /> */}
      <WrappedRoute
        path="/settings/tokens"
        page={DefaultPage}
        component={AuthTokenList}
        content={children}
      />
      <WrappedRoute
        path="/settings"
        page={DefaultPage}
        component={Settings}
        content={children}
      />

      <WrappedRoute
        path="/admin"
        staffOnly
        page={AdminPage}
        component={Admin}
        content={children}
        exact
      />
      <WrappedRoute
        path="/admin/reports"
        staffOnly
        page={AdminPage}
        component={Reports}
        content={children}
        exact
      />

      <WrappedRoute
        path="/admin/spaces"
        staffOnly
        page={AdminPage}
        component={AdminSpaces}
        content={children}
        exact
      />
      <WrappedRoute
        path="/admin/log"
        staffOnly
        page={AdminPage}
        component={ModerationLog}
        content={children}
        exact
      />
      <WrappedRoute
        path="/admin/users"
        staffOnly
        page={AdminPage}
        component={UserIndex}
        content={children}
        exact
      />

      <WrappedRoute
        path="/about"
        page={DefaultPage}
        component={AboutPage}
        publicRoute
        exact
      />

      <WrappedRoute
        path="/about/tos"
        page={DefaultPage}
        component={TermsPage}
        publicRoute
        exact
      />
      <WrappedRoute
        path="/about/privacy"
        page={DefaultPage}
        component={PrivacyPage}
        publicRoute
        exact
      />

      <WrappedRoute
        path="/contact"
        page={DefaultPage}
        component={ContactPage}
        content={children}
      />

      <WrappedRoute
        path="/share"
        page={DefaultPage}
        component={Share}
        content={children}
        exact
      />

      {/* 
      <WrappedRoute path='/developers/apps/create' developerOnly page={DefaultPage} component={CreateApp} content={children} />
      <WrappedRoute path='/developers/settings_store' developerOnly page={DefaultPage} component={SettingsStore} content={children} />
      <WrappedRoute path='/developers/timeline' developerOnly page={DefaultPage} component={TestTimeline} content={children} />
      <WrappedRoute path='/developers/sw' developerOnly page={DefaultPage} component={ServiceWorkerInfo} content={children} />
      <WrappedRoute path='/developers' page={DefaultPage} component={Developers} content={children} />
      <WrappedRoute path='/error/network' developerOnly page={EmptyPage} component={lazy(() => Promise.reject(new TypeError('Failed to fetch dynamically imported module: TEST')))} content={children} />
      <WrappedRoute path='/error' developerOnly page={EmptyPage} component={IntentionalError} content={children} />

*/}

      <WrappedRoute
        path="/signup"
        page={EmptyPage}
        component={Signup}
        publicRoute
        exact
      />

      <WrappedRoute
        path="/login/add"
        page={DefaultPage}
        component={Login}
        publicRoute
        exact
      />
      <WrappedRoute
        path="/login"
        page={DefaultPage}
        component={Login}
        publicRoute
        exact
      />
      {/* TODO: Implement later 
      <WrappedRoute
        path="/reset-password"
        page={DefaultPage}
        component={PasswordReset}
        publicRoute
        exact
      />
      <WrappedRoute
        path="/edit-password"
        page={DefaultPage}
        component={PasswordResetConfirm}
        publicRoute
        exact
      />
      <WrappedRoute
        path="/invite/:token"
        page={DefaultPage}
        component={SignupInvite}
        publicRoute
        exact
      />
      */}
      <Redirect from="/auth/password/new" to="/reset-password" />
      <Redirect from="/auth/password/edit" to={`/edit-password${search}`} />

      <WrappedRoute
        page={EmptyPage}
        component={GenericNotFound}
        content={children}
      />
    </Switch>
  );
};

interface IUI {
  children?: React.ReactNode;
}

const UI: React.FC<IUI> = ({ children }) => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const node = useRef<HTMLDivElement | null>(null);
  const me = useAppSelector((state) => state.me);
  const { account } = useOwnAccount();
  // const vapidKey = useAppSelector(state => getVapidKey(state));

  const dropdownMenuIsOpen = useAppSelector(
    (state) => state.dropdown_menu.isOpen
  );

  const { isDragging } = useDraggedFiles(node);

  const handleServiceWorkerPostMessage = ({ data }: MessageEvent) => {
    if (data.type === "navigate") {
      history.push(data.path);
    } else {
      console.warn("Unknown message type:", data.type);
    }
  };

  const handleDragEnter = (e: DragEvent) => e.preventDefault();
  const handleDragLeave = (e: DragEvent) => e.preventDefault();
  const handleDragOver = (e: DragEvent) => e.preventDefault();
  const handleDrop = (e: DragEvent) => e.preventDefault();

  /** Load initial data when a user is logged in */
  const loadAccountData = () => {
    if (!account) return;

    dispatch(
      expandHomeTimeline({}, () => {
        dispatch(fetchSuggestionsForTimeline());
      })
    );

    dispatch(expandNotifications())
      // @ts-ignore
      .then(() => dispatch(fetchMarker(["notifications"])))
      .catch(console.error);

    if (account.staff) {
      dispatch(fetchReports({ resolved: false }));
      dispatch(fetchUsers({}, 1, null, 50, BuildConfig.BACKEND_URL));
    }

    setTimeout(() => dispatch(fetchFilters()), 500);

    if (account.locked) {
      setTimeout(() => dispatch(fetchFollowRequests()), 700);
    }

    setTimeout(() => dispatch(fetchScheduledStatuses()), 900);
  };

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener(
        "message",
        handleServiceWorkerPostMessage
      );
    }

    if (window.Notification?.permission === "default") {
      window.setTimeout(() => Notification.requestPermission(), 120 * 1000);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDrop);
    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDrop);
    };
  }, []);

  useUserStream();

  // The user has logged in
  useEffect(() => {
    loadAccountData();
  }, [!!account]);

  /*  TODO: Implement push notifications
  useEffect(() => {
   dispatch(registerPushNotifications());
  }, [vapidKey]);
*/

  const shouldHideFAB = (): boolean => {
    const path = location.pathname;
    return Boolean(
      path.match(/^\/posts\/|^\/search|^\/getting-started|^\/chats/)
    );
  };

  // Wait for login to succeed or fail
  if (me === null) return null;

  const style: React.CSSProperties = {
    pointerEvents: dropdownMenuIsOpen ? "none" : undefined,
  };

  return (
    <GlobalHotkeys node={node}>
      <div ref={node} style={style}>
        <div
          className={clsx(
            "pointer-events-none fixed z-[90] h-screen w-screen transition",
            {
              "backdrop-blur": isDragging,
            }
          )}
        />

        <BackgroundShapes />

        <div className="z-10 flex flex-col">
          <Navbar />

          <SwitchingColumnsArea>{children}</SwitchingColumnsArea>

          {me && !shouldHideFAB() && (
            <div className="fixed bottom-24 right-4 z-40 transition-all lg:hidden rtl:left-4 rtl:right-auto">
              <FloatingActionButton />
            </div>
          )}

          {me && (
            <Suspense>
              <SidebarMenu />
            </Suspense>
          )}

          {me && (
            <div className="hidden xl:block">
              <Suspense
                fallback={
                  <div className="fixed bottom-0 z-[99] flex h-16 w-96 animate-pulse flex-col rounded-t-lg bg-white shadow-3xl ltr:right-5 rtl:left-5 dark:bg-gray-900" />
                }
              >
                {/* <ChatWidget /> */}
              </Suspense>
            </div>
          )}

          <ThumbNavigation />

          <Suspense>
            <ProfileHoverCard />
          </Suspense>

          <Suspense>
            <StatusHoverCard />
          </Suspense>
        </div>
      </div>
    </GlobalHotkeys>
  );
};

export default UI;
