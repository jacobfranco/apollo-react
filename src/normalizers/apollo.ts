import {
    Map as ImmutableMap,
    List as ImmutableList,
    Record as ImmutableRecord,
    fromJS,
  } from 'immutable';
  
  import { toTailwind } from 'src/utils/tailwind';
  import { generateAccent } from 'src/utils/theme';
  
  const DEFAULT_COLORS = ImmutableMap<string, any>({
    success: ImmutableMap({
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    }),
    danger: ImmutableMap({
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    }),
    'greentext': '#789922',
  });
  
  export const ApolloConfigRecord = ImmutableRecord({
    appleAppId: null,
    authProvider: '',
    logo: '',
    logoDarkMode: null,
    banner: '',
    brandColor: '', // Empty
    accentColor: '',
    colors: ImmutableMap(),
    copyright: `♥${new Date().getFullYear()}. Copying is an act of love. Please copy and share.`,
    customCss: ImmutableList<string>(),
    defaultSettings: ImmutableMap<string, any>(),
    extensions: ImmutableMap(),
    gdpr: false,
    gdprUrl: '',
    greentext: false,
    verifiedIcon: '',
    verifiedCanEditName: false,
    displayFqn: true,
    aboutPages: ImmutableMap<string, ImmutableMap<string, unknown>>(),
    authenticatedProfile: true,
    linkFooterMessage: '',
    links: ImmutableMap<string, string>(),
    displayCta: true,
    /** Whether to inject suggested profiles into the Home feed. */
    feedInjection: true,
    tileServer: '',
    tileServerAttribution: '',
    redirectRootNoLogin: '',
    /**
     * Whether to use the preview URL for media thumbnails.
     * On some platforms this can be too blurry without additional configuration.
     */
    mediaPreview: false,
    sentryDsn: undefined as string | undefined,
  }, 'ApolloConfig');
  
  type ApolloConfigMap = ImmutableMap<string, any>;
  
  const normalizeBrandColor = (ApolloConfig: ApolloConfigMap): ApolloConfigMap => {
    const brandColor = ApolloConfig.get('brandColor') || ApolloConfig.getIn(['colors', 'primary', '500']) || '';
    return ApolloConfig.set('brandColor', brandColor);
  };
  
  const normalizeAccentColor = (ApolloConfig: ApolloConfigMap): ApolloConfigMap => {
    const brandColor = ApolloConfig.get('brandColor');
  
    const accentColor = ApolloConfig.get('accentColor')
      || ApolloConfig.getIn(['colors', 'accent', '500'])
      || (brandColor ? generateAccent(brandColor) : '');
  
    return ApolloConfig.set('accentColor', accentColor);
  };
  
  const normalizeColors = (ApolloConfig: ApolloConfigMap): ApolloConfigMap => {
    const colors = DEFAULT_COLORS.mergeDeep(ApolloConfig.get('colors'));
    return toTailwind(ApolloConfig.set('colors', colors));
  };
  
  const maybeAddMissingColors = (ApolloConfig: ApolloConfigMap): ApolloConfigMap => {
    const colors = ApolloConfig.get('colors');
  
    const missing = ImmutableMap({
      'gradient-start': colors.getIn(['primary', '500']),
      'gradient-end': colors.getIn(['accent', '500']),
      'accent-blue': colors.getIn(['primary', '600']),
    });
  
    return ApolloConfig.set('colors', missing.mergeDeep(colors));
  };
  
  export const normalizeApolloConfig = (ApolloConfig: Record<string, any>) => {
    return ApolloConfigRecord(
      ImmutableMap(fromJS(ApolloConfig)).withMutations(ApolloConfig => {
        normalizeBrandColor(ApolloConfig);
        normalizeAccentColor(ApolloConfig);
        normalizeColors(ApolloConfig);
        maybeAddMissingColors(ApolloConfig);
      }),
    );
  };