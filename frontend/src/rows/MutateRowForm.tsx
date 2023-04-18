import React, { useState, useEffect, useContext } from "react";
import {
  ServerTable,
  FormField,
  ServerRow,
  UseMutateRow,
  RowSQLComponentProps,
  PrimaryRowKey,
} from "../interface";
import useForm from "../common/form/useForm";
import OutletContext from "../common/outletContext";
import FormLayout from "../common/components/FormLayout";
import Input from "../common/components/Input";
import Button from "../common/components/Button";
import Modal from "../common/components/Modal";
import Columns from "../tables/components/Columns";

interface Props {
  action: "Create" | "Update";
  table: ServerTable;
  row: ServerRow;
  sqlComponent: React.FC<RowSQLComponentProps>;
  primaryRowKey?: PrimaryRowKey;
  useMutateRow: UseMutateRow;
}

export default function CreateRowForm({
  action,
  table,
  row,
  sqlComponent,
  primaryRowKey = undefined,
  useMutateRow,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const { resetOutlet } = useContext(OutletContext);
  const { request, mutateRow: _mutateRow } = useMutateRow();
  const form = useForm();

  const colNameFields: [string, FormField][] = Object.entries(row)
    .filter(([name, _]) => !primaryRowKey || name !== primaryRowKey.name)
    .map(([name, initialValue]) => [
      name,
      form.useInput({ name, initialValue }),
    ]);

  const mutateRow = () =>
    _mutateRow(table.table_name, form.fields, primaryRowKey);

  const handleSubmit = () => {
    if (form.isBlank()) {
      setShowModal(true);
    } else {
      mutateRow();
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
        heading={`${action} A Row`}
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
            {sqlComponent({
              tableName: table.table_name,
              colNameFields,
              primaryRowKey,
            })}
          </>
        }
        submitButton={
          <Button
            text={`${action} Row`}
            type="submit"
            disabled={request.isLoading}
            isLoading={request.isLoading}
          />
        }
      />
      {showModal && (
        <Modal
          heading={`${action} A Blank Row`}
          message={`Are you sure you want to submit blank values?`}
          confirmButtonText="Yes"
          confirmButtonStyle="primary"
          cancelButtonStyle="secondary"
          onConfirm={mutateRow}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}
