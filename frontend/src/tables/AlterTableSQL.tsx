import React from "react";
import type { ServerTableColumn, TableAction } from "../interface";
import ColumnsSQL from "./ColumnsSQL";

interface Props {
  tableName: string;
  action: TableAction;
  columns: ServerTableColumn[];
  remainingSql: string;
  onRemoveColumn: (name: string) => void;
}

export default function AlterTableSQL({
  tableName,
  action,
  columns,
  remainingSql,
  onRemoveColumn,
}: Props) {
  return (
    <div>
      <h3 className="heading-3  mb-4">SQL Statement</h3>
      <code>ALTER TABLE {tableName} </code>
      <div>
        <code>
          {columns.length > 0 ? (
            <ColumnsSQL
              columns={columns}
              action={action}
              onRemoveColumn={onRemoveColumn}
            />
          ) : (
            <>
              &nbsp;&nbsp;{action} {remainingSql};
            </>
          )}
        </code>
      </div>
    </div>
  );
}
