import { ServerTableColumn } from "../../interface";

interface Props {
  columns: ServerTableColumn[];
}

export default function Columns({ columns }: Props) {
  const firstColumn = columns[0];

  if (!firstColumn.name) return <div>Table has no columns</div>;

  return (
    <ul className="mt-2 space-y-2 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
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
