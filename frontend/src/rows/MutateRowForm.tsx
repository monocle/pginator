import React, { useState } from "react";
import type {
  ServerTable,
  FormField,
  ServerRow,
  UseMutateRow,
  RowSqlStatementProps,
} from "../interface";
import useForm from "../common/form/useForm";
import FormLayout from "../common/components/FormLayout";
import Input from "../common/components/Input";
import Button from "../common/components/Button";
import Modal from "../common/components/Modal";
import Columns from "../tables/Columns";

interface Props {
  action: "Create" | "Update";
  table: ServerTable;
  row: ServerRow;
  SqlStatement: React.FC<RowSqlStatementProps>;
  useMutateRow: UseMutateRow;
}

export default function CreateRowForm({
  action,
  table,
  row,
  SqlStatement,
  useMutateRow,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const { request, mutateRow: _mutateRow } = useMutateRow();
  const form = useForm();

  const colNameFields: [string, FormField][] = Object.entries(row)
    .filter(([name]) => !table.primary_key || name !== table.primary_key)
    .map(([name, initialValue]) => [
      name,
      form.useInput({ name, initialValue }),
    ]);

  const mutateRow = () =>
    _mutateRow(table, form.getFields(), row[table.primary_key]);

  const handleSubmit = () => {
    if (form.isBlank()) {
      setShowModal(true);
    } else {
      mutateRow();
    }
  };

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
            <SqlStatement
              table={table}
              row={row}
              colNameFields={colNameFields}
            />
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
          isLoading={request.isLoading}
          onConfirm={mutateRow}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}
