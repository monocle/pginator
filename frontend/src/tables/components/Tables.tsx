import { useContext } from "react";
import ModalContext from "../../common/modalContext";
import { useGetTables } from "../useTablesApi";
import Button from "../../common/components/Button";
import ErrorMessage from "../../common/components/ErrorMessage";
import Table from "./Table";
import CreateTableForm from "./CreateTableForm";

export default function Tables() {
  const { setModal } = useContext(ModalContext);
  const { data, error } = useGetTables();

  if (!data) return null;

  return (
    <div>
      <h2>Tables</h2>
      <Button
        text="Add Table"
        onClick={() => setModal(<CreateTableForm tables={data.tables} />)}
      />

      {data.tables.map((table) => (
        <Table table={table} key={table.table_name} />
      ))}

      <ErrorMessage errorResponse={error} />
    </div>
  );
}
