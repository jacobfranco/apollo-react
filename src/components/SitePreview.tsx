import clsx from "clsx";
import React from "react";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";

import { defaultSettings } from "src/actions/settings";
import SiteLogo from "src/components/SiteLogo";
import BackgroundShapes from "src/components/BackgroundShapes";
import { useSystemTheme } from "src/hooks/useSystemTheme";
import { normalizeApolloConfig } from "src/normalizers/index";
import { generateThemeCss } from "src/utils/theme";

interface ISitePreview {
  /** Raw Apollo configuration. */
  apollo: any;
}

/** Renders a preview of the website's style with the configuration applied. */
const SitePreview: React.FC<ISitePreview> = ({ apollo }) => {
  const apolloConfig = useMemo(() => normalizeApolloConfig(apollo), [apollo]);
  const settings = defaultSettings.mergeDeep(apolloConfig.defaultSettings);

  const userTheme = settings.get("themeMode");
  const systemTheme = useSystemTheme();

  const dark =
    ["dark", "black"].includes(userTheme as string) ||
    (userTheme === "system" && systemTheme === "dark");

  // eslint-disable-next-line tailwindcss/no-custom-classname
  const bodyClass = clsx(
    "site-preview",
    "align-center relative flex justify-center text-base",
    "border border-solid border-gray-200 dark:border-gray-600",
    "h-40 overflow-hidden rounded-lg",
    {
      "bg-white": !dark,
      "bg-gray-900": dark,
    }
  );

  return (
    <div className={bodyClass}>
      {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
      <style>{`.site-preview {${generateThemeCss(apolloConfig)}}`}</style>
      <BackgroundShapes position="absolute" />

      <div className="absolute z-[2] self-center overflow-hidden rounded-lg bg-accent-500 p-2 text-white">
        <FormattedMessage id="site_preview.preview" defaultMessage="Preview" />
      </div>

      <div
        className={clsx("absolute inset-0 z-[1] flex h-12 shadow lg:h-16", {
          "bg-white": !dark,
          "bg-gray-800": dark,
        })}
      >
        <SiteLogo
          alt="Logo"
          className="h-5 w-auto self-center px-2 lg:h-6"
          theme={dark ? "dark" : "light"}
        />
      </div>
    </div>
  );
};

export default SitePreview;
