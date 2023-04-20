import React from "react";
import useOutletContext from "../common/useOutletContext";
import { useGetTables } from "./useTablesApi";
import Button from "../common/components/Button";
import ErrorMessage from "../common/components/ErrorMessage";
import Table from "./Table";
import CreateTableForm from "./CreateTableForm";

export default function Tables() {
  const { setOutlet } = useOutletContext();
  const { data, error } = useGetTables();

  if (!data) return null;

  return (
    <div>
      <div className="mb-4 flex gap-4">
        <h2 className="heading-2">Tables</h2>
        <div>
          <Button
            text="+"
            className="px-2 text-sm"
            onClick={() => setOutlet(<CreateTableForm tables={data.tables} />)}
          />
        </div>
      </div>
      <ul className="grid list-none grid-cols-1">
        {data.tables.map((table) => (
          <Table table={table} key={table.table_name} />
        ))}
      </ul>
      <ErrorMessage errorResponse={error} />
    </div>
  );
}
