import { useState } from "react";
import { ServerRow } from "../interface";
import ErrorMessage from "../common/components/ErrorMessage";
import { useGetRows } from "./useRowsApi";

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

export default function Rows() {
  const numRowsPerFetch = 20;
  const [page, setPage] = useState(0);
  const { data, error } = useGetRows("books", page * numRowsPerFetch);

  if (!data) return null;

  const headerRow = data.rows[0];
  const headers = headerRow
    ? ["id", ...Object.keys(headerRow).filter((key) => key !== "id")]
    : [];

  const handlePrevious = () => {
    setPage((page) => Math.max(page - 1, 0));
  };

  const handleNext = () => {
    setPage((page) => page + 1);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="heading-2 mb-4">Rows</h2>
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
            disabled={data.rows.length < 20}
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
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
      <ErrorMessage errorResponse={error} />
    </div>
  );
}
