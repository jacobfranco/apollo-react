// src/components/SortingHeaders.tsx

import React from "react";

type Column<T> = {
  label: string;
  key: string;
};

type SortConfig = {
  key: string;
  direction: "asc" | "desc";
};

interface SortingHeadersProps {
  columns: Column<any>[];
  sortConfig: SortConfig;
  onSort: (key: string) => void;
  gridTemplateColumns?: string;
}

const SortingHeaders: React.FC<SortingHeadersProps> = ({
  columns,
  sortConfig,
  onSort,
  gridTemplateColumns,
}) => (
  <div className="grid gap-0" style={{ gridTemplateColumns }}>
    {columns.map((column) => (
      <button
        key={column.key}
        onClick={() => onSort(column.key)}
        className="flex items-center justify-center w-full px-2 py-1 bg-primary-200 dark:bg-secondary-500 text-black dark:text-white font-semibold hover:bg-primary-300"
      >
        <span className="text-sm font-bold">{column.label}</span>
        <span className="ml-1 text-xs">
          {sortConfig?.key === column.key ? (
            sortConfig.direction === "asc" ? (
              // Up Arrow SVG
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 inline-block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            ) : (
              // Down Arrow SVG
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 inline-block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
            <span className="text-xs font-thin">—</span>
          )}
        </span>
      </button>
    ))}
  </div>
);

export default React.memo(SortingHeaders);
