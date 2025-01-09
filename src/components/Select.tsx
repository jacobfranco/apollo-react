import clsx from "clsx";
import { forwardRef } from "react";

interface ISelect extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: Iterable<React.ReactNode>;
  full?: boolean;
}

/** Multiple-select dropdown. */
const Select = forwardRef<HTMLSelectElement, ISelect>((props, ref) => {
  const { children, className, full = true, ...filteredProps } = props;

  return (
    <select
      ref={ref}
      className={clsx(
        "truncate rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 disabled:opacity-50 bg-primary-200 black:bg-black dark:border-gray-800 dark:bg-black dark:text-gray-100 dark:ring-1 dark:ring-gray-800 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm",
        className,
        {
          "w-full": full,
        }
      )}
      {...filteredProps}
    >
      {children}
    </select>
  );
});

export default Select;
