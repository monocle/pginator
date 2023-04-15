import { useCallback, useContext, useState } from "react";
import { ServerRow, ServerTable } from "../interface";
import ErrorMessage from "../common/components/ErrorMessage";
import OutletContext from "../common/outletContext";
import { useGetRows } from "./useRowsApi";
import CreateRowForm from "./CreateRowForm";

function Row({ row }: { row: ServerRow }) {
  const { id, ...rest } = row;

  return (
    <>
      <tr>
        <td className="border border-gray-300 px-4 py-2 dark:border-gray-700">
          {id}
        </td>
        {Object.entries(rest).map(([prop, value]) => (
          <td
            key={prop}
            className="border border-gray-300 px-4 py-2 dark:border-gray-700"
          >
            {value}
          </td>
        ))}
      </tr>
    </>
  );
}

interface Props {
  table: ServerTable;
}

export default function Rows({ table }: Props) {
  const numRowsPerFetch = 20;
  const [page, setPage] = useState(0);
  const { setOutlet } = useContext(OutletContext);
  const { data, error } = useGetRows(table.table_name, page * numRowsPerFetch);

  const headerRow = data?.rows[0];
  const headers = headerRow
    ? ["id", ...Object.keys(headerRow).filter((key) => key !== "id")]
    : [];

  const handlePrevious = () => {
    setPage((page) => Math.max(page - 1, 0));
  };

  const handleNext = () => {
    setPage((page) => page + 1);
  };

  const handleCreateNewRow = () => {
    setOutlet(<CreateRowForm table={table} />);
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
              <Row row={row} key={row.id} />
            ))}
          </tbody>
        </table>
      )}
      <ErrorMessage errorResponse={error} />
    </div>
  );
}
