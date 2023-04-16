import { useState } from "react";
import { FormField, Form, UseInputProps } from "../../interface";
import _useInput, { defaultValidator } from "./useInput";

const duplicateIdMessage = (id: string) =>
  `[useForm] Form id ${id} already exists`;

export default function useForm(): Form {
  const isValid = () => fieldsArr.every((input) => input.isValid);
  const reset = () => fieldsArr.forEach((input) => input.reset());
  const [fieldsArr, setFieldsArr] = useState<FormField[]>([]);
  const [fields, setFields] = useState<Record<string, string>>({});

  const useInput = ({
    name = "",
    validator = defaultValidator,
    id = undefined,
  }: UseInputProps = {}) => {
    const newInput: FormField = _useInput({ name, validator, id });

    if (fieldsArr.some((input) => input.id === newInput.id)) {
      throw new Error(duplicateIdMessage(newInput.id));
    }

    setFieldsArr([...fieldsArr, newInput]);
    setFields({ ...fields, [newInput.name]: newInput.value });

    return newInput;
  };

  return { useInput, isValid, fields, fieldsArr, reset };
}
