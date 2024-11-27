// src/components/StatsTable.tsx

import React from "react";
import SortingHeaders from "./SortingHeaders";

type Column<T> = {
  label: string;
  key: string;
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
  return (
    <>
      {onSort && sortConfig && (
        <SortingHeaders
          columns={columns}
          sortConfig={sortConfig}
          onSort={onSort}
          gridTemplateColumns={gridTemplateColumns}
        />
      )}
      <div className="my-2" />
      {data.map((item, index) =>
        renderRow ? (
          <React.Fragment key={rowKey ? rowKey(item, index) : index}>
            {renderRow(item)}
          </React.Fragment>
        ) : (
          <div
            key={rowKey ? rowKey(item, index) : index}
            className="grid gap-0"
            style={{ gridTemplateColumns }}
          >
            {columns.map((column) => (
              <div key={column.key} className="p-2">
                {column.render
                  ? column.render(item)
                  : (item as any)[column.key]}
              </div>
            ))}
          </div>
        )
      )}
    </>
  );
}

export default StatsTable;
