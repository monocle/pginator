import React from "react";
import type { RowSqlStatementProps } from "../interface";

export default function InsertRowSQL({
  table,
  colNameFields,
}: RowSqlStatementProps) {
  const colNamesStr = colNameFields.map(([colName]) => colName).join(", ");
  const colValuesStr = colNameFields
    .map(([, field]) => field.value)
    .filter((val) => val)
    .join(", ");

  return (
    <div>
      <h3 className="heading-3 mb-4">SQL Statement</h3>
      <code>INSERT INTO {table.table_name} </code>
      <code className="block">&nbsp;&nbsp;({colNamesStr})</code>
      <code className="block">VALUES</code>
      {colValuesStr && (
        <code className="block">&nbsp;&nbsp;({colValuesStr});</code>
      )}
    </div>
  );
}
