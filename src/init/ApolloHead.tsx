import clsx from "clsx";
import { lazy, useEffect } from "react";

import { useLocale } from "src/hooks/useLocale";
import { useSettings } from "src/hooks/useSettings";
import { useApolloConfig } from "src/hooks/useApolloConfig";
import { useTheme } from "src/hooks/useTheme";
import { normalizeApolloConfig } from "src/normalizers/index";
import { startSentry } from "src/sentry";
import { generateThemeCss } from "src/utils/theme";

const Helmet = lazy(() => import("src/components/Helmet"));

interface IApolloHead {
  children: React.ReactNode;
}

/** Injects metadata into site head with Helmet. */
const ApolloHead: React.FC<IApolloHead> = ({ children }) => {
  const { locale, direction } = useLocale();
  const { demo, reduceMotion, underlineLinks, demetricator } = useSettings();
  const apolloConfig = useApolloConfig();
  const theme = useTheme();

  const themeCss = generateThemeCss(
    demo ? normalizeApolloConfig({ brandColor: "#A981FC" }) : apolloConfig
  );
  const dsn = apolloConfig.sentryDsn;

  const bodyClass = clsx(
    "h-full bg-white text-base black:bg-black dark:bg-secondary-700",
    {
      "no-reduce-motion": !reduceMotion,
      "underline-links": underlineLinks,
      demetricator: demetricator,
      "font-sans": true,
      "!font-arabic": ["ar", "fa"].includes(locale),
      "!font-javanese": locale === "jv",
    }
  );

  useEffect(() => {
    if (dsn) {
      startSentry(dsn).catch(console.error);
    }
  }, [dsn]);

  useEffect(() => {
    // Log initial state
    console.log("InitialMount - Body style:", document.body.style.cssText);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          console.log("Body style changed:", {
            by: "ApolloHead",
            stackTrace: new Error().stack,
            oldValue: mutation.oldValue,
            newValue: document.body.style.cssText,
            attributeName: mutation.attributeName,
          });
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
      attributeOldValue: true,
    });

    return () => observer.disconnect();
  }, []);

  // Add this console.log right before the return
  console.log("ApolloHead rendering with bodyClass:", bodyClass);

  return (
    <>
      <Helmet>
        <html
          lang={locale}
          className={clsx("h-full", { dark: theme === "dark" })}
        />
        <body className={bodyClass} dir={direction} />
        {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
        {themeCss && (
          <style id="theme" type="text/css">{`:root{${themeCss}}`}</style>
        )}
        {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
        {["dark", "black"].includes(theme) && (
          <style type="text/css">{":root { color-scheme: dark; }"}</style>
        )}
        <meta name="theme-color" content={apolloConfig.brandColor} />
      </Helmet>

      {children}
    </>
  );
};

export default ApolloHead;
