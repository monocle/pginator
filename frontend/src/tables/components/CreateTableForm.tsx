import React, { useContext, useState, useEffect } from "react";
import { ServerTable, ServerTableColumn } from "../../interface";
import { useCreateTable } from "../useTablesApi";
import ModalContext from "../../common/outletContext";
import useForm from "../../common/form/useForm";
import { isValidTableName } from "../../common/validators";
import Input from "../../common/components/Input";
import Button from "../../common/components/Button";
import NewColumnFields from "./NewColumnFields";
import ColumnsSQL from "./ColumnsSQL";
import Checkbox from "../../common/components/Checkbox";
import ErrorMessage from "../../common/components/ErrorMessage";

interface Props {
  tables: ServerTable[];
}

export default function CreatTableForm({ tables }: Props) {
  const { resetOutlet } = useContext(ModalContext);
  const { request, createTable } = useCreateTable();
  const [columns, setColumns] = useState<ServerTableColumn[]>([]);
  const [createId, setCreateId] = useState(true);
  const form = useForm();
  const tableName = form.useInput(isValidTableName(tables));

  const handleRemoveColumn = (name: string) => {
    setColumns(columns.filter((col) => col.name !== name));
  };

  const handleToggleCreateId = () => setCreateId(!createId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.isValid()) {
      createTable({ tableName: tableName.value, columns, createId });
    }
  };

  useEffect(() => {
    if (request.isSuccess) {
      resetOutlet();
    }
  });

  return (
    <div>
      <h2 className="heading-2 mb-4">Create A New Table</h2>
      <form onSubmit={handleSubmit} className="rounded-lg bg-gray-900 p-4">
        <div className="flex flex-wrap justify-between">
          <div className="mb-4 md:w-3/5">
            <Input
              labelText="Table Name"
              className="mb-6"
              {...tableName.inputProps}
            />

            <NewColumnFields
              className="mb-6"
              columns={columns}
              validateColumns={columns}
              setColumns={setColumns}
            />

            <Checkbox
              labelText='Include "id" as a primary key'
              className="mb-4"
              checked={createId}
              onChange={handleToggleCreateId}
            />
          </div>

          <div className="mb-4 pl-4 md:w-2/5">
            <h3 className="text-xl font-bold">SQL Statement</h3>
            <code>CREATE TABLE {tableName.value} (</code>
            <ColumnsSQL columns={columns} onRemoveColumn={handleRemoveColumn} />
            <code>);</code>
          </div>
        </div>

        <div className="mb-4">
          <Button
            text="Create Table"
            type="submit"
            disabled={request.isLoading || !form.isValid() || !columns.length}
            isLoading={request.isLoading}
          />

          <Button
            text="Cancel"
            style="danger"
            className="ml-2"
            onClick={resetOutlet}
          />
        </div>
        <ErrorMessage errorResponse={request.error} />
      </form>
    </div>
  );
}
