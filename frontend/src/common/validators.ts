import { FormValidator, ServerTable, ServerTableColumn } from "../interface";
import {
  reservedWords,
  tableActions,
  systemColumns,
  columnDataTypes,
} from "./postgres";

export const isValidTableName = (tables: ServerTable[]) => {
  const validator: FormValidator = (value: string) => {
    const regex = /^[a-zA-Z][\w$]{0,62}$/;
    let errorMessage = "Invalid table name.";
    let isValid =
      regex.test(value) && !reservedWords.includes(value.toUpperCase());

    if (isValid && tables.some((table) => table.table_name === value)) {
      errorMessage = "Table name already exists.";
      isValid = false;
    }

    return { isValid, errorMessage };
  };
  return validator;
};

export const isValidTableColumnName = (
  existingColumns: ServerTableColumn[]
) => {
  const validator: FormValidator = (value: string) => {
    const upperValue = value.toUpperCase();
    const regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    let errorMessage = "Invalid table column name.";
    let isValid =
      regex.test(value) &&
      !reservedWords.includes(upperValue) &&
      !systemColumns.includes(upperValue);

    if (isValid && existingColumns.some((column) => column.name === value)) {
      isValid = false;
      errorMessage = "Column name already exists.";
    }

    return { isValid, errorMessage };
  };
  return validator;
};

export const isValidTableColumnType: FormValidator = (value: string) => {
  const errorMessage = "Invalid table column data type.";
  const isValid = columnDataTypes.includes(value.toLowerCase());

  return { isValid, errorMessage };
};

export const isValidTableAction: FormValidator = (value: string) => {
  const errorMessage = "Invalid alter table action.";
  const isValid = tableActions.includes(value.toUpperCase());

  return { isValid, errorMessage };
};
