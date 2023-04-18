import { useContext } from "react";
import { ServerRow, ServerTable } from "../interface";
import OutletContext from "../common/outletContext";
import Link from "../common/components/Link";
import { useUpdateRow } from "./useRowsApi";
import MutateRowForm from "./MutateRowForm";
import UpdateRowSQL from "./UpdateRowSQL";

interface Props {
  table: ServerTable;
  row: ServerRow;
}

export default function Row({ table, row }: Props) {
  const { setOutlet } = useContext(OutletContext);
  const { id, ...rest } = row;

  // TODO add 'primary_key' to ServerTable
  const primaryRowKey = { name: "id", value: row.id };

  const handleEditClick = () =>
    setOutlet(
      <MutateRowForm
        action="Update"
        table={table}
        row={row}
        sqlComponent={UpdateRowSQL}
        primaryRowKey={primaryRowKey}
        useMutateRow={useUpdateRow}
      />
    );

  return (
    <>
      <tr>
        <td className="border border-gray-300 px-4 dark:border-gray-700">
          <Link text={id} onClick={handleEditClick} />
        </td>

        {Object.entries(rest).map(([prop, value]) => (
          <td
            key={prop}
            className="border border-gray-300 px-4 dark:border-gray-700"
          >
            {value}
          </td>
        ))}
      </tr>
    </>
  );
}
