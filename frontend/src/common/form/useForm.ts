import { useRef } from "react";
import { FormField, Form, UseInputProps } from "../../interface";
import _useInput, { defaultValidator } from "./useInput";

export default function useForm(): Form {
  const fields = useRef<Record<string, FormField>>({});
  const isValid = () =>
    Object.entries(fields.current).every(([_, field]) => field.isValid);
  const isBlank = () =>
    Object.entries(fields.current).every(([_, field]) => field.isBlank);
  const reset = () =>
    Object.entries(fields.current).forEach(([_, field]) => field.reset());

  const useInput = ({
    name,
    validator = defaultValidator,
    id = undefined,
  }: UseInputProps = {}) => {
    if (!name) {
      throw new Error(
        "A field name must be provided when using `form.useInput`. "
      );
    }

    const newField: FormField = _useInput({ name, validator, id });

    fields.current[newField.name] = newField;
    return newField;
  };

  const fieldValues = Object.entries(fields.current).reduce(
    (res, [name, field]) => {
      res[name] = field.value;
      return res;
    },
    {} as Record<string, string>
  );

  return { useInput, isValid, isBlank, fields: fieldValues, reset };
}
