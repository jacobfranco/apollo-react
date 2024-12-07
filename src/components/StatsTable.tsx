import React from "react";
import SortingHeaders from "./SortingHeaders";

type Column<T> = {
  label: string;
  key: string;
  className?: string;
  render?: (item: T) => React.ReactNode;
};

type SortConfig = {
  key: string;
  direction: "asc" | "desc";
};

interface StatsTableProps<T> {
  columns: Column<T>[];
  data: T[];
  sortConfig?: SortConfig;
  onSort?: (key: string) => void;
  gridTemplateColumns?: string;
  rowKey?: (item: T, index: number) => string | number;
  renderRow?: (item: T) => React.ReactNode;
}

function StatsTable<T>({
  columns,
  data,
  sortConfig,
  onSort,
  gridTemplateColumns,
  rowKey,
  renderRow,
}: StatsTableProps<T>) {
  const gridStyle = {
    gridTemplateColumns:
      gridTemplateColumns || `repeat(${columns.length}, 1fr)`,
  };

  return (
    <div className="w-full">
      {onSort && sortConfig && (
        <div className="grid mb-3" style={gridStyle}>
          {columns.map((column, index) => (
            <div key={column.key} className={column.className}>
              <SortingHeaders
                label={column.label}
                sortKey={column.key}
                sortConfig={sortConfig}
                onSort={onSort}
              />
            </div>
          ))}
        </div>
      )}

      <div>
        {data.map((item, index) =>
          renderRow ? (
            renderRow(item)
          ) : (
            <div
              key={rowKey ? rowKey(item, index) : index}
              className="grid bg-primary-200 dark:bg-secondary-500 rounded-md mb-1"
              style={gridStyle}
            >
              {columns.map((column) => (
                <div key={column.key} className={`${column.className} p-2`}>
                  {column.render
                    ? column.render(item)
                    : (item as any)[column.key]}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default StatsTable;
