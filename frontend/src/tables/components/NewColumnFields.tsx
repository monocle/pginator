import { ServerTableColumn } from "../../interface";
import { columnDataTypes } from "../../common/postgres";
import {
  isValidTableColumnName,
  isValidTableColumnType,
} from "../../common/validators";
import Button from "../../common/components/Button";
import Input from "../../common/components/Input";
import SelectInput from "../../common/components/SelectInput";
import useForm from "../../common/form/useForm";

interface Props {
  columns: ServerTableColumn[];
  validateColumns: ServerTableColumn[];
  setColumns: (columns: ServerTableColumn[]) => void;
}

export default function ColumnFormFields({
  columns,
  validateColumns,
  setColumns,
}: Props) {
  const optionForManualType = "Type in a data type";
  const form = useForm();
  const selectedDataType = form.useInput(isValidTableColumnType);
  const columnName = form.useInput(isValidTableColumnName(validateColumns));
  const columnType = form.useInput();

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
    <fieldset>
      <Input labelText="Column Name" {...columnName.inputProps} />

      <SelectInput
        prompt="Select A Data Type"
        value={selectedDataType.value}
        options={[optionForManualType].concat(columnDataTypes)}
        onChange={handleSelectedTypeChange}
      />

      <Input labelText="Column Data Type" {...columnType.inputProps} />

      <Button
        text="Add Column"
        type="button"
        onClick={handleAddColumn}
        disabled={
          !columnName.isValid ||
          (!columnType.isValid && !selectedDataType.isValid)
        }
      />
    </fieldset>
  );
}
