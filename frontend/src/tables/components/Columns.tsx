import { ServerTableColumn } from "../../interface";

interface Props {
  columns: ServerTableColumn[];
}

export default function Columns({ columns }: Props) {
  const firstColumn = columns[0];

  if (!firstColumn.name) return <div>Table has no columns</div>;

  return (
    <ul>
      {columns.map((column) => (
        <li key={column.name}>
          {column.name} {column.data_type}
        </li>
      ))}
    </ul>
  );
}
