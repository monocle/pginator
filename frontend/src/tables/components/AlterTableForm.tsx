import { useContext, useState, useEffect } from "react";
import { ServerTable, ServerTableColumn, TableAction } from "../../interface";
import OutletContext from "../../common/outletContext";
import { tableActions } from "../../common/postgres";
import useForm from "../../common/form/useForm";
import { isValidTableAction } from "../../common/validators";
import Button from "../../common/components/Button";
import Input from "../../common/components/Input";
import SelectInput from "../../common/components/SelectInput";
import ErrorMessage from "../../common/components/ErrorMessage";
import { useUpdateTable } from "../useTablesApi";
import NewColumnFields from "./NewColumnFields";
import AlterTableSQL from "./AlterTableSQL";
import Columns from "./Columns";

interface ActionComponentMap {
  [key: TableAction]: JSX.Element;
}

interface Props {
  table: ServerTable;
}

export default function AlterTableForm({ table }: Props) {
  const { resetOutlet } = useContext(OutletContext);
  const { request, updateTable } = useUpdateTable();
  const form = useForm();
  const sqlAction = form.useInput(isValidTableAction);
  const remainingSql = form.useInput();
  const [columns, setColumns] = useState<ServerTableColumn[]>([]);

  const createColumnsSql = (_columns: ServerTableColumn[]) => {
    return _columns
      .map((col, idx) => {
        const action = idx === 0 ? "" : sqlAction.value + " ";
        return `${action}${col.name} ${col.data_type}`;
      })
      .join(", ");
  };

  const handleSetColumns = (_columns: ServerTableColumn[]) => {
    remainingSql.setValue(createColumnsSql(_columns));
    setColumns(_columns);
  };

  const handleRemoveColumn = (name: string) => {
    handleSetColumns(columns.filter((col) => col.name !== name));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.isValid()) {
      updateTable({
        tableName: table.table_name,
        action: sqlAction.value,
        remainingSql: remainingSql.value,
      });
    }
  };

  const actionComponentMap: ActionComponentMap = {
    ADD: (
      <NewColumnFields
        columns={columns}
        validateColumns={table.columns.concat(columns)}
        setColumns={handleSetColumns}
      />
    ),
  };

  useEffect(() => {
    if (request.isSuccess) {
      resetOutlet();
    }
  });

  return (
    <div>
      <h2 className="heading-2">Editing {table.table_name}</h2>
      <h3 className="heading-3">Existing Columns</h3>
      <Columns columns={table.columns} />

      <form onSubmit={handleSubmit}>
        <fieldset>
          <SelectInput
            labelText="Alter Action"
            prompt="Select An Action"
            options={tableActions}
            {...sqlAction.inputProps}
          />
        </fieldset>

        <fieldset>
          {!sqlAction.isBlank &&
            (actionComponentMap[sqlAction.value] ?? (
              <Input
                labelText="Remaining SQL Statement"
                {...remainingSql.inputProps}
              />
            ))}
        </fieldset>

        <AlterTableSQL
          tableName={table.table_name}
          action={sqlAction.value}
          columns={columns}
          remainingSql={remainingSql.value}
          onRemoveColumn={handleRemoveColumn}
        />

        <Button
          text="Update Table"
          type="submit"
          disabled={request.isLoading || !form.isValid()}
        />

        <Button text="Cancel" onClick={resetOutlet} />
        <ErrorMessage errorResponse={request.error} />
      </form>
    </div>
  );
}
