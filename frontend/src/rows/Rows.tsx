import React, { useEffect, useState } from "react";
import type { ServerTable, ServerRow, RowId } from "../interface";
import useOutletContext from "../common/useOutletContext";
import ErrorMessage from "../common/components/ErrorMessage";
import Modal from "../common/components/Modal";
import { useGetRows, useCreateRow, useDeleteRow } from "./useRowsApi";
import InsertRowSQL from "./InsertRowSQL";
import MutateRowForm from "./MutateRowForm";
import Row from "./Row";

function createEmptyRow(table: ServerTable): ServerRow {
  return table.columns.reduce((row, col) => {
    if (col.name !== table.primary_key) {
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
  const [showModal, setShowModal] = useState(false);
  const [rowIdToDelete, setRowIdToDelete] = useState<RowId>();
  const { setOutlet } = useOutletContext();
  const { data, error } = useGetRows(
    table.table_name,
    page * numRowsPerFetch,
    table.primary_key
  );
  const { request, deleteRow } = useDeleteRow();

  const headerRow = data?.rows[0];
  const headers = headerRow
    ? [
        table.primary_key,
        ...Object.keys(headerRow).filter((key) => key !== table.primary_key),
        "",
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

  const handleDeleteRow = (id: RowId) => {
    if (id) {
      setShowModal(true);
      setRowIdToDelete(id);
    }
  };

  useEffect(() => {
    if (!request.isLoading) {
      setShowModal(false);
      setRowIdToDelete(undefined);
    }
  }, [request.isLoading]);

  return (
    <div>
      <header className="mb-4 flex items-center justify-between ">
        <div className="flex gap-8">
          <h2 className="heading-2 mb-4">{table.table_name}</h2>
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
      </header>

      {data?.rows && (
        <table className="w-full table-auto border-collapse border border-gray-500 bg-gray-100 pb-4 dark:border-gray-400 dark:bg-gray-900">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-900">
              {headers.map((header) => (
                <th
                  key={header}
                  className="border border-gray-300 px-4 py-1 pb-4 text-left dark:border-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <Row
                table={table}
                row={row}
                onDelete={handleDeleteRow}
                key={row[table.primary_key]}
              />
            ))}
          </tbody>
        </table>
      )}
      <ErrorMessage errorResponse={error} />

      {showModal && (
        <Modal
          heading="Delete Row"
          message={`Are you sure you want to permanently delete row "${rowIdToDelete}"?`}
          confirmButtonText="Delete Row"
          confirmButtonStyle="danger"
          cancelButtonStyle="secondary"
          isLoading={request.isLoading}
          onConfirm={() => deleteRow(table.table_name, rowIdToDelete as RowId)}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
