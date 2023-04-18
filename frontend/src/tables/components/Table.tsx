import { useContext, useState } from "react";
import { ServerTable } from "../../interface";
import OutletContext from "../../common/outletContext";
import { useDeleteTable } from "../useTablesApi";
import AlterTableForm from "./AlterTableForm";
import Button from "../../common/components/Button";
import ErrorMessage from "../../common/components/ErrorMessage";
import Link from "../../common/components/Link";
import Modal from "../../common/components/Modal";
import Columns from "./Columns";
import Rows from "../../rows/Rows";

interface Props {
  table: ServerTable;
}

export default function Table({ table }: Props) {
  const [showModal, setShowModal] = useState(false);
  const { setOutlet } = useContext(OutletContext);
  const { request, deleteTable } = useDeleteTable();

  const handleTableClick = (table: ServerTable) => {
    setOutlet(<Rows table={table} />);
  };

  return (
    <li className="mb-8">
      <div className="flex items-center gap-2">
        <Link text={table.table_name} onClick={() => handleTableClick(table)} />
        <Button
          text="Edit"
          className="text-sm"
          onClick={() => setOutlet(<AlterTableForm table={table} />)}
        />
        <Button
          text="X"
          className="text-sm"
          style="danger"
          disabled={request.isLoading}
          onClick={() => setShowModal(true)}
        />
        <ErrorMessage errorResponse={request.error} />
      </div>

      {showModal && (
        <Modal
          heading="Drop Table"
          message={`Are you sure you want to permanently delete table "${table.table_name}"?`}
          confirmButtonText="Drop Table"
          confirmButtonStyle="danger"
          cancelButtonStyle="secondary"
          onConfirm={() => deleteTable(table.table_name)}
          onCancel={() => setShowModal(false)}
        />
      )}

      <Columns columns={table.columns} className="mt-2" />
    </li>
  );
}
