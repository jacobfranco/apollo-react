import React from "react";
import clsx from "clsx";
import { useTheme } from "src/hooks";
import bigLogo from "src/assets/images/big_logo.png";

interface ISiteLogo extends React.ComponentProps<"img"> {
  className?: string;
  theme?: "dark" | "light";
}

const SiteLogo: React.FC<ISiteLogo> = ({ className, theme, ...rest }) => {
  let darkMode = useTheme() === "dark";
  if (theme === "dark") darkMode = true;
  else if (theme === "light") darkMode = false;

  const apolloLogo = darkMode ? bigLogo : bigLogo; // TODO: Make this responsive for dark / light mode if necessary

  return (
    <img
      className={clsx("object-contain", className)}
      src={apolloLogo}
      {...rest}
    />
  );
};

export default SiteLogo;
