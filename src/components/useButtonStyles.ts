import clsx from "clsx";

const themes = {
  primary: clsx(
    "bg-gradient-to-br from-primary-600 via-primary-500 to-primary-500",
    "hover:from-primary-500 hover:via-primary-400 hover:to-primary-400",
    "text-secondary-900",
    "shadow-lg shadow-primary-800/40",
    "ring-primary-500/50 hover:ring-primary-400/50",
    "backdrop-blur-sm"
  ),

  secondary: clsx(
    "bg-gradient-to-br from-secondary-700 to-secondary-800",
    "hover:from-secondary-600 hover:to-secondary-700",
    "text-secondary-200 hover:text-white",
    "shadow-lg shadow-secondary-900/50",
    "ring-secondary-700/50",
    "backdrop-blur-sm"
  ),

  tertiary: clsx(
    "bg-gradient-to-br from-primary-200 to-primary-200 dark:from-secondary-800 dark:to-secondary-800",
    "hover:from-primary-100 hover:to-primary-200 dark:hover:from-secondary-600 dark:hover:to-secondary-700",
    "text-black dark:text-gray-200",
    "shadow-md shadow-gray-500/30 dark:shadow-gray-900/30",
    "backdrop-blur-sm"
  ),

  accent: clsx(
    "bg-gradient-to-br from-secondary-500 via-secondary-600 to-secondary-700",
    "hover:from-secondary-500 hover:via-secondary-500 hover:to-secondary-700",
    "text-white",
    "shadow-lg shadow-secondary-600/30",
    "backdrop-blur-sm"
  ),

  danger: clsx(
    "bg-gradient-to-br from-danger-500 via-danger-500 to-danger-400",
    "hover:from-danger-400 hover:via-danger-500 hover:to-danger-600",
    "text-white font-bold",
    "shadow-lg shadow-danger-600/30",
    "backdrop-blur-sm"
  ),

  transparent: clsx(
    "bg-transparent",
    "hover:bg-gray-200/20 dark:hover:bg-gray-800/20",
    "text-primary-600 dark:text-accent-blue",
    "backdrop-blur-sm"
  ),

  outline: clsx(
    "border-2",
    "bg-transparent",
    "text-gray-100",
    "hover:bg-white/10",
    "backdrop-blur-sm"
  ),

  muted: clsx(
    "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900",
    "hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-800",
    "text-gray-700 dark:text-gray-300",
    "shadow-sm shadow-gray-500/30 dark:shadow-gray-900/30",
    "backdrop-blur-sm"
  ),
};

const sizes = {
  xs: "px-3 py-1 text-xs",
  sm: "px-3 py-1.5 text-xs leading-4",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

type ButtonSizes = keyof typeof sizes;
type ButtonThemes = keyof typeof themes;

type IButtonStyles = {
  theme: ButtonThemes;
  block: boolean;
  disabled: boolean;
  size: ButtonSizes;
  className?: string;
};

const useButtonStyles = ({
  theme,
  block,
  disabled,
  size,
  className,
}: IButtonStyles) => {
  const buttonStyle = clsx(
    // Base styles
    "inline-flex items-center place-content-center rounded-md",
    "transition-all duration-300",
    "group hover:scale-102",

    // Theme styles
    themes[theme],

    // Size styles
    sizes[size],

    // Conditional styles
    {
      "select-none opacity-75 cursor-default": disabled,
      "flex w-full justify-center": block,
    },

    // Custom className
    className
  );

  return buttonStyle;
};

export { useButtonStyles, type ButtonSizes, type ButtonThemes };
