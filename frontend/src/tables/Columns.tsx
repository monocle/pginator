import React from "react";
import { ServerTableColumn } from "../interface";

interface Props {
  columns: ServerTableColumn[];
  className?: string;
}

export default function Columns({ className = "", columns }: Props) {
  const firstColumn = columns[0];

  if (!firstColumn?.name) return <div>Table has no columns</div>;

  return (
    <ul
      className={`space-y-2 rounded-lg bg-gray-100 p-4 dark:bg-gray-800 ${className}`}
    >
      {columns.map((column) => (
        <li className="flex text-sm font-medium" key={column.name}>
          <div className="w-1/2">{column.name}</div>
          <div className="w-1/2 text-gray-500 dark:text-gray-400">
            {column.data_type}
          </div>
        </li>
      ))}
    </ul>
  );
}
