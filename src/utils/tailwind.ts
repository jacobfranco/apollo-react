import { Map as ImmutableMap, fromJS } from "immutable";

import tintify from "src/utils/colors";
import { generateAccent, generateNeutral } from "src/utils/theme";

import type { TailwindColorPalette } from "src/types/colors";

type ApolloConfig = ImmutableMap<string, any>;
type ApolloColors = ImmutableMap<string, any>;

/** Check if the value is a valid hex color */
const isHex = (value: any): boolean => /^#([0-9A-F]{3}){1,2}$/i.test(value);

/** Expand hex colors into tints */
export const expandPalette = (
  palette: TailwindColorPalette
): TailwindColorPalette => {
  // Generate palette only for present colors
  return Object.entries(palette).reduce(
    (result: TailwindColorPalette, colorData) => {
      const [colorName, color] = colorData;

      // Conditionally handle hex color and Tailwind color object
      if (typeof color === "string" && isHex(color)) {
        result[colorName] = tintify(color);
      } else if (color && typeof color === "object") {
        result[colorName] = color;
      }

      return result;
    },
    {}
  );
};

// Generate accent color only if brandColor is present
const maybeGenerateAccentColor = (brandColor: any): string | null => {
  return isHex(brandColor) ? generateAccent(brandColor) : null;
};

/** Build a color object from legacy colors */
export const fromLegacyColors = (
  apolloConfig: ApolloConfig
): TailwindColorPalette => {
  const brandColor = apolloConfig.get("brandColor");
  const accentColor = apolloConfig.get("accentColor");
  const accent = isHex(accentColor)
    ? accentColor
    : maybeGenerateAccentColor(brandColor);

  return expandPalette({
    primary: isHex(brandColor) ? brandColor : null,
    secondary: accent,
    accent,
    gray: (isHex(brandColor) ? generateNeutral(brandColor) : null) as any,
  });
};

/** Convert Apollo Config into Tailwind colors */
export const toTailwind = (apolloConfig: ApolloConfig): ApolloConfig => {
  const colors: ApolloColors = ImmutableMap(apolloConfig.get("colors"));
  const legacyColors = ImmutableMap(
    fromJS(fromLegacyColors(apolloConfig))
  ) as ApolloColors;

  return apolloConfig.set("colors", legacyColors.mergeDeep(colors));
};
