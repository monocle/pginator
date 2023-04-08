import { useContext } from "react";
import { ServerTable } from "../../interface";
import ModalContext from "../../common/outletContext";
import { useDeleteTable } from "../useTablesApi";
import AlterTableForm from "./AlterTableForm";
import Button from "../../common/components/Button";
import ErrorMessage from "../../common/components/ErrorMessage";
import Columns from "./Columns";

interface Props {
  table: ServerTable;
}

export default function Table({ table }: Props) {
  const { setOutlet } = useContext(ModalContext);
  const { request, deleteTable } = useDeleteTable();

  return (
    <li>
      <div>
        <p>{table.table_name}</p>
        <Button
          text="Edit"
          onClick={() => setOutlet(<AlterTableForm table={table} />)}
        />
        <Button
          text="X"
          disabled={request.isLoading}
          onClick={() => deleteTable(table.table_name)}
        />
        <ErrorMessage errorResponse={request.error} />
      </div>

      <Columns columns={table.columns} />
    </li>
  );
}
