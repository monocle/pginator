import { FormValidator, FormField, Form, UseInput } from "../../interface";
import _useInput from "./useInput";

const duplicateIdMessage = (id: string) =>
  `[useForm] Form id ${id} already exists`;

export default function useForm(): Form {
  const isValid = () => inputs.every((input) => input.isValid);
  const reset = () => inputs.forEach((input) => input.reset());
  let inputs: FormField[] = [];

  const useInput: UseInput = (validator?: FormValidator, id?: string) => {
    const newInput: FormField = _useInput(validator, id);

    if (inputs.some((input) => input.id === newInput.id)) {
      throw new Error(duplicateIdMessage(newInput.id));
    }

    inputs = [...inputs, newInput];

    return newInput;
  };

  return { useInput, inputs, isValid, reset };
}
