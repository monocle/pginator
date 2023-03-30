import { useState } from "react";
import { FormValidator } from "../../interface";

export const defaultValidator: FormValidator = () => ({
  isValid: true,
  errorMessage: "",
});

let _inputId = 0;

export default function useInput(
  validator: FormValidator = defaultValidator,
  id?: string
) {
  const [value, _setValue] = useState<string>("");
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const setValue = (value: string) => {
    const { isValid, errorMessage } = validator(value);

    _setValue(value);
    setIsValid(isValid);
    setErrorMessage(isValid ? "" : errorMessage);
  };

  const reset = () => {
    _setValue("");
    setIsValid(false);
    setErrorMessage("");
  };

  id = `form-input-${id || _inputId++}`;

  return {
    id,
    value,
    setValue,
    isValid,
    isBlank: value.trim() === "",
    errorMessage,
    reset,
    inputProps: {
      id,
      value,
      isValid,
      errorMessage,
      onChange: setValue,
    },
  };
}
