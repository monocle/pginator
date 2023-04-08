import { useContext, useEffect } from "react";
import OutletContext from "../../common/outletContext";
import { useGetTables } from "../useTablesApi";
import Button from "../../common/components/Button";
import ErrorMessage from "../../common/components/ErrorMessage";
import Table from "./Table";
import CreateTableForm from "./CreateTableForm";
import Rows from "../../rows/Rows";

export default function Tables() {
  const { setOutlet } = useContext(OutletContext);
  const { data, error } = useGetTables();

  useEffect(() => {
    setOutlet(<Rows />);
  }, [data?.tables]);

  if (!data) return null;
  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Tables</h2>
      <div className="mb-4 flex items-center justify-between">
        <Button
          text="Add Table"
          onClick={() => setOutlet(<CreateTableForm tables={data.tables} />)}
        />
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
