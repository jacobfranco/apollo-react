import {
  Map as ImmutableMap,
  List as ImmutableList,
  Record as ImmutableRecord,
  fromJS,
} from "immutable";

import { toTailwind } from "src/utils/tailwind";
import { generateAccent } from "src/utils/theme";

import type { FooterItem } from "src/types/apollo";

const DEFAULT_COLORS = ImmutableMap<string, any>({
  success: ImmutableMap({
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  }),
  danger: ImmutableMap({
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  }),
  greentext: "#789922",
});

export const ApolloConfigRecord = ImmutableRecord(
  {
    appleAppId: null,
    authProvider: "",
    logo: "",
    logoDarkMode: null,
    banner: "",
    brandColor: "",
    accentColor: "",
    colors: ImmutableMap(),
    copyright: `© Apollo Fantasy Inc. ${new Date().getFullYear()}
  This software is distributed under the GNU Affero General Public License.
  `,
    customCss: ImmutableList<string>(),
    defaultSettings: ImmutableMap<string, any>(),
    extensions: ImmutableMap(),
    gdpr: false,
    gdprUrl: "",
    greentext: false,
    navlinks: ImmutableMap({
      homeFooter: ImmutableList<FooterItem>(),
    }),
    allowedEmoji: ImmutableList<string>(["👍", "❤️", "😆", "😮", "😢", "😩"]),
    verifiedIcon: "",
    verifiedCanEditName: false,
    aboutPages: ImmutableMap<string, ImmutableMap<string, unknown>>(),
    authenticatedProfile: true,
    linkFooterMessage: "",
    links: ImmutableMap<string, string>(),
    displayCta: true,
    /** Whether to inject suggested profiles into the Home feed. */
    feedInjection: true,
    tileServer: "",
    tileServerAttribution: "",
    redirectRootNoLogin: "",
    /**
     * Whether to use the preview URL for media thumbnails.
     * On some platforms this can be too blurry without additional configuration.
     */
    mediaPreview: false,
    sentryDsn: undefined as string | undefined,
  },
  "ApolloConfig"
);

export const FooterItemRecord = ImmutableRecord({
  title: "",
  url: "",
});

type ApolloConfigMap = ImmutableMap<string, any>;

const normalizeFooterLinks = (
  apolloConfig: ApolloConfigMap
): ApolloConfigMap => {
  const path = ["navlinks", "homeFooter"];
  const items = (
    apolloConfig.getIn(path, ImmutableList()) as ImmutableList<any>
  ).map(FooterItemRecord);
  return apolloConfig.setIn(path, items);
};

const normalizeBrandColor = (
  apolloConfig: ApolloConfigMap
): ApolloConfigMap => {
  const brandColor =
    apolloConfig.get("brandColor") ||
    apolloConfig.getIn(["colors", "primary", "500"]) ||
    "";
  return apolloConfig.set("brandColor", brandColor);
};

const normalizeAccentColor = (
  apolloConfig: ApolloConfigMap
): ApolloConfigMap => {
  const brandColor = apolloConfig.get("brandColor");

  const accentColor =
    apolloConfig.get("accentColor") ||
    apolloConfig.getIn(["colors", "accent", "500"]) ||
    (brandColor ? generateAccent(brandColor) : "");

  return apolloConfig.set("accentColor", accentColor);
};

const normalizeColors = (apolloConfig: ApolloConfigMap): ApolloConfigMap => {
  const colors = DEFAULT_COLORS.mergeDeep(apolloConfig.get("colors"));
  return toTailwind(apolloConfig.set("colors", colors));
};

const maybeAddMissingColors = (
  apolloConfig: ApolloConfigMap
): ApolloConfigMap => {
  const colors = apolloConfig.get("colors");

  const missing = ImmutableMap({
    "gradient-start": colors.getIn(["primary", "500"]),
    "gradient-end": colors.getIn(["accent", "500"]),
    "accent-blue": colors.getIn(["primary", "600"]),
  });

  return apolloConfig.set("colors", missing.mergeDeep(colors));
};

export const normalizeApolloConfig = (apolloConfig: Record<string, any>) => {
  return ApolloConfigRecord(
    ImmutableMap(fromJS(apolloConfig)).withMutations((apolloConfig) => {
      normalizeBrandColor(apolloConfig);
      normalizeAccentColor(apolloConfig);
      normalizeColors(apolloConfig);
      maybeAddMissingColors(apolloConfig);
      normalizeFooterLinks(apolloConfig);
    })
  );
};
