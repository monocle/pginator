import { useContext, useState } from "react";
import { ServerTable, ServerRow } from "../interface";
import ErrorMessage from "../common/components/ErrorMessage";
import OutletContext from "../common/outletContext";
import { useCreateRow, useGetRows } from "./useRowsApi";
import InsertRowSQL from "./InsertRowSQL";
import MutateRowForm from "./MutateRowForm";
import Row from "./Row";

function createEmptyRow(table: ServerTable): ServerRow {
  return table.columns.reduce((row, col) => {
    if (col.name !== "id") {
      row[col.name] = "";
    }
    return row;
  }, {} as ServerRow);
}

interface Props {
  table: ServerTable;
}

export default function Rows({ table }: Props) {
  const numRowsPerFetch = 20;
  const [page, setPage] = useState(0);
  const { setOutlet } = useContext(OutletContext);
  const { data, error } = useGetRows(
    table.table_name,
    page * numRowsPerFetch,
    table.primary_key
  );

  const headerRow = data?.rows[0];
  const headers = headerRow
    ? [
        table.primary_key,
        ...Object.keys(headerRow).filter((key) => key !== table.primary_key),
      ]
    : [];

  const handlePrevious = () => {
    setPage((page) => Math.max(page - 1, 0));
  };

  const handleNext = () => {
    setPage((page) => page + 1);
  };

  const handleCreateNewRow = () => {
    setOutlet(
      <MutateRowForm
        action="Create"
        table={table}
        row={createEmptyRow(table)}
        SqlStatement={InsertRowSQL}
        useMutateRow={useCreateRow}
      />
    );
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-8">
          <h2 className="heading-2 mb-4">Table: {table.table_name}</h2>
          <div>
            <button
              className="mr-2 rounded-md bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
              disabled={page === 0}
              onClick={handlePrevious}
            >
              Previous
            </button>
            <button
              className="rounded-md bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
              disabled={!data?.rows || data.rows.length < 20}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
        <div className="flex gap-8">
          <a className="link" onClick={handleCreateNewRow}>
            Create New Row
          </a>
        </div>
      </div>

      {data?.rows && (
        <table className="w-full table-auto border-collapse border border-gray-500 dark:border-gray-400">
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="border border-gray-300 bg-gray-200 px-4 py-2 text-left dark:border-gray-700 dark:bg-gray-800"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <Row table={table} row={row} key={row[table.primary_key]} />
            ))}
          </tbody>
        </table>
      )}
      <ErrorMessage errorResponse={error} />
    </div>
  );
}
