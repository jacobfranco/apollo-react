import {
  Map as ImmutableMap,
  List as ImmutableList,
  Record as ImmutableRecord,
  fromJS,
} from "immutable";

import { toTailwind } from "src/utils/tailwind";
import { generateAccent } from "src/utils/theme";

import type { FooterItem, PromoPanelItem } from "src/types/apollo";

const DEFAULT_COLORS = ImmutableMap<string, any>({
  info: ImmutableMap({
    50: "#e6f6ff",
    100: "#bae3ff",
    200: "#7cc4ff",
    300: "#45caff",
    400: "#0095ff",
    500: "#0077cc",
    600: "#005c99",
    700: "#004166",
    800: "#002633",
    900: "#001219",
  }),
  success: ImmutableMap({
    50: "#ecfdf4",
    100: "#c9fce3",
    200: "#9ff9d0",
    300: "#3dff9e",
    400: "#00d085",
    500: "#00a669",
    600: "#007d4d",
    700: "#005331",
    800: "#002a19",
    900: "#00150c",
  }),
  danger: ImmutableMap({
    50: "#fef1f5",
    100: "#ffd9e7",
    200: "#ffb3d0",
    300: "#ff5fb3",
    400: "#ff3b99",
    500: "#cc2f7a",
    600: "#99235c",
    700: "#66173d",
    800: "#330c1f",
    900: "#1a060f",
  }),
  misc: ImmutableMap({
    50: "#f3f0ff",
    100: "#e4dcff",
    200: "#c7b8ff",
    300: "#9f8dff",
    400: "#7b4dff",
    500: "#623eca",
    600: "#4a2e98",
    700: "#311f65",
    800: "#190f33",
    900: "#0c081a",
  }),
  greentext: "#789922",
});

export const PromoPanelItemRecord = ImmutableRecord({
  icon: "",
  text: "",
  url: "",
  textLocales: ImmutableMap<string, string>(),
});

export const PromoPanelRecord = ImmutableRecord({
  items: ImmutableList<PromoPanelItem>(),
});

export const ApolloConfigRecord = ImmutableRecord(
  {
    appleAppId: null,
    authProvider: "",
    logo: "",
    logoDarkMode: null,
    banner: "",
    brandColor: "#A981FC",
    accentColor: "110132",
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
    promoPanel: PromoPanelRecord(),
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
    "gradient-end": colors.getIn(["secondary", "700"]),
    "accent-blue": colors.getIn(["primary", "600"]),
  });

  return apolloConfig.set("colors", missing.mergeDeep(colors));
};

const normalizePromoPanel = (
  apolloConfig: ApolloConfigMap
): ApolloConfigMap => {
  const promoPanel = PromoPanelRecord(apolloConfig.get("promoPanel"));
  const items = promoPanel.items.map(PromoPanelItemRecord);
  return apolloConfig.set("promoPanel", promoPanel.set("items", items));
};

export const normalizeApolloConfig = (apolloConfig: Record<string, any>) => {
  return ApolloConfigRecord(
    ImmutableMap(fromJS(apolloConfig)).withMutations((apolloConfig) => {
      normalizeBrandColor(apolloConfig);
      normalizeAccentColor(apolloConfig);
      normalizeColors(apolloConfig);
      maybeAddMissingColors(apolloConfig);
      normalizeFooterLinks(apolloConfig);
      normalizePromoPanel(apolloConfig);
    })
  );
};
