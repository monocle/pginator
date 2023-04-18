import { useState } from "react";
import { FormValidator, UseInputProps } from "../../interface";

function generateUniqueId(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

export const defaultValidator: FormValidator = () => ({
  isValid: true,
  errorMessage: "",
});

export default function useInput({
  initialValue = "",
  name = "",
  validator = defaultValidator,
  id = undefined,
}: UseInputProps = {}) {
  const [value, _setValue] = useState<string>(initialValue);
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

  const fullId = `form-input-${id || generateUniqueId()}`;

  const inputProps = {
    id: fullId,
    name,
    value,
    isValid,
    errorMessage,
    onChange: setValue,
  };

  return {
    id: fullId,
    name,
    value,
    setValue,
    isValid,
    isBlank: typeof value === "string" && value.trim() === "",
    errorMessage,
    reset,
    inputProps,
  };
}
