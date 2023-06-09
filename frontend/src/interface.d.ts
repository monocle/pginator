import { UseMutationResult } from "@tanstack/react-query";
import React from "react";
import { tableActions } from "./common/postgres";

export interface ServerValidationError {
  loc: string[];
  msg: string;
  type: string;
}

export interface ErrorResponse {
  error: ServerValidationError | ServerValidationError[] | string;
}

export type ErrorResponseHandler = React.Dispatch<
  React.SetStateAction<ErrorResponse | undefined>
>;

export type ReactSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export interface ServerTableColumn {
  name: string;
  data_type: string;
}

export interface ServerTable {
  table_name: string;
  columns: ServerTableColumn[];
  primary_key: string;
}

export interface ServerTables {
  tables: ServerTable[];
}
export type ServerRow = Record<string, string>;

export interface ServerRows {
  rows: ServerRow[];
}

export interface QueryParams {
  offset: number;
}

export type FormValidator = (value: string) => FormValidatorResult;

export interface FormValidatorResult {
  isValid: boolean;
  errorMessage: string;
}

export type FormInputChangeResult = ValidatorResult & {
  value: string;
};

export interface FormField {
  id: string;
  name: string;
  value: string;
  setValue: (value: string) => void;
  isValid: boolean;
  isBlank: boolean;
  errorMessage: string;
  reset: () => void;
  inputProps: {
    id: string;
    value: string;
    isValid: boolean;
    errorMessage: string;
    onChange: (value: string) => void;
  };
}

export interface UseInputProps {
  initialValue?: string;
  name?: string;
  validator?: FormValidator;
  id?: string;
}

export type UseInput = (UseInputProps) => FormField;

export interface Form {
  useInput: UseInput;
  getFields: () => Record<string, string>;
  isValid: () => boolean;
  isBlank: () => boolean;
  reset: () => void;
}

export type TableAction = (typeof tableActions)[number];

export type RowId = string | number;

export type UseMutateRow = () => {
  request: UseMutationResult<
    ServerRow,
    ErrorResponse,
    { queryKey: QueryKey },
    object
  >;
  mutateRow: (table: ServerTable, params: ServerRow, id: RowId) => void;
};

export interface RowSqlStatementProps {
  table: ServerTable;
  row: ServerRow;
  colNameFields: [string, FormField][];
}

export type ButtonStyle =
  | "primary"
  | "secondary"
  | "danger"
  | "disabled"
  | "loading";
