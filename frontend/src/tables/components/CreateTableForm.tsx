import { useContext, useState, useEffect } from "react";
import { ServerTable, ServerTableColumn } from "../../interface";
import { useCreateTable } from "../useTablesApi";
import ModalContext from "../../common/outletContext";
import useForm from "../../common/form/useForm";
import { isValidTableName } from "../../common/validators";
import FormLayout from "../../common/components/FormLayout";
import Input from "../../common/components/Input";
import Button from "../../common/components/Button";
import NewColumnFields from "./NewColumnFields";
import ColumnsSQL from "./ColumnsSQL";
import Checkbox from "../../common/components/Checkbox";

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

  const handleSubmit = () => {
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
    <FormLayout
      heading="Create A New Table"
      onSumbit={handleSubmit}
      error={request.error}
      leftColumn={
        <>
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
        </>
      }
      rightColumn={
        <>
          <h3 className="heading-3">SQL Statement</h3>
          <code>CREATE TABLE {tableName.value} (</code>
          <ColumnsSQL columns={columns} onRemoveColumn={handleRemoveColumn} />
          <code>);</code>
        </>
      }
      submitButton={
        <Button
          text="Create Table"
          type="submit"
          disabled={request.isLoading || !form.isValid() || !columns.length}
          isLoading={request.isLoading}
        />
      }
    />
  );
}
