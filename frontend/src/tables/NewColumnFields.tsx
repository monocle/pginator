import React from "react";
import type { ServerTableColumn } from "../interface";
import { columnDataTypes } from "../common/postgres";
import {
  isValidTableColumnName,
  isValidTableColumnType,
} from "../common/validators";
import Button from "../common/components/Button";
import Input from "../common/components/Input";
import SelectInput from "../common/components/SelectInput";
import useForm from "../common/form/useForm";

interface Props {
  className?: string;
  columns: ServerTableColumn[];
  validateColumns: ServerTableColumn[];
  setColumns: (columns: ServerTableColumn[]) => void;
}

export default function ColumnFormFields({
  className = "",
  columns,
  validateColumns,
  setColumns,
}: Props) {
  const optionForManualType = "Type in a data type";
  const form = useForm();
  const selectedDataType = form.useInput({
    name: "selectedDataType",
    validator: isValidTableColumnType,
  });
  const columnName = form.useInput({
    name: "columnName",
    validator: isValidTableColumnName(validateColumns),
  });
  const columnType = form.useInput({ name: "columnType" });

  const setNewColumnAndReset = (dataType: string) => {
    const newColumn = { name: columnName.value, data_type: dataType };

    setColumns([...columns, newColumn]);

    form.reset();
  };

  const handleAddColumn = () => {
    const shouldAdd =
      columnName.isValid && (columnName.isValid || selectedDataType.isValid);

    if (shouldAdd) {
      const field = columnType.isBlank ? selectedDataType : columnType;
      setNewColumnAndReset(field.value);
    }
  };

  const handleSelectedTypeChange = (value: string) => {
    selectedDataType.setValue(value);
    columnType.setValue(value);
  };

  return (
    <fieldset className={className}>
      <Input
        labelText="Column Name"
        className="mb-4"
        {...columnName.inputProps}
      />

      <fieldset className="mb-4">
        <SelectInput
          labelText="Column Data Type"
          prompt="Select A Data Type"
          className="mb-4"
          value={selectedDataType.value}
          options={[optionForManualType].concat(columnDataTypes)}
          onChange={handleSelectedTypeChange}
        />

        <Input
          labelText="If needed, modify the data type here:"
          className="mb-4"
          {...columnType.inputProps}
        />
      </fieldset>

      <Button
        text="Add Column"
        onClick={handleAddColumn}
        disabled={
          !columnName.isValid ||
          (!columnType.isValid && !selectedDataType.isValid)
        }
      />
    </fieldset>
  );
}
