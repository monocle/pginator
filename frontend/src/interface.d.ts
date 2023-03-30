import { UseQueryResult } from "@tanstack/react-query";
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
  columns: TableColumn[];
}

export interface ServerTables {
  tables: Table[];
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

export type UseInput = (validator?: FormValidator, id?: string) => FormField;

export interface Form {
  useInput: UseInput;
  inputs: FormField[];
  isValid: () => boolean;
  reset: () => void;
}

export type TableAction = typeof tableActions[number];
