import { useState, useEffect, useContext } from "react";
import { ServerTable, FormField } from "../interface";
import useForm from "../common/form/useForm";
import OutletContext from "../common/outletContext";
import FormLayout from "../common/components/FormLayout";
import Input from "../common/components/Input";
import Button from "../common/components/Button";
import Modal from "../common/components/Modal";
import Columns from "../tables/components/Columns";
import { useCreateRow } from "./useRowsApi";
import InsertRowSQL from "./InsertRowSQL";

interface Props {
  table: ServerTable;
}

export default function CreateRowForm({ table }: Props) {
  const [showModal, setShowModal] = useState(false);
  const { resetOutlet } = useContext(OutletContext);
  const { request, createRow } = useCreateRow();
  const form = useForm();
  const colNameFields: [string, FormField][] = table.columns
    .filter((col) => col.name !== "id")
    .map((col) => [col.name, form.useInput({ name: col.name })]);

  const handleSubmit = () => {
    if (form.isBlank()) {
      setShowModal(true);
    } else {
      createRow(table.table_name, form.fields);
    }
  };

  useEffect(() => {
    if (request.isSuccess) {
      resetOutlet();
    }
  });

  return (
    <>
      <FormLayout
        heading="Create A New Row"
        onSumbit={handleSubmit}
        error={request.error}
        leftColumn={
          <>
            {colNameFields.map(([colName, input]) => (
              <Input labelText={colName} key={colName} {...input.inputProps} />
            ))}
          </>
        }
        rightColumn={
          <>
            <h3 className="heading-3 mb-4">Existing Columns</h3>
            <Columns className="mb-6" columns={table.columns} />
            <InsertRowSQL
              tableName={table.table_name}
              colNameFields={colNameFields}
            />
          </>
        }
        submitButton={
          <Button
            text="Create Row"
            type="submit"
            disabled={request.isLoading}
            isLoading={request.isLoading}
          />
        }
      />
      {showModal && (
        <Modal
          heading="Adding A Blank Row"
          message={`Are you sure you want to add a row without any values?`}
          confirmButtonText="Yes, add the row"
          confirmButtonStyle="primary"
          cancelButtonStyle="secondary"
          onConfirm={() => createRow(table.table_name, form.fields)}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}
