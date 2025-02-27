import { lazy } from "react";

export const ModalContainer = lazy(
  () => import("../containers/ModalContainer")
);
export const OnboardingFlowModal = lazy(
  () => import("./modals/OnboardingFlowModal")
);
export const Login = lazy(() => import("./Login"));
export const Signup = lazy(() => import("./Signup"));
export const TrendsPanel = lazy(() => import("./TrendsPanel"));
export const TrendingSpacesPanel = lazy(() => import("./TrendingSpacesPanel"));
export const WhoToFollowPanel = lazy(() => import("./WhoToFollowPanel"));
export const SignUpPanel = lazy(() => import("./SignUpPanel"));
export const CtaBanner = lazy(() => import("./CtaBanner"));
export const HomeTimeline = lazy(() => import("./HomeTimeline"));
export const EmailConfirmation = lazy(() => import("./EmailConfirmation"));
export const ChatWidget = lazy(() => import("./chats/components/ChatWidget"));
export const SidebarMenu = lazy(() => import("./SidebarMenu"));
export const ProfileHoverCard = lazy(() => import("./ProfileHoverCard"));
export const StatusHoverCard = lazy(() => import("./StatusHoverCard"));
export const Logout = lazy(() => import("./Logout"));
export const PasswordReset = lazy(() => import("./PasswordReset"));
export const PasswordResetConfirm = lazy(
  () => import("./PasswordResetConfirm")
);
export const SignupInvite = lazy(() => import("./SignupInvite"));
export const Landing = lazy(() => import("./Landing"));
export const TermsPage = lazy(() => import("./Terms"));
export const PrivacyPage = lazy(() => import("./Privacy"));
export const ComposeEditor = lazy(() => import("./compose/editor"));
export const MediaGallery = lazy(() => import("./MediaGallery"));
export const Video = lazy(() => import("./Video"));
export const Audio = lazy(() => import("./Audio"));
export const AccountModerationModal = lazy(
  () => import("./modals/AccountModerationModal")
);
export const ActionsModal = lazy(() => import("./modals/ActionsModal"));
export const BoostModal = lazy(() => import("./modals/BoostModal"));
export const ComposeModal = lazy(() => import("./modals/ComposeModal"));
export const ConfirmationModal = lazy(
  () => import("./modals/ConfirmationModal")
);
export const EmojiPickerModal = lazy(() => import("./modals/EmojiPickerModal"));
export const FamiliarFollowersModal = lazy(
  () => import("./modals/FamiliarFollowersModal")
);
export const HotkeysModal = lazy(() => import("./modals/HotkeysModal"));
export const LikesModal = lazy(() => import("./modals/LikesModal"));
export const MediaModal = lazy(() => import("./modals/MediaModal"));
export const MentionsModal = lazy(() => import("./modals/MentionsModal"));
export const MissingDescriptionModal = lazy(
  () => import("./modals/MissingDescriptionModal")
);
export const MuteModal = lazy(() => import("./modals/MuteModal"));
export const ReplyMentionsModal = lazy(
  () => import("./modals/ReplyMentionsModal")
);
export const ReportModal = lazy(() => import("./modals/ReportModal"));
export const RepostsModal = lazy(() => import("./modals/RepostsModal"));
export const UnauthorizedModal = lazy(
  () => import("./modals/UnauthorizedModal")
);
export const VideoModal = lazy(() => import("./modals/VideoModal"));
export const UserPanel = lazy(() => import("./UserPanel"));
export const EmojiPicker = lazy(() => import("./emoji/components/EmojiPicker"));
export const Status = lazy(() => import("./Status"));
export const HashtagTimeline = lazy(() => import("./HashtagTimeline"));
export const SpaceTimeline = lazy(() => import("./SpaceTimeline"));
export const Notifications = lazy(() => import("./Notifications"));
export const FollowRequests = lazy(() => import("./FollowRequests"));
export const Blocks = lazy(() => import("./Blocks"));
export const Mutes = lazy(() => import("./Mutes"));
export const Filters = lazy(() => import("./Filters"));
export const EditFilter = lazy(() => import("./EditFilter"));
export const Search = lazy(() => import("./Search"));
export const Bookmarks = lazy(() => import("./Bookmarks"));
// export const ChatIndex = lazy(() => import("./chats"));
export const ScheduledStatuses = lazy(() => import("./ScheduledStatuses"));
export const FollowRecommendations = lazy(
  () => import("./FollowRecommendations")
);
export const NewStatus = lazy(() => import("./NewStatus"));
export const FollowedTags = lazy(() => import("./FollowedTags"));
export const SuggestedGroupsPanel = lazy(
  () => import("./SuggestedGroupsPanel")
);
export const DirectTimeline = lazy(() => import("./DirectTimeline"));
export const Conversations = lazy(() => import("./Conversations"));
export const AccountGallery = lazy(() => import("./AccountGallery"));
export const ProfileInfoPanel = lazy(() => import("./ProfileInfoPanel"));
export const ProfileMediaPanel = lazy(() => import("./ProfileMediaPanel"));
export const ProfileFieldsPanel = lazy(() => import("./ProfileFieldsPanel"));
export const AccountTimeline = lazy(() => import("./AccountTimeline"));
export const Followers = lazy(() => import("./Followers"));
export const Following = lazy(() => import("./Following"));
export const LikedStatuses = lazy(() => import("./LikedStatuses"));
export const PinnedStatuses = lazy(() => import("./PinnedStatuses"));
export const Quotes = lazy(() => import("./Quotes"));
export const GenericNotFound = lazy(() => import("./GenericNotFound"));
export const Settings = lazy(() => import("./Settings"));
export const EditProfile = lazy(() => import("./EditProfile"));
export const EditEmail = lazy(() => import("./EditEmail"));
export const EditPassword = lazy(() => import("./EditPassword"));
export const DeleteAccount = lazy(() => import("./DeleteAccount"));
export const AuthTokenList = lazy(() => import("./AuthTokenList"));
export const ServerInfo = lazy(() => import("./ServerInfo"));
export const Share = lazy(() => import("./Share"));
export const SpacePage = lazy(() => import("./SpacePage"));
export const Spaces = lazy(() => import("./Spaces"));
export const ESportPage = lazy(() => import("./ESportPage"));
export const ESports = lazy(() => import("./ESports"));
export const CommunityTab = lazy(() => import("./CommunityTab"));
export const ScoreboardDetailsTab = lazy(
  () => import("./ScoreboardDetailsTab")
);
export const ScheduleTab = lazy(() => import("./ScheduleTab"));
export const TeamsTab = lazy(() => import("./TeamsTab"));
export const PlayersTab = lazy(() => import("./PlayersTab"));
export const FantasyTab = lazy(() => import("./FantasyTab"));
export const MediaTab = lazy(() => import("./MediaTab"));
export const EsportsTab = lazy(() => import("./EsportsTab"));
export const LolRegionFilterModal = lazy(
  () => import("./modals/LolRegionFilterModal")
);
export const TeamDetail = lazy(() => import("./TeamDetail"));
export const PlayerDetail = lazy(() => import("./PlayerDetail"));
export const StreamPage = lazy(() => import("./StreamPage"));
export const LatestAccountsPanel = lazy(() => import("./LatestAccountsPanel"));
export const AboutPage = lazy(() => import("./About"));
export const ContactPage = lazy(() => import("./Contact"));
export const Admin = lazy(() => import("./Admin"));
export const ModerationLog = lazy(() => import("./ModerationLog"));
export const UserIndex = lazy(() => import("./UserIndex"));
export const Reports = lazy(() => import("./Reports"));
export const AdminSpaces = lazy(() => import("./AdminSpaces"));
// export const PromoPanel = lazy(() => import('./PromoPanel')); TODO: Implement
