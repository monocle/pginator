import React from "react";
import type { ServerRow, ServerTable } from "../interface";
import Button from "../common/components/Button";
import Link from "../common/components/Link";
import { useUpdateRow } from "./useRowsApi";
import MutateRowForm from "./MutateRowForm";
import UpdateRowSQL from "./UpdateRowSQL";
import useOutletContext from "../common/useOutletContext";

interface Props {
  table: ServerTable;
  row: ServerRow;
  onDelete: (id: string | number) => void;
}

export default function Row({ table, row, onDelete }: Props) {
  const { setOutlet } = useOutletContext();
  const { [table.primary_key]: id, ...rest } = row;
  const borderClassName = "border border-gray-300 px-4 dark:border-gray-700";

  const handleEditClick = () =>
    setOutlet(
      <MutateRowForm
        action="Update"
        table={table}
        row={row}
        SqlStatement={UpdateRowSQL}
        useMutateRow={useUpdateRow}
      />
    );

  return (
    <>
      <tr>
        <td className={borderClassName}>
          <Link text={id} onClick={handleEditClick} />
        </td>

        {Object.entries(rest).map(([prop, value]) => (
          <td key={prop} className={borderClassName}>
            {value}
          </td>
        ))}
        <td className={borderClassName + " w-2"}>
          <Button
            text="X"
            style="danger"
            disabled={false}
            isLoading={false}
            onClick={() => onDelete(id)}
          />
        </td>
      </tr>
    </>
  );
}
