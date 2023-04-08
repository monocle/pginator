import { useContext, useState, useEffect } from "react";
import { ServerTable, ServerTableColumn } from "../../interface";
import { useCreateTable } from "../useTablesApi";
import ModalContext from "../../common/outletContext";
import useForm from "../../common/form/useForm";
import { isValidTableName } from "../../common/validators";
import Input from "../../common/components/Input";
import Button from "../../common/components/Button";
import ErrorMessage from "../../common/components/ErrorMessage";
import NewColumnFields from "./NewColumnFields";
import ColumnsSQL from "./ColumnsSQL";

interface Props {
  tables: ServerTable[];
}

export default function CreatTableForm({ tables }: Props) {
  const { resetOutlet } = useContext(ModalContext);
  const { request, createTable } = useCreateTable();
  const [columns, setColumns] = useState<ServerTableColumn[]>([]);
  const form = useForm();
  const tableName = form.useInput(isValidTableName(tables));

  const handleRemoveColumn = (name: string) => {
    setColumns(columns.filter((col) => col.name !== name));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.isValid()) {
      createTable({ tableName: tableName.value, columns });
    }
  };

  useEffect(() => {
    if (request.isSuccess) {
      resetOutlet();
    }
  });

  return (
    <div>
      <h2>Create A New Table</h2>
      <form onSubmit={handleSubmit} className="rounded-lg bg-gray-900 p-8">
        <fieldset>
          <Input
            labelText="Table Name"
            {...tableName.inputProps}
            className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 focus:border-indigo-500 focus:outline-none"
          />
        </fieldset>

        <NewColumnFields
          columns={columns}
          validateColumns={columns}
          setColumns={setColumns}
        />

        <div>
          <h3>SQL Statement</h3>
          <code>CREATE TABLE {tableName.value} (</code>
          <ColumnsSQL columns={columns} onRemoveColumn={handleRemoveColumn} />
          <code>);</code>
        </div>

        <Button
          text="Create Table"
          type="submit"
          disabled={
            request.isLoading || (!form.isValid() && columns.length > 0)
          }
          isLoading={request.isLoading}
        />

        <Button text="Cancel" onClick={resetOutlet} />
        <ErrorMessage errorResponse={request.error} />
      </form>
    </div>
  );
}
