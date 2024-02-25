import clsx from 'clsx';
import React, { useEffect } from 'react';

import {
  useSettings,
  useApolloConfig,
  useTheme,
  useLocale,
} from 'src/hooks';
import { normalizeApolloConfig } from 'src/normalizers';
// import { startSentry } from 'soapbox/sentry'; TODO: Implement sentry
import { generateThemeCss } from 'src/utils/theme';

const Helmet = React.lazy(() => import('src/components/Helmet'));

interface IApolloHead {
  children: React.ReactNode;
}

/** Injects metadata into site head with Helmet. */
const ApolloHead: React.FC<IApolloHead> = ({ children }) => {
  const { locale, direction } = useLocale();
  const { reduceMotion, underlineLinks, demetricator } = useSettings();
  const apolloConfig = useApolloConfig();

  const darkMode = useTheme() === 'dark';
  const themeCss = generateThemeCss(apolloConfig);
  // const dsn = apolloConfig.sentryDsn;

  const bodyClass = clsx('h-full bg-white text-base dark:bg-gray-800', {
    'no-reduce-motion': !reduceMotion,
    'underline-links': underlineLinks,
    'demetricator': demetricator,
  });

  /* TODO: Implement sentry
  useEffect(() => {
    if (dsn) {
      startSentry(dsn).catch(console.error);
    }
  }, [dsn]);
*/ 
  return (
    <>
      <Helmet>
        <html lang={locale} className={clsx('h-full', { dark: darkMode })} />
        <body className={bodyClass} dir={direction} />
        {themeCss && <style id='theme' type='text/css'>{`:root{${themeCss}}`}</style>}
        {darkMode && <style type='text/css'>{':root { color-scheme: dark; }'}</style>}
        <meta name='theme-color' content={apolloConfig.brandColor} />
      </Helmet>

      {children}
    </>
  );
};

export default ApolloHead;