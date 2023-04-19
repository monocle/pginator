import { RowSqlStatementProps } from "../interface";

export default function InsertRowSQL({
  table,
  row,
  colNameFields,
}: RowSqlStatementProps) {
  const colNamesFieldsNoPrimaryKey = colNameFields.filter(
    ([colName, _]) => colName !== table.primary_key
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
      <code>UPDATE {table.table_name} </code>
      <code className="block">&nbsp;&nbsp;SET ({colNamesStr})</code>
      <code className="block">=</code>
      {colValuesStr && (
        <code className="block">&nbsp;&nbsp;({colValuesStr})</code>
      )}
      <code className="block">
        WHERE {table.primary_key} = '{row[table.primary_key]}';
      </code>
    </div>
  );
}
