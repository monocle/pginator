import { useContext } from "react";
import { ServerTable } from "../../interface";
import ModalContext from "../../common/modalContext";
import { useDeleteTable } from "../useTablesApi";
import AlterTableForm from "./AlterTableForm";
import Button from "../../common/components/Button";
import ErrorMessage from "../../common/components/ErrorMessage";
import Columns from "./Columns";

interface Props {
  table: ServerTable;
}

export default function Table({ table }: Props) {
  const { setModal } = useContext(ModalContext);
  const { request, deleteTable } = useDeleteTable();

  return (
    <li>
      <div>
        {table.table_name}
        <Button
          text="Edit"
          onClick={() => setModal(<AlterTableForm table={table} />)}
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
