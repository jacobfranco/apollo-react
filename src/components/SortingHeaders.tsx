import React from "react";

type SortConfig = {
  key: string;
  direction: "asc" | "desc";
};

interface SortingHeadersProps {
  label: string;
  sortKey: string;
  sortConfig: SortConfig;
  onSort: (key: string) => void;
}

const SortingHeaders: React.FC<SortingHeadersProps> = ({
  label,
  sortKey,
  sortConfig,
  onSort,
}) => (
  <button
    onClick={() => onSort(sortKey)}
    className="flex items-center justify-center w-full px-2 py-1 bg-primary-200 dark:bg-secondary-500 text-black dark:text-white font-semibold hover:bg-primary-300"
  >
    {label}
    {sortConfig?.key === sortKey ? (
      sortConfig.direction === "asc" ? (
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      )
    ) : (
      <span className="ml-1">—</span>
    )}
  </button>
);

export default React.memo(SortingHeaders);
