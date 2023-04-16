import { FormValidator, FormField, Form, UseInput } from "../../interface";
import _useInput from "./useInput";

const duplicateIdMessage = (id: string) =>
  `[useForm] Form id ${id} already exists`;

export default function useForm(): Form {
  const isValid = () => fields.every((input) => input.isValid);
  const reset = () => fields.forEach((input) => input.reset());
  let fields: FormField[] = [];

  const useInput: UseInput = (validator?: FormValidator, id?: string) => {
    const newInput: FormField = _useInput(validator, id);

    if (fields.some((input) => input.id === newInput.id)) {
      throw new Error(duplicateIdMessage(newInput.id));
    }

    fields = [...fields, newInput];

    return newInput;
  };

  return { useInput, isValid, reset };
}
