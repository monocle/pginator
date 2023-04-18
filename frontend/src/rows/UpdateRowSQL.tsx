import { RowSQLComponentProps } from "../interface";

export default function InsertRowSQL({
  tableName,
  colNameFields,
  primaryRowKey,
}: RowSQLComponentProps) {
  if (!primaryRowKey) throw new Error("Primary key required for UpdateRowSQL");

  const colNamesFieldsNoPrimaryKey = colNameFields.filter(
    ([colName, _]) => colName !== primaryRowKey.name
  );
  const colNamesStr = colNamesFieldsNoPrimaryKey
    .map(([colName, _]) => colName)
    .join(", ");
  const colValuesStr = colNamesFieldsNoPrimaryKey
    .map(([_, input]) => input.value)
    .filter((val) => val)
    .join(", ");

  return (
    <div>
      <h3 className="heading-3 mb-4">SQL Statement</h3>
      <code>UPDATE {tableName} </code>
      <code className="block">&nbsp;&nbsp;SET ({colNamesStr})</code>
      <code className="block">=</code>
      {colValuesStr && (
        <code className="block">&nbsp;&nbsp;({colValuesStr})</code>
      )}
      <code className="block">
        WHERE {primaryRowKey.name} = '{primaryRowKey.value}'
      </code>
    </div>
  );
}
