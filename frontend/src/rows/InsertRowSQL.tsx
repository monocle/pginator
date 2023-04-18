import { FormField } from "../interface";

interface Props {
  tableName: string;
  colNameFields: [string, FormField][];
}

export default function InsertRowSQL({ tableName, colNameFields }: Props) {
  const colNamesStr = colNameFields.map(([colName, _]) => colName).join(", ");
  const colValuesStr = colNameFields
    .map(([_, input]) => input.value)
    .filter((val) => val)
    .join(", ");

  return (
    <div>
      <h3 className="heading-3 mb-4">SQL Statement</h3>
      <code>INSERT INTO {tableName} </code>
      <code className="block">&nbsp;&nbsp;({colNamesStr})</code>
      <code className="block">VALUES</code>
      {colValuesStr && (
        <code className="block">&nbsp;&nbsp;({colValuesStr})</code>
      )}
    </div>
  );
}
