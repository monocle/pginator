import React from "react";
import type { ServerTableColumn, TableAction } from "../interface";
import Button from "../common/components/Button";

interface Props {
  columns: ServerTableColumn[];
  action?: TableAction;
  onRemoveColumn: (columnName: string) => void;
}

export default function ColumnsSQL({ columns, action, onRemoveColumn }: Props) {
  return (
    <>
      {columns.map((column, i, arr) => (
        <div key={column.name}>
          <code>
            &nbsp;&nbsp;
            {action ? action + " " : ""}
            {column.name} {column.data_type}
            {!(i === arr.length - 1) && ", "}{" "}
          </code>
          <Button
            text="X"
            style="danger"
            dataTestId={`remove-column-${column.name}`}
            onClick={() => onRemoveColumn(column.name)}
          />
        </div>
      ))}
    </>
  );
}
