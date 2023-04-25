import React, { useState } from "react";
import type { ServerTable, ServerTableColumn, TableAction } from "../interface";
import { tableActions } from "../common/postgres";
import useForm from "../common/form/useForm";
import { isValidTableAction, isNotBlank } from "../common/validators";
import FormLayout from "../common/components/FormLayout";
import Button from "../common/components/Button";
import Input from "../common/components/Input";
import SelectInput from "../common/components/SelectInput";
import { useUpdateTable } from "./useTablesApi";
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
  const { request, updateTable } = useUpdateTable();
  const form = useForm();
  const sqlAction = form.useInput({
    name: "sqlAction",
    validator: isValidTableAction,
  });
  const remainingSql = form.useInput({
    name: "remainingSql",
    validator: isNotBlank,
  });
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

  const handleSubmit = () => {
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

  return (
    <FormLayout
      heading={`Editing the "${table.table_name}" table`}
      onSumbit={handleSubmit}
      error={request.error}
      leftColumn={
        <>
          <fieldset className="mb-4">
            <SelectInput
              labelText="Alter Action"
              prompt="Select An Action"
              options={tableActions}
              {...sqlAction.inputProps}
            />
          </fieldset>

          <fieldset className="mb-4">
            {!sqlAction.isBlank &&
              (actionComponentMap[sqlAction.value] ?? (
                <Input
                  labelText="Remaining SQL Statement"
                  {...remainingSql.inputProps}
                />
              ))}
          </fieldset>
        </>
      }
      rightColumn={
        <>
          <h3 className="heading-3 mb-4">Existing Columns</h3>
          <Columns className="mb-6" columns={table.columns} />

          <AlterTableSQL
            tableName={table.table_name}
            action={sqlAction.value}
            columns={columns}
            remainingSql={remainingSql.value}
            onRemoveColumn={handleRemoveColumn}
          />
        </>
      }
      submitButton={
        <Button
          text="Update Table"
          type="submit"
          disabled={request.isLoading || !form.isValid()}
          isLoading={request.isLoading}
        />
      }
    />
  );
}
